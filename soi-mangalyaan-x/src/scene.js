import * as THREE from 'three'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
const colorVar = (name, fallback) => new THREE.Color(css(name) || fallback)
const numberVar = (name, fallback) => Number.parseFloat(css(name)) || fallback

// Deterministic noise keeps the planet reproducible without shipping texture assets.
function hash(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return n - Math.floor(n)
}

function noise3(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z)
  const fx = x - ix, fy = y - iy, fz = z - iz
  const smooth = (t) => t * t * (3 - 2 * t)
  const u = smooth(fx), v = smooth(fy), w = smooth(fz)
  const a = THREE.MathUtils.lerp(hash(ix, iy, iz), hash(ix + 1, iy, iz), u)
  const b = THREE.MathUtils.lerp(hash(ix, iy + 1, iz), hash(ix + 1, iy + 1, iz), u)
  const c = THREE.MathUtils.lerp(hash(ix, iy, iz + 1), hash(ix + 1, iy, iz + 1), u)
  const d = THREE.MathUtils.lerp(hash(ix, iy + 1, iz + 1), hash(ix + 1, iy + 1, iz + 1), u)
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, v), THREE.MathUtils.lerp(c, d, v), w)
}

function fbm(x, y, z) {
  let value = 0, amplitude = 0.56, frequency = 1
  for (let octave = 0; octave < 4; octave += 1) {
    value += noise3(x * frequency, y * frequency, z * frequency) * amplitude
    frequency *= 2.03
    amplitude *= 0.48
  }
  return value
}

function buildMarsGeometry() {
  const geometry = new THREE.SphereGeometry(1, 128, 96)
  const position = geometry.attributes.position
  const colors = []
  const low = colorVar('--planet-low', '#a75e52')
  const mid = colorVar('--planet-mid', '#c78069')
  const high = colorVar('--planet-high', '#e8b496')
  const ridge = colorVar('--planet-ridge', '#f1c9aa')
  const craters = Array.from({ length: 24 }, (_, i) => {
    const direction = new THREE.Vector3(hash(i, 2, 1) * 2 - 1, hash(i, 3, 4) * 1.7 - 0.85, hash(i, 5, 8) * 2 - 1).normalize()
    return { direction, radius: 0.035 + hash(i, 12, 6) * 0.11, depth: 0.018 + hash(i, 4, 5) * 0.03 }
  })
  for (let i = 0; i < position.count; i += 1) {
    const direction = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i)).normalize()
    const broad = fbm(direction.x * 3.2 + 3, direction.y * 3.2 - 4, direction.z * 3.2 + 8) - 0.5
    const fine = fbm(direction.x * 13 + 1, direction.y * 13, direction.z * 13 - 3) - 0.5
    let height = broad * 0.085 + fine * 0.026
    for (const crater of craters) {
      const angle = Math.acos(THREE.MathUtils.clamp(direction.dot(crater.direction), -1, 1))
      const d = angle / crater.radius
      if (d < 1.45) {
        const bowl = Math.exp(-d * d * 4.8)
        const lip = Math.exp(-((d - 0.88) ** 2) * 55)
        height += -bowl * crater.depth + lip * crater.depth * 0.35
      }
    }
    const polar = Math.max(0, (Math.abs(direction.y) - 0.84) / 0.16)
    height += polar * 0.02
    direction.multiplyScalar(1 + height)
    position.setXYZ(i, direction.x, direction.y, direction.z)

    const elevation = THREE.MathUtils.clamp(0.48 + broad * 1.5 + fine * 0.55, 0, 1)
    const color = new THREE.Color().copy(low).lerp(mid, THREE.MathUtils.smoothstep(elevation, 0.05, 0.62)).lerp(high, THREE.MathUtils.smoothstep(elevation, 0.48, 0.95))
    color.lerp(ridge, Math.max(0, height - 0.035) * 3.8)
    color.lerp(colorVar('--planet-ice', '#f2e6df'), polar * 0.88)
    colors.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return geometry
}

