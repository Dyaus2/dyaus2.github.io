// All content comes from Hazem Ilahi's CVs (Hazem_Ilahi_Resume_EN/French.pdf, Nov 2026), his own statements and verified TurboWatch results.
// Bilingual: every user-facing string is { en, fr }.

export type Lang = "en" | "fr";
export type L = { en: string; fr: string };

export const profile = {
  name: "Hazem Ilahi",
  email: "hazem.ilahi@esprit.tn",
  phone: "+216 97 111 410",
  phoneHref: "tel:+21697111410",
  linkedin: "https://www.linkedin.com/in/hazem-ilahi-016a7a315",
  github: "https://github.com/Dyaus2",
  location: { en: "Tunis, Tunisia", fr: "Tunis, Tunisie" } as L,
  cv: { en: "cv/Hazem_Ilahi_CV_EN.pdf", fr: "cv/Hazem_Ilahi_CV_FR.pdf" },
};

export interface Metric {
  value: number;
  from?: number; // count-up start (e.g. 18 → 84)
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: L;
}

export interface Project {
  id: string;
  color: string;
  title: string;
  kicker: L; // org / context
  period: L;
  role: L;
  summary: L;
  bullets: L[];
  metrics: Metric[];
  stack: string[];
  links?: { label: L; url: string }[];
}

