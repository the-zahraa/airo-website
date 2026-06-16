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
    {#each navItems as item}
      <a class:active={activeNavPath === item.path} href={item.path} onclick={(event) => goToPage(event, item.path)}>{item.label}</a>
    {/each}
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
    opacity: 0.36;
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
    font-weight: 400;
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
    .airo-navbar,
    .airo-navbar.scrolled {
      top: 12px;
      translate: 0 0;
      width: min(100% - 24px, 720px);
      height: 60px;
      gap: 10px;
    }

    .airo-navbar.nav-hidden {
      transform: translateY(calc(-100% - 34px));
    }

    .airo-logo,
    .airo-navbar.scrolled .airo-logo {
      width: clamp(102px, 29vw, 128px);
      height: auto;
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
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .airo-contact-mobile {
      width: clamp(122px, 34vw, 142px);
      height: 44px;
      font-size: clamp(14px, 3.8vw, 15.5px);
      line-height: 1;
      gap: 8px;
    }

    .airo-contact-mobile svg {
      width: 16px;
      height: 16px;
    }

    .airo-menu-toggle {
      width: 48px;
      height: 48px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      background: rgba(2, 0, 4, 0.45);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 12px 34px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .airo-menu-toggle::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 1px;
      border-radius: inherit;
      background: linear-gradient(115deg, rgba(24,1,48,.92), rgba(231,211,255,.46), rgba(24,1,48,.78));
      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .airo-menu-toggle span {
      width: 18px;
      height: 2px;
      border-radius: 99px;
      background: #fff;
      transition: transform 260ms cubic-bezier(.2, .8, .2, 1), opacity 220ms ease;
    }

    .menu-open .airo-menu-toggle span:first-child {
      transform: translateY(4px) rotate(45deg);
    }

    .menu-open .airo-menu-toggle span:last-child {
      transform: translateY(-4px) rotate(-45deg);
    }

    .airo-mobile-menu {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(100% + 12px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 18px 20px 19px;
      border-radius: 28px;
      background: rgba(2, 0, 4, 0.72);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        0 22px 58px rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      opacity: 0;
      transform: translateY(-8px) scale(0.98);
      pointer-events: none;
      transition:
        opacity 260ms ease,
        transform 300ms cubic-bezier(.2, .8, .2, 1);
      overflow: hidden;
    }

    .airo-mobile-menu::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 1px;
      border-radius: inherit;
      background: linear-gradient(115deg, rgba(24,1,48,.9), rgba(231,211,255,.38), rgba(24,1,48,.8));
      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .menu-open .airo-mobile-menu {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .airo-mobile-menu a {
      z-index: 1;
      font-size: clamp(14px, 3.6vw, 17px);
      line-height: 1;
    }

    .airo-mobile-menu a.active::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -10px;
      width: 31px;
      height: 3px;
      border-radius: 999px;
      background: #7300ff;
      opacity: 0.36;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 480px) {
    .airo-navbar,
    .airo-navbar.scrolled {
      top: 8px;
      width: calc(100vw - 16px);
      height: 54px;
    }

    .airo-logo,
    .airo-navbar.scrolled .airo-logo {
      width: clamp(86px, 27vw, 104px);
    }

    .airo-mobile-actions {
      gap: 8px;
    }

    .airo-contact-mobile {
      width: 116px;
      height: 40px;
      font-size: 13.5px;
      gap: 7px;
    }

    .airo-menu-toggle {
      width: 42px;
      height: 42px;
      gap: 5px;
    }

    .airo-menu-toggle span {
      width: 16px;
    }

    .airo-mobile-menu {
      flex-wrap: wrap;
      justify-content: center;
      row-gap: 20px;
      column-gap: 24px;
      padding: 17px 18px 20px;
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