function makeEnvironment() {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 256
  const context = canvas.getContext('2d')
  const sky = context.createLinearGradient(0, 0, 0, 256)
  sky.addColorStop(0, '#dce6ed'); sky.addColorStop(0.48, '#faf5ef'); sky.addColorStop(1, '#dac2b4')
  context.fillStyle = sky; context.fillRect(0, 0, 512, 256)
  const lights = [[92, 72, 78, '#fff7e7'], [315, 86, 54, '#e4edf4'], [453, 177, 47, '#d6bdad']]
  for (const [x, y, radius, color] of lights) {
    const glow = context.createRadialGradient(x, y, 0, x, y, radius)
    glow.addColorStop(0, color); glow.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = glow; context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeSpacecraft() {
  const craft = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.36, 5, 12), new THREE.MeshPhysicalMaterial({ color: colorVar('--spacecraft-hull', '#e8e2d8'), metalness: 0.42, roughness: 0.26, clearcoat: 0.8 }))
  body.rotation.z = Math.PI / 2
  craft.add(body)
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.16, 16), new THREE.MeshPhysicalMaterial({ color: '#c9a96e', metalness: 0.58, roughness: 0.24 }))
  nose.rotation.z = -Math.PI / 2; nose.position.x = 0.25; craft.add(nose)
  const panelMat = new THREE.MeshStandardMaterial({ color: colorVar('--spacecraft-panel', '#7f9bb0'), metalness: 0.52, roughness: 0.36, emissive: colorVar('--spacecraft-panel-emissive', '#253c56'), emissiveIntensity: 0.18 })
  const panelLine = new THREE.MeshStandardMaterial({ color: colorVar('--spacecraft-panel-line', '#b9ccdb'), metalness: 0.65, roughness: 0.3 })
  for (const side of [-1, 1]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.018, 0.28), panelMat)
    panel.position.set(-0.04, side * 0.42, 0); craft.add(panel)
    for (let line = -2; line <= 2; line += 1) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.022, 0.28), panelLine)
      bar.position.set(-0.04 + line * 0.1, side * 0.432, 0); craft.add(bar)
    }
  }
  const thruster = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.44, 20), new THREE.MeshBasicMaterial({ color: colorVar('--scene-thruster', '#f6d7a7'), transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false }))
  thruster.userData.thrusterTrail = true
  thruster.rotation.z = Math.PI / 2
  thruster.position.x = -0.48
  craft.add(thruster)
  const glow = new THREE.PointLight(colorVar('--scene-thruster', '#f6d7a7'), 0.7, 1.4)
  glow.position.x = -0.65
  craft.add(glow)
  return craft
}

function makeParticles(count) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const gold = colorVar('--scene-dust-color', '#d6bd8f')
  const pale = colorVar('--scene-dust-pale', '#fffaf1')
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = (Math.random() - 0.5) * 11
    positions[i * 3 + 2] = -2 - Math.random() * 10
    const color = gold.clone().lerp(pale, Math.random())
    colors.set([color.r, color.g, color.b], i * 3)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.022, vertexColors: true, transparent: true, opacity: numberVar('--scene-dust-opacity', .22), sizeAttenuation: true, depthWrite: false }))
}

function makeStarLayer(count, spread, depth, size) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - .5) * spread
    positions[i * 3 + 1] = (Math.random() - .5) * spread * .62
    positions[i * 3 + 2] = -depth - Math.random() * depth * .8
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: colorVar('--scene-dust-pale', '#edeae4'), size, transparent: true, opacity: numberVar('--scene-star-opacity', 0), depthWrite: false, sizeAttenuation: true }))
  return points
}

function makeNebula(color, position, scale) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64)
  gradient.addColorStop(0, color.getStyle())
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: 0xffffff, transparent: true, opacity: numberVar('--scene-nebula-opacity', 0), depthWrite: false, blending: THREE.AdditiveBlending }))
  sprite.position.copy(position); sprite.scale.set(...scale)
  return sprite
}