export const projects: Project[] = [
  {
    id: "turbowatch",
    color: "#22d3ee",
    title: "TurboWatch",
    kicker: { en: "Flagship project · Predictive maintenance copilot", fr: "Projet phare · Copilote de maintenance prédictive" },
    period: { en: "Nov 2026", fr: "Nov. 2026" },
    role: { en: "Solo — ML, MLOps, backend, frontend, deployment", fr: "Seul — ML, MLOps, backend, frontend, déploiement" },
    summary: {
      en: "Fleet health dashboard on NASA C-MAPSS turbofan data: remaining-useful-life prediction with uncertainty, calibrated risk, cost-tuned alarms, SHAP explanations and a RAG copilot that cites FAA/NASA documents. Evaluated only on held-out engines.",
      fr: "Tableau de bord de santé de flotte sur les données turboréacteurs NASA C-MAPSS : prédiction de durée de vie résiduelle avec incertitude, risque calibré, alarmes réglées sur une matrice de coûts, explications SHAP et copilote RAG citant des documents FAA/NASA. Évalué uniquement sur des moteurs tenus à l'écart.",
    },
    bullets: [
      { en: "RUL models: gradient boosting + P10/P90 quantile band and a 1D-CNN (PyTorch) on causal, per-regime-normalised features shared by training and serving; engine-grouped fit/calibration/holdout split.", fr: "Modèles RUL : gradient boosting + bande quantile P10/P90 et CNN 1D (PyTorch) sur des variables causales normalisées par régime, partagées entre entraînement et production ; découpage par moteur fit/calibration/holdout." },
      { en: "Alarm policy (k-of-n) tuned on calibration engines with a cost matrix (missed failure 100, false alarm 10); Isolation Forest vs autoencoder health scores compared honestly (the autoencoder was rejected).", fr: "Politique d'alarme (k parmi n) réglée sur les moteurs de calibration avec une matrice de coûts (panne manquée 100, fausse alarme 10) ; scores de santé Isolation Forest vs autoencodeur comparés honnêtement (l'autoencodeur a été écarté)." },
      { en: "Maintenance copilot: bge-small + BM25 hybrid retrieval, reciprocal rank fusion and cross-encoder reranking over FAA/NASA public documents; cited answers, refusal when nothing relevant, LLM (Groq) or template fallback.", fr: "Copilote de maintenance : recherche hybride bge-small + BM25, fusion RRF et reranking par cross-encoder sur des documents publics FAA/NASA ; réponses citées, refus si rien de pertinent, LLM (Groq) ou modèle de secours." },
      { en: "MLOps: MLflow tracking, PSI drift detection and a champion/challenger retraining scenario (FD001 → FD003 fleet: FD003 test RMSE 20.73 → 14.96); pytest, ruff and a Docker build + container smoke test in GitHub Actions.", fr: "MLOps : suivi MLflow, détection de dérive PSI et scénario de réentraînement champion/challenger (flotte FD001 → FD003 : RMSE test FD003 20,73 → 14,96) ; pytest, ruff et construction Docker + test du conteneur dans GitHub Actions." },
      { en: "Live static demo on GitHub Pages: the dashboard replays the pipeline's exported outputs (checked against the real API by a parity test) and the copilot runs entirely in the browser (transformers.js) with the same retrieval scores.", fr: "Démo statique en ligne sur GitHub Pages : le tableau de bord rejoue les sorties exportées du pipeline (vérifiées contre la vraie API par un test de parité) et le copilote tourne entièrement dans le navigateur (transformers.js) avec les mêmes scores de recherche." },
      { en: "FastAPI backend with a live replay stream and a React + TypeScript dashboard (fleet grid, engine timelines vs ground truth, SHAP drivers, copilot).", fr: "Backend FastAPI avec flux de rejeu en direct et tableau de bord React + TypeScript (grille de flotte, chronologies moteur vs vérité terrain, facteurs SHAP, copilote)." },
    ],
    metrics: [
      { value: 97, suffix: "%", label: { en: "of failures detected on the official test set, at a 2% false-alarm rate (5 seeds)", fr: "des pannes détectées sur le jeu de test officiel, à 2 % de fausses alarmes (5 graines)" } },
      { value: 36, label: { en: "cycles median warning before failure", fr: "cycles d'avance médiane avant la panne" } },
      { value: 15.46, decimals: 2, label: { en: "RUL RMSE (1D-CNN, FD001 test, 5 seeds)", fr: "RMSE RUL (CNN 1D, test FD001, 5 graines)" } },
      { value: 100, suffix: "%", label: { en: "copilot retrieval hit@1 on 26 document questions", fr: "hit@1 de la recherche du copilote sur 26 questions" } },
    ],
    stack: ["Python", "scikit-learn", "PyTorch", "SHAP", "MLflow", "FastAPI", "RAG", "React", "TypeScript", "Docker", "transformers.js"],
    links: [{ label: { en: "Live demo", fr: "Démo en ligne" }, url: "https://dyaus2.github.io/turbowatch/" }, { label: { en: "GitHub repository", fr: "Dépôt GitHub" }, url: "https://github.com/Dyaus2/turbowatch" }],
  },
  {
    id: "ator",
    color: "#00e5ff",
    title: "ATOR DFIR",
    kicker: { en: "NEXT STEP IT · Machine Learning Intern (SOC)", fr: "NEXT STEP IT · Stagiaire Machine Learning (SOC)" },
    period: { en: "Jul – Sep 2026", fr: "Juil. – Sept. 2026" },
    role: { en: "Designed and integrated the ML layer + MLOps chain", fr: "Conception et intégration de la couche ML + chaîne MLOps" },
    summary: {
      en: "ML threat-detection layer for ATOR DFIR, a digital-forensics and threat-hunting framework for Windows/Linux endpoints, built on top of the security team's YARA/Sigma rule engine.",
      fr: "Couche de détection de menaces par ML pour ATOR DFIR, framework d'investigation numérique et de chasse aux menaces sur postes Windows/Linux, au-dessus du moteur de règles YARA/Sigma de l'équipe sécurité.",
    },
    bullets: [
      { en: "Threat-likelihood classifier (histogram gradient boosting + Platt calibration), 1.6% calibration error, 5-fold CV grouped by capture.", fr: "Classifieur de vraisemblance de menace (gradient boosting par histogrammes + calibration de Platt), erreur de calibration de 1,6 %, validation croisée à 5 plis groupée par capture." },
      { en: "Unsupervised anomaly detection (Isolation Forest, 300 trees): 23 of the top 25 flags were true attack stages; MITRE ATT&CK tactic classifier at 79.7% precision.", fr: "Détection d'anomalies non supervisée (Isolation Forest, 300 arbres) : 23 des 25 premiers signalements sont de vraies étapes d'attaque ; classifieur de tactique MITRE ATT&CK à 79,7 % de précision." },
      { en: "Training set built from 115 public attack captures (Empire, Covenant, Mimikatz, Metasploit) via ETL, labelled by process lineage; 110 behavioural features per process, one code path for training and production.", fr: "Jeu d'entraînement construit à partir de 115 captures d'attaques publiques (Empire, Covenant, Mimikatz, Metasploit) par ETL, labellisé par filiation de processus ; 110 variables comportementales par processus, code unique entraînement/production." },
      { en: "Weekly MLOps chain: snapshot, ETL, retraining, 14 offline quality gates, 7-day silent champion/challenger trial on live traffic, atomic canary deployment, automatic rollback, PSI drift monitoring, protection against reference poisoning.", fr: "Chaîne MLOps hebdomadaire : snapshot, ETL, réentraînement, 14 critères de qualité, essai silencieux champion/challenger de 7 jours sur le trafic réel, déploiement canari atomique, retour arrière automatique, surveillance de la dérive (PSI), protection contre l'empoisonnement de la référence." },
      { en: "10 REST endpoints and a threat-hunting page for SOC analysts (P1–P4 priorities, verdicts); fault-injection tests guarantee an ML failure never stops rule-based detection.", fr: "10 endpoints REST et une page de chasse aux menaces pour les analystes SOC (priorités P1–P4, verdicts) ; des tests d'injection de pannes garantissent qu'une défaillance ML n'interrompt jamais la détection par règles." },
    ],
    metrics: [
      { from: 18, value: 84, suffix: "%", label: { en: "attack-stage coverage (rules alone → rules + ML) at 1% false positives", fr: "couverture des étapes d'attaque (règles seules → règles + ML) à 1 % de faux positifs" } },
      { value: 0.927, decimals: 3, label: { en: "PR-AUC (vs 0.278 for rules)", fr: "PR-AUC (contre 0,278 pour les règles)" } },
      { value: 135, suffix: "/168", label: { en: "stages missed by rules, recovered", fr: "étapes manquées par les règles, récupérées" } },
      { value: 500, suffix: "+", label: { en: "automated tests", fr: "tests automatisés" } },
    ],
    stack: ["Python 3.13", "scikit-learn", "pandas", "NumPy", "SQLite", "FastAPI", "Jinja2", "pytest", "Git"],
  },
  {
    id: "soc",
    color: "#4d7cff",
    title: "SOC Report Platform",
    kicker: { en: "NEXT STEP IT · Developer Intern", fr: "NEXT STEP IT · Stagiaire Développeur" },
    period: { en: "Jul – Sep 2025", fr: "Juil. – Sept. 2025" },
    role: { en: "Pair internship — co-design and development", fr: "Stage en binôme — co-conception et développement" },
    summary: {
      en: "Web platform that automates SOC report generation for security analysts, replacing repetitive manual writing.",
      fr: "Plateforme web qui automatise la génération des rapports SOC pour les analystes, en remplacement de la rédaction manuelle répétitive.",
    },
    bullets: [
      { en: "Co-designed and developed a Python/Django web platform for SOC analysts with an intuitive UI/UX.", fr: "Conception et développement en binôme d'une plateforme web Python/Django pour analystes SOC, avec une interface UI/UX intuitive." },
      { en: "Automated SOC report generation, replacing repetitive manual writing.", fr: "Automatisation de la génération des rapports SOC, en remplacement de la rédaction manuelle répétitive." },
      { en: "Prepared the solution for future deployment.", fr: "Préparation de la solution en vue d'un futur déploiement." },
    ],
    metrics: [],
    stack: ["Python", "Django", "HTML/CSS", "Git"],
  },
  {
    id: "garage",
    color: "#b06cff",
    title: "UnderHood",
    kicker: { en: "ESPRIT team project (Garage Augmenté) · Multi-agent RAG assistant", fr: "Projet d'équipe ESPRIT (Garage Augmenté) · Assistant multi-agents RAG" },
    period: { en: "2026 – 2027", fr: "2026 – 2027" },
    role: { en: "Owner of the knowledge base and retrieval layer", fr: "Responsable de la base de connaissances et de la couche de recherche" },
    summary: {
      en: "Multi-agent RAG assistant for automotive pre-diagnosis, grounded in thousands of owner's manuals and exposed to a LangGraph diagnostic agent.",
      fr: "Assistant multi-agents RAG de pré-diagnostic automobile, ancré dans des milliers de manuels du propriétaire et exposé à un agent de diagnostic LangGraph.",
    },
    bullets: [
      { en: "Corpus: 7 resumable Python collectors gathering 2,019 owner's manuals (≈697,000 pages, 26 brands, 73% official sources), covering 54 of the 56 priority models of the Tunisian market.", fr: "Corpus : 7 collecteurs Python reprenables : 2 019 manuels du propriétaire (≈ 697 000 pages, 26 marques, 73 % de sources officielles), couvrant 54 des 56 modèles prioritaires du marché tunisien." },
      { en: "SHA-256 deduplication, Tesseract OCR (≈18,500 pages), 364 model families, Qdrant index of 101,417 passages.", fr: "Déduplication SHA-256, OCR Tesseract (≈ 18 500 pages), 364 familles de modèles, index Qdrant de 101 417 passages." },
      { en: "Retrieval: query expansion in French / English / Tunisian Derja plus LLM query rewriting, hybrid BGE-M3 + BM25 search (RRF), brand/model/year filtering, cross-encoder reranking and exact lookup of 9,533 OBD-II codes.", fr: "Recherche : expansion de requêtes FR / EN / derja tunisienne et réécriture par LLM, recherche hybride BGE-M3 + BM25 (RRF), filtre marque/modèle/année, reranking par cross-encoder et consultation exacte de 9 533 codes OBD-II." },
      { en: "All exposed as a FastAPI service to the diagnostic agent (LangGraph).", fr: "Le tout est exposé en service FastAPI à l'agent de diagnostic (LangGraph)." },
      { en: "Evaluation: ablation on 40 questions (hit@5, MRR, double-blind LLM judging): the vehicle filter raises the share of correct answers found in the right manual from 0% to 72% (MRR 0.63).", fr: "Évaluation : ablation sur 40 questions (hit@5, MRR, jugement LLM en double aveugle) : le filtre véhicule fait passer le taux de bonnes réponses dans le bon manuel de 0 % à 72 % (MRR 0,63)." },
    ],
    metrics: [
      { value: 72, suffix: "%", label: { en: "correct answers found in the right manual with the vehicle filter (0% without)", fr: "bonnes réponses trouvées dans le bon manuel avec le filtre véhicule (0 % sans)" } },
      { value: 2019, label: { en: "owner's manuals (26 brands)", fr: "manuels du propriétaire (26 marques)" } },
      { value: 101417, label: { en: "passages in the Qdrant index", fr: "passages dans l'index Qdrant" } },
      { value: 9533, label: { en: "OBD-II codes, exact lookup", fr: "codes OBD-II, consultation exacte" } },
    ],
    stack: ["Python", "Qdrant", "BGE-M3", "BM25", "FastAPI", "LangGraph", "PyMuPDF", "Tesseract"],
  },
  {
    id: "kadastra",
    color: "#ffb547",
    title: "Kadastra",
    kicker: { en: "ESPRIT team project (Data Crunchers) · Microsoft TDSP", fr: "Projet d'équipe ESPRIT (Data Crunchers) · Microsoft TDSP" },
    period: { en: "2026", fr: "2026" },
    role: { en: "Team member — end-to-end data product", fr: "Membre de l'équipe — produit data de bout en bout" },
    summary: {
      en: "AI real-estate intelligence platform for the Tunisian market: from scraped listings to price estimation, contracts and investment scenarios.",
      fr: "Plateforme d'intelligence immobilière par IA pour le marché tunisien : des annonces collectées à l'estimation de prix, aux contrats et aux scénarios d'investissement.",
    },
    bullets: [
      { en: "End-to-end pipeline: collection of ≈26,000 listings (Mubawab, Tayara), XGBoost price estimation, contract and investment-scenario generation.", fr: "Pipeline de bout en bout : collecte de ≈ 26 000 annonces (Mubawab, Tayara), estimation de prix par XGBoost, génération de contrats et de scénarios d'investissement." },
      { en: "Removed a data leak in the model features; calibrated financial constants on Tunisian legislation and Central Bank (BCT) rates.", fr: "Suppression d'une fuite de données dans les variables ; calage des constantes financières sur la législation tunisienne et les taux de la BCT." },
      { en: "Full-stack deployment with FastAPI, Django, React and Docker.", fr: "Déploiement full-stack FastAPI, Django, React et Docker." },
    ],
    metrics: [{ value: 26000, prefix: "≈", label: { en: "real-estate listings collected", fr: "annonces immobilières collectées" } }],
    stack: ["Python", "XGBoost", "FastAPI", "Django", "React", "Docker"],
  },
  {
    id: "dressme",
    color: "#ff5fa2",
    title: "DressMe",
    kicker: { en: "ESPRIT team project (7 people) · Advanced Data Science Project", fr: "Projet d'équipe ESPRIT (7 personnes) · Advanced Data Science Project" },
    period: { en: "2026 – 2027", fr: "2026 – 2027" },
    role: { en: "From design to working prototype (API + mobile app)", fr: "De la conception au prototype fonctionnel (API + application mobile)" },
    summary: {
      en: "Smart personal fashion assistant for the Tunisian market: style representation, personalized outfits, vision and generative AI, explainable recommendations and a second-hand marketplace.",
      fr: "Assistant de mode personnel intelligent pour le marché tunisien : représentation du style, tenues personnalisées, vision et IA générative, recommandations explicables et marché de seconde main.",
    },
    bullets: [
      { en: "Style representation: benchmarked encoders on Polyvore (152,785 items, 95% bootstrap CIs); chose Qwen3-VL-Embedding-2B, as accurate as the 8B model but 3.7× faster. \"Fashion DNA\" learned by a Set Transformer trained contrastively (InfoNCE).", fr: "Représentation du style : benchmark d'encodeurs sur Polyvore (152 785 articles, IC bootstrap à 95 %) ; choix de Qwen3-VL-Embedding-2B, aussi précis que le 8B mais 3,7× plus rapide. « Fashion DNA » apprise par un Set Transformer entraîné en contrastif (InfoNCE)." },
      { en: "Personalized outfits: compatibility head per category pair (AUC 0.852 vs 0.830 for cosine alone), beam-search generation conditioned on weather and occasion, Thompson-sampling personalization with a population prior, evaluated on 40 simulated personas over 60 days.", fr: "Tenues personnalisées : tête de compatibilité par paire de catégories (AUC 0,852 contre 0,830 pour le cosinus seul), génération par beam search selon la météo et l'occasion, personnalisation par Thompson sampling avec prior de population, évaluée sur 40 personas simulées pendant 60 jours." },
      { en: "Vision and generative AI: SAM 3 segmentation and garment recognition from photos (96.6% accuracy in auto-fill), diffusion-based virtual try-on (Qwen Image Edit via ComfyUI), local LLM stylist (Qwen 9B) with every sentence checked against facts: 199 of 200 answers grounded.", fr: "Vision et IA générative : segmentation SAM 3 et reconnaissance des vêtements sur photo (96,6 % de précision en remplissage automatique), essayage virtuel par diffusion (Qwen Image Edit via ComfyUI), styliste LLM local (Qwen 9B) dont chaque phrase est vérifiée contre les faits : 199 réponses sur 200 ancrées." },
      { en: "Explainable AI and marketplace: exact per-criterion contributions to the score; occlusion maps evaluated for faithfulness (deletion/insertion curves); concepts shown only above 0.85 AUC; second-hand prices predicted by quantile LightGBM with conformal calibration (80.0% coverage on 423k listings), explained with TreeSHAP.", fr: "IA explicable et marché : contributions exactes de chaque critère au score ; cartes d'occlusion évaluées en fidélité (courbes deletion/insertion) ; concepts affichés seulement au-delà d'une AUC de 0,85 ; prix de seconde main prédits par LightGBM quantile et calibration conforme (couverture 80,0 % sur 423 k annonces), expliqués par TreeSHAP." },
    ],
    metrics: [
      { value: 0.852, decimals: 3, label: { en: "outfit-compatibility AUC (vs 0.830 cosine alone)", fr: "AUC de compatibilité des tenues (contre 0,830 cosinus seul)" } },
      { value: 96.6, decimals: 1, suffix: "%", label: { en: "garment recognition accuracy in auto-fill", fr: "précision de reconnaissance des vêtements en remplissage automatique" } },
      { value: 199, suffix: "/200", label: { en: "LLM stylist answers grounded in facts", fr: "réponses du styliste LLM ancrées dans les faits" } },
      { value: 80.0, decimals: 1, suffix: "%", label: { en: "conformal price-interval coverage on 423k listings", fr: "couverture des intervalles de prix conformes sur 423 k annonces" } },
    ],
    stack: ["Python", "PyTorch", "FastAPI", "LightGBM", "llama.cpp", "Qwen3-VL", "SAM 3", "React Native (Expo)"],
  },
  {
    id: "sat",
    color: "#4dffb5",
    title: "Show, Attend and Tell",
    kicker: { en: "Deep learning project · Image captioning", fr: "Projet de deep learning · Légendes d'images" },
    period: { en: "2026", fr: "2026" },
    role: { en: "Reproduction + extensions", fr: "Reproduction + extensions" },
    summary: {
      en: "Automatic image captioning on Flickr8k with an attention-based encoder-decoder, then modern vision-language extensions.",
      fr: "Génération automatique de légendes d'images sur Flickr8k avec un encodeur-décodeur à attention, puis des extensions vision-langage modernes.",
    },
    bullets: [
      { en: "Reproduced the CNN + LSTM attention encoder-decoder.", fr: "Reproduction du modèle encodeur-décodeur à attention (CNN + LSTM)." },
      { en: "Extensions: ViT encoder, CLIP reranking of beam search, BLIP fine-tuning.", fr: "Extensions : encodeur ViT, reranking du beam search par CLIP, fine-tuning de BLIP." },
      { en: "Evaluation with BLEU and attention-map visualisation.", fr: "Évaluation par score BLEU et visualisation des cartes d'attention." },
    ],
    metrics: [],
    stack: ["PyTorch", "Flickr8k", "CNN", "LSTM", "ViT", "CLIP", "BLIP"],
  },
  {
    id: "ts",
    color: "#ff7a59",
    title: "Time-Series Forecasting",
    kicker: { en: "Statistical modelling project in R", fr: "Projet de modélisation statistique en R" },
    period: { en: "2026", fr: "2026" },
    role: { en: "Analysis and modelling", fr: "Analyse et modélisation" },
    summary: {
      en: "U.S. residential construction spending (U.S. Census Bureau) analysed and forecast in three phases.",
      fr: "Dépenses de construction résidentielle aux États-Unis (U.S. Census Bureau) analysées et prévues en trois phases.",
    },
    bullets: [
      { en: "Graphical analysis of the series.", fr: "Analyse graphique de la série." },
      { en: "Deterministic fitting with polynomial trends.", fr: "Ajustement déterministe par tendances polynomiales." },
      { en: "ARIMA/SARIMA modelling with diagnostics and forecasts.", fr: "Modélisation ARIMA/SARIMA avec diagnostics et prévisions." },
    ],
    metrics: [{ value: 3, label: { en: "modelling phases", fr: "phases de modélisation" } }],
    stack: ["R", "ARIMA", "SARIMA"],
  },
];

