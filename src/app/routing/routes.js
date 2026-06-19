/**
 * Central route registry for the small client-side router.
 *
 * Keeping lazy imports here makes page ownership obvious and keeps App.svelte
 * focused on navigation state, history, and scroll restoration.
 */
export const routeLoaders = {
  '/': () => import('../../features/home/HomePage.svelte'),
  '/about': () => import('../../features/about/AboutPage.svelte'),
  '/games': () => import('../../features/games/GamesPage.svelte'),
  '/careers': () => import('../../features/careers/CareersPage.svelte'),
  '/legal': () => import('../../features/legal/LegalPage.svelte'),
  '/work-with-us': () => import('../../features/work-with-us/WorkWithUsPage.svelte')
};

const knownPaths = new Set(Object.keys(routeLoaders));

export function normalizeRoutePath(path) {
  const clean = (path || '/').split('#')[0].split('?')[0];
  const normalized = clean === '' ? '/' : clean.replace(/\/$/, '') || '/';
  return knownPaths.has(normalized) ? normalized : '/';
}

export function loadRouteComponent(path) {
  const normalizedPath = normalizeRoutePath(path);
  return (routeLoaders[normalizedPath] || routeLoaders['/'])();
}