export function createMarsScene(canvas) {
  if (!canvas) return () => {}
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = window.matchMedia('(max-width: 700px)').matches
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: 'low-power' })
  } catch {
    canvas.classList.add('is-unavailable')
    return () => {}
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(css('--scene-fog-color') || '#e9edf0', 11, 27)
  scene.environment = makeEnvironment()
  const camera = new THREE.PerspectiveCamera(mobile ? 40 : 34, window.innerWidth / window.innerHeight, 0.1, 70)
  camera.position.set(0, 0.15, 10.3)
  const canBloom = !mobile && (navigator.hardwareConcurrency || 4) >= 6 && (navigator.deviceMemory || 8) >= 6
  const composer = canBloom ? new EffectComposer(renderer) : null
  if (composer) {
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), .25, .55, .84))
  }

  const keyLight = new THREE.DirectionalLight(css('--scene-key-color') || '#fff2da', numberVar('--scene-key-intensity', 3.25)); keyLight.position.set(-4, 5, 6); scene.add(keyLight)
  const fillLight = new THREE.DirectionalLight(css('--scene-fill-color') || '#c9d9ec', numberVar('--scene-fill-intensity', 2.1)); fillLight.position.set(5, 1, 3); scene.add(fillLight)
  const rimLight = new THREE.PointLight(css('--scene-rim-color') || '#d89d82', numberVar('--scene-rim-intensity', 4), 12); rimLight.position.set(1, -2, -1); scene.add(rimLight)
  const hemisphere = new THREE.HemisphereLight(css('--scene-hemi-sky') || '#eef3f6', css('--scene-hemi-ground') || '#bba99c', numberVar('--scene-hemi-intensity', 1.45)); scene.add(hemisphere)
  const stars = [makeStarLayer(mobile ? 60 : 110, 20, 6, .014), makeStarLayer(mobile ? 90 : 180, 24, 12, .021), makeStarLayer(mobile ? 120 : 280, 28, 20, .028)]
  stars.forEach((layer) => scene.add(layer))
  const nebulae = [makeNebula(colorVar('--nebula-lavender', '#b8c4e8'), new THREE.Vector3(-4, 2, -12), [6, 4, 1]), makeNebula(colorVar('--nebula-terracotta', '#d9a28c'), new THREE.Vector3(4, -2, -15), [8, 5, 1])]
  nebulae.forEach((sprite) => scene.add(sprite))
  const target = {}
  const readTheme = () => Object.assign(target, {
    clear: colorVar('--scene-clear-color', '#e9edf0'), fog: colorVar('--scene-fog-color', '#e9edf0'),
    key: colorVar('--scene-key-color', '#fff2da'), fill: colorVar('--scene-fill-color', '#c9d9ec'), rim: colorVar('--scene-rim-color', '#d89d82'),
    hemiSky: colorVar('--scene-hemi-sky', '#eef3f6'), hemiGround: colorVar('--scene-hemi-ground', '#bba99c'),
    atmosphere: colorVar('--scene-atmosphere', '#e6b497'), thruster: colorVar('--scene-thruster', '#f6d7a7'), routeColor: colorVar('--gold', '#c9a96e'),
    keyIntensity: numberVar('--scene-key-intensity', 3.25), fillIntensity: numberVar('--scene-fill-intensity', 2.1),
    rimIntensity: numberVar('--scene-rim-intensity', 4), hemiIntensity: numberVar('--scene-hemi-intensity', 1.45),
    dust: numberVar('--scene-dust-opacity', .22), stars: numberVar('--scene-star-opacity', 0),
    nebula: numberVar('--scene-nebula-opacity', 0), route: numberVar('--scene-route-opacity', .32), alpha: numberVar('--scene-clear-alpha', .06),
  })
  readTheme()
  const current = { ...target }
  for (const name of ['clear', 'fog', 'key', 'fill', 'rim', 'hemiSky', 'hemiGround', 'atmosphere', 'thruster', 'routeColor']) current[name] = target[name].clone()
  const onTheme = () => { readTheme(); if (reducedMotion) renderFrame(performance.now()) }
  window.addEventListener('soi:theme', onTheme)

  const marsRig = new THREE.Group(); marsRig.position.set(1.72, 0.06, -1.55); scene.add(marsRig)
  const mars = new THREE.Mesh(buildMarsGeometry(), new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.82, metalness: 0.02, clearcoat: 0.12, clearcoatRoughness: 0.7 }))
  mars.scale.setScalar(2.15); marsRig.add(mars)
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.04, 64, 48), new THREE.MeshBasicMaterial({ color: css('--scene-atmosphere') || '#e6b497', transparent: true, opacity: 0.115, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }))
  atmosphere.scale.copy(mars.scale).multiplyScalar(1.045); marsRig.add(atmosphere)
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.006, 8, 240), new THREE.MeshBasicMaterial({ color: '#c9a96e', transparent: true, opacity: 0.48 }))
  orbit.rotation.set(1.19, 0.25, -0.18); orbit.position.z = 0.01; marsRig.add(orbit)
  const phobosRig = new THREE.Group(); phobosRig.position.set(2.55, 0, 0.08); marsRig.add(phobosRig)
  const phobos = new THREE.Mesh(new THREE.DodecahedronGeometry(0.105, 1), new THREE.MeshStandardMaterial({ color: '#bba392', roughness: 0.95, flatShading: true }))
  phobos.position.x = 0.48; phobos.scale.set(1.35, 0.8, 0.85); phobosRig.add(phobos)

  const earth = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 24), new THREE.MeshPhysicalMaterial({ color: '#c9d8e4', roughness: 0.52, metalness: 0.02, clearcoat: 0.4, clearcoatRoughness: 0.7 }))
  earth.position.set(-4.1, -0.58, -1.85); scene.add(earth)
  const earthGlow = new THREE.Mesh(new THREE.SphereGeometry(0.29, 32, 24), new THREE.MeshBasicMaterial({ color: '#dbe7ed', transparent: true, opacity: 0.21, side: THREE.BackSide, depthWrite: false }))
  earth.add(earthGlow)

  const route = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.8, -0.58, -1.8), new THREE.Vector3(-2.4, 0.8, -1.8), new THREE.Vector3(-0.9, -0.15, -1.4), new THREE.Vector3(0.75, 0.52, -1.4), new THREE.Vector3(1.72, 0.15, -1.6),
  ])
  const routeGeometry = new THREE.BufferGeometry().setFromPoints(route.getPoints(240))
  const routeMaterial = new THREE.LineDashedMaterial({ color: colorVar('--gold', '#c9a96e'), transparent: true, opacity: numberVar('--scene-route-opacity', .32), dashSize: .095, gapSize: .055, depthWrite: false })
  const routeLine = new THREE.Line(routeGeometry, routeMaterial); routeLine.computeLineDistances(); routeGeometry.setDrawRange(0, 1); scene.add(routeLine)
  const craft = makeSpacecraft(); scene.add(craft)
  const thruster = craft.children.find((child) => child.userData.thrusterTrail)
  const thrusterLight = craft.children.find((child) => child.isPointLight)
  const particles = makeParticles(mobile ? 180 : 620); scene.add(particles)

  let scrollProgress = 0, journeyProgress = 0, pointerX = 0, pointerY = 0, visible = !document.hidden, rafId = 0
  const onPointer = (event) => { pointerX = (event.clientX / window.innerWidth - 0.5) * 2; pointerY = (event.clientY / window.innerHeight - 0.5) * 2 }
  const onScroll = () => { scrollProgress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight) }
  const onVisibility = () => { visible = !document.hidden; if (visible) renderFrame(performance.now()) }
  const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(window.innerWidth, window.innerHeight); composer?.setSize(window.innerWidth, window.innerHeight) }
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibility)

  const trigger = ScrollTrigger.create({ trigger: '#journey', start: 'top 80%', end: 'bottom 30%', onUpdate: (self) => { journeyProgress = self.progress } })
  let lastTime = 0, frameDelta = 16
  const renderFrame = (time = 0) => {
    if (!visible) return
    if (!reducedMotion && time - lastTime > (mobile ? 45 : 24)) {
      frameDelta = Math.min(60, time - lastTime || 16)
      lastTime = time
      mars.rotation.y += 0.0008
      phobosRig.rotation.y += 0.003
      particles.rotation.y += 0.00008
    }
    const progress = THREE.MathUtils.clamp(journeyProgress, 0, 1)
    const blend = reducedMotion ? 1 : 1 - Math.exp(-frameDelta / 1000)
    for (const name of ['clear', 'fog', 'key', 'fill', 'rim', 'hemiSky', 'hemiGround', 'atmosphere', 'thruster']) current[name].lerp(target[name], blend)
    for (const name of ['dust', 'stars', 'nebula', 'route', 'keyIntensity', 'fillIntensity', 'rimIntensity', 'hemiIntensity', 'alpha']) current[name] = THREE.MathUtils.lerp(current[name], target[name], blend)
    renderer.setClearColor(current.clear, current.alpha)
    scene.fog.color.copy(current.fog)
    keyLight.color.copy(current.key); keyLight.intensity = current.keyIntensity
    fillLight.color.copy(current.fill); fillLight.intensity = current.fillIntensity
    rimLight.color.copy(current.rim); rimLight.intensity = current.rimIntensity
    hemisphere.color.copy(current.hemiSky); hemisphere.groundColor.copy(current.hemiGround); hemisphere.intensity = current.hemiIntensity
    atmosphere.material.color.copy(current.atmosphere)
    routeMaterial.color.copy(current.routeColor)
    if (thruster) thruster.material.color.copy(current.thruster)
    if (thrusterLight) thrusterLight.color.copy(current.thruster)
    particles.material.opacity = current.dust
    stars.forEach((layer, i) => { layer.material.opacity = current.stars * (0.55 + 0.2 * Math.sin(time * .0014 + i * 2)); layer.rotation.y = Math.sin(time * .00008 + i) * .012 })
    nebulae.forEach((sprite, i) => { sprite.material.opacity = current.nebula * (0.85 + 0.15 * Math.sin(time * .0003 + i * 3)) })
    routeMaterial.opacity = current.route
    routeGeometry.setDrawRange(0, Math.max(1, Math.floor(240 * progress)))
    craft.position.copy(route.getPointAt(progress))
    const tangent = route.getTangentAt(progress).normalize()
    craft.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tangent)
    const parallax = reducedMotion ? 0 : 0.055
    camera.position.x += (pointerX * parallax + scrollProgress * 0.14 - camera.position.x) * 0.018
    camera.position.y += (-pointerY * parallax + Math.sin(scrollProgress * Math.PI) * 0.16 - camera.position.y) * 0.018
    camera.lookAt(0, 0, -1.1)
    const heroScale = mobile ? 0.86 : 1
    const scalePulse = 1 + Math.sin(scrollProgress * Math.PI) * 0.06
    marsRig.scale.setScalar(heroScale * scalePulse)
    marsRig.position.x = (mobile ? 1.45 : 1.72) - scrollProgress * 1.1
    marsRig.position.y = 0.06 + Math.sin(scrollProgress * Math.PI * 1.5) * 0.14
    if (composer) composer.render(); else renderer.render(scene, camera)
    if (!reducedMotion) rafId = window.requestAnimationFrame(renderFrame)
  }
  renderFrame()

  return () => {
    window.cancelAnimationFrame(rafId)
    trigger.kill()
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('soi:theme', onTheme)
    scene.traverse((object) => {
      object.geometry?.dispose()
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
      else object.material?.dispose()
    })
    scene.environment?.dispose()
    composer?.dispose()
    renderer.dispose()
  }
}
