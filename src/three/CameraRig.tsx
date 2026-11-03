import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { projects } from "../content/data";
import { prefersReducedMotion } from "../lib/device";
import { live, useUI } from "../lib/store";
import { buildWaypoints, focusWaypoint } from "./world";

/** Flies the camera along the section waypoints, driven by scroll (live.section). */
export function CameraRig() {
  const { camera, size } = useThree();
  const portrait = size.width / size.height < 0.8;
  const wps = useMemo(() => buildWaypoints(portrait), [portrait]);
  const focus = useUI((s) => s.focus);
  const focusIdx = focus ? projects.findIndex((p) => p.id === focus) : -1;
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const look = useRef(new THREE.Vector3().copy(wps[0].look));
  const tPos = useMemo(() => new THREE.Vector3(), []);
  const tLook = useMemo(() => new THREE.Vector3(), []);
  const lastSection = useRef(0);
  const vel = useRef(0);
  const init = useRef(false);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const s = THREE.MathUtils.clamp(live.section, 0, wps.length - 1);
    if (focusIdx >= 0) {
      const f = focusWaypoint(focusIdx, portrait);
      tPos.copy(f.cam);
      tLook.copy(f.look);
    } else {
      const i = Math.min(Math.floor(s), wps.length - 2);
      const f = s - i;
      const e = f * f * (3 - 2 * f); // smoothstep
      tPos.lerpVectors(wps[i].cam, wps[i + 1].cam, e);
      tLook.lerpVectors(wps[i].look, wps[i + 1].look, e);
      tPos.y += Math.sin(Math.PI * f) * 1.2; // arc between stops: feels like flying
    }
    // pointer parallax
    if (!reduced) { tPos.x += live.px * 0.6; tPos.y += live.py * 0.35; }

    const k = reduced ? 1 : 1 - Math.exp(-d * (focusIdx >= 0 ? 2.4 : 3.2));
    if (!init.current) { camera.position.copy(tPos); look.current.copy(tLook); init.current = true; }
    camera.position.lerp(tPos, k);
    look.current.lerp(tLook, k);
    camera.lookAt(look.current);

    // FOV kick proportional to scroll speed (warp feeling)
    const persp = camera as THREE.PerspectiveCamera;
    const v = Math.abs(live.section - lastSection.current) / Math.max(d, 1e-3);
    lastSection.current = live.section;
    vel.current += (Math.min(v, 3) - vel.current) * (1 - Math.exp(-d * 4));
    const baseFov = portrait ? 62 : 55;
    const fov = baseFov + (reduced ? 0 : vel.current * 6);
    if (Math.abs(persp.fov - fov) > 0.01) { persp.fov = fov; persp.updateProjectionMatrix(); }
  });

  return null;
}
