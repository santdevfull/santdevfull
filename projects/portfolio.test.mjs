import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {PROJECTS,PROJECT_LEVEL,INTERFACE,filterProjects,projectsSummary,publicProjectUrl} from "./portfolio-data.mjs";
const here=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(here,"index.html"),"utf8");
const css=fs.readFileSync(path.join(here,"editorial.css"),"utf8");
const js=fs.readFileSync(path.join(here,"portfolio.js"),"utf8");
const presentation=fs.readFileSync(path.join(here,"editorial.js"),"utf8");

test("all 15 projects have distinct identifiers and valid bilingual descriptions",()=>{
 assert.equal(PROJECTS.length,15);
 assert.equal(new Set(PROJECTS.map(p=>p.slug)).size,15);
 assert.equal(PROJECTS.filter(p=>p.category==="web").length,10);
 assert.equal(PROJECTS.filter(p=>p.category==="api").length,5);
 for(const p of PROJECTS){
  assert.ok(p.name&&p.tags.length&&p.description.pt.length>15&&p.description.en.length>15);
  assert.ok(PROJECT_LEVEL[p.level]);
  assert.equal(publicProjectUrl(p.url),p.url);
  assert.equal(publicProjectUrl(p.demo),p.demo);
 }
});

test("filters, search and localized counts work",()=>{
 assert.equal(filterProjects("all").length,15);
 assert.equal(filterProjects("web").length,10);
 assert.equal(filterProjects("api").length,5);
 assert.equal(filterProjects("all","FASTapi").length,3);
 assert.equal(filterProjects("api","notevault").length,0);
 assert.equal(filterProjects("all","no-match").length,0);
 assert.equal(projectsSummary("all","","pt"),"Exibindo 15 de 15 projetos");
 assert.equal(projectsSummary("api","","en"),"Showing 5 of 15 projects");
 assert.ok(INTERFACE.pt.docs);
});
test("public links cannot redirect to unknown origins",()=>{
 for(const url of ["javascript:alert(1)","http://github.com/example","https://github.com.evil.com/a","https://example.com"]){
  assert.equal(publicProjectUrl(url),null);
 }
});
test("premium santdev wordmark is the only h1 and the first screen",()=>{
 assert.match(html,/<h1 id="hero-title" aria-label="santdev">santdev/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(html,/class="hero-center"/);
 assert.match(html,/href="#intro"/);
 assert.match(css, /height:max\(660px,100svh\)/);
 assert.match(css, /--bg: #080808/);
});
test("vertical presentation includes full chapters and no forced horizontal career rail",()=>{
 for(const id of ["intro","cases","experience","projects","about","contact"]){
  assert.ok(html.includes('id="'+id+'"'),"missing "+id);
 }
 assert.equal((html.match(/class="career-entry/g)||[]).length,5);
 assert.match(css,/\.career-entry\{display:grid/);
 assert.doesNotMatch(html,/data-rail-target|class="rail experience-rail"/);
 assert.match(html,/role="status" aria-live="polite"/);
 assert.match(html,/id="projects-empty"/);
});
test("eSIM's experience and NivIA case are accurate about QA",()=>{
 assert.match(html,/eSIM&#8217;s/);
 for(const text of ["Chatwoot","n8n","APIs REST","Odoo CRM"]){assert.ok(html.includes(text),text)}
 assert.match(html,/N1\/N2/);
 assert.match(html,/QA/);
 assert.match(html,/data-en="AI Specialist">Especialista IA/);
 assert.match(html,/MAY 2026 &#8212; PRESENT/);
 assert.match(html,/MAI 2026 &#8212; ATUAL/);
 assert.match(html,/data-en="Self-employed &#183; Remote">Aut&#244;nomo &#183; Remoto/);
 assert.equal((html.match(/class="career-focus-item"/g)||[]).length,4);
 for(const text of ["Odoo CRM","Chatwoot","Python automation","triggers","webhooks","exception handling","triage","flowcharts","low-code"]){
   assert.ok(html.includes(text),text);
 }
 assert.doesNotMatch(html,/Formal title and start date are not specified|Cargo formal e data de in&#237;cio n&#227;o informados/);
 assert.match(html,/Sem m&#233;tricas de produ&#231;&#227;o/);
 assert.doesNotMatch(html,/production-ready|published into production/);
});
test("historical experience and credentials remain present",()=>{
 for(const value of ["Oliv-e Sa&#250;de","Helibras","Hitss Brasil","Tech Mahindra",
 "ITIL 4 Foundation","AZ-900","AWS Cloud Practitioner","Abyssal","30%"]){
  assert.ok(html.includes(value),value);
 }
});
test("layout and accessibility support keyboard, reduced motion and bilingual UI",()=>{
 for(const value of ['class="skip-link"', 'data-lang="en"', 'aria-pressed="true"', 'data-en-placeholder=', 'rel="canonical"', 'type="application/ld+json"']){
  assert.ok(html.includes(value),value);
 }
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/@media\(max-width:540px\)/);
 assert.match(js,/textContent/);
 assert.match(presentation,/IntersectionObserver/);
});
test("static page has no synthetic media, tracking scripts or private phone",()=>{
 assert.doesNotMatch(html,/<video|<source|flow-film|media\/signal-flow|href="tel:/i);
 assert.doesNotMatch(html,/<script[^>]+src="https?:\/\//);
 assert.doesNotMatch(html,/googletagmanager|gtag\(|facebook\.net/);
 assert.match(html,/mailto:santdev.contato@gmail.com/);
});
test("all required distribution assets exist",()=>{
 for(const file of ["editorial.css","editorial.js","portfolio.js","portfolio-data.mjs","favicon.svg"]){
  assert.ok(fs.statSync(path.join(here,file)).size>200,file);
 }
});
