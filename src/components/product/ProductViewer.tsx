import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls, RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';

function Cup({ side, tone }: { side: number; tone: string }) {
  const shell = useMemo(() => new THREE.LatheGeometry([
    new THREE.Vector2(0, -0.18), new THREE.Vector2(0.2, -0.18), new THREE.Vector2(0.31, -0.16),
    new THREE.Vector2(0.37, -0.1), new THREE.Vector2(0.38, 0.06), new THREE.Vector2(0.35, 0.15),
    new THREE.Vector2(0.27, 0.19), new THREE.Vector2(0, 0.19),
  ], 72), []);
  const cupRotation = side < 0 ? -0.12 : 0.12;
  return <group position={[side * 0.94, -0.2, 0]} rotation={[0, cupRotation, side * 0.025]}>
    <mesh geometry={shell} rotation={[Math.PI / 2, 0, 0]} scale={[0.91, 1.22, 1]} castShadow receiveShadow>
      <meshPhysicalMaterial color={tone} metalness={0.7} roughness={0.27} clearcoat={0.35} clearcoatRoughness={0.22} />
    </mesh>
    <mesh position={[0, 0, 0.192]} scale={[0.91, 1.22, 1]}>
      <circleGeometry args={[0.305, 72]} />
      <meshPhysicalMaterial color="#202220" metalness={0.62} roughness={0.26} clearcoat={0.45} />
    </mesh>
    <mesh position={[0, 0, 0.198]} scale={[0.91, 1.22, 1]}>
      <torusGeometry args={[0.286, 0.012, 12, 72]} />
      <meshStandardMaterial color="#b39a70" metalness={0.86} roughness={0.24} />
    </mesh>
    <mesh position={[0, 0, 0.201]} scale={[0.88, 1.16, 1]}>
      <circleGeometry args={[0.25, 72]} />
      <meshStandardMaterial color="#292c29" metalness={0.5} roughness={0.33} />
    </mesh>
    <mesh position={[0, 0, 0.205]} scale={[0.86, 1.14, 1]}>
      <torusGeometry args={[0.195, 0.006, 8, 64]} />
      <meshStandardMaterial color="#887753" metalness={0.72} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0, -0.13]} scale={[0.91, 1.22, 1]}>
      <torusGeometry args={[0.255, 0.083, 20, 72]} />
      <meshPhysicalMaterial color="#171817" roughness={0.91} clearcoat={0.08} />
    </mesh>
    <mesh position={[0, 0, -0.17]} scale={[0.9, 1.18, 1]}>
      <torusGeometry args={[0.15, 0.025, 14, 56]} />
      <meshStandardMaterial color="#292a27" roughness={0.98} />
    </mesh>
    <mesh position={[side * 0.29, 0.16, 0.14]} castShadow>
      <RoundedBox args={[0.052, 0.48, 0.055]} radius={0.024} smoothness={6}>
        <meshStandardMaterial color="#9a896a" metalness={0.86} roughness={0.27} />
      </RoundedBox>
    </mesh>
    <mesh position={[side * 0.29, 0.16, -0.14]} castShadow>
      <RoundedBox args={[0.052, 0.48, 0.055]} radius={0.024} smoothness={6}>
        <meshStandardMaterial color="#766b54" metalness={0.8} roughness={0.3} />
      </RoundedBox>
    </mesh>
    <mesh position={[side * 0.29, 0.43, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.035, 0.035, 0.23, 24]} />
      <meshStandardMaterial color="#b39a70" metalness={0.86} roughness={0.24} />
    </mesh>
    <mesh position={[side * 0.29, 0.14, 0.19]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.075, 0.075, 0.026, 32]} />
      <meshStandardMaterial color="#c6aa7a" metalness={0.84} roughness={0.23} />
    </mesh>
    {side > 0 && <group>
      <mesh position={[0.21, -0.19, 0.216]}>
        <RoundedBox args={[0.095, 0.025, 0.018]} radius={0.012} smoothness={5}>
          <meshStandardMaterial color="#b6a176" metalness={0.72} roughness={0.3} />
        </RoundedBox>
      </mesh>
      <mesh position={[0.21, -0.25, 0.216]}>
        <RoundedBox args={[0.095, 0.025, 0.018]} radius={0.012} smoothness={5}>
          <meshStandardMaterial color="#77766e" metalness={0.62} roughness={0.34} />
        </RoundedBox>
      </mesh>
      <mesh position={[0.21, -0.31, 0.216]}>
        <sphereGeometry args={[0.012, 12, 10]} />
        <meshStandardMaterial color="#d7c69f" metalness={0.5} roughness={0.28} />
      </mesh>
    </group>}
  </group>;
}function Headphones({ tone, angle, interacting }: { tone: string; angle: number; interacting: boolean }) {
  const group = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i++) { const a = Math.PI - (Math.PI * i / 48); points.push(new THREE.Vector3(Math.cos(a) * 1.08, 0.35 + Math.sin(a) * 1.02, 0)); }
    return new THREE.CatmullRomCurve3(points);
  }, []);
  const paddedCurve = useMemo(() => new THREE.CatmullRomCurve3(curve.getPoints(48).map(point => new THREE.Vector3(point.x, point.y - 0.045, point.z + 0.012))), [curve]);
  const trimCurve = useMemo(() => new THREE.CatmullRomCurve3(curve.getPoints(48).map(point => new THREE.Vector3(point.x, point.y + 0.018, point.z + 0.062))), [curve]);
  const baseY = -0.46 + angle * 0.78;
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const idle = reducedMotion || interacting ? 0 : Math.sin(clock.elapsedTime * 0.34) * 0.065;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, baseY + idle, 3.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.035 + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.27) * 0.012), 2.8, delta);
  });
  return <group ref={group} rotation={[0.035, baseY, -0.035]} scale={1.1}>
    <mesh castShadow><tubeGeometry args={[curve, 96, 0.058, 18, false]} /><meshStandardMaterial color="#292c2a" metalness={0.58} roughness={0.32} /></mesh>
    <mesh><tubeGeometry args={[paddedCurve, 96, 0.078, 16, false]} /><meshStandardMaterial color="#171817" roughness={0.95} /></mesh>
    <mesh><tubeGeometry args={[trimCurve, 96, 0.009, 8, false]} /><meshStandardMaterial color="#75674e" metalness={0.7} roughness={0.36} /></mesh>
    <Cup side={-1} tone={tone} /><Cup side={1} tone={tone} />
  </group>;
}
function CameraFrame({ compact }: { compact: boolean }) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const mobile = size.width < 620;
    camera.position.set(0, mobile ? 0.12 : 0.22, compact ? (mobile ? 6.6 : 6.05) : (mobile ? 4.35 : 4.55));
    camera.fov = mobile ? (compact ? 39 : 37) : compact ? 38 : 35;
    camera.lookAt(0, 0.2, 0);
    camera.updateProjectionMatrix();
  }, [camera, compact, size.width]);
  return null;
}
export default function ProductViewer({ color = 'Obsidian', compact = false, angle = 0 }: { color?: string; compact?: boolean; angle?: number }) {
  const [interacting, setInteracting] = useState(false);
  const tone = color === 'Dune' ? '#b7a68e' : color === 'Silver' ? '#999d9a' : '#292c2a';
  return <div className={`viewer ${compact ? 'viewer-compact' : ''}`} aria-label="Interactive three dimensional OBSIDIAN ONE headphone model">
    <Canvas shadows dpr={[1, 1.45]} camera={{ position: [0, 0.2, compact ? 6.05 : 4.55], fov: compact ? 38 : 35 }} fallback={<div className="canvas-fallback">Interactive product viewer unavailable</div>}>
      <CameraFrame compact={compact} />
      <ambientLight intensity={0.72} />
      <spotLight position={[2.8, 4.5, 4.2]} intensity={68} angle={0.48} penumbra={0.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[-3.5, 1.6, 1.2]} intensity={10} color="#c6aa7a" />
      <pointLight position={[3.2, 0.5, -2]} intensity={7} color="#ded8c9" />
      <Headphones tone={tone} angle={angle} interacting={interacting} />
      <ContactShadows position={[0, -1.22, 0]} opacity={0.42} scale={4.8} blur={2.7} far={3.2} resolution={256} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.6} color="#f3ead6" position={[-3, 4, 4]} scale={[5, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.3} color="#e8e1d2" position={[4, 1.5, 2]} scale={[2.5, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.2} color="#c6aa7a" position={[0, 3, -4]} scale={[4, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.6} color="#dbc69c" position={[-4, 0.5, -1]} scale={[1.2, 5, 1]} target={[0, 0, 0]} />
      </Environment>
      <OrbitControls enablePan={false} target={[0, 0.2, 0]} minDistance={3.8} maxDistance={7.8} minPolarAngle={0.78} maxPolarAngle={2.18} minAzimuthAngle={-1.12} maxAzimuthAngle={1.12} onStart={() => setInteracting(true)} onEnd={() => setInteracting(false)} rotateSpeed={0.58} enableDamping dampingFactor={0.075} />
    </Canvas><div className="viewer-hint">DRAG TO EXPLORE</div>
  </div>;
}










