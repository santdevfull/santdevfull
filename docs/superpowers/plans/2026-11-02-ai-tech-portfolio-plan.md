# AI & Tech Portfolio Redesign Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax.

**Goal:** Position Cau? Santiago for applied AI / automation / software systems opportunities using his documented IT career and demonstrable code.

**Architecture:** Static HTML/CSS plus ES modules for a searchable public project catalog and PT/EN switching. Existing GitHub Pages workflow distributes the single-page professional portfolio alongside 15 projects.

**Tech Stack:** HTML5, CSS3, ES modules, Node 22 tests, GitHub Actions and GitHub Pages.

**Spec:** docs/superpowers/specs/2026-11-02-ai-tech-portfolio-design.md

## Global Constraints
- Use only factual experience metrics from the provided CV and defensible project descriptions.
- No private project credentials, production data, private numbers or ICCIDs; NivIA QA only.
- Preserve every existing projects/* sub-app.
- Browser-visible accessibility, reduced motion and mobile layouts.

## Review Focus
- Existing project links must remain valid.
- EN toggle must update text and project descriptions without changing code project names.
- Search and filters must restore all 15 cards.
- No horizontal overflow on 390px and 1440px.
- Never show QA projects as production success.

### Task 1: Evidence-based content and design system
Files: projects/DESIGN.md, projects/design-tokens.json, docs/superpowers/specs/*, projects/index.html
- [x] Read CV, repositories and project history.
- [x] Distinguish public proven career facts from QA/R&D projects.
- [x] Implement semantic sections and provenance-limited copy.

### Task 2: Interactive catalog and bilingual UI
Files: projects/portfolio-data.mjs, projects/portfolio.js, projects/portfolio.test.mjs
- [x] Add 15 project records and safe public links.
- [x] Write project filtering and translation behavior.
- [x] Run Node tests: 9 project/content/semantic checks pass.

### Task 3: Rendered interface
Files: projects/portfolio.css, projects/index.html
- [ ] Start a local server, check actual desktop/mobile screenshots.
- [ ] Verify click navigation, focus and mobile overflow.
- [ ] Refine typography/spacing if necessary.

### Task 4: Deploy and verify
Files: .github/workflows/portfolio-pages.yml, .github/workflows/portfolio-ci.yml
- [ ] Update distribution copy rules and site CI.
- [ ] Run full local tests, commit and push.
- [ ] Verify GitHub Actions success, HTTP 200 and correct production title.


### Task 5: Cinematic iteration from Quayside reference
- [x] Capture and inspect Quayside visual language, with original portfolio interpretation.
- [x] Generate own procedural animation and lightweight WebM/WebP assets.
- [x] Implement translucent motion panel, timeline ticker, tilt and paused-on-demand control.
- [x] Verify 4 viewports, play/pause, PT/EN, reduced motion and contrast.
- [ ] Publish via existing GitHub Pages workflow and verify in production.
