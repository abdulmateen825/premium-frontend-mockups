import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';

export type ProductFinish = 'Red' | 'Cream' | 'Black';
type Vec3 = [number, number, number];
type Surface = { roughness: number; metalness: number };
type MeshData = { positions: number[]; indices: number[]; color: [number, number, number]; surface: Surface };
const surfaces = { satinMetal: {roughness:.3,metalness:.42}, shell: {roughness:.37,metalness:.22}, ceramic: {roughness:.28,metalness:.18}, leather: {roughness:.94,metalness:.02}, polymer: {roughness:.58,metalness:.08} } satisfies Record<string,Surface>;

const palette: Record<ProductFinish, { shell: [number,number,number]; plate: [number,number,number]; accent: [number,number,number]; cushion: [number,number,number] }> = {
  Red: { shell: [.78,.12,.105], plate: [.32,.045,.038], accent: [.95,.24,.19], cushion: [.08,.075,.07] },
  Cream: { shell: [.88,.84,.76], plate: [.72,.67,.59], accent: [.79,.17,.13], cushion: [.1,.09,.08] },
  Black: { shell: [.105,.115,.11], plate: [.17,.18,.17], accent: [.86,.21,.16], cushion: [.055,.05,.045] },
};

const roundBox = (size: Vec3, center: Vec3, radius: number, color: MeshData['color'], rotateY = 0, rotateZ = 0, surface: Surface = surfaces.shell): MeshData => {
  const [hx,hy,hz] = size.map(v => v / 2) as Vec3;
  const r = Math.min(radius, hx, hy, hz);
  const faces: Array<[Vec3,Vec3,Vec3,number]> = [
    [[0,0,1],[1,0,0],[0,1,0],hz], [[0,0,-1],[-1,0,0],[0,1,0],hz],
    [[1,0,0],[0,0,-1],[0,1,0],hx], [[-1,0,0],[0,0,1],[0,1,0],hx],
    [[0,1,0],[1,0,0],[0,0,-1],hy], [[0,-1,0],[1,0,0],[0,0,1],hy],
  ];
  const half: Vec3 = [hx,hy,hz], inner: Vec3 = [hx-r,hy-r,hz-r], positions: number[] = [], indices: number[] = [];
  const n = 10;
  const rotate = (p: Vec3): Vec3 => {
    const cy=Math.cos(rotateY),sy=Math.sin(rotateY),cz=Math.cos(rotateZ),sz=Math.sin(rotateZ);
    const x=p[0]*cz-p[1]*sz, y=p[0]*sz+p[1]*cz;
    return [center[0]+x*cy+p[2]*sy,center[1]+y,center[2]-x*sy+p[2]*cy];
  };
  for (const [normal,u,v,d] of faces) {
    const start=positions.length/3;
    for(let iy=0;iy<=n;iy++) for(let ix=0;ix<=n;ix++) {
      const a=(ix/n*2-1), b=(iy/n*2-1);
      const raw: Vec3=[normal[0]*d+u[0]*a*half[0]+v[0]*b*half[0],normal[1]*d+u[1]*a*half[1]+v[1]*b*half[1],normal[2]*d+u[2]*a*half[2]+v[2]*b*half[2]];
      const clamped: Vec3=[Math.max(-inner[0],Math.min(inner[0],raw[0])),Math.max(-inner[1],Math.min(inner[1],raw[1])),Math.max(-inner[2],Math.min(inner[2],raw[2]))];
      let q: Vec3=[raw[0]-clamped[0],raw[1]-clamped[1],raw[2]-clamped[2]], len=Math.hypot(...q);
      q=len>0?[q[0]/len,q[1]/len,q[2]/len]:normal;
      const p=rotate([clamped[0]+q[0]*r,clamped[1]+q[1]*r,clamped[2]+q[2]*r]); positions.push(...p);
    }
    for(let iy=0;iy<n;iy++) for(let ix=0;ix<n;ix++) {
      const a=start+iy*(n+1)+ix,b=a+1,c=a+n+1,d2=c+1;
      indices.push(a,b,c,b,d2,c);
    }
  }
  return {positions,indices,color,surface};
};

