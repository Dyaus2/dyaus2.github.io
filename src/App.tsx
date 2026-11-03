import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { projects } from "./content/data";
import { ui, useLang } from "./content/i18n";
import { ScrollTrigger, useMagnetic, useReveals } from "./lib/anim";
import { hasWebGL } from "./lib/device";
import { live, useUI } from "./lib/store";
import { Cursor } from "./ui/Cursor";
import { Nav } from "./ui/Nav";
import { Preloader } from "./ui/Preloader";
import { ProjectOverlay } from "./ui/ProjectOverlay";
import { About, Contact, Hero, Journey, ProjectSection, Skills } from "./ui/Sections";

const Scene = lazy(() => import("./three/Scene"));

/** Maps page scroll to a float section index: 0 when section 0 is centred, 1 when section 1 is centred, … */
function useSectionTracking() {
  useEffect(() => {
    let anchors: number[] = [];
    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
      anchors = els.map((el) => {
        const top = el.getBoundingClientRect().top + scrollY;
        return Math.max(0, top + el.offsetHeight / 2 - innerHeight / 2);
      });
      anchors[0] = 0;
      update();
    };
    const update = () => {
      const y = scrollY;
      if (!anchors.length) return;
      if (y <= anchors[0]) { live.section = 0; return; }
      for (let i = 0; i < anchors.length - 1; i++) {
        if (y < anchors[i + 1]) {
          const span = anchors[i + 1] - anchors[i];
          live.section = i + (span > 0 ? (y - anchors[i]) / span : 0);
          return;
        }
      }
      live.section = anchors.length - 1;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", measure);
    return () => { ro.disconnect(); removeEventListener("scroll", update); removeEventListener("resize", measure); };
  }, []);
}

function usePointer() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      live.px = (e.clientX / innerWidth) * 2 - 1;
      live.py = -(e.clientY / innerHeight) * 2 + 1;
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, []);
}

export default function App() {
  const { t } = useLang();
  const webgl = useMemo(() => hasWebGL(), []);
  const root = useRef<HTMLDivElement>(null);
  const entered = useUI((s) => s.entered);
  useSectionTracking();
  usePointer();
  useReveals(root);
  useMagnetic(root);

  useEffect(() => {
    if (!entered) return;
    window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [entered]);

  return (
    <div ref={root} className={`app ${entered ? "entered" : ""}`}>
      <Preloader webgl={webgl} />
      <Cursor />
      <div className="webgl-wrap" aria-hidden="true">
        {webgl ? (
          <Suspense fallback={null}><Scene /></Suspense>
        ) : (
          <div className="fallback-bg"><p className="fallback-note">{t(ui.noWebgl)}</p></div>
        )}
      </div>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main className="content">
        <Hero />
        <About />
        {projects.map((p, i) => <ProjectSection key={p.id} p={p} i={i} />)}
        <Journey />
        <Skills />
        <Contact />
      </main>
      <ProjectOverlay />
    </div>
  );
}
