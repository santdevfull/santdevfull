// Public portfolio projects, mirrored from verified GitHub repositories.
export const PROJECTS = [
  {
    slug: "habitflow", name: "HabitFlow", category: "web", level: "simple",
    tags: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    description: { pt: "Hábitos diários com checklist, progresso e persistência local.", en: "Daily habits, checklists, progress tracking and local persistence." },
    url: "https://github.com/santdevfull/habitflow",
    demo: "https://santdevfull.github.io/santdevfull/habitflow/"
  },
  {
    slug: "focusforge", name: "FocusForge", category: "web", level: "simple",
    tags: ["JavaScript", "Timer", "UX"],
    description: { pt: "Pomodoro com ciclos de foco, pausas e estatísticas locais.", en: "Pomodoro with focus cycles, breaks and local session statistics." },
    url: "https://github.com/santdevfull/focusforge",
    demo: "https://santdevfull.github.io/focusforge/"
  },
  {
    slug: "chromacheck", name: "ChromaCheck", category: "web", level: "simple",
    tags: ["WCAG", "Accessibility", "JavaScript"],
    description: { pt: "Analisador de contraste e recomendações para interfaces acessíveis.", en: "Color contrast testing and accessible interface recommendations." },
    url: "https://github.com/santdevfull/chromacheck",
    demo: "https://santdevfull.github.io/chromacheck/"
  },
  {
    slug: "notevault", name: "NoteVault", category: "web", level: "simple",
    tags: ["JavaScript", "Privacy", "LocalStorage"],
    description: { pt: "Notas locais com busca, favoritos e armazenamento no navegador.", en: "Local notes with search, pinning and browser-based storage." },
    url: "https://github.com/santdevfull/notevault",
    demo: "https://santdevfull.github.io/notevault/"
  },
  {
    slug: "typemeter", name: "TypeMeter", category: "web", level: "simple",
    tags: ["JavaScript", "Metrics", "UX"],
    description: { pt: "Teste de digitação com velocidade WPM e precisão em tempo real.", en: "Typing speed benchmark with real-time WPM and accuracy." },
    url: "https://github.com/santdevfull/typemeter",
    demo: "https://santdevfull.github.io/typemeter/"
  },
  {
    slug: "budgetlab", name: "BudgetLab", category: "web", level: "medium",
    tags: ["JavaScript", "CSV", "Data"],
    description: { pt: "Dashboard financeiro com gráficos, categorias e exportação CSV.", en: "Finance dashboard with charts, categories and CSV export." },
    url: "https://github.com/santdevfull/budgetlab",
    demo: "https://santdevfull.github.io/santdevfull/budgetlab/"
  },
  {
    slug: "sprintboard", name: "SprintBoard", category: "web", level: "medium",
    tags: ["Kanban", "JavaScript", "State"],
    description: { pt: "Quadro Kanban com prioridades, etapas e indicadores de tarefas.", en: "Kanban task board with priorities, stages and completion metrics." },
    url: "https://github.com/santdevfull/sprintboard",
    demo: "https://santdevfull.github.io/sprintboard/"
  },
  {
    slug: "studyloop", name: "StudyLoop", category: "web", level: "medium",
    tags: ["JavaScript", "Spaced Repetition"],
    description: { pt: "Flashcards com algoritmo simplificado de repetição espaçada.", en: "Flashcards with a simplified spaced-repetition algorithm." },
    url: "https://github.com/santdevfull/studyloop",
    demo: "https://santdevfull.github.io/studyloop/"
  },
  {
    slug: "invoicekit", name: "InvoiceKit", category: "web", level: "medium",
    tags: ["JavaScript", "PDF", "Business"],
    description: { pt: "Orçamentos com cálculos em centavos, impostos e impressão em PDF.", en: "Quotes with integer-cent calculations, tax rates and print-to-PDF." },
    url: "https://github.com/santdevfull/invoicekit",
    demo: "https://santdevfull.github.io/invoicekit/"
  },
  {
    slug: "datalens", name: "DataLens", category: "web", level: "medium",
    tags: ["JavaScript", "CSV", "Analytics"],
    description: { pt: "Explorador de CSV com estatísticas e visualização de frequência.", en: "CSV explorer with summary statistics and frequency visualization." },
    url: "https://github.com/santdevfull/santdevfull/tree/main/projects/datalens",
    demo: "https://santdevfull.github.io/santdevfull/datalens/"
  },
  {
    slug: "pulseops", name: "PulseOps", category: "api", level: "advanced",
    tags: ["Python", "FastAPI", "SQLite", "Docker"],
    description: { pt: "API de incidentes com autenticação, persistência e métricas.", en: "Incident-management API with authentication, persistence and metrics." },
    url: "https://github.com/santdevfull/pulseops",
    demo: "https://santdevfull.github.io/santdevfull/pulseops/demo/",
    demoType: "simulation"
  },
  {
    slug: "flagpilot", name: "FlagPilot", category: "api", level: "advanced",
    tags: ["FastAPI", "Feature Flags", "SHA-256"],
    description: { pt: "Feature flags com rollout percentual determinístico e API autenticada.", en: "Feature flags with deterministic percentage rollout and authenticated API." },
    url: "https://github.com/santdevfull/santdevfull/tree/main/projects/flagpilot",
    demo: "https://santdevfull.github.io/santdevfull/flagpilot/",
    demoType: "docs"
  },
  {
    slug: "queuecraft", name: "QueueCraft", category: "api", level: "advanced",
    tags: ["Python", "SQLite", "Jobs", "Docker"],
    description: { pt: "Fila persistente com idempotência, consumo atômico e retentativas.", en: "Persistent queue with idempotency, atomic claiming and retries." },
    url: "https://github.com/santdevfull/santdevfull/tree/main/projects/queuecraft",
    demo: "https://santdevfull.github.io/santdevfull/queuecraft/",
    demoType: "docs"
  },
  {
    slug: "ledgerforge", name: "LedgerForge", category: "api", level: "advanced",
    tags: ["FastAPI", "SQLite", "Finance"],
    description: { pt: "Livro-razão de partidas dobradas com lançamentos transacionais.", en: "Double-entry ledger with transactional, balanced journal postings." },
    url: "https://github.com/santdevfull/santdevfull/tree/main/projects/ledgerforge",
    demo: "https://santdevfull.github.io/santdevfull/ledgerforge/",
    demoType: "docs"
  },
  {
    slug: "eventshield", name: "EventShield", category: "api", level: "advanced",
    tags: ["Python", "HMAC", "Security", "Webhooks"],
    description: { pt: "Webhooks HMAC com proteção contra replay e controle de idempotência.", en: "HMAC-signed webhooks with replay prevention and idempotency controls." },
    url: "https://github.com/santdevfull/santdevfull/tree/main/projects/eventshield",
    demo: "https://santdevfull.github.io/santdevfull/eventshield/",
    demoType: "docs"
  }
];

