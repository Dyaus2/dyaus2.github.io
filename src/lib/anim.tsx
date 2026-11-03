import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { finePointer, prefersReducedMotion } from "./device";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ";

/** Text that decodes from random glyphs when it enters the viewport (and when `text` changes). */
export function Scramble({ text, className, as: Tag = "span", delay = 0, duration = 1.1 }: {
  text: string; className?: string; as?: "span" | "h1" | "h2" | "h3" | "p"; delay?: number; duration?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [out, setOut] = useState(text);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { setOut(text); return; }
    let raf = 0;
    let timer = 0;
    const run = () => {
      const start = performance.now() + delay * 1000;
      const tick = (now: number) => {
        const p = Math.max(0, Math.min(1, (now - start) / (duration * 1000)));
        const n = Math.floor(p * text.length);
        let s = text.slice(0, n);
        for (let i = n; i < text.length; i++) s += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        setOut(s);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (seen.current) { run(); return () => cancelAnimationFrame(raf); }
    setOut(text.replace(/\S/g, " "));
    const io = new IntersectionObserver((ents) => {
      if (ents.some((e) => e.isIntersecting)) { seen.current = true; io.disconnect(); timer = window.setTimeout(run, 0); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.clearTimeout(timer); };
  }, [text, delay, duration]);

  return <Tag ref={ref as never} className={className} aria-label={text}><span aria-hidden="true">{out}</span></Tag>;
}

/** Animated number (counts from `from` to `value` when visible or when `play` flips true). */
export function CountUp({ value, from = 0, decimals = 0, prefix = "", suffix = "", play = true, duration = 1.8, lang = "en" }: {
  value: number; from?: number; decimals?: number; prefix?: string; suffix?: string; play?: boolean; duration?: number; lang?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) =>
    prefix + v.toLocaleString(lang === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!play) { el.textContent = fmt(from); return; }
    if (prefersReducedMotion()) { el.textContent = fmt(value); return; }
    const o = { v: from };
    let tw: gsap.core.Tween | null = null;
    el.textContent = fmt(from);
    // start counting only once the number is actually on screen
    const io = new IntersectionObserver((ents) => {
      if (!ents.some((e) => e.isIntersecting)) return;
      io.disconnect();
      tw = gsap.to(o, { v: value, duration, ease: "power3.out", delay: 0.25, onUpdate: () => { el.textContent = fmt(o.v); } });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); tw?.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, from, decimals, prefix, suffix, play, duration, lang]);
  return <span ref={ref} className="countup">{fmt(from)}</span>;
}

/** Magnetic pull on [data-magnetic] elements inside `root` (desktop only). */
export function useMagnetic(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!finePointer() || prefersReducedMotion() || !root.current) return;
    const els = Array.from(root.current.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const cleanups = els.map((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const leave = () => { xTo(0); yTo(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });
    return () => cleanups.forEach((c) => c());
  });
}

/** Scroll-triggered reveals for [data-reveal] children (fade + rise + de-blur, staggered by DOM order). */
export function useReveals(root: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    if (!root.current) return;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const kind = el.dataset.reveal;
        const dx = innerWidth < 820 ? 30 : 80; // small side-slides on phones
        const from: gsap.TweenVars =
          kind === "left" ? { x: -dx, opacity: 0, filter: "blur(10px)" }
          : kind === "right" ? { x: dx, opacity: 0, filter: "blur(10px)" }
          : kind === "scale" ? { scale: 0.85, opacity: 0, filter: "blur(12px)" }
          : { y: 60, opacity: 0, filter: "blur(10px)" };
        // fromTo with explicit end values: never depends on (possibly mid-transition) computed styles
        gsap.fromTo(el, from, {
          x: 0, y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "expo.out", delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((wrap) => {
        gsap.fromTo(wrap.children, { y: 30, opacity: 0, scale: 0.9 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.8)", stagger: 0.04,
          scrollTrigger: { trigger: wrap, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
