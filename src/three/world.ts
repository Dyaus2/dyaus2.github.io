import * as THREE from "three";
import { projects } from "../content/data";

/** Section order in the DOM — must match the <section data-section> order in App. */
export const SECTION_COUNT = 2 + projects.length + 3; // hero, about, projects…, journey, skills, contact

const Y = [0.6, -0.8, 1.0, -0.5, 0.8, -1.0, 0.3];
export const clusterPos = projects.map((_, i) => {
  const side = i % 2 === 0 ? 1 : -1;
  return new THREE.Vector3(side * 5, Y[i % Y.length], -32 - i * 17);
});
export const clusterSide = projects.map((_, i) => (i % 2 === 0 ? 1 : -1));

const lastZ = clusterPos[clusterPos.length - 1].z;
export const TIMELINE_Z = lastZ - 24;
export const SKILLS_POS = new THREE.Vector3(0, 0, TIMELINE_Z - 26);
export const CORE_POS = new THREE.Vector3(0, 0, SKILLS_POS.z - 30);
export const WORLD_Z_MIN = CORE_POS.z - 20;
export const WORLD_Z_MAX = 16;

export interface Waypoint { cam: THREE.Vector3; look: THREE.Vector3 }

/** Camera waypoints per section; `portrait` repositions targets for tall phone screens. */
export function buildWaypoints(portrait: boolean): Waypoint[] {
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const w: Waypoint[] = [];
  // hero: avatar "HI" at origin
  w.push(portrait ? { cam: v(0, 0.5, 18), look: v(0, -2, 0) } : { cam: v(0, 0, 14), look: v(0, 0.3, 0) });
  // about: drift past the avatar, look down the corridor
  w.push(portrait ? { cam: v(0, 3, 7), look: v(0, -1, -14) } : { cam: v(-3.5, 1.6, 5), look: v(2.5, -0.5, -10) });
  // projects: cluster on one side, DOM card on the other (portrait: cluster on top)
  clusterPos.forEach((c, i) => {
    const s = clusterSide[i];
    w.push(portrait
      ? { cam: v(c.x * 0.6, c.y + 0.8, c.z + 13), look: v(c.x * 0.85, c.y - 2.6, c.z) }
      : { cam: v(c.x - s * 1.2, c.y + 0.6, c.z + 9.5), look: v(c.x - s * 3.6, c.y, c.z) });
  });
  // journey: look at the timeline spine from slightly above
  w.push(portrait ? { cam: v(0, 4, TIMELINE_Z + 20), look: v(0, -2.5, TIMELINE_Z) } : { cam: v(0, 4.5, TIMELINE_Z + 13), look: v(0, -1.2, TIMELINE_Z) });
  // skills: sphere on the right (portrait: on top)
  const S = SKILLS_POS;
  w.push(portrait ? { cam: v(0, 0.5, S.z + 17), look: v(0, -3, S.z) } : { cam: v(-1.5, 0.4, S.z + 12.5), look: v(-5, 0, S.z) });
  // contact: face the pulsing core
  // core framed in the upper part of the screen so the contact headline stays readable
  w.push(portrait ? { cam: v(0, -6, CORE_POS.z + 22), look: v(0, -9.5, CORE_POS.z) } : { cam: v(0, -5.5, CORE_POS.z + 17), look: v(0, -7.4, CORE_POS.z) });
  return w;
}

/** Camera target when a project overlay is open (cluster framed beside the panel). */
export function focusWaypoint(i: number, portrait: boolean): Waypoint {
  const c = clusterPos[i];
  return portrait
    ? { cam: new THREE.Vector3(c.x, c.y + 0.4, c.z + 8.5), look: new THREE.Vector3(c.x, c.y - 2.2, c.z) }
    : { cam: new THREE.Vector3(c.x, c.y + 0.3, c.z + 7), look: new THREE.Vector3(c.x + 2.6, c.y, c.z) };
}

/** Soft radial sprite used by all glowing points. */
let glowTex: THREE.Texture | null = null;
export function glowTexture(): THREE.Texture {
  if (glowTex) return glowTex;
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.85)");
  grd.addColorStop(0.6, "rgba(255,255,255,0.18)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}

/** Text sprite texture (canvas) — avoids loading external fonts at runtime. */
export function textSprite(text: string, color = "#ffffff", px = 64, weight = 700): { tex: THREE.Texture; aspect: number } {
  const c = document.createElement("canvas");
  const g = c.getContext("2d")!;
  const font = `${weight} ${px}px "Space Grotesk", "Segoe UI", Arial, sans-serif`;
  g.font = font;
  const w = Math.ceil(g.measureText(text).width) + px;
  const h = Math.ceil(px * 1.5);
  c.width = w;
  c.height = h;
  g.font = font;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = color;
  g.shadowBlur = px * 0.35;
  g.fillStyle = color;
  g.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: w / h };
}

/** Deterministic PRNG so the world looks the same on every visit. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Connect each point to its k nearest neighbours within maxDist; returns unique index pairs. */
export function knnEdges(pts: THREE.Vector3[], k: number, maxDist: number): [number, number][] {
  const edges = new Set<string>();
  const out: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const near: { j: number; d: number }[] = [];
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      const d = pts[i].distanceToSquared(pts[j]);
      if (d < maxDist * maxDist) near.push({ j, d });
    }
    near.sort((a, b) => a.d - b.d);
    for (const { j } of near.slice(0, k)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edges.has(key)) { edges.add(key); out.push(i < j ? [i, j] : [j, i]); }
    }
  }
  return out;
}
