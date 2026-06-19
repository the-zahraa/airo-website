<script>
  import { onMount, tick as svelteTick } from 'svelte';
  import Navbar from './components/Navbar.svelte';
  import Footer from './components/Footer.svelte';
  import WorkWithUsForm from './components/WorkWithUsForm.svelte';

  const pagePaths = new Set(['/', '/about', '/games', '/careers', '/legal', '/work-with-us']);
  const pageLoaders = {
    '/': () => import('./routes/Home.svelte'),
    '/about': () => import('./about/AboutPage.svelte'),
    '/games': () => import('./games/GamesPage.svelte'),
    '/careers': () => import('./careers/CareersPage.svelte'),
    '/legal': () => import('./legal/LegalPage.svelte'),
    '/work-with-us': () => import('./work-with-us/WorkWithUsPage.svelte')
  };

  let currentPath = typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/';
  let RoutePage = null;
  let routeReady = false;
  let routeLoadToken = 0;

  function normalizePath(path) {
    const clean = (path || '/').split('#')[0].split('?')[0];
    const normalized = clean === '' ? '/' : clean.replace(/\/$/, '') || '/';
    return pagePaths.has(normalized) ? normalized : '/';
  }

  function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function unlockPageScroll() {
    if (typeof document === 'undefined') return;

    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.classList.remove('no-scroll', 'scroll-locked', 'is-locked', 'menu-open', 'modal-open');
  }

  function getRouteHeroTop(path) {
    if (typeof window === 'undefined') return 0;

    if (path === '/legal') {
      const legalPage = document.querySelector('.legal-page');
      if (legalPage) {
        return Math.max(0, legalPage.getBoundingClientRect().top + window.scrollY);
      }
    }

    return 0;
  }

  function scrollToRouteHero(path, behavior = 'auto') {
    if (typeof window === 'undefined') return;

    unlockPageScroll();

    window.scrollTo({
      top: getRouteHeroTop(path),
      left: 0,
      behavior: prefersReducedMotion() ? 'auto' : behavior
    });

    requestAnimationFrame(unlockPageScroll);
    window.dispatchEvent(new CustomEvent('airo:route-hero-scroll', { detail: { path } }));
  }

  function shouldShowWorkWithUsForm(path) {
    return path === '/' || path === '/about' || path === '/games' || path === '/careers';
  }

  function workWithUsInitialTab(path) {
    return path === '/careers' ? 'Careers' : 'Game';
  }

  async function loadRoutePage(path) {
    const token = ++routeLoadToken;
    const loader = pageLoaders[path] || pageLoaders['/'];

    routeReady = false;
    RoutePage = null;

    try {
      const module = await loader();

      if (token === routeLoadToken) {
        RoutePage = module.default;
        routeReady = true;
      }
    } catch (error) {
      console.error(`Could not load route: ${path}`, error);

      if (token === routeLoadToken) {
        RoutePage = null;
        routeReady = true;
      }
    }
  }

  async function handleNavbarNavigate(path, options = {}) {
    const nextPath = normalizePath(path);

    if (typeof window === 'undefined') {
      currentPath = nextPath;
      await loadRoutePage(nextPath);
      return;
    }

    const currentBrowserPath = normalizePath(window.location.pathname);
    const isSameRoute = currentBrowserPath === nextPath;

    if (!isSameRoute) {
      window.history.pushState({}, '', nextPath);
    } else if (window.location.hash) {
      window.history.replaceState({}, '', nextPath);
    }

    currentPath = nextPath;
    await loadRoutePage(nextPath);
    await svelteTick();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToRouteHero(nextPath, options?.smooth || isSameRoute ? 'smooth' : 'auto');
      });
    });
  }

  onMount(() => {
    unlockPageScroll();
    loadRoutePage(currentPath);

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (currentPath === '/') {
      const initialHash = window.location.hash;

      requestAnimationFrame(() => {
        if (initialHash) {
          window.history.replaceState({}, '', '/');
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    }

    const handlePopState = async () => {
      const nextPath = normalizePath(window.location.pathname);
      currentPath = nextPath;
      await loadRoutePage(nextPath);
      requestAnimationFrame(() => scrollToRouteHero(currentPath, 'auto'));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  });
</script>

<main
  class="site-shell"
  class:about-route={currentPath === '/about'}
  class:careers-route={currentPath === '/careers'}
  class:games-route={currentPath === '/games'}
  class:legal-route={currentPath === '/legal'}
  class:work-with-us-route={currentPath === '/work-with-us'}
>
  <Navbar activePath={currentPath} onNavigate={handleNavbarNavigate} />

  {#if routeReady}
    {#if RoutePage}
      {#if currentPath === '/' || currentPath === '/legal'}
        <svelte:component this={RoutePage} onNavigate={handleNavbarNavigate} />
      {:else}
        <svelte:component this={RoutePage} />
      {/if}
    {/if}

    {#if shouldShowWorkWithUsForm(currentPath) || (currentPath === '/work-with-us' && !RoutePage)}
      <WorkWithUsForm initialTab={workWithUsInitialTab(currentPath)} />
    {/if}

    <Footer onNavigate={handleNavbarNavigate} />
  {:else}
    <div class="route-loading-spacer" aria-hidden="true"></div>
  {/if}
</main>

<style>
  .route-loading-spacer {
    min-height: 100vh;
  }
</style>
