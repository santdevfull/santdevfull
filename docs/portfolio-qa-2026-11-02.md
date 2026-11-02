# Portfolio QA ? 2026-11-02

## Source and privacy review
- CV-sourced company dates, ITSM operational metrics and certifications.
- NivIA labeled R&D / QA; no assertion of production cutover.
- Abyssal labeled private/local prototype; no public launch asserted.
- Public code links point to existing GitHub repositories or profile-project paths.
- Resume PDF/phone number not published.

## Automated checks
- Node syntax check on portfolio.js and portfolio-data.mjs.
- Node test runner: 9/9 site data and content tests passed.
- Playwright with local Chrome headless at 1440x900, 768x1024, 390x844, 320x720:
  * Page loaded with no runtime errors and 15 project cards.
  * No horizontal overflow at any viewport.
  * Filters: all 15, web 10, API 5.
  * Search, empty state, clear filters and PT/EN switching verified.
  * Axe-core WCAG 2 A/AA 2.1 checks after contrast remediation: 0 automatic violations.
- Screenshots saved in local QA workspace only; not published.

## Limitations
- Automated accessibility is not a substitute for manual screen-reader testing.
- External fonts can fail offline; system font fallback remains.
- No user tracking or third-party JavaScript dependencies.
- Backend API docs do not claim a live hosted backend.
- Deployment is validated separately from these local checks.

## Reproduction
- Start static site from projects with Python http.server.
- Browser QA scripts are in the sibling local portfolio-qa directory.


## Second design iteration: motion + original video
- Reference visually inspected: https://quayside-template.modulify.website/ (no template source/assets used).
- Original video: projects/media/signal-flow.webm (216KB), poster WebP (15KB), encoded locally with Chromium MediaRecorder.
- Source material is abstract generated network flow: illustrative only, no production data or clients.
- Browser tests: 1440, 768, 390 and 320px: all zero horizontal overflow, 15 project cards, no JS errors.
- Motion controls: video decodes, pauses/resumes, i18n labels and reduced-motion behavior tested.
- Save Data and hidden-tab pause paths implemented.
- Automated axe-core WCAG2 A/AA and WCAG2.1 A/AA on desktop after animation settles: zero violations.
- Static unit tests: 11 passing, including media integrity/byte limits.
- Reduced-motion browser emulation: video remains paused and ticker has no animation.
- Accessibility statement: automated checks are not full assistive-technology or human testing.
- New assets and implementation published only in the portfolio's public website, not NivIA infrastructure.

## Third iteration: panel refinement and video removal (supersedes second iteration)
- User requested removal of low-quality video and replacement of green right-side hero diagram.
- HTML no longer contains video, source or playback controls. The WebM/WebP media files were deleted from source; Pages artifact no longer copies them.
- portfolio-motion.js reduced to reading progress plus optional, nonessential reveals; no media APIs.
- Hero now contains a compact dark-slate NivIA architecture study with labeled QA status and central context node.
- Replaced film with a three-card static editorial principles section; no production stats are implied.
- Local Playwright tested 1440, 768, 390 and 320 px; no overflow, JS runtime errors, or video requests; 15 projects visible.
- Local axe WCAG A/AA automatic audit: 0 violations after contrast correction.
- Search, category filters, PT/EN, reduced-motion and navigation verified.
- Initial QA iteration found/fixed an extraneous grid item and localized line-break handling.

## Fourth iteration: site-wide premium blue + current eSIM?s experience
- Design tokens follow the NivIA slate/blue panel instead of mixed warm/green surfaces.
- All major sections, buttons, tags, cards, timelines, filters and footer are themed.
- eSIM?s appears first on professional timeline as ongoing work; no title or start date fabricated.
- NivIA study links current work to eSIM's while retaining QA/experimental status.
- Browser, accessibility and live GitHub Pages results recorded when validation finishes.

## Fifth iteration ? premium blue site identity and eSIM's current work
- Added portfolio-blue.css after the stable base/refinement stylesheet, and included it in Pages deployment workflow.
- Palette derived from the existing NivIA study panel: midnight/navy surfaces, cobalt actions, slate borders and ice-blue labels. Light green/beige areas were replaced.
- Current employer eSIM's added to the top of professional timeline; formal job title and start date are **not available** and are not claimed. Current NivIA case also attributes eSIM's context.
- Portuguese and English UI content preserved; currently 5 experience entries and 15 public projects.
- 12 portfolio-specific tests passed and 15 individual application/API suites passed.
- Playwright viewport checks: 1440, 768, 390 and 320 px; no horizontal overflow, runtime errors or video.
- Playwright checked first professional entry eSIM's, search/category filters and English current-experience language.
- Axe-core automated WCAG 2/2.1 A and AA audit after contrast correction: 0 violations. Accessibility still warrants human testing.
- No client information, precise hire date, private credentials or unsupported production claims published.
