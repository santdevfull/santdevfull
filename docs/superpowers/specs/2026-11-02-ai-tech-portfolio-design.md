# AI & Tech Portfolio ? redesign specification

## Goal and audience
Build a public, recruitment-focused portfolio for Cau? Santiago, an IT infrastructure/support professional transitioning toward applied AI, automation, software systems and cloud engineering. Audience: Brazilian and international engineering hiring managers and technical recruiters. Primary action: inspect verified case studies or contact the professional.

## Sources
- User-supplied CV, 3 pages: four employers/timeline, Python/Jira automations, operational results, skills, certifications, languages.
- Public GitHub portfolio: 15 programming projects (ten web apps/five backend APIs), tested via Actions.
- Previous user-led work: NivIA AI support system (Chatwoot/n8n/Python, QA and rollback safety), Abyssal Bio-Fish Farm (Roblox/Blender local R&D).
- No unverified production claims; no clients' private data, secrets, credentials, incident IDs, or device identifiers.

## Design direction
Concept: **AI systems control room meets technical field notes.** More evocative than a grid of project tiles. A large typographic statement plus an architectural signal-flow visual anchors the first viewport. Numbers are used as proof, not decorations.

Palette:
- Paper: #f5f4ef (background, warmth and readability)
- Ink: #17232a (headlines/body)
- Slate: #61747b (secondary labels)
- Pine: #0b3435 (deep technical panels)
- Electric azure: #2d64f0 (actions, system signal)
- Signal mint: #b7f7d7 (operational accent on dark backgrounds)

Typography: **Manrope** for headlines and interface, **IBM Plex Mono** for logs/technical details; graceful offline fallbacks. Alignment: left. Body max 68ch.

Layout:
Desktop: sticky thin masthead | two-column hero (narrative 60%, technical diagram 40%) | proof rail | alternating featured cases | career timeline | filterable project grid | skills/credentials | contact.
Mobile: logo/nav/contact; hero narrative before technical diagram, proof rail wraps, featured cases stack, grid single column, touch controls full-width.

## Functional features
- Working PT-BR and EN toggle, persisted in localStorage, with proper html lang.
- 15 filtered project cards; Apps, APIs and all; search with accessible live count and empty-state recovery.
- NivIA case study explicitly marked R&D / QA; no unsupported production claims.
- Professional experience: Oliv-e Sa?de, Helibras, Hitss Brasil, Tech Mahindra with dates, outcomes and role labels.
- Certifications from CV, cloud/ITSM/AI/software stack and public contact email/LinkedIn (exclude phone).
- Progressive enhancement, accessible focus, reduced motion, meaningful SVG role/alt, SEO canonical/OG and JSON-LD Person.
- No tracking, third-party JS, or fabricated testimonials.

## Tradeoffs
Chosen: lean static HTML/CSS/JS deployed with existing GitHub Pages workflow. Alternative React SPA would increase bundle/deploy fragility without helping recruiter read the content. Alternative single CV-style page would downplay hands-on software evidence.

## Verification and content boundaries
- Unit tests for project model, language content, categories and safe URL construction.
- Browser at 1440x900 and 390x844; inspect screenshots for overflow, visible hierarchy, keyboard navigation and language toggle.
- Validate Actions CI, Pages deploy and HTTP 200 from canonical URL.
- Contact details only professional email and LinkedIn from CV; do not publish the uploaded PDF because it contains a personal phone number.