function softVolume(size:Vec3,center:Vec3,power:number,color:MeshData['color'],rotateY=0,surface:Surface=surfaces.shell):MeshData {
  const [rx,ry,rz]=size.map(v=>v/2) as Vec3, lat=30,lon=56,positions:number[]=[],indices:number[]=[];
  const sp=(v:number)=>Math.sign(v)*Math.pow(Math.abs(v),power),cy=Math.cos(rotateY),sy=Math.sin(rotateY);
  for(let i=0;i<=lat;i++){
    const phi=-Math.PI/2+Math.PI*i/lat,cp=Math.cos(phi),y=sp(Math.sin(phi));
    for(let j=0;j<lon;j++){
      const theta=2*Math.PI*j/lon,x=sp(cp*Math.cos(theta)),z=sp(cp*Math.sin(theta));
      positions.push(center[0]+(x*rx)*cy+(z*rz)*sy,center[1]+y*ry,center[2]-(x*rx)*sy+(z*rz)*cy);
    }
  }
  for(let i=0;i<lat;i++)for(let j=0;j<lon;j++){
    const a=i*lon+j,b=i*lon+(j+1)%lon,c=(i+1)*lon+j,d=(i+1)*lon+(j+1)%lon;
    indices.push(a,c,b,b,c,d);
  }
  return {positions,indices,color,surface};
}

function arch(color: MeshData['color'], padded = false, trim = false): MeshData {
  const positions: number[]=[],indices: number[]=[],steps=72,ring=20;
  for(let i=0;i<=steps;i++) {
    const t=i/steps*Math.PI, x=.91*Math.cos(t), y=.12+1.43*Math.sin(t);
    const tx=-.91*Math.sin(t),ty=1.43*Math.cos(t),len=Math.hypot(tx,ty),nx=ty/len,ny=-tx/len;
    for(let j=0;j<=ring;j++) {
      // A thinner alloy spine and a soft inner headband give the silhouette
      // a cleaner, more contemporary profile.
      const a=j/ring*Math.PI*2, ry=trim?.009:(padded?.052:.046), rz=trim?.01:(padded?.105:.09);
      const cs=Math.cos(a),sn=Math.sin(a),flatX=Math.sign(cs)*Math.pow(Math.abs(cs),.72),flatZ=Math.sign(sn)*Math.pow(Math.abs(sn),.72);
      positions.push(x+nx*ry*flatX,y+ny*ry*flatX-(padded?.045:0), (trim?.105:0)+rz*flatZ-(padded?.025:0));
    }
  }
  for(let i=0;i<steps;i++) for(let j=0;j<ring;j++) {const a=i*(ring+1)+j,b=a+ring+1;indices.push(a,b,a+1,b,b+1,a+1)}
  return {positions,indices,color,surface:padded?surfaces.leather:trim?surfaces.polymer:surfaces.satinMetal};
}

function modelMeshes(finish: ProductFinish): MeshData[] {
  const c=palette[finish], out:MeshData[]=[arch(c.shell),arch(c.cushion,true),arch(c.accent,false,true)];
  for(const side of [-1,1]) {
    const x=side*.87, y=-.37;
    const cupAngle=side*.19;
    // Layered soft-rectangle geometry gives the cup a tailored edge, padded
    // acoustic seal, and a restrained inset finish plate.
    out.push(softVolume([.64,.79,.39],[x,y,-.09],.72,c.cushion,cupAngle,surfaces.leather));
    out.push(softVolume([.59,.75,.39],[x,y,.035],.68,c.shell,cupAngle,surfaces.satinMetal));
    out.push(softVolume([.54,.70,.12],[x,y,.235],.72,c.plate,cupAngle,surfaces.ceramic));
    out.push(softVolume([.46,.61,.045],[x,y,.319],.78,c.shell,cupAngle,surfaces.polymer));
    // Quiet vertical signature and tactile control mark, kept flush with the cup.
    out.push(softVolume([.018,.29,.012],[x+side*.145,y+.015,.348],.85,c.accent,cupAngle,surfaces.polymer));
    out.push(softVolume([.11,.018,.012],[x,y-.255,.35],.9,c.accent,cupAngle,surfaces.polymer));
    // A narrow floating yoke and compact hinge connect the cup to the band.
    out.push(softVolume([.105,.43,.11],[side*.91,.105,.015],.62,c.shell,side*.08,surfaces.satinMetal));
    out.push(softVolume([.14,.105,.14],[side*.9,-.145,.035],.72,c.plate,side*.06,surfaces.ceramic));
    out.push(softVolume([.07,.24,.065],[side*.93,.38,.012],.72,c.shell,side*.08,surfaces.polymer));
  }
  return out;
}

