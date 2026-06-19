# Refactor manifest

- Page source moved into feature folders; no runtime routes were removed.
- The router is centralized in `app/routing/routes.js` and retains the same lazy-loading, history, stale-chunk retry, and scroll behavior.
- Reusable layout/form components are placed in `components/layout` and `components/forms`.
- The original scoped component CSS is externalized beside each component/page. It is root-scoped to retain component isolation when loaded as plain CSS.
- The duplicated About SVG constants were removed from `AboutPage.svelte`; their byte-identical original SVG files are used with `?raw` imports.
- Public asset paths and animation code were not renamed or changed.
