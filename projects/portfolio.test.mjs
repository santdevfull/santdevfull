import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTS, PROJECT_LEVEL, INTERFACE, filterProjects, projectsSummary, publicProjectUrl } from "./portfolio-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(here, "index.html"), "utf8");
const css = fs.readFileSync(path.join(here, "portfolio.css"), "utf8");
const js = fs.readFileSync(path.join(here, "portfolio.js"), "utf8");

test("catalog has 15 distinct projects", () => {
  assert.equal(PROJECTS.length, 15);
  assert.equal(new Set(PROJECTS.map(project => project.slug)).size, 15);
  assert.equal(PROJECTS.filter(project => project.category === "web").length, 10);
  assert.equal(PROJECTS.filter(project => project.category === "api").length, 5);
});

test("each project has both languages, tags and safe links", () => {
  for (const p of PROJECTS) {
    assert.ok(p.name && p.slug && p.tags.length > 0);
    assert.ok(p.description.pt.length > 15 && p.description.en.length > 15);
    assert.ok(PROJECT_LEVEL[p.level]);
    assert.equal(publicProjectUrl(p.url), p.url);
    assert.equal(publicProjectUrl(p.demo), p.demo);
  }
});

test("category and technology search", () => {
  assert.equal(filterProjects("web").length, 10);
  assert.equal(filterProjects("api").length, 5);
  assert.equal(filterProjects("all", "FASTapi").length, 3);
  assert.equal(filterProjects("all", "HTML").length, 1);
  assert.equal(filterProjects("all", "nonexistent-search").length, 0);
  assert.equal(filterProjects("api", "notevault").length, 0);
});

test("localized counts", () => {
  assert.equal(projectsSummary("all", "", "pt"), "Exibindo 15 de 15 projetos");
  assert.equal(projectsSummary("api", "", "en"), "Showing 5 of 15 projects");
  assert.equal(INTERFACE.pt.docs, "Documentação");
});

test("reject untrusted links", () => {
  for (const unsafe of ["javascript:alert(1)", "https://example.org", "https://github.com.evil.test/a", "http://github.com/a"]) {
    assert.equal(publicProjectUrl(unsafe), null);
  }
});

test("semantics, professional sources and contact", () => {
  for (const text of ["<main", "<nav", 'id="cases"', 'id="projects"', 'id="experience"', 'id="contact"',
    'id="project-grid"', 'id="project-search"', 'name="description"', 'rel="canonical"',
    'type="application/ld+json"', "NivIA", "Oliv-e Saúde", "Helibras", "Hitss Brasil", "Tech Mahindra",
    "Abyssal Bio-Fish Farm", "ITIL 4 Foundation", "AZ-900", "AWS Certified Cloud Practitioner",
    "github.com/santdevfull", "mailto:cauesantiagosilva@gmail.com"]) {
    assert.ok(html.includes(text), "Missing " + text);
  }
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test("AI QA work is not falsely presented as production", () => {
  assert.match(html, /validação em QA/i);
  assert.match(html, /não representa ambiente produtivo/i);
  assert.match(html, /Sem afirmação de publicação produtiva/);
  assert.doesNotMatch(html, /\bproduction-ready\b/i);
});

test("accessibility and bilingual controls", () => {
  for (const value of ['class="skip-link"', 'aria-live="polite"', 'aria-pressed="true"', 'data-lang="en"',
    'data-en-placeholder=', 'prefers-reduced-motion']) {
    assert.ok((html + css + js).includes(value), "Missing " + value);
  }
  assert.match(js, /textContent/);
  assert.match(css, /@media \(max-width: 670px\)/);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(html, /href="tel:/i, "Do not publish a private phone contact link");
});

test("no third-party script trackers", () => {
  assert.match(html, /src="\.\/portfolio\.js"/);
  assert.doesNotMatch(html, /<script[^>]+src="https?:\/\//);
  assert.doesNotMatch(html, /googletagmanager|gtag\(|facebook\.net/);
});

test("the portfolio uses a designed conceptual panel and no video", () => {
  assert.match(html, /class="ai-surface"/);
  assert.match(html, /id="method"/);
  assert.match(html, /class="method-grid"/);
  assert.doesNotMatch(html, /<video|<source[^>]+video|id="flow-film"|id="motion-toggle"|id="motion"/i);
  assert.doesNotMatch(html, /signal-flow\.webm/);
  assert.match(html, /portfolio-refinement\.css/);
  assert.match(html, /R&amp;D \/ QA/);
});

test("reduced-motion and semantic hierarchy survive the replacement", () => {
  const refinement = fs.readFileSync(path.join(here,"portfolio-refinement.css"),"utf8");
  const motionCode = fs.readFileSync(path.join(here,"portfolio-motion.js"),"utf8");
  assert.match(refinement, /prefers-reduced-motion/);
  assert.match(motionCode, /IntersectionObserver/);
  assert.match(motionCode, /readingProgress|ReadingProgress/);
  assert.doesNotMatch(motionCode, /\.play\(|flow-film|MediaRecorder|pauseFilm/);
  assert.match(html, /Human-in-the-loop|humano|human handoff|humano/i);
  assert.ok((html.match(/<h1\b/g)||[]).length===1);
});
