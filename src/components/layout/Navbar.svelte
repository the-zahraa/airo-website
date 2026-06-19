<script>
  import './styles/Navbar.css';
  import { onMount } from 'svelte';

  export let activePath = '/';
  export let onNavigate = () => {};

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Games', path: '/games' },
    { label: 'Careers', path: '/careers' },
    { label: 'Legal', path: '/legal' }
  ];

  const NAVIGATION_DELAY = 460;
  const SCROLL_TRIGGER_ENTER = 8;
  const SCROLL_TRIGGER_EXIT = 2;
  const NAV_HIDE_START = 72;
  const MOBILE_NAV_HIDE_START = 96;
  const DIRECTION_THRESHOLD = 1;
  const MOBILE_DIRECTION_THRESHOLD = 8;
  const REVEAL_PROTECTION_TIME = 120;
  const MOBILE_REVEAL_PROTECTION_TIME = 320;

  let menuOpen = false;
  let isScrolled = false;
  let isNavHidden = false;
  let visualPath = normalizePath(activePath);
  let pendingPath = null;
  let drawingPath = null;
  let navTimer;
  let scrollRaf;
  let lastScrollY = 0;
  let lastTouchY = 0;
  let revealProtectedUntil = 0;

  $: activeNavPath = normalizePath(pendingPath || visualPath);

  function normalizePath(path) {
    const clean = (path || '/').split('#')[0].split('?')[0];
    return clean === '' ? '/' : clean.replace(/\/$/, '') || '/';
  }

  function closeMenu() {
    menuOpen = false;
  }

  $: if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('airo-mobile-menu-locked', menuOpen);
    document.body.classList.toggle('airo-mobile-menu-locked', menuOpen);
  }

  function clearNavTimer() {
    if (navTimer) {
      clearTimeout(navTimer);
      navTimer = null;
    }
  }

  function settleNavigation(nextPath) {
    const next = normalizePath(nextPath);
    visualPath = next;
    pendingPath = null;
    drawingPath = null;
    closeMenu();
  }


  function goToWorkForm(event) {
    goToPage(event, '/work-with-us');
  }

  function goToPage(event, path) {
    event.preventDefault();

    const next = normalizePath(path);
    const current = normalizePath(activePath || visualPath);
    const isSameRoute = next === current;

    clearNavTimer();

    pendingPath = next;
    drawingPath = next;
    closeMenu();
    showNavbar();

    onNavigate(next, { smooth: isSameRoute });

    navTimer = setTimeout(() => {
      navTimer = null;
      settleNavigation(next);
    }, NAVIGATION_DELAY);
  }

  function getScrollY() {
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function isMobileViewport() {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches;
  }

  function getNavHideStart() {
    return isMobileViewport() ? MOBILE_NAV_HIDE_START : NAV_HIDE_START;
  }

  function getDirectionThreshold() {
    return isMobileViewport() ? MOBILE_DIRECTION_THRESHOLD : DIRECTION_THRESHOLD;
  }

  function getRevealProtectionTime() {
    return isMobileViewport() ? MOBILE_REVEAL_PROTECTION_TIME : REVEAL_PROTECTION_TIME;
  }

  function protectReveal() {
    revealProtectedUntil = performance.now() + getRevealProtectionTime();
  }

  function canHideNow() {
    return performance.now() > revealProtectedUntil;
  }

  function showNavbar() {
    isNavHidden = false;
    protectReveal();
  }

  function hideNavbar() {
    if (!menuOpen && getScrollY() > getNavHideStart() && canHideNow()) {
      isNavHidden = true;
    }
  }

  function updateScrollState() {
    const scrollY = Math.max(0, getScrollY());
    const scrollDelta = scrollY - lastScrollY;
    const directionThreshold = getDirectionThreshold();
    const movingUp = scrollDelta < -directionThreshold;
    const movingDown = scrollDelta > directionThreshold;

    isScrolled = scrollY > SCROLL_TRIGGER_ENTER;

    if (scrollY <= SCROLL_TRIGGER_EXIT || menuOpen) {
      isNavHidden = false;
      revealProtectedUntil = 0;
      lastScrollY = scrollY;
      return;
    }

    if (movingUp) {
      showNavbar();
    } else if (movingDown && scrollY > getNavHideStart()) {
      hideNavbar();
    }

    lastScrollY = scrollY;
  }

  function handleScroll() {
    if (scrollRaf) return;

    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = null;
      updateScrollState();
    });
  }

  function handleWheel(event) {
    const directionThreshold = getDirectionThreshold();

    if (event.deltaY < -directionThreshold) {
      showNavbar();
      return;
    }

    if (event.deltaY > directionThreshold) {
      hideNavbar();
    }
  }

  function handleTouchStart(event) {
    lastTouchY = event.touches?.[0]?.clientY || 0;
  }

  function handleTouchMove(event) {
    const currentTouchY = event.touches?.[0]?.clientY || 0;

    if (!lastTouchY) return;

    const touchDelta = currentTouchY - lastTouchY;
    const directionThreshold = getDirectionThreshold();

    if (Math.abs(touchDelta) < directionThreshold) return;

    if (touchDelta > 0) {
      showNavbar();
    } else {
      hideNavbar();
    }

    lastTouchY = currentTouchY;
  }

  $: if (normalizePath(activePath) !== visualPath && !pendingPath) {
    visualPath = normalizePath(activePath);
  }

  onMount(() => {
    lastScrollY = getScrollY();
    updateScrollState();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('load', handleScroll, { passive: true });

    return () => {
      document.documentElement.classList.remove('airo-mobile-menu-locked');
      document.body.classList.remove('airo-mobile-menu-locked');
      clearNavTimer();

      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel, true);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('load', handleScroll);

      if (scrollRaf) {
        cancelAnimationFrame(scrollRaf);
        scrollRaf = null;
      }
    };
  });
