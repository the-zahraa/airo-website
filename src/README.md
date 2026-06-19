# Airo source structure

This `src` folder is organized by responsibility, while preserving the public asset URLs used by the site (`/stickers/...`, `/logos/...`, `/top-hits/...`, and so on).

```text
src/
├── app/
│   ├── App.svelte                 # App shell, route transitions, history and scroll handling
│   └── routing/routes.js          # One central lazy-route registry
├── components/
│   ├── forms/                     # Reusable Work With Us form
│   └── layout/                    # Navbar and footer
├── features/
│   ├── about/                     # About page, data, local SVG source artwork, styles
│   ├── careers/                   # Careers page and its styles
│   ├── games/                     # Games page and its styles
│   ├── home/                      # Home page and its styles
│   ├── legal/                     # Legal page and its styles
│   └── work-with-us/              # Standalone Work With Us route and its styles
└── styles/global.css              # Existing global site styling, loaded once from main.js
```

## Editing guide

- Edit a route inside its matching `features/<name>/` folder.
- Edit the site-wide shell only in `app/App.svelte`, `app/routing/routes.js`, or `components/layout/`.
- Component/page CSS sits next to its owner in a `styles/` folder. Larger legacy styles are split into ordered `styles/partials/` files through a tiny CSS entrypoint; source declaration order is intentionally retained so the current visual design and responsive overrides stay identical.
- The About hero artwork now loads from real SVG files in `features/about/assets/hero-art/` instead of duplicating those exact SVG strings inside the page component.
- All original public asset URLs are preserved, so `public/` can stay exactly as it is.
