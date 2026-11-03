import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "../lib/device";
import { live, useUI } from "../lib/store";
import { glowTexture, rng } from "./world";

/** Sample pixel positions of the initials "HI" from an offscreen canvas. */
function sampleInitials(count: number): THREE.Vector3[] {
  const W = 640, H = 320;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 280px "Space Grotesk", "Segoe UI", Arial, sans-serif`;
  g.fillText("HI", W / 2, H / 2 + 10);
  const data = g.getImageData(0, 0, W, H).data;
  const cand: [number, number][] = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3] > 128) cand.push([x, y]);
  const r = rng(42);
  const out: THREE.Vector3[] = [];
  const scale = 9 / W;
  const lift = 2.1; // avatar sits in the upper half, hero text below
  for (let i = 0; i < count && cand.length; i++) {
    const [x, y] = cand[Math.floor(r() * cand.length)];
    out.push(new THREE.Vector3((x - W / 2) * scale + (r() - 0.5) * 0.04, -(y - H / 2) * scale + lift, (r() - 0.5) * 0.35));
  }
  return out;
}

export function Avatar({ count, fontsReady }: { count: number; fontsReady: boolean }) {
  const entered = useUI((s) => s.entered);
  const { camera, raycaster, pointer } = useThree();
  const progress = useRef(prefersReducedMotion() ? 1 : 0);

  const data = useMemo(() => {
    if (!fontsReady) return null;
    const target = sampleInitials(count);
    const r = rng(9);
    const n = target.length;
    const start = new Float32Array(n * 3);
    const pos = new Float32Array(n * 3);
    const off = new Float32Array(n * 3);
    const delay = new Float32Array(n);
    const col = new Float32Array(n * 3);
    const a = new THREE.Color("#00e5ff"), b = new THREE.Color("#b06cff"), tmp = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 14 + r() * 16, s = Math.sqrt(1 - u * u);
      start[i * 3] = Math.cos(th) * s * rad;
      start[i * 3 + 1] = u * rad;
      start[i * 3 + 2] = Math.sin(th) * s * rad - 6;
      pos.set(start.subarray(i * 3, i * 3 + 3), i * 3);
      delay[i] = r() * 0.55;
      tmp.copy(a).lerp(b, (target[i].x + 4.5) / 9 + (r() - 0.5) * 0.2);
      tmp.toArray(col, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return { target, start, off, delay, geo, n };
  }, [count, fontsReady]);

  useEffect(() => () => data?.geo.dispose(), [data]);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    if (!data) return;
    const d = Math.min(dt, 0.05);
    if (entered && progress.current < 1) progress.current = Math.min(1, progress.current + d / 2.6);
    const P = progress.current;
    // scatter as the camera leaves the hero section
    const ex = THREE.MathUtils.smoothstep(live.section, 0.25, 1.3);
    raycaster.setFromCamera(pointer, camera);
    const hasHit = raycaster.ray.intersectPlane(plane, hit) !== null && live.section < 0.6;
    const t = state.clock.elapsedTime;
    const pos = data.geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const { target, start, off, delay } = data;
    for (let i = 0; i < data.n; i++) {
      const k = THREE.MathUtils.clamp((P - delay[i]) / 0.45, 0, 1);
      const e = 1 - Math.pow(1 - k, 3); // easeOutCubic
      const i3 = i * 3;
      const tx = target[i].x + Math.sin(t * 1.3 + i) * 0.015;
      const ty = target[i].y + Math.cos(t * 1.1 + i * 0.7) * 0.015;
      const tz = target[i].z;
      let x = start[i3] + (tx - start[i3]) * e;
      let y = start[i3 + 1] + (ty - start[i3 + 1]) * e;
      let z = start[i3 + 2] + (tz - start[i3 + 2]) * e;
      // pointer repulsion with spring back
      if (hasHit) {
        const dx = x - hit.x, dy = y - hit.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.3 && dist > 1e-4) {
          const f = (1 - dist / 1.3) * 0.12;
          off[i3] += (dx / dist) * f;
          off[i3 + 1] += (dy / dist) * f;
          off[i3 + 2] += f * 0.6;
        }
      }
      const damp = Math.exp(-d * 3.2);
      off[i3] *= damp; off[i3 + 1] *= damp; off[i3 + 2] *= damp;
      x += off[i3]; y += off[i3 + 1]; z += off[i3 + 2];
      // explode outward when scrolling away
      if (ex > 0) {
        x += (start[i3] - x) * ex * 0.7;
        y += (start[i3 + 1] - y) * ex * 0.7;
        z += (start[i3 + 2] - z) * ex * 0.7;
      }
      arr[i3] = x; arr[i3 + 1] = y; arr[i3 + 2] = z;
    }
    pos.needsUpdate = true;
  });

  if (!data) return null;
  return (
    <points geometry={data.geo} frustumCulled={false}>
      <pointsMaterial map={glowTexture()} vertexColors size={0.17} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
