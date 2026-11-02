# Portfolio design system

Theme: technical field-notes / operational control room. Source: local frontend-design, ECC design-system, ECC frontend-a11y and ECC SEO skills.

## Identity
The large hero and signal-flow illustration are the one expressive device. Everything else uses restrained documentation-like structures: evidence rails, case-study panels, timeline and project ledger.

## Tokens
See design-tokens.json and CSS custom properties in portfolio.css. Paper, ink, pine and azure convey mature engineering rather than an interchangeable purple-gradient SaaS.

## Content model
1. Documented career metrics from uploaded CV.
2. NivIA (sensitive internal system): QA/research case only, no code or production claim.
3. Abyssal Bio-Fish Farm: private prototype / in development.
4. Public GitHub portfolio apps: live demos for frontends, static API docs for backend.

## Accessibility gate
Skip link, focus indicators, semantic landmarks, language controls with explicit pressed state, projects status live region, keyboard navigation, 44px touch controls, reduced-motion stylesheet.

## SEO gate
Canonical GitHub Pages URL, Person structured data, contact/link anchors, OG preview, descriptive title and 1 h1.

## Visual review
Desktop 1440x900 and mobile 390x844; verify rendered screenshots after publishing.


## Motion expansion ? Quayside reference study (2026-11-02)
Reference: https://quayside-template.modulify.website/

Observed: warm ambient gradients, oversized editorial hero, floating map card, vivid cobalt CTA, kinetic bottom ticker and story-led interaction. The portfolio adapts principles only with original content, CSS and a locally generated WebM ? no copied template assets.

- Original concept film illustrates input ? vision ? verify ? route ? output, containing no client or production data.
- Restrained glass on navigation, AI console and video overlay; deep pine and cobalt with peach/lilac environment.
- Motion tokens: 180ms fast, 440ms normal, 760ms slow; cubic-bezier(.22,1,.36,1); opacity/transform only.
- Scroll progress, subtle fine-pointer tilt, curated one-time reveals, tech ticker, viewport-gated video. Playback controls, hidden-page pause, reduced-motion poster default.
- Media authored with browser canvas and MediaRecorder: original VP9 WebM plus WebP poster under projects/media.
- The reference is a logistics template; this is an AI/software engineering portfolio, not a copy of that site.

## Panel and video replacement ? visual refinement (2026-11-02)

**Latest direction (supersedes the Quayside-based film experiment):**
- Removed the video section, original WebM and WebP assets, autoplay logic and ticker. The video was considered visually insufficient for the portfolio.
- Replaced the saturated green, uniform four-box right hero panel with an original, structured NivIA / Systems study surface: midnight slate, focused cobalt-blue core, distinct input/context/output nodes and supportive capabilities.
- The primary surface is explicitly conceptual: R&D/QA, not production telemetry. No fake uptime, performance numbers or customer data.
- Added a non-video editorial method section with three actual design principles: understand context, verify state and provide human escalation. This retains the portfolio's AI/tech objective.
- Tokens and CSS live in projects/portfolio-refinement.css layered over the existing stable system. Backdrop blur is used only on the nav, not as decoration on every card.
- Motion is limited to scroll progress and restrained one-time reveals. Keyboard focus, reduced motion, bilingual content and filters remain.
- Visual hierarchy inspired by clean, high-density Linear/Raycast/Stripe design principles, without copying proprietary UI assets.

Validation: Node portfolio tests, real-browser responsive screenshots, accessibility checks and GitHub Actions.

## Premium blue unification and career update (2026-11-02)

- All page surfaces now borrow the NivIA right hero study's midnight navy, slate blue and cobalt.
- Alternating navy surfaces improve section separation without introducing off-palette green or beige blocks.
- Navigation glass, hero, proof rail, engineering principles, case studies, projects, career timeline, skills, contact and footer share the portfolio-blue.css theme.
- Brand system tokens are documented in design-tokens.json.
- Current role: eSIM?s is now the first timeline entry, labeled Atual/Current. Historical conversations substantiate eSIM support operations, NivIA automation/integration and QA but do not provide a formal job title or hiring date. Neither is invented.
- Case study NivIA is attributed to the eSIM?s context and remains marked R&D/QA, never as deployed production.
- Contrast, mobile layout, bilingual labels, project filters and motion preferences remain regression gates.