export interface TimelineItem { period: L; title: L; place: L; text: L; current?: boolean }

export const timeline: TimelineItem[] = [
  { period: { en: "2020 – 2023", fr: "2020 – 2023" }, title: { en: "Preparatory cycle, Physics–Chemistry", fr: "Cycle préparatoire, Physique-Chimie" }, place: { en: "IPEIT — Montfleury, Tunis", fr: "IPEIT — Montfleury, Tunis" }, text: { en: "Intensive maths and physics for the national engineering-school entrance exams.", fr: "Mathématiques et physique intensives pour les concours nationaux d'entrée aux écoles d'ingénieurs." } },
  { period: { en: "2023 – 2027", fr: "2023 – 2027" }, title: { en: "Engineering degree, Data Science & AI", fr: "Cycle ingénieur, Science des Données & IA" }, place: { en: "ESPRIT — Ariana, Tunisia", fr: "ESPRIT — Ariana, Tunisie" }, text: { en: "Final year; graduation expected 2027.", fr: "Dernière année ; diplôme prévu en 2027." } },
  { period: { en: "Jul – Sep 2025", fr: "Juil. – Sept. 2025" }, title: { en: "Developer Intern", fr: "Stagiaire Développeur" }, place: { en: "NEXT STEP IT — Charguia 1", fr: "NEXT STEP IT — Charguia 1" }, text: { en: "Django platform automating SOC reports (pair internship).", fr: "Plateforme Django automatisant les rapports SOC (stage en binôme)." } },
  { period: { en: "Jul – Sep 2026", fr: "Juil. – Sept. 2026" }, title: { en: "Machine Learning Intern (SOC)", fr: "Stagiaire Machine Learning (SOC)" }, place: { en: "NEXT STEP IT — Charguia 1", fr: "NEXT STEP IT — Charguia 1" }, text: { en: "ML detection layer + weekly MLOps chain for ATOR DFIR (18% → 84% coverage).", fr: "Couche de détection ML + chaîne MLOps hebdomadaire pour ATOR DFIR (couverture 18 % → 84 %)." } },
  { period: { en: "Nov 2026", fr: "Nov. 2026" }, title: { en: "TurboWatch — flagship project", fr: "TurboWatch — projet phare" }, place: { en: "github.com/Dyaus2/turbowatch", fr: "github.com/Dyaus2/turbowatch" }, text: { en: "Predictive maintenance copilot: RUL, cost-tuned alarms, SHAP, RAG over FAA/NASA documents, MLOps, live dashboard.", fr: "Copilote de maintenance prédictive : RUL, alarmes réglées sur les coûts, SHAP, RAG sur documents FAA/NASA, MLOps, tableau de bord en direct." } },
  { period: { en: "From Jan/Feb 2027", fr: "Dès janv./févr. 2027" }, title: { en: "6-month end-of-studies internship (PFE)", fr: "Stage de fin d'études (PFE) de 6 mois" }, place: { en: "Your team? — open to relocation", fr: "Votre équipe ? — mobilité internationale" }, text: { en: "Applied data science: anomaly detection, LLM/RAG, MLOps, forecasting, computer vision.", fr: "Data science appliquée : détection d'anomalies, LLM/RAG, MLOps, prévision, vision par ordinateur." }, current: true },
];

