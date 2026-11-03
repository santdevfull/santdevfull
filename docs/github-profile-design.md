# GitHub profile design system

The GitHub profile is a readable editorial counterpart of the live site: https://santdevfull.github.io/santdevfull/.

## Design direction

- Reference: projects/editorial.css and projects/design-tokens.json.
- Palette: matte black #080808, charcoal #141516, ivory #f3f1eb, muted #b9b9bb, dusty blue #9eafff.
- Identity: large, lowercase santdev. wordmark, single blue period, monospaced micro-labels and thin straight lines.
- No badge wall, fabricated Github stats, visit counters, auto-playing media, heavy gradients or meaningless animations.
- SVGs are self-contained and use no external fonts, scripts, images or trackers.
- All substantial content remains accessible, selectable Markdown for GitHub rendering and mobile users.
- Two language versions: canonical Portuguese README.md and English docs/PROFILE_EN.md.

## Content truth

- eSIM's role: AI Specialist, May 2026–present, self-employed and remote.
- NivIA is an engineering and isolated QA case, not a claimed public launch or live performance dashboard.
- Oliv-e Saúde results cite values reported in the supplied résumé; historical experience stays chronological.
- Abyssal remains a private local playtest candidate.
- 15 public projects, with frontend demos and backend documentation distinguished.
- Education completion is not claimed without confirmation.

## GitHub limitations

GitHub sanitizes custom CSS and JavaScript in README, so the full web layout cannot be reproduced directly. Two original lightweight SVGs carry the design language instead, while Markdown does the informational work. No layout tables are required.

## Files

- README.md — Portuguese profile
- assets/profile-hero.svg — editorial black cover
- assets/nivia-systems.svg — conceptual case illustration
- docs/PROFILE_EN.md — translated profile
- scripts/verify_profile.py — static verification

## Matching GitHub avatar and account bio

- assets/avatar-santdev.svg is the editable vector mark, assets/avatar-santdev.png is the 800x800 upload asset.
- Avatar and the left-side About panel are account-level settings, not repository README. The current CLI token lacks GitHub's user scope; no account metadata or avatar was changed automatically.
- Recommended account name: Cauê Santiago. Recommended bio: AI Specialist @ eSIM's | Python, n8n, AI agents & automation | santdev.
- Recommended public website: https://santdevfull.github.io/santdevfull/
- In GitHub Settings > Public profile, upload avatar-santdev.png and apply name, bio, website. Existing company affiliation is preserved unless the user changes it.