const vertexShader = `attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uProjection; uniform mat4 uModel; varying vec3 vNormal; varying vec3 vPosition; void main(){ vec4 p=uModel*vec4(aPosition,1.0); vPosition=p.xyz; vNormal=mat3(uModel)*aNormal; gl_Position=uProjection*p; }`;
const fragmentShader = `precision mediump float; uniform vec3 uColor; uniform vec2 uSurface; varying vec3 vNormal; varying vec3 vPosition; void main(){ vec3 N=normalize(vNormal); vec3 L=normalize(vec3(-0.48,0.72,0.82)); vec3 V=normalize(-vPosition); float rough=clamp(uSurface.x,.08,1.0); float metal=clamp(uSurface.y,0.0,1.0); float diff=max(dot(N,L),0.0); float spec=pow(max(dot(N,normalize(L+V)),0.0),mix(86.0,8.0,rough)); float rim=pow(1.0-max(dot(N,V),0.0),2.4); vec3 warm=vec3(1.0,0.83,0.65); vec3 base=uColor*(0.34+0.64*diff)*(1.0-metal*.28); vec3 sheen=mix(vec3(.94),warm,metal*.34); vec3 color=base+sheen*spec*(.14+metal*.42)*(1.0-rough*.55)+warm*rim*.055; gl_FragColor=vec4(color,1.0); }`;

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const s=gl.createShader(type); if(!s) throw new Error('Could not create shader');
  gl.shaderSource(s,source); gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)||'Shader compilation failed');
  return s;
}
function mat4Perspective(fov:number,aspect:number,near:number,far:number) {
  const f=1/Math.tan(fov/2), nf=1/(near-far);
  return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
}
function makeModel(yaw:number,pitch:number,zoom:number):Float32Array {
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch),s=zoom;
  return new Float32Array([cy*s,0,-sy*s,0,sy*sx*s,cx*s,cy*sx*s,0,sy*cx*s,-sx*s,cy*cx*s,0,0,-.3,-4.8,1]);
}
function normalArray(p:number[],idx:number[]) {
  const n=new Float32Array(p.length);
  for(let i=0;i<idx.length;i+=3){const a=idx[i]*3,b=idx[i+1]*3,c=idx[i+2]*3, ux=p[b]-p[a],uy=p[b+1]-p[a+1],uz=p[b+2]-p[a+2],vx=p[c]-p[a],vy=p[c+1]-p[a+1],vz=p[c+2]-p[a+2],nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;for(const k of [a,b,c]){n[k]+=nx;n[k+1]+=ny;n[k+2]+=nz}}
  for(let i=0;i<n.length;i+=3){const len=Math.hypot(n[i],n[i+1],n[i+2])||1;n[i]/=len;n[i+1]/=len;n[i+2]/=len}
  return n;
}

