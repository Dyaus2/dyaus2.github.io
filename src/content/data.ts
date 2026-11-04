// All content comes from Hazem Ilahi's CV (Resume_pfe.pdf) and his own statements.
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
      { en: "MLOps: MLflow tracking, PSI drift detection and a champion/challenger retraining scenario (FD001 → FD003 fleet: FD003 test RMSE 20.73 → 14.96), 26 pytest tests + ruff in GitHub Actions, Docker, Hugging Face Space.", fr: "MLOps : suivi MLflow, détection de dérive PSI et scénario de réentraînement champion/challenger (flotte FD001 → FD003 : RMSE test FD003 20,73 → 14,96), 26 tests pytest + ruff dans GitHub Actions, Docker, Hugging Face Space." },
      { en: "FastAPI backend with a live replay stream and a React + TypeScript dashboard (fleet grid, engine timelines vs ground truth, SHAP drivers, copilot).", fr: "Backend FastAPI avec flux de rejeu en direct et tableau de bord React + TypeScript (grille de flotte, chronologies moteur vs vérité terrain, facteurs SHAP, copilote)." },
    ],
    metrics: [
      { value: 97, suffix: "%", label: { en: "of failures detected on the official test set, at a 2% false-alarm rate (5 seeds)", fr: "des pannes détectées sur le jeu de test officiel, à 2 % de fausses alarmes (5 graines)" } },
      { value: 36, label: { en: "cycles median warning before failure", fr: "cycles d'avance médiane avant la panne" } },
      { value: 15.46, decimals: 2, label: { en: "RUL RMSE (1D-CNN, FD001 test, 5 seeds)", fr: "RMSE RUL (CNN 1D, test FD001, 5 graines)" } },
      { value: 100, suffix: "%", label: { en: "copilot retrieval hit@1 on 26 document questions", fr: "hit@1 de la recherche du copilote sur 26 questions" } },
    ],
    stack: ["Python", "scikit-learn", "PyTorch", "SHAP", "MLflow", "FastAPI", "RAG", "React", "TypeScript", "Docker", "Hugging Face"],
    links: [{ label: { en: "GitHub repository", fr: "Dépôt GitHub" }, url: "https://github.com/Dyaus2/turbowatch" }],
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
    title: "Garage Augmenté",
    kicker: { en: "ESPRIT team project · Multi-agent RAG assistant", fr: "Projet d'équipe ESPRIT · Assistant multi-agents RAG" },
    period: { en: "2026 – 2027", fr: "2026 – 2027" },
    role: { en: "Owner of the knowledge base and retrieval layer", fr: "Responsable de la base de connaissances et de la couche de recherche" },
    summary: {
      en: "Multi-agent RAG assistant for automotive pre-diagnosis, grounded in thousands of official owner's manuals.",
      fr: "Assistant multi-agents RAG de pré-diagnostic automobile, ancré dans des milliers de manuels constructeurs.",
    },
    bullets: [
      { en: "Tunisian car-market study (2015–2026 registrations, fleet) to rank brands in 3 priority tiers and select 56 priority models.", fr: "Étude du marché automobile tunisien (immatriculations 2015–2026, parc roulant) pour classer les marques en 3 niveaux et retenir 56 modèles prioritaires." },
      { en: "7 resumable Python collectors (XML catalogs, JSON APIs, sitemaps, Next.js data routes): 73% official manufacturer sources, 54 of 56 priority models covered.", fr: "7 collecteurs Python reprenables (catalogues XML, API JSON, sitemaps, routes Next.js) : 73 % de sources constructeurs officielles, 54 des 56 modèles prioritaires couverts." },
      { en: "Corpus prep: SHA-256 dedup, Tesseract OCR of ≈18,500 pages, metadata normalised into 364 model families, ≈39M-token index.", fr: "Préparation du corpus : déduplication SHA-256, OCR Tesseract de ≈ 18 500 pages, métadonnées normalisées en 364 familles de modèles, index de ≈ 39 M tokens." },
      { en: "Modular RAG on Qdrant: multilingual query expansion (FR/EN/Tunisian Arabic), hybrid BGE-M3 + BM25 with reciprocal rank fusion, brand/model/year filters, cross-encoder reranking.", fr: "RAG modulaire sur Qdrant : expansion de requêtes multilingue (FR/EN/arabe tunisien), recherche hybride BGE-M3 + BM25 fusionnée par RRF, filtres marque/modèle/année, reranking par cross-encoder." },
      { en: "FastAPI service for the n8n workflow, ablation bench (hit@k, MRR), documented Docker Compose hand-off for the GPU host.", fr: "Service FastAPI pour le workflow n8n, banc d'ablation (hit@k, MRR), paquet de transfert Docker Compose documenté pour la machine GPU." },
    ],
    metrics: [
      { value: 2019, label: { en: "unique owner's manuals (26 brands)", fr: "manuels du propriétaire uniques (26 marques)" } },
      { value: 697000, prefix: "≈", label: { en: "pages collected", fr: "pages collectées" } },
      { value: 98000, label: { en: "units in the main index", fr: "unités dans l'index principal" } },
      { value: 9533, label: { en: "OBD fault codes, exact lookup", fr: "codes défaut OBD, consultation exacte" } },
    ],
    stack: ["Python", "Qdrant", "BGE-M3", "BM25", "PyMuPDF", "Tesseract", "FastAPI", "Docker Compose", "n8n"],
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
    kicker: { en: "ESPRIT team project · Advanced Data Science Project", fr: "Projet d'équipe ESPRIT · Advanced Data Science Project" },
    period: { en: "2026 – 2027", fr: "2026 – 2027" },
    role: { en: "Design phase — Design Thinking", fr: "Phase de conception — Design Thinking" },
    summary: {
      en: "Smart personal fashion assistant for the Tunisian market, designed around a single garment representation.",
      fr: "Assistant de mode personnel intelligent pour le marché tunisien, conçu autour d'une représentation unique du vêtement.",
    },
    bullets: [
      { en: "User research (17-respondent survey, 6 personas) turned into 5 business & data-science objectives with metrics and a 3-version roadmap.", fr: "Recherche utilisateur (17 répondants, 6 personas) traduite en 5 objectifs métier et data science avec métriques et feuille de route en 3 versions." },
      { en: "5-layer architecture: mobile client, FastAPI gateway + Redis Streams, business services, ML models, PostgreSQL / FAISS.", fr: "Architecture en 5 couches : client mobile, passerelle FastAPI + Redis Streams, services métier, modèles ML, PostgreSQL / FAISS." },
      { en: "6 ML pipelines specified: YOLO + SAM 2 + Qwen3-VL ingestion, HDBSCAN + RAG style profile, BPR outfit compatibility (Polyvore), diffusion try-on, ReAct resale agent with LightGBM pricing, Two-Tower + LightGBM ranker.", fr: "6 pipelines ML spécifiés : ingestion YOLO + SAM 2 + Qwen3-VL, profil de style HDBSCAN + RAG, compatibilité de tenues BPR (Polyvore), essayage par diffusion, agent de revente ReAct avec prix LightGBM, recommandeur Two-Tower + LightGBM." },
      { en: "Explainability (additive reason codes, TreeSHAP, LIME, counterfactuals) and privacy by design (on-device face blurring, EXIF removal).", fr: "Explicabilité (codes de raison additifs, TreeSHAP, LIME, contrefactuels) et respect de la vie privée (floutage des visages sur l'appareil, suppression des EXIF)." },
    ],
    metrics: [
      { value: 6, label: { en: "ML pipelines specified", fr: "pipelines ML spécifiés" } },
      { value: 6, label: { en: "personas", fr: "personas" } },
      { value: 5, label: { en: "architecture layers", fr: "couches d'architecture" } },
    ],
    stack: ["FastAPI", "Redis Streams", "PostgreSQL", "FAISS", "YOLO", "SAM 2", "Qwen3-VL", "LightGBM"],
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
  { name: { en: "ML / DL", fr: "ML / DL" }, items: ["scikit-learn", "XGBoost", "PyTorch", "TensorFlow", "Keras", "Anomaly detection", "Calibration", "Grouped CV"] },
  { name: { en: "LLM / RAG / NLP", fr: "LLM / RAG / NLP" }, items: ["Qdrant", "BGE-M3", "BM25", "Hybrid search", "Reranking", "hit@k / MRR"] },
  { name: { en: "MLOps", fr: "MLOps" }, items: ["Automated retraining", "Model registry", "Champion/challenger", "Drift monitoring", "pytest"] },
  { name: { en: "Data", fr: "Data" }, items: ["pandas", "NumPy", "ETL", "SQLite", "Power BI", "Tableau"] },
  { name: { en: "Web & deployment", fr: "Web & déploiement" }, items: ["FastAPI", "Django", "Flask", "Spring Boot", "Symfony", "REST APIs", "Docker", "Git"] },
  { name: { en: "Methods", fr: "Méthodes" }, items: ["Microsoft TDSP", "CRISP-DM", "Design Thinking", "Agile/Scrum"] },
];

