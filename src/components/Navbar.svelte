<script>
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
  const DIRECTION_THRESHOLD = 1;
  const REVEAL_PROTECTION_TIME = 120;

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


  function scrollToWorkForm() {
    const target = document.getElementById('work-with-us');
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goToWorkForm(event) {
    event.preventDefault();
    clearNavTimer();
    pendingPath = null;
    drawingPath = null;
    closeMenu();
    showNavbar();

    const current = normalizePath(activePath || visualPath);

    if (current === '/' || current === '/about' || current === '/games' || current === '/careers' || current === '/legal') {
      scrollToWorkForm();
      return;
    }

    onNavigate('/');
    setTimeout(scrollToWorkForm, 90);
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

  function protectReveal() {
    revealProtectedUntil = performance.now() + REVEAL_PROTECTION_TIME;
  }

  function canHideNow() {
    return performance.now() > revealProtectedUntil;
  }

  function showNavbar() {
    isNavHidden = false;
    protectReveal();
  }

  function hideNavbar() {
    if (!menuOpen && getScrollY() > NAV_HIDE_START && canHideNow()) {
      isNavHidden = true;
    }
  }

  function updateScrollState() {
    const scrollY = Math.max(0, getScrollY());
    const movingUp = scrollY < lastScrollY;
    const movingDown = scrollY > lastScrollY;

    isScrolled = scrollY > SCROLL_TRIGGER_ENTER;

    if (scrollY <= SCROLL_TRIGGER_EXIT || menuOpen) {
      isNavHidden = false;
      revealProtectedUntil = 0;
      lastScrollY = scrollY;
      return;
    }

    if (movingUp) {
      showNavbar();
    } else if (movingDown && scrollY > NAV_HIDE_START) {
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
    if (event.deltaY < -DIRECTION_THRESHOLD) {
      showNavbar();
      return;
    }

    if (event.deltaY > DIRECTION_THRESHOLD) {
      hideNavbar();
    }
  }

  function handleTouchStart(event) {
    lastTouchY = event.touches?.[0]?.clientY || 0;
  }

  function handleTouchMove(event) {
    const currentTouchY = event.touches?.[0]?.clientY || 0;

    if (!lastTouchY) return;

    if (currentTouchY > lastTouchY) {
      showNavbar();
    } else if (currentTouchY < lastTouchY) {
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

    <a class="airo-contact" href="#work-with-us" aria-label="Contact us" onclick={goToWorkForm}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path class="arrow-main" pathLength="100" d="M20.3 3.7L3.7 20.3" />
        <path class="arrow-head" pathLength="100" d="M3.7 20.3H17.2" />
        <path class="arrow-head" pathLength="100" d="M3.7 20.3V6.8" />
      </svg>
      <span>Contact us</span>
    </a>
  </nav>

  <div class="airo-mobile-actions">
    <a class="airo-contact airo-contact-mobile" href="#work-with-us" aria-label="Contact us" onclick={goToWorkForm}>
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

      <a class="airo-contact airo-contact-menu" href="#work-with-us" aria-label="Contact us" onclick={goToWorkForm}>
        <span>Contact us</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path class="arrow-main" pathLength="100" d="M20.3 3.7L3.7 20.3" />
          <path class="arrow-head" pathLength="100" d="M3.7 20.3H17.2" />
          <path class="arrow-head" pathLength="100" d="M3.7 20.3V6.8" />
        </svg>
      </a>

      <div class="airo-mobile-info">
        <img src="/logos/airo.svg" alt="Airo" />
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

<style>
  .airo-navbar {
    position: fixed;
    top: clamp(24px, 1.95vw, 32px);
    left: 0;
    right: 0;
    z-index: 2147483647;
    width: min(1328px, calc(100vw - 28px));
    height: 58px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 164px;
    translate: -24px 0;
    isolation: isolate;
    transition:
      width 560ms cubic-bezier(0.16, 1, 0.3, 1),
      height 560ms cubic-bezier(0.16, 1, 0.3, 1),
      gap 560ms cubic-bezier(0.16, 1, 0.3, 1),
      top 560ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .airo-navbar.scrolled {
    width: min(1188px, calc(100vw - 28px));
    gap: 0;
  }

  .airo-navbar.nav-hidden {
    transform: translateY(calc(-100% - 46px));
    pointer-events: none;
  }

  .airo-logo {
    flex: 0 0 auto;
    width: 112px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    line-height: 0;
    margin-right: 0;
    transform-origin: left center;
    transition:
      width 560ms cubic-bezier(0.16, 1, 0.3, 1),
      margin-right 560ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 360ms ease,
      transform 560ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .airo-navbar.scrolled .airo-logo {
    width: 0;
    opacity: 0;
    transform: translateX(36px) scale(0.76);
    margin-right: 0;
    pointer-events: none;
  }

  .airo-logo img,
  .airo-pill-logo img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }

  .airo-nav-pill {
    position: relative;
    width: auto;
    height: 58px;
    margin-left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 78px;
    padding: 9px 20px 9px 62px;
    border-radius: 138.089px;
    background: rgba(2, 0, 4, 0.1);
    box-shadow:
      inset 0 0 0 1.45px rgba(231, 211, 255, 0.13),
      inset 0 1px 0 rgba(255, 255, 255, 0.035),
      inset 0 -1px 0 rgba(231, 211, 255, 0.032),
      0 14px 38px rgba(0, 0, 0, 0.24);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    overflow: hidden;
    transition:
      width 560ms cubic-bezier(0.16, 1, 0.3, 1),
      height 560ms cubic-bezier(0.16, 1, 0.3, 1),
      padding 560ms cubic-bezier(0.16, 1, 0.3, 1),
      gap 560ms cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 560ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .airo-navbar.scrolled .airo-nav-pill {
    width: auto;
    padding-left: 62px;
  }

  .airo-nav-pill::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1.45px;
    border-radius: inherit;
    background:
      linear-gradient(102deg,
        rgba(24, 1, 48, 0.92) 0%,
        rgba(231, 211, 255, 0.54) 12%,
        rgba(231, 211, 255, 0.18) 31%,
        rgba(231, 211, 255, 0.14) 50%,
        rgba(231, 211, 255, 0.18) 69%,
        rgba(231, 211, 255, 0.48) 88%,
        rgba(24, 1, 48, 0.86) 100%);
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .airo-nav-pill::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: inherit;
    background:
      radial-gradient(circle at 8% 10%, rgba(231, 211, 255, 0.07), transparent 24%),
      radial-gradient(circle at 94% 86%, rgba(231, 211, 255, 0.045), transparent 28%),
      linear-gradient(180deg, rgba(255,255,255,0.012), rgba(0,0,0,0.055));
    pointer-events: none;
  }

  .airo-pill-logo {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    width: 0;
    height: 25px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    line-height: 0;
    opacity: 0;
    transform: translateX(-18px) scale(0.78);
    transform-origin: left center;
    pointer-events: none;
    overflow: hidden;
    transition:
      width 560ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 360ms ease 80ms,
      transform 560ms cubic-bezier(0.16, 1, 0.3, 1);
  }


  .airo-navbar:not(.scrolled) .airo-pill-logo {
    display: none;
  }

  .airo-navbar.scrolled .airo-pill-logo {
    width: 88px;
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: auto;
  }

  .airo-nav-links {
    position: relative;
    z-index: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 56px;
    height: 100%;
  }

  .airo-nav-links a,
  .airo-mobile-menu a {
    position: relative;
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: 17.5px;
    line-height: 20px;
    font-weight: 400;
    color: #fff;
    white-space: nowrap;
    transition: opacity 260ms ease;
  }

  .airo-nav-links a {
    height: 100%;
    display: inline-grid;
    place-items: center;
    text-align: center;
  }

  .airo-nav-links a::before {
    content: attr(data-label);
    grid-area: 1 / 1;
    font-weight: 600;
    visibility: hidden;
    pointer-events: none;
  }

  .airo-nav-links a::after {
    content: '';
    position: absolute;
    left: calc(50% - 17px);
    bottom: 4px;
    width: 34px;
    height: 2.5px;
    border-radius: 25.7767px;
    background: #7300ff;
    opacity: 1;
    transform: scaleX(0);
    transform-origin: right center;
    will-change: transform;
    transition:
      transform 440ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 260ms ease;
  }

  .airo-nav-links a:hover::after,
  .airo-nav-links a:focus-visible::after,
  .airo-nav-links a.active::after {
    transform: scaleX(1);
    transform-origin: left center;
  }

  .airo-nav-links a.active::after {
    opacity: 1;
  }

  .airo-nav-links a:hover::after,
  .airo-nav-links a:focus-visible::after,
  .airo-nav-links a.drawing::after {
    opacity: 1;
  }

  .airo-nav-links a.drawing::after {
    animation: airoNavLineDraw 460ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .airo-nav-links a span {
    grid-area: 1 / 1;
    font-weight: 400;
    transition: font-weight 180ms ease, opacity 240ms ease;
  }

  .airo-nav-links a.active span,
  .airo-mobile-menu a.active {
    font-weight: 600;
  }

  .airo-nav-links a:hover,
  .airo-mobile-menu a:hover {
    opacity: 0.92;
  }

  .airo-contact {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    width: 142px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 48.5px;
    background: #7300ff;
    color: #fff;
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: 15px;
    line-height: 22px;
    font-weight: 600;
    overflow: hidden;
    box-shadow: none;
  }

  .airo-contact span,
  .airo-contact svg {
    position: relative;
    z-index: 1;
  }

  .airo-contact svg {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
  }

  .airo-contact path {
    fill: none;
    stroke: #fff;
    stroke-width: 2.25;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 100;
    stroke-dashoffset: 0;
  }

  .airo-contact:hover path {
    animation: airoArrowDraw 1380ms cubic-bezier(.19, 1, .22, 1) both;
  }

  .airo-contact:hover .arrow-head {
    animation-delay: 260ms;
  }

  .airo-mobile-actions,
  .airo-mobile-menu {
    display: none;
  }

  @keyframes airoNavLineDraw {
    0% {
      transform: scaleX(0);
      transform-origin: left center;
    }
    100% {
      transform: scaleX(1);
      transform-origin: left center;
    }
  }

  @keyframes airoArrowDraw {
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }

  @media (max-width: 1200px) {
    .airo-navbar {
      gap: clamp(102px, 9.4vw, 138px);
    }

    .airo-navbar.scrolled {
      gap: 0;
    }

    .airo-navbar.nav-hidden {
      transform: translateY(calc(-100% - 46px));
    }

    .airo-logo {
      width: clamp(96px, 9.2vw, 112px);
      height: auto;
      aspect-ratio: 141 / 40;
      margin-right: 0;
    }

    .airo-nav-pill {
      width: auto;
      justify-content: flex-start;
      padding-left: clamp(44px, 4.8vw, 60px);
      gap: clamp(50px, 5.8vw, 72px);
    }

    .airo-navbar.scrolled .airo-nav-pill {
      width: auto;
      padding-left: clamp(36px, 4vw, 52px);
    }

    .airo-navbar.scrolled .airo-pill-logo {
      width: clamp(74px, 8.1vw, 88px);
    }

    .airo-nav-links {
      gap: clamp(30px, 3.8vw, 52px);
    }

    .airo-nav-links a {
      font-size: clamp(15.5px, 1.45vw, 17.5px);
    }

    .airo-contact {
      width: clamp(126px, 12.4vw, 142px);
      height: 40px;
      font-size: clamp(13.5px, 1.2vw, 15px);
      gap: clamp(7px, .8vw, 8px);
    }
  }

  @media (max-width: 860px) {
    :global(html.airo-mobile-menu-locked),
    :global(body.airo-mobile-menu-locked) {
      overflow: hidden;
      overscroll-behavior: none;
      touch-action: none;
    }

    .airo-navbar,
    .airo-navbar.scrolled {
      top: 0;
      left: 0;
      right: 0;
      translate: 0 0;
      width: 100%;
      max-width: none;
      height: 72px;
      margin: 0;
      padding: 0 24px;
      gap: 0;
      justify-content: space-between;
      background: #000;
      border-radius: 0;
      box-shadow: 0 10px 34px rgba(0, 0, 0, 0.28);
      transition:
        transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
        background 260ms ease,
        box-shadow 260ms ease;
    }

    .airo-navbar.nav-hidden {
      transform: translateY(-100%);
    }

    .airo-logo,
    .airo-navbar.scrolled .airo-logo {
      position: relative;
      z-index: 5;
      width: 78px;
      height: auto;
      aspect-ratio: 141 / 40;
      opacity: 1;
      transform: none;
      pointer-events: auto;
      margin-right: 0;
    }

    .airo-nav-pill {
      display: none;
    }

    .airo-pill-logo {
      display: none;
    }

    .airo-mobile-actions {
      position: relative;
      z-index: 5;
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .airo-contact-mobile {
      display: none;
    }

    .airo-contact-menu {
      width: fit-content;
      height: auto;
      margin: 18px 0 0 0;
      padding: 8px 14px 8px 18px;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      border-radius: 0;
      font-size: 32px;
      line-height: 1.08;
      font-weight: 500;
      color: #fff;
      text-decoration: none;
      white-space: nowrap;
      background: transparent;
      box-shadow: none;
      overflow: visible;
      opacity: 0;
      transform: translateY(-4px);
      transition:
        color 200ms ease,
        opacity 200ms ease,
        transform 260ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .menu-open .airo-contact-menu {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 390ms;
    }

    .airo-contact-menu::before {
      display: block;
      box-shadow: 0 0 18px rgba(115, 0, 255, 0.94);
      opacity: 1;
    }

    .airo-contact-menu svg {
      display: block;
      width: 19px;
      height: 19px;
      margin-top: -6px;
      transform: rotate(180deg);
      filter: drop-shadow(0 0 8px rgba(115, 0, 255, 0.65));
    }

    .airo-menu-toggle {
      width: 26px;
      height: 22px;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 6px;
      cursor: pointer;
      position: relative;
      overflow: visible;
    }

    .airo-menu-toggle::before {
      display: none;
    }

    .airo-menu-toggle span {
      width: 24px;
      height: 2px;
      border-radius: 99px;
      background: #fff;
      transform-origin: center;
      transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease;
    }

    .menu-open .airo-menu-toggle span:first-child {
      transform: translateY(4px) rotate(45deg);
    }

    .menu-open .airo-menu-toggle span:last-child {
      transform: translateY(-4px) rotate(-45deg);
    }

    .airo-mobile-menu {
      position: fixed;
      inset: 0;
      z-index: 4;
      display: block;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      pointer-events: none;
      visibility: hidden;
      transition: visibility 0s linear 520ms;
    }

    .menu-open .airo-mobile-menu {
      pointer-events: auto;
      visibility: visible;
      transition-delay: 0s;
    }

    .airo-mobile-menu-background {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: #000;
      transform: translateY(-100%);
      will-change: transform;
      transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1) 110ms;
    }

    .menu-open .airo-mobile-menu-background {
      transform: translateY(0);
      transition-delay: 0s;
    }

    .airo-mobile-menu-content {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 92px 18px 26px;
      opacity: 0;
      transform: translateY(-6px);
      transition:
        opacity 180ms ease,
        transform 240ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .menu-open .airo-mobile-menu-content {
      opacity: 1;
      transform: translateY(0);
      transition:
        opacity 160ms ease 210ms,
        transform 260ms cubic-bezier(0.4, 0, 0.2, 1) 210ms;
    }

    .airo-mobile-nav-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .airo-mobile-menu a {
      position: relative;
      z-index: 1;
      width: fit-content;
      font-family: 'Poppins', system-ui, sans-serif;
      font-size: 32px;
      line-height: 1.08;
      font-weight: 400;
      color: #fff;
      text-decoration: none;
      white-space: nowrap;
      padding: 8px 14px 8px 18px;
      transition: color 200ms ease, opacity 200ms ease, transform 240ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .airo-mobile-nav-list a {
      opacity: 0;
      transform: translateY(-4px);
    }

    .menu-open .airo-mobile-nav-list a {
      opacity: 1;
      transform: translateY(0);
      transition-delay: calc(230ms + (var(--mobile-link-index) * 30ms));
    }

    .airo-mobile-menu a::before {
      content: '';
      position: absolute;
      left: 0;
      top: 12px;
      bottom: 10px;
      width: 3px;
      border-radius: 999px;
      background: #7300ff;
      opacity: 0.85;
    }

    .airo-mobile-menu .airo-contact-menu::before {
      opacity: 1;
      box-shadow: 0 0 12px rgba(115, 0, 255, 0.92), 0 0 28px rgba(115, 0, 255, 0.64);
    }

    .airo-mobile-menu a:hover {
      color: rgba(255, 255, 255, 0.72);
      opacity: 1;
    }

    .airo-mobile-menu a.active {
      font-weight: 500;
    }

    .airo-mobile-menu a.active::after {
      display: none;
    }

    .airo-mobile-info {
      margin-top: auto;
      padding: 22px 18px 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      color: #fff;
      font-family: 'Poppins', system-ui, sans-serif;
    }

    .airo-mobile-info img {
      width: 82px;
      height: auto;
      display: block;
      object-fit: contain;
      margin-bottom: 4px;
    }

    .airo-mobile-info p,
    .airo-mobile-info span,
    .airo-mobile-info a {
      max-width: 330px;
      margin: 0;
      padding: 0;
      font-size: 13px;
      line-height: 1.55;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.86);
      white-space: normal;
    }

    .airo-mobile-info-copy {
      display: flex;
      flex-direction: column;
      gap: 0;
      max-width: 340px;
    }

    .airo-mobile-info-copy span {
      display: block;
      max-width: none;
      font-size: inherit;
      line-height: inherit;
      font-weight: inherit;
      color: inherit;
    }

    .airo-mobile-contact-details {
      margin-top: 9px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .airo-mobile-info-row {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      width: fit-content;
      margin-left: 0;
    }

    .airo-mobile-info-row svg {
      width: 18px;
      height: 18px;
      flex: 0 0 auto;
      fill: none;
      stroke: #7300ff;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .airo-mobile-info-link {
      width: fit-content;
      border-bottom: 0;
      padding-bottom: 0;
      margin-left: 0;
      transform: none;
    }

    .airo-mobile-info a::before {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .airo-navbar,
    .airo-navbar.scrolled {
      height: 64px;
      padding: 0 16px;
    }

    .airo-logo,
    .airo-navbar.scrolled .airo-logo {
      width: 66px;
    }

    .airo-mobile-actions {
      gap: 10px;
    }

    .airo-contact-menu {
      width: fit-content;
      height: auto;
      margin-top: 16px;
      font-size: 30px;
      gap: 9px;
    }

    .airo-contact-menu svg {
      width: 18px;
      height: 18px;
      margin-top: -5px;
    }

    .airo-menu-toggle {
      width: 22px;
      height: 20px;
      gap: 5px;
    }

    .airo-menu-toggle span {
      width: 21px;
      height: 2px;
    }

    .menu-open .airo-menu-toggle span:first-child {
      transform: translateY(3.5px) rotate(45deg);
    }

    .menu-open .airo-menu-toggle span:last-child {
      transform: translateY(-3.5px) rotate(-45deg);
    }

    .airo-mobile-menu-content {
      padding: 82px 16px 24px;
    }

    .airo-mobile-menu a {
      font-size: 30px;
      padding: 8px 12px 8px 18px;
    }

    .airo-mobile-info {
      padding: 20px 18px 0;
      gap: 9px;
    }

    .airo-mobile-info img {
      width: 74px;
    }

    .airo-mobile-info p,
    .airo-mobile-info span,
    .airo-mobile-info a {
      max-width: 300px;
      font-size: 12.5px;
    }

    .airo-mobile-info-copy {
      max-width: 310px;
    }

    .airo-mobile-contact-details {
      margin-top: 8px;
      gap: 3px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .airo-navbar,
    .airo-logo,
    .airo-pill-logo,
    .airo-nav-pill,
    .airo-contact,
    .airo-nav-links a,
    .airo-nav-links a::after,
    .airo-mobile-menu,
    .airo-mobile-menu-background,
    .airo-mobile-menu-content,
    .airo-menu-toggle span {
      transition: none;
      animation: none;
    }

    .airo-contact:hover path,
    .airo-nav-links a.drawing::after {
      animation: none;
    }
  }
</style>