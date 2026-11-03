import { useEffect, useRef } from "react";
import { ui, useLang } from "../content/i18n";
import { sound } from "../lib/sound";
import { setUI, useUI } from "../lib/store";

const LINKS: { id: string; key: keyof typeof ui.nav }[] = [
  { id: "about", key: "about" }, { id: "projects", key: "projects" }, { id: "journey", key: "journey" },
  { id: "skills", key: "skills" }, { id: "contact", key: "contact" },
];

export function Nav() {
  const { t, lang, setLang } = useLang();
  const soundOn = useUI((s) => s.soundOn);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setUI({ focus: null });
    sound.blip(660);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleSound = async () => {
    if (soundOn) { sound.disable(); setUI({ soundOn: false }); }
    else { await sound.enable(); setUI({ soundOn: true }); sound.blip(880); }
  };

  return (
    <header className="nav" data-ui>
      <div className="nav-progress" ref={bar} />
      <button className="logo" onClick={() => go("top")} data-magnetic aria-label="Hazem Ilahi — top">
        <span>H</span><span>I</span>
      </button>
      <nav className="nav-links" aria-label="Sections">
        {LINKS.map((l) => (
          <button key={l.id} onClick={() => go(l.id)} onMouseEnter={() => sound.blip(1200, 0.05, 0.03)} className="nav-link" data-magnetic>
            <span className="nav-link-inner" data-text={t(ui.nav[l.key])}>{t(ui.nav[l.key])}</span>
          </button>
        ))}
      </nav>
      <div className="nav-tools">
        <button className={`lang-toggle ${lang}`} onClick={() => { setLang(lang === "en" ? "fr" : "en"); sound.blip(740); }} data-magnetic aria-label="Language EN/FR">
          <span className="lang-pill" />
          <span className="lang-opt">EN</span>
          <span className="lang-opt">FR</span>
        </button>
        <button className={`sound-toggle ${soundOn ? "on" : ""}`} onClick={toggleSound} data-magnetic aria-pressed={soundOn} aria-label={t(ui.sound)}>
          {[0, 1, 2, 3].map((i) => <i key={i} style={{ animationDelay: `${i * 0.15}s` }} />)}
        </button>
      </div>
    </header>
  );
}
