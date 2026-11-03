import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { glowTexture } from "./world";

interface Props {
  points: THREE.Vector3[];
  edges: [number, number][];
  color: THREE.ColorRepresentation;
  nodeSize?: number;
  lineOpacity?: number;
  pulses?: number;
  pulseSpeed?: number;
  pulseSize?: number;
  pulseColor?: THREE.ColorRepresentation;
  seed?: number;
}

/** Nodes + synapse lines + light pulses travelling along edges. */
export function Graph({
  points, edges, color, nodeSize = 0.28, lineOpacity = 0.22, pulses = 40, pulseSpeed = 0.5,
  pulseSize = 0.35, pulseColor = "#ffffff", seed = 1,
}: Props) {
  const tex = glowTexture();

  const nodeGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const lineGeo = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      points[a].toArray(arr, i * 6);
      points[b].toArray(arr, i * 6 + 3);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [points, edges]);

  // pulse state: edge index, progress, speed, direction
  const pulseState = useMemo(() => {
    let s = seed;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: edges.length ? pulses : 0 }, () => ({
      e: Math.floor(r() * edges.length), t: r(), v: (0.4 + r() * 0.8) * pulseSpeed, dir: r() > 0.5 ? 1 : -1, r,
    }));
  }, [edges, pulses, pulseSpeed, seed]);

  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(Math.max(1, pulseState.length) * 3), 3));
    return g;
  }, [pulseState]);

  const tmp = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    if (!pulseState.length) return;
    const pos = pulseGeo.attributes.position as THREE.BufferAttribute;
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < pulseState.length; i++) {
      const p = pulseState[i];
      p.t += p.v * d;
      if (p.t >= 1) { // hop to a random edge
        p.t = 0;
        p.e = Math.floor(p.r() * edges.length);
        p.dir = p.r() > 0.5 ? 1 : -1;
      }
      const [a, b] = edges[p.e];
      const from = p.dir > 0 ? points[a] : points[b];
      const to = p.dir > 0 ? points[b] : points[a];
      tmp.current.lerpVectors(from, to, p.t);
      pos.setXYZ(i, tmp.current.x, tmp.current.y, tmp.current.z);
    }
    pos.needsUpdate = true;
  });

  return (
    <group>
      <points geometry={nodeGeo}>
        <pointsMaterial map={tex} color={color} size={nodeSize} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={color} transparent opacity={lineOpacity} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      {pulseState.length > 0 && (
        <points geometry={pulseGeo} frustumCulled={false}>
          <pointsMaterial map={tex} color={pulseColor} size={pulseSize} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      )}
    </group>
  );
}