export default function ProductViewer({ color='Cream', compact=false, angle=.38, className='', interactive=true }: { color?: ProductFinish; compact?: boolean; angle?: number; className?: string; interactive?: boolean }) {
  const rootRef=useRef<HTMLDivElement>(null), canvasRef=useRef<HTMLCanvasElement>(null), rotation=useRef({x:.1,y:angle}), drag=useRef<{x:number;y:number;active:boolean}>({x:0,y:0,active:false}), pointer=useRef({x:0,y:0});
  const [supported,setSupported]=useState(true);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const root=rootRef.current;if(!root)return;
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'80px'});
    observer.observe(root);return()=>observer.disconnect();
  },[]);
  useEffect(()=>{rotation.current.y=angle},[angle]);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas||!visible)return;
    let gl:WebGLRenderingContext|null=null, raf=0, disposed=false;
    const resources:Array<{p:WebGLBuffer;n:WebGLBuffer;i:WebGLBuffer;count:number;color:Float32Array;surface:Float32Array}>=[];
    try {
      gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});
      if(!gl){setSupported(false);return}
      const program=gl.createProgram();if(!program)throw new Error('Could not create program');
      gl.attachShader(program,shader(gl,gl.VERTEX_SHADER,vertexShader));gl.attachShader(program,shader(gl,gl.FRAGMENT_SHADER,fragmentShader));gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'Program link failed');
      const pos=gl.getAttribLocation(program,'aPosition'),norm=gl.getAttribLocation(program,'aNormal'),proj=gl.getUniformLocation(program,'uProjection'),mdl=gl.getUniformLocation(program,'uModel'),col=gl.getUniformLocation(program,'uColor'),surface=gl.getUniformLocation(program,'uSurface');
      gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
      for(const mesh of modelMeshes(color)) {
        const normals=normalArray(mesh.positions,mesh.indices),p=gl.createBuffer(),n=gl.createBuffer(),i=gl.createBuffer();if(!p||!n||!i)throw new Error('Could not allocate model buffers');
        gl.bindBuffer(gl.ARRAY_BUFFER,p);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mesh.positions),gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER,n);gl.bufferData(gl.ARRAY_BUFFER,normals,gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,i);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(mesh.indices),gl.STATIC_DRAW);
        resources.push({p,n,i,count:mesh.indices.length,color:new Float32Array(mesh.color),surface:new Float32Array([mesh.surface.roughness,mesh.surface.metalness])});
      }
      const resize=()=>{if(!gl)return;const dpr=Math.min(window.devicePixelRatio||1,compact?1.25:1.55),w=Math.max(1,Math.floor(canvas.clientWidth*dpr)),h=Math.max(1,Math.floor(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}};
      const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
      const frame=(now:number)=>{
        if(disposed||!gl)return;raf=requestAnimationFrame(frame);resize();
        const idle=!drag.current.active&&!reduced.matches?Math.sin(now*.00028)*.045:0;
        const w=canvas.width,h=canvas.height;gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniformMatrix4fv(proj,false,mat4Perspective(0.66,w/h,.1,100));gl.uniformMatrix4fv(mdl,false,makeModel(rotation.current.y+idle+pointer.current.x*.08,rotation.current.x+pointer.current.y*.045,compact?.83:1));
        for(const r of resources){gl.bindBuffer(gl.ARRAY_BUFFER,r.p);gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,r.n);gl.enableVertexAttribArray(norm);gl.vertexAttribPointer(norm,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,r.i);gl.uniform3fv(col,r.color);gl.uniform2fv(surface,r.surface);gl.drawElements(gl.TRIANGLES,r.count,gl.UNSIGNED_SHORT,0)}
      };
      raf=requestAnimationFrame(frame);
      return ()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();resources.forEach(r=>{gl?.deleteBuffer(r.p);gl?.deleteBuffer(r.n);gl?.deleteBuffer(r.i)});gl?.deleteProgram(program)};
    } catch { setSupported(false); }
  },[color,compact,visible]);
  const onDown=(e:ReactPointerEvent<HTMLCanvasElement>)=>{if(!interactive)return;drag.current={x:e.clientX,y:e.clientY,active:true};e.currentTarget.setPointerCapture(e.pointerId)};
  const onMove=(e:ReactPointerEvent<HTMLCanvasElement>)=>{pointer.current={x:(e.clientX/window.innerWidth-.5)*2,y:(e.clientY/window.innerHeight-.5)*2};if(!drag.current.active)return;const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;rotation.current.y=Math.max(-1.15,Math.min(1.15,rotation.current.y+dx*.008));rotation.current.x=Math.max(-.38,Math.min(.42,rotation.current.x+dy*.004));drag.current.x=e.clientX;drag.current.y=e.clientY};
  const onUp=(e:ReactPointerEvent<HTMLCanvasElement>)=>{drag.current.active=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)};
  const onKey=(e:ReactKeyboardEvent<HTMLCanvasElement>)=>{if(e.key==='ArrowLeft')rotation.current.y=Math.max(-1.15,rotation.current.y-.16);if(e.key==='ArrowRight')rotation.current.y=Math.min(1.15,rotation.current.y+.16);if(e.key==='ArrowUp')rotation.current.x=Math.max(-.38,rotation.current.x-.1);if(e.key==='ArrowDown')rotation.current.x=Math.min(.42,rotation.current.x+.1)};
  return <div ref={rootRef} className={`product-viewer ${className}`} role="group" aria-label={`Interactive three dimensional Obsidian One headphone model, ${color} finish`}><canvas ref={canvasRef} className="model-canvas" aria-label="Drag or use arrow keys to rotate the headphone model" tabIndex={interactive?0:-1} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey}/>{!supported&&<span className="model-fallback">3D product preview unavailable</span>}</div>;
}
