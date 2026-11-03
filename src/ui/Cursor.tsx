import { useEffect, useRef } from "react";
import { finePointer, prefersReducedMotion } from "../lib/device";

/** Glowing cursor: dot + lagging ring + particle trail canvas. Grows over interactive elements and 3D clusters. Desktop only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!finePointer()) return;
    document.body.classList.add("custom-cursor");
    const reduced = prefersReducedMotion();
    const c = canvas.current!;
    const g = c.getContext("2d")!;
    const resize = () => { c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio; };
    resize();
    addEventListener("resize", resize);

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    let active = false, down = false;
    const parts: { x: number; y: number; vx: number; vy: number; life: number; hue: number }[] = [];

    const move = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      const tgt = e.target as Element | null;
      active = !!tgt?.closest?.("a,button,[data-magnetic],input,label") || document.body.classList.contains("hovering-3d");
      if (!reduced && parts.length < 140) {
        for (let i = 0; i < 2; i++) parts.push({ x: mx, y: my, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, life: 1, hue: Math.random() < 0.5 ? 187 : 275 });
      }
    };
    const dn = () => { down = true; };
    const up = () => { down = false; };
    addEventListener("pointermove", move);
    addEventListener("pointerdown", dn);
    addEventListener("pointerup", up);

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`;
      if (ring.current) {
        const s = (active ? 2.2 : 1) * (down ? 0.8 : 1);
        ring.current.style.transform = `translate(${rx}px, ${ry}px) scale(${s})`;
        ring.current.classList.toggle("active", active);
      }
      g.clearRect(0, 0, c.width, c.height);
      g.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.025;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        g.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.life * 0.55})`;
        g.beginPath();
        g.arc(p.x * devicePixelRatio, p.y * devicePixelRatio, 2.4 * p.life * devicePixelRatio, 0, Math.PI * 2);
        g.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", dn);
      removeEventListener("pointerup", up);
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  if (typeof window !== "undefined" && !finePointer()) return null;
  return (
    <>
      <canvas ref={canvas} className="cursor-trail" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