export const skillGroups: { name: L; items: string[] }[] = [
  { name: { en: "Languages", fr: "Langages" }, items: ["Python", "R", "SQL", "C/C++", "Java", "PHP"] },
  { name: { en: "ML / DL", fr: "ML / DL" }, items: ["scikit-learn", "XGBoost", "PyTorch", "TensorFlow", "Keras", "Anomaly detection", "Probability calibration", "Grouped CV", "Computer vision (CNN, ViT, CLIP, BLIP)", "Time series (ARIMA/SARIMA)"] },
  { name: { en: "LLM / RAG / NLP", fr: "LLM / RAG / NLP" }, items: ["RAG pipelines", "Qdrant", "BGE-M3", "BM25", "Hybrid search", "Cross-encoder reranking", "hit@k / MRR", "Transformers"] },
  { name: { en: "MLOps", fr: "MLOps" }, items: ["Automated retraining", "Model registry", "MLflow", "Champion/challenger", "Drift monitoring (PSI)", "Quality gates", "Canary & rollback", "pytest"] },
  { name: { en: "Data", fr: "Data" }, items: ["pandas", "NumPy", "ETL", "Web scraping", "OCR (Tesseract)", "SQLite", "Power BI", "Tableau"] },
  { name: { en: "Cloud & deployment", fr: "Cloud & déploiement" }, items: ["AWS (Cloud Foundations)", "Docker", "Docker Compose", "FastAPI", "Django", "Flask", "Spring Boot", "Symfony", "REST APIs", "n8n", "Git"] },
  { name: { en: "Methods", fr: "Méthodes" }, items: ["Microsoft TDSP", "CRISP-DM", "Design Thinking", "Agile/Scrum"] },
];

