import { useEffect, useState } from "react";
import { certs, languages, profile, projects, skillGroups, timeline, type Project } from "../content/data";
import { ui, useLang } from "../content/i18n";
import { CountUp, Scramble } from "../lib/anim";
import { sound } from "../lib/sound";
import posthog, { isPostHogEnabled, portfolioLogger } from "../lib/posthog";
import { setUI } from "../lib/store";
import { clusterSide } from "../three/world";

export function Hero() {
  const { t, lang } = useLang();
  const roles = ui.heroRoles[lang];
  const [ri, setRi] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setRi((i) => (i + 1) % roles.length), 2200);
    return () => window.clearInterval(id);
  }, [roles.length]);
  return (
    <section className="section hero" id="top" data-section>
      <div className="hero-inner">
        <p className="eyebrow" data-reveal data-delay="0.1">{t(profile.location)} · ESPRIT</p>
        <Scramble as="h1" className="hero-name" text={profile.name.toUpperCase()} duration={1.4} />
        <p className="hero-title" data-reveal data-delay="0.3">{t(ui.heroTitle)}</p>
        <div className="hero-roles" data-reveal data-delay="0.45" aria-live="polite">
          <span className="role-prefix">&gt;</span>
          <Scramble key={`${lang}-${ri}`} text={roles[ri]} className="role" duration={0.6} />
          <span className="caret" />
        </div>
        <div className="availability" data-reveal data-delay="0.6" data-ui>
          <span className="pulse-dot" />
          {t(ui.availability)}
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true"><span className="mouse"><i /></span>{t(ui.scroll)}</div>
    </section>
  );
}

