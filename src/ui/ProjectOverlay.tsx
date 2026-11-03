import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "../content/data";
import { ui, useLang } from "../content/i18n";
import { CountUp, gsap, Scramble } from "../lib/anim";
import { prefersReducedMotion } from "../lib/device";
import { sound } from "../lib/sound";
import { setUI, useUI } from "../lib/store";

/** Side panel (bottom sheet on phones) with full project details; the camera zooms into the cluster meanwhile. */
export function ProjectOverlay() {
  const { t, lang } = useLang();
  const focus = useUI((s) => s.focus);
  const [shown, setShown] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const idx = projects.findIndex((p) => p.id === (focus ?? shown));
  const p = idx >= 0 ? projects[idx] : null;

  // mount on open, animate out before unmount on close
  useEffect(() => {
    if (focus) { setShown(focus); return; }
    if (!shown || !panel.current) return;
    if (prefersReducedMotion()) { setShown(null); return; }
    const tl = gsap.timeline({ onComplete: () => setShown(null) });
    tl.to(panel.current.querySelectorAll(".ov-anim"), { opacity: 0, y: 20, duration: 0.25, stagger: 0.02 })
      .to(panel.current, innerWidth < 820 ? { yPercent: 100, duration: 0.5, ease: "expo.in" } : { xPercent: 105, duration: 0.5, ease: "expo.in" }, "<0.1")
      .to(".ov-backdrop", { opacity: 0, duration: 0.3 }, "<");
    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const wasOpen = useRef(false);
  useLayoutEffect(() => {
    const switching = wasOpen.current && !!focus;
    wasOpen.current = !!focus;
    if (!focus || !panel.current || prefersReducedMotion()) return;
    if (switching) { // project → project: only re-animate the content
      const tl = gsap.timeline();
      tl.fromTo(panel.current.querySelectorAll(".ov-anim"), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.04, ease: "power3.out" });
      panel.current.scrollTop = 0;
      return () => { tl.kill(); };
    }
    const mobile = innerWidth < 820;
    const tl = gsap.timeline();
    tl.fromTo(".ov-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo(panel.current, mobile ? { yPercent: 100, xPercent: 0 } : { xPercent: 105, yPercent: 0 }, { xPercent: 0, yPercent: 0, duration: 0.9, ease: "expo.out" }, "<")
      .fromTo(panel.current.querySelectorAll(".ov-anim"), { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.05, ease: "power3.out" }, "<0.25");
    return () => { tl.kill(); };
  }, [focus]);

  // Esc to close, arrows to switch, lock page scroll while open
  useEffect(() => {
    if (!focus) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUI({ focus: null });
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    addEventListener("keydown", key);
    document.documentElement.classList.add("lock");
    return () => { removeEventListener("keydown", key); document.documentElement.classList.remove("lock"); };
  });

  const step = (dir: number) => {
    const n = (idx + dir + projects.length) % projects.length;
    sound.whoosh();
    setUI({ focus: projects[n].id });
    // keep the page scroll aligned with the new project
    document.getElementById(n === 0 ? "projects" : `project-${projects[n].id}`)?.scrollIntoView({ behavior: "auto", block: "start" });
  };

  if (!shown || !p) return null;
  return (
    <div className="overlay" data-ui role="dialog" aria-modal="true" aria-label={p.title} style={{ ["--accent" as string]: p.color }}>
      <div className="ov-backdrop" onClick={() => setUI({ focus: null })} />
      <div className="ov-panel glass" ref={panel}>
        <div className="ov-top ov-anim">
          <span className="ov-index">{String(idx + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          <div className="ov-nav">
            <button onClick={() => step(-1)} aria-label="Previous project" data-magnetic>←</button>
            <button onClick={() => step(1)} aria-label="Next project" data-magnetic>→</button>
            <button onClick={() => setUI({ focus: null })} className="ov-close" data-magnetic>{t(ui.close)} ✕</button>
          </div>
        </div>
        <p className="card-kicker ov-anim">{t(p.kicker)} · {t(p.period)}</p>
        <Scramble key={p.id + lang} as="h2" className="ov-title" text={p.title} duration={0.9} />
        <p className="ov-role ov-anim">{t(p.role)}</p>
        <p className="ov-summary ov-anim">{t(p.summary)}</p>
        {p.metrics.length > 0 && (
          <>
            <h4 className="ov-h ov-anim">{t(ui.results)}</h4>
            <div className="ov-metrics">
              {p.metrics.map((m, k) => (
                <div key={p.id + k} className="ov-metric ov-anim">
                  <strong><CountUp value={m.value} from={m.from ?? 0} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} lang={lang} duration={2.2} /></strong>
                  <span>{t(m.label)}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <h4 className="ov-h ov-anim">{t(ui.highlights)}</h4>
        <ul className="ov-bullets">
          {p.bullets.map((b, k) => <li key={p.id + k} className="ov-anim">{t(b)}</li>)}
        </ul>
        <h4 className="ov-h ov-anim">{t(ui.stack)}</h4>
        <ul className="chips ov-anim">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
    </div>
  );
}
