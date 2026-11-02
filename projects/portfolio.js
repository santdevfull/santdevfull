import { PROJECTS, PROJECT_LEVEL, INTERFACE, filterProjects, projectsSummary, publicProjectUrl } from "./portfolio-data.mjs";

const state = { lang: "pt", category: "all", query: "" };
const grid = document.getElementById("project-grid");
const count = document.getElementById("projects-count");
const empty = document.getElementById("projects-empty");
const queryInput = document.getElementById("project-search");

function node(tag, className, text) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (text !== undefined) result.textContent = text;
  return result;
}

function safeAnchor(label, url, className) {
  const href = publicProjectUrl(url);
  const link = node("a", className, label);
  if (!href) {
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    return link;
  }
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function renderProject(project) {
  const words = INTERFACE[state.lang];
  const article = node("article", "project-card");
  const top = node("div", "project-card-top");
  top.append(
    node("span", "project-category", project.category === "web" ? words.web : words.api),
    node("span", "project-level", PROJECT_LEVEL[project.level][state.lang])
  );

  const heading = node("h3", "", project.name);
  const description = node("p", "", project.description[state.lang]);
  const tech = node("div", "project-tech");
  project.tags.forEach(tag => tech.append(node("span", "", tag)));

  const links = node("div", "project-links");
  const primaryText = project.demoType === "docs" ? words.docs : project.demoType === "simulation" ? words.simulation : words.demo;
  links.append(
    safeAnchor(primaryText + " ↗", project.demo, "primary"),
    safeAnchor(words.code + " ↗", project.url)
  );
  article.append(top, heading, description, tech, links);
  return article;
}

function renderProjects() {
  const visible = filterProjects(state.category, state.query);
  const cards = document.createDocumentFragment();
  visible.forEach(project => cards.append(renderProject(project)));
  grid.replaceChildren(cards);
  count.textContent = projectsSummary(state.category, state.query, state.lang);
  empty.hidden = visible.length !== 0;
}

const translatable = Array.from(document.querySelectorAll("[data-en]"));
translatable.forEach(element => { element.dataset.originalPt = element.textContent; });
const placeholders = Array.from(document.querySelectorAll("[data-en-placeholder]"));
placeholders.forEach(element => { element.dataset.originalPlaceholder = element.placeholder; });

function setLanguage(lang) {
  state.lang = lang === "en" ? "en" : "pt";
  document.documentElement.lang = state.lang === "en" ? "en" : "pt-BR";
  translatable.forEach(element => {
    element.textContent = state.lang === "en" ? element.dataset.en : element.dataset.originalPt;
  });
  placeholders.forEach(element => {
    element.placeholder = state.lang === "en" ? element.dataset.enPlaceholder : element.dataset.originalPlaceholder;
  });
  document.querySelectorAll("[data-lang]").forEach(button => {
    const selected = button.dataset.lang === state.lang;
    button.setAttribute("aria-pressed", String(selected));
  });
  document.title = state.lang === "en"
    ? "Cauê Santiago | Applied AI, Automation & Engineering"
    : "Cauê Santiago | IA aplicada, automação e engenharia";
  try { window.localStorage.setItem("portfolio-language", state.lang); } catch { /* optional storage */ }
  renderProjects();
}

document.querySelectorAll("[data-lang]").forEach(button =>
  button.addEventListener("click", () => setLanguage(button.dataset.lang))
);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    document.querySelectorAll(".filter").forEach(item => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    renderProjects();
  });
});

queryInput.addEventListener("input", event => {
  state.query = event.target.value;
  renderProjects();
});

document.getElementById("clear-filters").addEventListener("click", () => {
  state.category = "all";
  state.query = "";
  queryInput.value = "";
  document.querySelectorAll(".filter").forEach(button => {
    const selected = button.dataset.category === "all";
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  renderProjects();
  queryInput.focus();
});

document.getElementById("year").textContent = String(new Date().getFullYear());

let storedLanguage = "pt";
try { storedLanguage = window.localStorage.getItem("portfolio-language") || "pt"; }
catch { storedLanguage = "pt"; }
setLanguage(storedLanguage);

// Keep the public project inventory auditable without querying third-party APIs.
console.info("Portfolio project catalog:", PROJECTS.length, "projects, no remote tracking.");
