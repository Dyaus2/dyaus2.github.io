import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Project } from "../content/data";
import { sound } from "../lib/sound";
import { getUI, setUI, useUI } from "../lib/store";
import { Graph } from "./Graph";
import { knnEdges, rng, textSprite } from "./world";

interface Props { project: Project; index: number; position: THREE.Vector3; nodes: number; fontsReady: boolean }

/** One project = one glowing neural cluster: fuzzy sphere of nodes, wireframe core, orbit ring, label. */
export function Cluster({ project, index, position, nodes, fontsReady }: Props) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const hovered = useUI((s) => s.hover === project.id);
  const focused = useUI((s) => s.focus === project.id);
  const color = useMemo(() => new THREE.Color(project.color), [project.color]);

  const { points, edges } = useMemo(() => {
    const r = rng(100 + index);
    const pts: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < nodes; i++) {
      const y = 1 - (i / (nodes - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      const R = 2.1 + (r() - 0.5) * 0.9;
      pts.push(new THREE.Vector3(Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R));
    }
    return { points: pts, edges: knnEdges(pts, 3, 1.9) };
  }, [nodes, index]);

  const label = useMemo(() => (fontsReady ? textSprite(project.title, "#ffffff", 72, 700) : null), [project.title, fontsReady]);
  useEffect(() => () => label?.tex.dispose(), [label]);

  const scale = useRef(1);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const active = hovered || focused;
    g.rotation.y += d * (active ? 0.5 : 0.12);
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.15;
    const target = focused ? 1.25 : hovered ? 1.15 : 1;
    scale.current += (target - scale.current) * (1 - Math.exp(-d * 6));
    g.scale.setScalar(scale.current);
    const t = state.clock.elapsedTime;
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 2 + index) * 0.08 + (active ? 0.15 : 0));
    if (shell.current) { shell.current.rotation.x += d * 0.4; shell.current.rotation.z -= d * 0.3; }
    if (ring.current) ring.current.rotation.z += d * 0.6;
  });

  // DOM UI sits above the canvas and shares its event source: ignore events that start on UI elements
  const blocked = (e: ThreeEvent<PointerEvent | MouseEvent>) => !!(e.nativeEvent.target as Element | null)?.closest?.("[data-ui]");
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (blocked(e)) return;
    if (getUI().hover !== project.id) { setUI({ hover: project.id }); sound.blip(520 + index * 60, 0.08, 0.05); }
    document.body.classList.add("hovering-3d");
  };
  const out = () => {
    if (getUI().hover === project.id) setUI({ hover: null });
    document.body.classList.remove("hovering-3d");
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (blocked(e) || getUI().focus) return;
    sound.whoosh();
    setUI({ focus: project.id });
  };

  return (
    <group position={position}>
      <group ref={group}>
        <Graph points={points} edges={edges} color={project.color} nodeSize={0.32} lineOpacity={hovered || focused ? 0.55 : 0.32}
          pulses={Math.round(nodes / 3)} pulseSpeed={0.9} pulseSize={0.3} pulseColor="#ffffff" seed={index + 3} />
        <mesh ref={core}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <mesh ref={shell}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.35} toneMapped={false} />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[3.1, 0.015, 8, 128]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
        </mesh>
      </group>
      {label && (
        <sprite position={[0, 3.4, 0]} scale={[label.aspect * 0.55, 0.55, 1]}>
          <spriteMaterial map={label.tex} transparent depthWrite={false} opacity={hovered || focused ? 1 : 0.8} />
        </sprite>
      )}
      {/* invisible hit area for pointer events */}
      <mesh onPointerOver={over} onPointerOut={out} onClick={click}>
        <sphereGeometry args={[3.2, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