export function About() {
  const { t } = useLang();
  return (
    <section className="section about" id="about" data-section>
      <div className="panel glass" data-ui data-reveal="left">
        <p className="kicker">{t(ui.aboutKicker)}</p>
        <Scramble as="h2" className="h2" text={t(ui.aboutTitle)} duration={1.2} />
        <p className="lead">{t(ui.aboutText)}</p>
        <dl className="facts" data-stagger>
          {ui.aboutFacts.map((f, i) => (
            <div key={i} className={`fact${"wide" in f && f.wide ? " wide" : ""}`}><dt>{t(f.k)}</dt><dd>{t(f.v)}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function ProjectSection({ p, i }: { p: Project; i: number }) {
  const { t, lang } = useLang();
  const side = clusterSide[i] === 1 ? "left" : "right"; // card opposite to the 3D cluster
  const open = () => {
    if (isPostHogEnabled) posthog.capture("project_detail_opened", { project_id: p.id });
    portfolioLogger.info("portfolio project detail opened", { project_id: p.id, interaction_source: "project_card" });
    sound.whoosh();
    setUI({ focus: p.id });
  };
  const trackProjectLink = (linkType: "live_demo" | "repository") => {
    if (isPostHogEnabled) posthog.capture("project_link_clicked", { project_id: p.id, link_type: linkType });
  };
  return (
    <section className={`section project ${side}`} id={i === 0 ? "projects" : `project-${p.id}`} data-section style={{ ["--accent" as string]: p.color }}>
      <article className="card glass" data-ui data-reveal={side}
        onMouseEnter={() => setUI({ hover: p.id })} onMouseLeave={() => setUI({ hover: null })}>
        {i === 0 && <p className="kicker projects-kicker">{t(ui.projectsKicker)} — {t(ui.projectsIntro)}</p>}
        <div className="card-index">{String(i + 1).padStart(2, "0")}<span>/{String(projects.length).padStart(2, "0")}</span></div>
        <p className="card-kicker">{t(p.kicker)} · {t(p.period)}</p>
        <Scramble as="h3" className="card-title" text={p.title} />
        <p className="card-summary">{t(p.summary)}</p>
        {p.links && p.links.length > 0 && (
          <div className="proj-links" data-ui>{p.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="proj-link" data-magnetic onClick={() => trackProjectLink(l.label.en === "Live demo" ? "live_demo" : "repository")}>{t(l.label)} ↗</a>)}</div>
        )}
        {p.metrics.length > 0 && (
          <div className="mini-metrics">
            {p.metrics.slice(0, 2).map((m, k) => (
              <div key={k} className="mini-metric">
                <strong><CountUp value={m.value} from={m.from ?? 0} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} lang={lang} /></strong>
                <span>{t(m.label)}</span>
              </div>
            ))}
          </div>
        )}
        <ul className="chips" data-stagger>{p.stack.slice(0, 6).map((s) => <li key={s}>{s}</li>)}</ul>
        <button className="btn btn-accent" onClick={open} data-magnetic onMouseEnter={() => sound.blip(980, 0.06, 0.04)}>
          <span>{t(ui.explore)}</span><span className="btn-arrow">→</span>
        </button>
      </article>
    </section>
  );
}

export function Journey() {
  const { t } = useLang();
  return (
    <section className="section journey" id="journey" data-section>
      <div className="journey-inner" data-ui>
        <p className="kicker" data-reveal>{t(ui.journeyKicker)}</p>
        <Scramble as="h2" className="h2 center" text={t(ui.journeyTitle)} />
        <ol className="timeline">
          {timeline.map((e, i) => (
            <li key={i} className={`tl-item ${e.current ? "current" : ""}`} data-reveal={i % 2 ? "right" : "left"}>
              <div className="tl-dot" />
              <div className="tl-card glass">
                <span className="tl-period">{t(e.period)}</span>
                <h3>{t(e.title)}</h3>
                <p className="tl-place">{t(e.place)}</p>
                <p>{t(e.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Skills() {
  const { t } = useLang();
  return (
    <section className="section skills" id="skills" data-section>
      <div className="panel glass wide" data-ui data-reveal="left">
        <p className="kicker">{t(ui.skillsKicker)}</p>
        <Scramble as="h2" className="h2" text={t(ui.skillsTitle)} />
        <div className="skill-groups">
          {skillGroups.map((g) => (
            <div key={g.name.en} className="skill-group">
              <h4>{t(g.name)}</h4>
              <ul className="chips" data-stagger>{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          ))}
        </div>
        <h3 className="h3">{t(ui.certsTitle)}</h3>
        <ul className="certs" data-stagger>
          {certs.filter((c) => c.show).map((c) => (
            <li key={c.title} className="cert">
              <span className="cert-issuer">{c.issuer}</span>
              <span className="cert-title">{c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer" className="cert-link" data-magnetic>{c.title} ↗</a> : c.title}</span>
              <span className="cert-year">{c.year}</span>
            </li>
          ))}
        </ul>
        <p className="langs">{t(languages)}</p>
      </div>
    </section>
  );
}

export function Contact() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); if (isPostHogEnabled) posthog.capture("contact_email_copied"); setCopied(true); sound.blip(1320); window.setTimeout(() => setCopied(false), 1800); }
    catch { window.location.href = `mailto:${profile.email}`; }
  };
  return (
    <section className="section contact" id="contact" data-section>
      <div className="contact-inner" data-ui>
        <p className="kicker" data-reveal>{t(ui.contactKicker)}</p>
        <Scramble as="h2" className="h2 huge center" text={t(ui.contactTitle)} duration={1.4} />
        <p className="lead center" data-reveal>{t(ui.contactText)}</p>
        <div className="contact-grid" data-stagger>
          <div className="contact-item glass">
            <a href={`mailto:${profile.email}`} onClick={() => { if (isPostHogEnabled) posthog.capture("contact_method_clicked", { method: "email" }); }} data-magnetic className="contact-link">{profile.email}</a>
            <button className="mini-btn" onClick={copy}>{copied ? t(ui.copied) : t(ui.copy)}</button>
          </div>
          <a className="contact-item glass contact-link" href={profile.phoneHref} onClick={() => { if (isPostHogEnabled) posthog.capture("contact_method_clicked", { method: "phone" }); }} data-magnetic>{profile.phone}</a>
          <a className="contact-item glass contact-link" href={profile.linkedin} onClick={() => { if (isPostHogEnabled) posthog.capture("contact_method_clicked", { method: "linkedin" }); }} target="_blank" rel="noopener noreferrer" data-magnetic>LinkedIn ↗</a>
          <a className="contact-item glass contact-link" href={profile.github} onClick={() => { if (isPostHogEnabled) posthog.capture("contact_method_clicked", { method: "github" }); }} target="_blank" rel="noopener noreferrer" data-magnetic>GitHub ↗</a>
        </div>
        <div className="cv-row" data-reveal>
          <span className="cv-label">{t(ui.downloadCv)}</span>
          <a className="btn btn-accent" href={profile.cv.en} download onClick={() => { if (isPostHogEnabled) posthog.capture("cv_downloaded", { language: "en" }); }} data-magnetic><span>{t(ui.cvEn)}</span><span className="btn-arrow">↓</span></a>
          <a className="btn btn-ghost" href={profile.cv.fr} download onClick={() => { if (isPostHogEnabled) posthog.capture("cv_downloaded", { language: "fr" }); }} data-magnetic><span>{t(ui.cvFr)}</span><span className="btn-arrow">↓</span></a>
        </div>
        <footer className="footer">{t(ui.footer)} · © 2026</footer>
      </div>
    </section>
  );
}
