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
