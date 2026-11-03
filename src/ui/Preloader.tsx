import { useEffect, useRef, useState } from "react";
import { ui, useLang } from "../content/i18n";
import { gsap } from "../lib/anim";
import { prefersReducedMotion } from "../lib/device";
import { getUI, setUI } from "../lib/store";

/** Neural "boot" screen: animated graph + counting percentage, then a curtain wipe. Waits for the WebGL scene. */
export function Preloader({ webgl }: { webgl: boolean }) {
  const { t } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const counter = { v: 0 };
    const minTime = reduced ? 0.4 : 2.4;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      const tl = gsap.timeline({ onComplete: () => { setGone(true); } });
      tl.to(counter, { v: 100, duration: 0.4, ease: "power2.out", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(counter.v)); } })
        .to(".pre-inner", { opacity: 0, y: -30, duration: 0.5, ease: "power3.in" })
        .call(() => setUI({ entered: true }))
        .to(".pre-curtain", { scaleY: 0, transformOrigin: "top", duration: 0.9, ease: "expo.inOut", stagger: 0.06 }, "<0.1")
        .to(root.current, { autoAlpha: 0, duration: 0.2 });
    };
    // count to 90% over minTime, then wait for the scene
    const tw = gsap.to(counter, {
      v: 90, duration: minTime, ease: "power1.inOut",
      onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(counter.v)); },
      onComplete: () => {
        const wait = () => (getUI().sceneReady || !webgl ? finish() : window.setTimeout(wait, 100));
        wait();
      },
    });
    const safety = window.setTimeout(finish, 9000); // never block the site
    return () => { tw.kill(); window.clearTimeout(safety); };
  }, [webgl]);

  if (gone) return null;
  return (
    <div className="preloader" ref={root} aria-live="polite">
      <div className="pre-curtains">
        {Array.from({ length: 5 }, (_, i) => <div key={i} className="pre-curtain" />)}
      </div>
      <div className="pre-inner">
        <svg className="pre-graph" viewBox="0 0 200 120" aria-hidden="true">
          {[[20, 60, 70, 25], [20, 60, 70, 95], [70, 25, 130, 60], [70, 95, 130, 60], [70, 25, 130, 15], [70, 95, 130, 105], [130, 60, 180, 60], [130, 15, 180, 60], [130, 105, 180, 60]].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
          {[[20, 60], [70, 25], [70, 95], [130, 15], [130, 60], [130, 105], [180, 60]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={4} style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </svg>
        <div className="pre-count"><span ref={num}>0</span><small>%</small></div>
        <div className="pre-label">{t(ui.loading)}<span className="dots" /></div>
        <div className="pre-name">HAZEM ILAHI</div>
      </div>
    </div>
  );
}