// Words shown on the rotating 3D skill sphere (subset, recognisable).
export const sphereSkills = [
  "Python", "PyTorch", "scikit-learn", "XGBoost", "TensorFlow", "RAG", "Qdrant", "BGE-M3", "BM25", "MLOps",
  "FastAPI", "Docker", "SQL", "R", "pandas", "NumPy", "Isolation Forest", "Calibration", "Drift (PSI)",
  "Champion/Challenger", "Django", "Power BI", "Transformers", "ARIMA", "Computer Vision", "Git", "pytest", "ETL",
];

export interface Cert { title: string; issuer: string; year: string; show: boolean; url?: string }
export const certs: Cert[] = [
  { title: "AWS Cloud Foundations", issuer: "Amazon Web Services", year: "Nov 2026", show: true, url: "https://www.credly.com/earner/earned/badge/64339ed0-debf-40c3-8ec5-70c4a48f495b" },
  { title: "Fundamentals of Deep Learning", issuer: "NVIDIA", year: "2026", show: true },
  { title: "Applications of AI for Anomaly Detection", issuer: "NVIDIA", year: "2026", show: true },
  { title: "Building Transformer-Based NLP Applications", issuer: "NVIDIA", year: "2026", show: true },
  { title: "CCNA 2: Switching, Routing, and Wireless Essentials", issuer: "Cisco Networking Academy", year: "2025", show: true },
];

export const languages: L = {
  en: "English — fluent · French — advanced (professional working proficiency) · Arabic — native",
  fr: "Arabe — langue maternelle · Français — courant (niveau avancé, usage professionnel) · Anglais — courant",
};
