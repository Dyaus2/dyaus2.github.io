import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { L, Lang } from "./data";

export const ui = {
  nav: { about: { en: "About", fr: "Profil" }, projects: { en: "Projects", fr: "Projets" }, journey: { en: "Journey", fr: "Parcours" }, skills: { en: "Skills", fr: "Compétences" }, contact: { en: "Contact", fr: "Contact" } },
  heroTitle: { en: "Data Science & AI Engineering Student", fr: "Élève ingénieur en Data Science & IA" },
  heroRoles: { en: ["Machine Learning", "MLOps", "LLM / RAG", "Anomaly Detection", "Forecasting"], fr: ["Machine Learning", "MLOps", "LLM / RAG", "Détection d'anomalies", "Prévision"] },
  availability: { en: "Seeking a 6-month end-of-studies internship (PFE) from Jan/Feb 2027 — open to relocation", fr: "Recherche un stage de fin d'études (PFE) de 6 mois dès janvier/février 2027 — mobilité internationale" },
  scroll: { en: "Scroll to fly through the network", fr: "Faites défiler pour traverser le réseau" },
  aboutKicker: { en: "01 — About", fr: "01 — Profil" },
  aboutTitle: { en: "I build machine learning that ships — with the tests, metrics and MLOps around it.", fr: "Je construis du machine learning qui va en production — avec les tests, les métriques et le MLOps autour." },
  aboutText: {
    en: "Final-year engineering student in Data Science & AI at ESPRIT (graduating 2027). Hands-on experience in machine learning, MLOps, RAG systems and full-stack deployment of AI solutions. Two internships in a SOC environment, including the end-to-end design of an ML threat-detection layer.",
    fr: "Élève ingénieur en dernière année de Data Science & IA à ESPRIT (diplôme prévu en 2027). Expérience pratique en machine learning, MLOps, systèmes RAG et déploiement full-stack de solutions IA. Deux stages en environnement SOC, dont la conception de bout en bout d'une couche de détection de menaces par apprentissage automatique.",
  },
  aboutFacts: [
    { k: { en: "Based in", fr: "Basé à" }, v: { en: "Tunis, Tunisia", fr: "Tunis, Tunisie" } },
    { k: { en: "Available", fr: "Disponible" }, v: { en: "Jan/Feb 2027 · 6 months", fr: "Janv./févr. 2027 · 6 mois" } },
    { k: { en: "Mobility", fr: "Mobilité" }, v: { en: "Open to relocation", fr: "Mobilité internationale" } },
    { k: { en: "Languages", fr: "Langues" }, v: { en: "EN · FR · AR", fr: "AN · FR · AR" } },
  ],
  projectsKicker: { en: "02 — Projects", fr: "02 — Projets" },
  projectsIntro: { en: "Each glowing cluster in the network is a project. Click one to dive in.", fr: "Chaque amas lumineux du réseau est un projet. Cliquez pour plonger dedans." },
  explore: { en: "Explore project", fr: "Explorer le projet" },
  close: { en: "Close", fr: "Fermer" },
  highlights: { en: "Highlights", fr: "Points clés" },
  stack: { en: "Stack", fr: "Stack" },
  results: { en: "Results", fr: "Résultats" },
  journeyKicker: { en: "03 — Journey", fr: "03 — Parcours" },
  journeyTitle: { en: "From physics to production ML", fr: "De la physique au ML en production" },
  skillsKicker: { en: "04 — Skills", fr: "04 — Compétences" },
  skillsTitle: { en: "Toolbox", fr: "Boîte à outils" },
  certsTitle: { en: "Certifications", fr: "Certifications" },
  contactKicker: { en: "05 — Contact", fr: "05 — Contact" },
  contactTitle: { en: "Let's build your next model together.", fr: "Construisons ensemble votre prochain modèle." },
  contactText: { en: "Looking for a 6-month PFE internship from Jan/Feb 2027 in data science, ML or AI — anywhere.", fr: "Je recherche un stage de fin d'études de 6 mois dès janvier/février 2027 en data science, ML ou IA — partout." },
  copy: { en: "Copy", fr: "Copier" },
  copied: { en: "Copied!", fr: "Copié !" },
  downloadCv: { en: "Download CV", fr: "Télécharger le CV" },
  cvEn: { en: "CV (English)", fr: "CV (anglais)" },
  cvFr: { en: "CV (French)", fr: "CV (français)" },
  sound: { en: "Sound", fr: "Son" },
  loading: { en: "Initialising neural network", fr: "Initialisation du réseau neuronal" },
  enter: { en: "Enter", fr: "Entrer" },
  footer: { en: "Designed & built by Hazem Ilahi · React · Three.js · GSAP", fr: "Conçu et développé par Hazem Ilahi · React · Three.js · GSAP" },
  noWebgl: { en: "3D is unavailable on this device — showing the lightweight version.", fr: "La 3D n'est pas disponible sur cet appareil — version allégée affichée." },
} as const;

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: (s: L) => string }
const LangCtx = createContext<Ctx | null>(null);

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "fr") return saved;
  } catch { /* storage blocked */ }
  return typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch { /* ignore */ }
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const value = useMemo<Ctx>(() => ({ lang, setLang, t: (s: L) => s[lang] }), [lang, setLang]);
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang(): Ctx {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}
