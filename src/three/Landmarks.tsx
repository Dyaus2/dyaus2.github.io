import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sphereSkills } from "../content/data";
import { live } from "../lib/store";
import { Graph } from "./Graph";
import { CORE_POS, knnEdges, rng, SKILLS_POS, textSprite, TIMELINE_Z } from "./world";

const PALETTE = ["#00e5ff", "#7ff6ff", "#b06cff", "#ff5fa2", "#ffb547", "#4dffb5"];

/** Rotating sphere of skill labels + wireframe globe + certification satellites. */
export function SkillSphere({ fontsReady, certCount }: { fontsReady: boolean; certCount: number }) {
  const group = useRef<THREE.Group>(null);
  const sats = useRef<THREE.Group>(null);
  const labels = useMemo(() => {
    if (!fontsReady) return [];
    const n = sphereSkills.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    return sphereSkills.map((s, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const R = 4.6;
      const sp = textSprite(s, PALETTE[i % PALETTE.length], 56, 600);
      return { pos: new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R), ...sp };
    });
  }, [fontsReady]);
  useEffect(() => () => labels.forEach((l) => l.tex.dispose()), [labels]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    if (group.current) {
      group.current.rotation.y += d * 0.18;
      group.current.rotation.x += ((live.py * 0.35) - group.current.rotation.x) * (1 - Math.exp(-d * 2));
    }
    if (sats.current) {
      sats.current.rotation.y -= d * 0.35;
      sats.current.children.forEach((c, i) => { c.rotation.x += d * (0.8 + i * 0.1); c.rotation.y += d; });
    }
  });

  return (
    <group position={SKILLS_POS}>
      <group ref={group}>
        <mesh>
          <icosahedronGeometry args={[4.1, 3]} />
          <meshBasicMaterial color="#3f6bff" wireframe transparent opacity={0.12} toneMapped={false} />
        </mesh>
        {labels.map((l, i) => (
          <sprite key={i} position={l.pos} scale={[l.aspect * 0.55, 0.55, 1]}>
            <spriteMaterial map={l.tex} transparent depthWrite={false} />
          </sprite>
        ))}
      </group>
      <group ref={sats} rotation={[0.35, 0, 0.15]}>
        {Array.from({ length: certCount }, (_, i) => {
          const a = (i / certCount) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 7, 0, Math.sin(a) * 7]}>
              <octahedronGeometry args={[0.35, 0]} />
              <meshBasicMaterial color={PALETTE[(i + 2) % PALETTE.length]} wireframe toneMapped={false} />
            </mesh>
          );
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[7, 0.012, 8, 160]} />
          <meshBasicMaterial color="#b06cff" transparent opacity={0.5} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Journey spine: five milestones connected by a light path; the last one (PFE 2027) pulses. */
export function TimelineSpine() {
  const nodes = useMemo(() => [-8, -4, 0, 4, 8].map((x, i) => new THREE.Vector3(x, Math.sin(i * 1.3) * 0.8, TIMELINE_Z)), []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(nodes), [nodes]);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.035, 8, false), [curve]);
  const runner = useRef<THREE.Mesh>(null);
  const last = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (runner.current) runner.current.position.copy(curve.getPointAt((t * 0.12) % 1));
    if (last.current) last.current.scale.setScalar(1 + Math.sin(t * 3) * 0.25);
  });
  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color="#7ff6ff" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      {nodes.map((p, i) => (
        <mesh key={i} position={p} ref={i === nodes.length - 1 ? last : undefined}>
          <sphereGeometry args={[i === nodes.length - 1 ? 0.45 : 0.3, 24, 24]} />
          <meshBasicMaterial color={i === nodes.length - 1 ? "#ff5fa2" : "#00e5ff"} toneMapped={false} />
        </mesh>
      ))}
      <mesh ref={runner}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Final destination: a pulsing neural core with orbit rings and its own mini-network. */
export function Core({ nodes }: { nodes: number }) {
  const g = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const { points, edges } = useMemo(() => {
    const r = rng(77);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < nodes; i++) {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 3.5 + r() * 3.5, s = Math.sqrt(1 - u * u);
      pts.push(new THREE.Vector3(Math.cos(th) * s * rad, u * rad, Math.sin(th) * s * rad));
    }
    return { points: pts, edges: knnEdges(pts, 3, 3.2) };
  }, [nodes]);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (g.current) g.current.rotation.y += Math.min(dt, 0.05) * 0.1;
    if (heart.current) heart.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.12);
    if (rings.current) rings.current.children.forEach((c, i) => { c.rotation.x += 0.004 * (i + 1); c.rotation.y += 0.003 * (3 - i); });
  });
  return (
    <group position={CORE_POS}>
      <group ref={g}>
        <Graph points={points} edges={edges} color="#b06cff" nodeSize={0.35} lineOpacity={0.25} pulses={Math.round(nodes / 2)} pulseSpeed={0.8} pulseSize={0.35} pulseColor="#7ff6ff" seed={5} />
      </group>
      <mesh ref={heart}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial color="#b06cff" wireframe transparent opacity={0.4} toneMapped={false} />
      </mesh>
      <group ref={rings}>
        {[2.8, 3.4, 4.0].map((R, i) => (
          <mesh key={i} rotation={[i, i * 0.7, 0]}>
            <torusGeometry args={[R, 0.015, 8, 160]} />
            <meshBasicMaterial color={["#00e5ff", "#ff5fa2", "#ffb547"][i]} transparent opacity={0.7} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
