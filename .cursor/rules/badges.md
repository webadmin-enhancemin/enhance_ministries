---
description: "Event badge usage rules and current badge inventory"
alwaysApply: false
globs: ["src/pages/**/*.njk"]
---

## Event Badge Pattern (`.event-badge`)

- `.event-badge` renders a small orange pill/chip label above section headings.
- It is purely decorative: not interactive, not linked, and not filterable.

## When To Use a Badge

Use a badge when it adds information the heading alone does not convey, for example:

- Specific dates or timeframes (e.g. `"July 19-25, 2026"`, `"Summer 2026"`)
- Event or content type (e.g. `"Annual Fundraiser"`, `"Interactive Training"`)
- Intended audience (e.g. `"For Your Next Event"`, `"Church & Nonprofit"`)
- Content taxonomy on cards (e.g. blog category tags like `"Coaching"`, `"Leadership"`)
- Context framing for a sub-section (e.g. `"Latest Insights"`, `"Featured Appearances"`, `"In the News"`, `"Kingdom Partnerships"`, `"Listen & Learn"`)

## When Not To Use a Badge

Do not use a badge when it simply restates the meaning of the heading beneath it (or is vague marketing copy), for example:

- `"Our Story"` above the About page headline
- `"Get in Touch"` above the contact headline
- `"Our Team"` above the Leadership headline
- Vague labels like `"Personalized Support"`, `"Versatile Speaker"`, `"How We Help"`

## Current Badge Inventory by Page

| Page | Badge | Section |
|------|-------|---------|
| `golf.njk` | `"Annual Fundraiser"` | Page hero |
| `events.njk` | `"Annual Fundraiser"` | Golf event card |
| `events.njk` | `"Summer 2026"` | Mission experiences card |
| `mission.njk` | `"Summer 2026"` | Page hero |
| `mission.njk` | `"July 19-25, 2026"` | Student Missions Trip |
| `mission.njk` | `"July 6-12, 2026"` | Family Mission Trip |
| `mission.njk` | `"Local Missions"` | Win Your Jerusalem |
| `speaking.njk` | `"For Your Next Event"` | Page hero |
| `training.njk` | `"Interactive Training"` | Page hero |
| `consulting.njk` | `"Church & Nonprofit"` | Page hero |
| `coaching.njk` | `"Church & Nonprofit"` | Consulting sub-section |
| `resources.njk` | `"Latest Insights"` | Blog section header |
| `resources.njk` | `"Listen & Learn"` | Media section header |
| `resources.njk` | `"Featured Appearances"` | Podcasts sub-section |
| `resources.njk` | `"In the News"` | Articles sub-section |
| `resources.njk` | `"Kingdom Partnerships"` | Ministry Partners section |
| `resources.njk` | `"[Category]"` | Blog post cards (dynamic) |
| `index.njk` | `"Annual Fundraiser"` | Golf event card |

