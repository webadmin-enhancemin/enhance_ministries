---
description: "Blog post frontmatter + Decap CMS config + blog.11tydata.js auto-wiring"
alwaysApply: false
globs: ["src/blog/**", "src/admin/config.yml", "src/_includes/layouts/post.njk"]
---

## Blog Post Frontmatter (Required Fields)

Each post in `src/blog/` must include:

- `title`
- `date`
- `author`
- `category`
- `description`: 1–2 sentence summary for post cards and SEO
- `image` (optional): path like `"/assets/blog/optional-featured-image.jpg"`

Example:

```markdown
---
title: "Post Title"
date: 2026-02-15
author: "Matt Swigart"
category: "Coaching"
description: "1–2 sentence summary for post cards and SEO."
image: "/assets/blog/optional-featured-image.jpg"
---
```

## What Not To Set Manually in Posts

- Do not manually add `layout`, `tags: blog`, or `permalink` to individual post files.
- Those values are set automatically by `src/blog/blog.11tydata.js`.

## Decap CMS Configuration

`src/admin/config.yml` defines the blog post collection and its fields:

- Add new `category` options by editing the `category` widget `options` list.
- Add new post fields by updating `src/admin/config.yml` and also updating `src/_includes/layouts/post.njk` to render them.