</script>

<header
  class="airo-navbar"
  class:menu-open={menuOpen}
  class:scrolled={isScrolled}
  class:nav-hidden={isNavHidden}
  aria-label="Main navigation"
>
  <a class="airo-logo" href="/" aria-label="Airo home" onclick={(event) => goToPage(event, '/') }>
    <img src="/logos/airo.svg" alt="Airo" />
  </a>

  <nav class="airo-nav-pill" aria-label="Main navigation links">
    <a class="airo-pill-logo" href="/" aria-label="Airo home" onclick={(event) => goToPage(event, '/') }>
      <img src="/logos/airo.svg" alt="Airo" />
    </a>

    <div class="airo-nav-links">
      {#each navItems as item}
        <a
          class:active={activeNavPath === item.path}
          class:drawing={drawingPath === item.path}
          href={item.path}
          data-label={item.label}
          onclick={(event) => goToPage(event, item.path)}
        ><span>{item.label}</span></a>
      {/each}
    </div>

    <a class="airo-contact" href="/work-with-us" aria-label="Contact us" onclick={goToWorkForm}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path class="arrow-main" pathLength="100" d="M20.3 3.7L3.7 20.3" />
        <path class="arrow-head" pathLength="100" d="M3.7 20.3H17.2" />
        <path class="arrow-head" pathLength="100" d="M3.7 20.3V6.8" />
      </svg>
      <span>Contact us</span>
    </a>
  </nav>

  <div class="airo-mobile-actions">
    <a class="airo-contact airo-contact-mobile" href="/work-with-us" aria-label="Contact us" onclick={goToWorkForm}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path class="arrow-main" pathLength="100" d="M20.3 3.7L3.7 20.3" />
        <path class="arrow-head" pathLength="100" d="M3.7 20.3H17.2" />
        <path class="arrow-head" pathLength="100" d="M3.7 20.3V6.8" />
      </svg>
      <span>Contact us</span>
    </a>

    <button
      class="airo-menu-toggle"
      type="button"
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={menuOpen}
      onclick={() => (menuOpen = !menuOpen)}
    >
      <span></span>
      <span></span>
    </button>
  </div>

  <div class="airo-mobile-menu" aria-hidden={!menuOpen}>
    <div class="airo-mobile-menu-background" aria-hidden="true"></div>

    <div class="airo-mobile-menu-content">
      <div class="airo-mobile-nav-list">
        {#each navItems as item, index}
          <a
            class:active={activeNavPath === item.path}
            href={item.path}
            style={`--mobile-link-index: ${index}`}
            onclick={(event) => goToPage(event, item.path)}
          >{item.label}</a>
        {/each}
      </div>

      <a class="airo-contact airo-contact-menu" href="/work-with-us" aria-label="Contact us" onclick={goToWorkForm}>
        <span>Contact us</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path class="arrow-main" pathLength="100" d="M20.3 3.7L3.7 20.3" />
          <path class="arrow-head" pathLength="100" d="M3.7 20.3H17.2" />
          <path class="arrow-head" pathLength="100" d="M3.7 20.3V6.8" />
        </svg>
      </a>

      <div class="airo-mobile-info">
        <div class="airo-mobile-contact-details">
          <div class="airo-mobile-info-row">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
              <circle cx="12" cy="10" r="2.25" />
            </svg>
            <span>London, United Kingdom</span>
          </div>
          <a class="airo-mobile-info-row airo-mobile-info-link" href="mailto:hello@airo.gg">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
              <path d="m5 8 7 5 7-5" />
            </svg>
            <span>hello@airo.gg</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</header>