export const PROJECT_LEVEL = {
  simple: { pt: "Fundamentos", en: "Foundation" },
  medium: { pt: "Aplicação", en: "Application" },
  advanced: { pt: "Sistemas", en: "Systems" }
};

export const INTERFACE = {
  pt: {
    code: "Código-fonte", demo: "Demo", docs: "Documentação",
    simulation: "Demo simulada", showing: "Exibindo", of: "de", projects: "projetos",
    web: "App web", api: "API / Backend"
  },
  en: {
    code: "Source code", demo: "Live demo", docs: "Documentation",
    simulation: "Simulated demo", showing: "Showing", of: "of", projects: "projects",
    web: "Web app", api: "API / Backend"
  }
};

export function filterProjects(category="all",query="",projects=PROJECTS) {
  const q=String(query).trim().toLocaleLowerCase();
  return projects.filter(project => {
    if (category!=="all" && project.category!==category) return false;
    const searchable=[project.name, project.slug, ...project.tags,
      project.description.pt, project.description.en].join(" ").toLocaleLowerCase();
    return searchable.includes(q);
  });
}

export function projectsSummary(category="all",query="",lang="pt") {
  const filtered=filterProjects(category,query);
  const words=INTERFACE[lang]||INTERFACE.pt;
  return words.showing+" "+filtered.length+" "+words.of+" "+PROJECTS.length+" "+words.projects;
}

export function publicProjectUrl(url) {
  if (typeof url!=="string") return null;
  try {
    const value=new URL(url);
    if (value.protocol!=="https:" || !["github.com","santdevfull.github.io"].includes(value.hostname)) return null;
    return value.href;
  } catch { return null; }
}