// Words shown on the rotating 3D skill sphere (subset, recognisable).
export const sphereSkills = [
  "Python", "PyTorch", "scikit-learn", "XGBoost", "TensorFlow", "RAG", "Qdrant", "BGE-M3", "BM25", "MLOps",
  "FastAPI", "Docker", "SQL", "R", "pandas", "NumPy", "Isolation Forest", "Calibration", "Drift (PSI)",
  "Champion/Challenger", "Django", "Power BI", "Transformers", "ARIMA", "Computer Vision", "Git", "pytest", "ETL",
];

export interface Cert { title: string; issuer: string; year: string; show: boolean }
export const certs: Cert[] = [
  { title: "Fundamentals of Deep Learning", issuer: "NVIDIA", year: "2026", show: true },
  { title: "Applications of AI for Anomaly Detection", issuer: "NVIDIA", year: "2026", show: true },
  { title: "Building Transformer-Based NLP Applications", issuer: "NVIDIA", year: "2026", show: true },
  { title: "AWS Cloud Foundations", issuer: "Amazon Web Services", year: "2026", show: true },
  { title: "CCNA 2: Switching, Routing, and Wireless Essentials", issuer: "Cisco Networking Academy", year: "2025", show: true },
  // Hedera certifications: set show:true and fill the exact titles once issued.
  { title: "Hedera certification #1 (title TBD)", issuer: "Hedera", year: "2026", show: false },
  { title: "Hedera certification #2 (title TBD)", issuer: "Hedera", year: "2026", show: false },
  { title: "Hedera certification #3 (title TBD)", issuer: "Hedera", year: "2026", show: false },
];

export const languages: L = {
  en: "English — fluent · French — advanced · Arabic — native",
  fr: "Anglais — courant · Français — avancé · Arabe — langue maternelle",
};
