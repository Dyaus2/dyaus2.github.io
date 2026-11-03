import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Graph } from "./Graph";
import { glowTexture, knnEdges, rng, WORLD_Z_MAX, WORLD_Z_MIN } from "./world";

/** Background neural network: a tube of nodes around the flight path. */
export function Network({ count, pulses }: { count: number; pulses: number }) {
  const { points, edges } = useMemo(() => {
    const r = rng(7);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const z = WORLD_Z_MAX - r() * (WORLD_Z_MAX - WORLD_Z_MIN);
      const ang = r() * Math.PI * 2;
      const rad = 10 + Math.pow(r(), 0.7) * 24;
      pts.push(new THREE.Vector3(Math.cos(ang) * rad, Math.sin(ang) * rad * 0.65, z));
    }
    return { points: pts, edges: knnEdges(pts, 2, 11) };
  }, [count]);

  return (
    <group>
      <Graph points={points} edges={edges} color="#3f6bff" nodeSize={0.45} lineOpacity={0.16} pulses={pulses} pulseSpeed={0.55} pulseSize={0.55} pulseColor="#7ff6ff" seed={11} />
    </group>
  );
}

/** Distant star dust, slowly rotating. */
export function Starfield({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const r = rng(3);
    const arr = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color("#9fb4ff"), c2 = new THREE.Color("#c99bff"), c3 = new THREE.Color("#ffffff"), tmp = new THREE.Color();
    const midZ = (WORLD_Z_MAX + WORLD_Z_MIN) / 2;
    for (let i = 0; i < count; i++) {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 60 + r() * 160;
      const s = Math.sqrt(1 - u * u);
      arr[i * 3] = Math.cos(th) * s * rad;
      arr[i * 3 + 1] = u * rad * 0.7;
      arr[i * 3 + 2] = midZ + Math.sin(th) * s * rad * 1.4;
      const k = r();
      tmp.copy(k < 0.33 ? c1 : k < 0.66 ? c2 : c3);
      tmp.toArray(col, i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count]);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 0.004; });
  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <pointsMaterial map={glowTexture()} vertexColors size={0.9} sizeAttenuation transparent depthWrite={false} fog={false} blending={THREE.AdditiveBlending} opacity={0.9} />
    </points>
  );
}
