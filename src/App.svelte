<script>
  import { onMount, tick as svelteTick } from 'svelte';
  import lottie from 'lottie-web';
  import Navbar from './components/Navbar.svelte';
  import Footer from './components/Footer.svelte';
  import WorkWithUsForm from './components/WorkWithUsForm.svelte';
  import AboutPage from './about/AboutPage.svelte';
  import GamesPage from './games/GamesPage.svelte';
  import CareersPage from './careers/CareersPage.svelte';
  import LegalPage from './legal/LegalPage.svelte';

  const pagePaths = new Set(['/', '/about', '/games', '/careers', '/legal']);

  function normalizePath(path) {
    const clean = (path || '/').split('#')[0].split('?')[0];
    const normalized = clean === '' ? '/' : clean.replace(/\/$/, '') || '/';
    return pagePaths.has(normalized) ? normalized : '/';
  }

  let currentPath = typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/';

  function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    window.scrollTo({
      top: getRouteHeroTop(path),
      left: 0,
      behavior: prefersReducedMotion() ? 'auto' : behavior
    });

    window.dispatchEvent(new CustomEvent('airo:route-hero-scroll', { detail: { path } }));
  }

  async function handleNavbarNavigate(path, options = {}) {
    const nextPath = normalizePath(path);

    if (typeof window === 'undefined') {
      currentPath = nextPath;
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

    await svelteTick();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToRouteHero(nextPath, options?.smooth || isSameRoute ? 'smooth' : 'auto');
      });
    });
  }

  const stats = [
    { value: '385,928', label: 'Peak ccu', icon: 'people' },
    { value: '2,719,383,201', label: 'Visit the game', icon: 'bolt' },
    { value: '+1,591,802', label: 'Experiences', icon: 'grid' }
  ];

  const brandRows = [
    ['Samsung', 'yahoo!', 'NETFLIX', 'Walmart', 'IGN', 'NETFLIX'],
    ['Walmart', 'SAMSUNG', 'IGN', 'NETFLIX', 'yahoo!']
  ];

  const brandBadges = [
    { value: '+4M', label: 'Monthly players' },
    { value: '20+', label: 'Partner studios' },
    { value: '1B+', label: 'Visits generated' }
  ];

  const hitCards = [1, 2, 3, 4, 5];

  let cards = [];
  let raf;
  const baseCards = Array.from({ length: 9 }, (_, i) => ({ id: i }));
  const storyVideoSrc = '/videos/our-story.mp4';

  let storyVideoEl;
  let storyVideoStarted = false;

  async function playStoryVideo() {
    storyVideoStarted = true;
    await svelteTick();

    try {
      await storyVideoEl?.play?.();
    } catch (error) {
      storyVideoStarted = false;
      console.warn('Our Story video could not start. Add the video file at public/videos/our-story.mp4', error);
    }
  }

  let pantherAwardEl;
  let statsBannerEl;
  let statsBannerInView = false;
  let growthCardEl;
  let growthInView = false;
  let peakCounterRaf;
  const peakCcuTarget = 385928;
  const peakCcuStart = 246000;
  let peakCcuValue = formatCounter(peakCcuTarget);

  function formatCounter(value) {
    return Math.round(value).toLocaleString('en-US');
  }

  function resetPeakCounter() {
    if (peakCounterRaf) cancelAnimationFrame(peakCounterRaf);
    peakCounterRaf = null;
    peakCcuValue = formatCounter(peakCcuTarget);
  }

  function animatePeakCounter() {
    resetPeakCounter();

    const duration = 1250;
    const start = performance.now();
    const easeOutQuart = (progress) => 1 - Math.pow(1 - progress, 4);

    peakCcuValue = formatCounter(peakCcuStart);

    const run = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutQuart(progress);

      peakCcuValue = formatCounter(peakCcuStart + (peakCcuTarget - peakCcuStart) * eased);

      if (progress < 1) {
        peakCounterRaf = requestAnimationFrame(run);
      } else {
        peakCounterRaf = null;
        peakCcuValue = formatCounter(peakCcuTarget);
      }
    };

    peakCounterRaf = requestAnimationFrame(run);
  }

  function cardStyle(i, t, width) {
    const viewport = Math.max(width || 1200, 720);
    const gap = viewport < 760 ? 132 : viewport < 1100 ? 170 : 210;
    const center = viewport / 2;
    const range = gap * baseCards.length;
    let x = center + (i - 4) * gap - (t % gap);

    while (x < -260) x += range;
    while (x > viewport + 260) x -= range;

    const d = Math.min(Math.abs(x - center) / (viewport * 0.5), 1.25);
    const centerPull = 1 - Math.min(d, 1);
    const scale = 0.72 + Math.min(d, 1) * 0.42;
    const y = 16 - centerPull * 44;
    const z = -centerPull * 160;
    const rotateY = (x - center) / viewport * -28;
    const height = viewport < 760 ? 145 + Math.min(d, 1) * 70 : 185 + Math.min(d, 1) * 112;
    const widthCard = viewport < 760 ? 105 + Math.min(d, 1) * 42 : 132 + Math.min(d, 1) * 78;
    const opacity = 0.36 + Math.min(d, 1) * 0.22 + centerPull * 0.08;
    const border = d > 0.88 || (i % 4 === 0) ? 'dashed' : 'solid';
    const glow = centerPull * 0.32;

    return `--x:${x}px;--y:${y}px;--z:${z}px;--r:${rotateY}deg;--s:${scale};--w:${widthCard}px;--h:${height}px;--o:${opacity};--glow:${glow};--border:${border};`;
  }

  function loadSticker(container, path) {
    if (!container) return null;

    container.innerHTML = '';

    return lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        progressiveLoad: true
      }
    });
  }

  onMount(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePopState = () => {
      currentPath = normalizePath(window.location.pathname);
      requestAnimationFrame(() => scrollToRouteHero(currentPath, 'auto'));
    };

    window.addEventListener('popstate', handlePopState);

    const stickerAnimations = [
      loadSticker(pantherAwardEl, '/stickers/panther-award.json')
    ].filter(Boolean);

    let observer;
    let statsObserver;

    if (statsBannerEl) {
      statsObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const ratio = entry?.intersectionRatio || 0;

          statsBannerInView = !!entry?.isIntersecting && ratio >= 0.22;
        },
        {
          threshold: [0, 0.1, 0.22, 0.45],
          rootMargin: '-6% 0px -18% 0px'
        }
      );

      statsObserver.observe(statsBannerEl);
    }

    if (growthCardEl) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const ratio = entry?.intersectionRatio || 0;

          if (entry?.isIntersecting && ratio >= 0.28) {
            if (!growthInView) {
              growthInView = true;
              animatePeakCounter();
            }
          } else if (!entry?.isIntersecting || ratio <= 0.08) {
            if (growthInView) {
              growthInView = false;
              resetPeakCounter();
            }
          }
        },
        {
          threshold: [0, 0.08, 0.28, 0.45],
          rootMargin: '-8% 0px -14% 0px'
        }
      );

      observer.observe(growthCardEl);
    }

    const start = performance.now();
    const tick = (now) => {
      const w = window.innerWidth;
      const t = (now - start) * 0.032;
      cards = baseCards.map((card, i) => ({ ...card, style: cardStyle(i, t, w) }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (peakCounterRaf) cancelAnimationFrame(peakCounterRaf);
      observer?.disconnect();
      window.removeEventListener('popstate', handlePopState);
      statsObserver?.disconnect();
      stickerAnimations.forEach((animation) => animation.destroy());
    };
  });
</script>

<main class="site-shell" class:about-route={currentPath === '/about'} class:careers-route={currentPath === '/careers'} class:games-route={currentPath === '/games'} class:legal-route={currentPath === '/legal'}>
  <Navbar activePath={currentPath} onNavigate={handleNavbarNavigate} />

  {#if currentPath === '/'}
    <div class="ambient ambient-hero"></div>
    <div class="ambient ambient-low"></div>
    <div class="dot-field dot-field-main"></div>
    <div class="dot-field dot-field-lower"></div>
    <div class="soft-columns"></div>
  {/if}

  {#if currentPath === '/careers'}
    <CareersPage />
  {:else if currentPath === '/games'}
    <GamesPage />
  {:else}
    <section class="hero-section" class:empty-route-section={currentPath !== '/'}>
      {#if currentPath === '/'}
      <div class="hero-copy">
        <h1>Play Create Innovate</h1>
        <p>Pumped is an exclusive acquisition studio embracing Creativity and innovation amongst young developers and creators.</p>
        <a href="#story" class="video-btn shine-btn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M10 7h7v7"/></svg>
          <span>Go to video</span>
        </a>
      </div>

      <div class="card-orbit" aria-hidden="true">
        {#each cards as card}
          <div class="game-card" style={card.style}>
            <div class="card-noise"></div>
            <div class="card-inner-glow"></div>
          </div>
        {/each}
      </div>

      <div class="stats-row">
        {#each stats as item}
          <article class="stat-item">
            <div class="stat-icon">
              {#if item.icon === 'people'}
                <svg viewBox="0 0 24 24"><circle cx="8.5" cy="9" r="3"/><circle cx="15.5" cy="9" r="3"/><path d="M4 19c.8-3 2.5-4.3 4.5-4.3s3.7 1.3 4.5 4.3"/><path d="M11 19c.8-3 2.5-4.3 4.5-4.3S19.2 16 20 19"/></svg>
              {:else if item.icon === 'bolt'}
                <svg viewBox="0 0 24 24"><path d="M13 2 5 13h6l-1 9 9-13h-6l0-7z"/></svg>
              {:else}
                <svg viewBox="0 0 24 24"><path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z"/></svg>
              {/if}
            </div>
            <div>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          </article>
        {/each}
      </div>
      {:else if currentPath === '/about'}
      <AboutPage />
      {:else if currentPath === '/legal'}
      <LegalPage onNavigate={handleNavbarNavigate} />
      {/if}
    </section>
  {/if}

  {#if currentPath === '/'}
  <section class="story-section" id="story">
    <div class="section-title title-with-icon">
      <span class="play-mark"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
      <h2>OUR STORY</h2>
    </div>
    <p class="section-lead">This section will showcase our studio, vision, and featured projects through video content</p>
    <div class="video-card" class:is-playing={storyVideoStarted}>
      <!-- svelte-ignore a11y_media_has_caption -->
      <video
        bind:this={storyVideoEl}
        class="story-video"
        preload="metadata"
        playsinline
        controls={storyVideoStarted}
        on:ended={() => (storyVideoStarted = false)}
      >
        <source src={storyVideoSrc} type="video/mp4" />
      </video>

      {#if !storyVideoStarted}
        <button type="button" class="story-video-trigger" on:click={playStoryVideo} aria-label="Play Our Story video">
          <span class="tiny-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
          <span>VIDEO PLACEHOLDER</span>
          <small>Click to play</small>
        </button>
      {/if}
    </div>
  </section>

  <section class="brands-section" id="brands">
    <span class="eyebrow">Brands</span>
    <h2>Trusted by global brands</h2>
    <p>From studios to global tech leaders, our team has collaborated with partners who care about polished products and memorable experiences.</p>

    <div class="brand-badges">
      {#each brandBadges as badge}
        <div class="brand-badge">
          <strong>{badge.value}</strong>
          <span>{badge.label}</span>
        </div>
      {/each}
    </div>

    <div class="logo-cloud" aria-label="Brand logos">
      {#each brandRows as row, index}
        <div class="logo-row" class:reverse={index === 1}>
          <div class="logo-track">
            {#each [...row, ...row, ...row] as logo}
              <span>{logo}</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section class="hits-section" id="games">
    <div class="hits-head">
      <div>
        <span class="vertical-accent"></span>
        <h2>Our top hits</h2>
        <p>Watch our games climb higher.</p>
      </div>
      <a class="view-btn shine-btn" href="#games">View all games</a>
    </div>

    <div class="hits-grid">
      {#each hitCards as hit, index}
        <article class="hit-card" style={`--delay:${index * 0.12}s`}>
          <div class="hit-shine"></div>
        </article>
      {/each}
    </div>
    <div class="slider-line"><span></span></div>
  </section>

  <section class="stats-panel-section">
    <div bind:this={statsBannerEl} class={`stats-banner${statsBannerInView ? ' is-visible' : ''}`}>
      <span class="banner-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path d="M8 31C13 17 17 36 23 22C29 8 32 31 40 12"/>
        </svg>
      </span>
      <strong>Our stats</strong>
      <img class="stats-logo-pop" src="/logos/airo.svg" alt="" aria-hidden="true"/>
      <div class="stats-panther-visual" aria-hidden="true"></div>
    </div>

    <div class="mini-panels">
      <article>
        <strong>+1B</strong>
        <span>Total visit across all our experiences ROBLOX.</span>
      </article>
      <article>
        <strong>+41</strong>
        <span>Games acquired to-date. we are always scouting for more games & UGC group</span>
      </article>
    </div>

    <article class="award-card">
      <div class="award-icon">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M22 6h20l-5 16H27L22 6Z" fill="currentColor" opacity=".9"/>
          <circle cx="32" cy="38" r="15" fill="none" stroke="currentColor" stroke-width="5"/>
          <path d="M32 29l2.7 5.5 6.1.9-4.4 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.2 6.1-.9L32 29Z" fill="currentColor"/>
        </svg>
      </div>
      <div class="award-copy">
        <h3>BLOXY AWARD</h3>
        <p>Won the 6th Bloxy Award from Roblox</p>
      </div>
      <div class="award-sticker" bind:this={pantherAwardEl} aria-label="Panther award animation"></div>
    </article>

    <article bind:this={growthCardEl} class={`growth-card${growthInView ? ' is-visible' : ''}`}>
      <span class="growth-label">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8.5" cy="9" r="3"/><circle cx="15.5" cy="9" r="3"/><path d="M4 19c.8-3 2.5-4.3 4.5-4.3s3.7 1.3 4.5 4.3"/><path d="M11 19c.8-3 2.5-4.3 4.5-4.3S19.2 16 20 19"/></svg>
        Peak ccu
      </span>
      <strong>{peakCcuValue}</strong>
      <small>Concurrent players across all our games, and<br/>we are growing daily.</small>
      <svg class="growth-line" viewBox="0 0 760 220" preserveAspectRatio="none">
        <defs>
          <linearGradient id="growth-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#087A45"/>
            <stop offset="24%" stop-color="#16F06B"/>
            <stop offset="48%" stop-color="#EDFFE8"/>
            <stop offset="70%" stop-color="#79FF67"/>
            <stop offset="100%" stop-color="#18D95D"/>
          </linearGradient>
          <linearGradient id="growth-shine-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0)"/>
            <stop offset="44%" stop-color="rgba(255,255,255,.12)"/>
            <stop offset="58%" stop-color="rgba(255,255,255,.96)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,.28)"/>
          </linearGradient>
          <linearGradient id="growth-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(94,255,117,.2)"/>
            <stop offset="48%" stop-color="rgba(94,255,117,.065)"/>
            <stop offset="100%" stop-color="rgba(94,255,117,0)"/>
          </linearGradient>
          <radialGradient id="growth-end-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="38%" stop-color="#DEFFD0"/>
            <stop offset="100%" stop-color="#18E263"/>
          </radialGradient>
          <filter id="growth-premium-glow" x="-18%" y="-105%" width="136%" height="310%">
            <feGaussianBlur stdDeviation="8.5" result="blur"/>
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.02 0 0 0 0 1 0 0 0 0 0.28 0 0 0 .76 0"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path class="line-area" d="M-16 176 C 42 168, 83 116, 145 126 C 208 136, 250 180, 318 132 C 370 95, 420 70, 472 106 C 526 144, 568 156, 626 103 C 681 53, 724 31, 784 36 L784 220 L-16 220 Z" fill="url(#growth-area-gradient)"/>
        <path class="line-haze" d="M-16 176 C 42 168, 83 116, 145 126 C 208 136, 250 180, 318 132 C 370 95, 420 70, 472 106 C 526 144, 568 156, 626 103 C 681 53, 724 31, 784 36" fill="none" stroke="#55FF76" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="line-glow" d="M-16 176 C 42 168, 83 116, 145 126 C 208 136, 250 180, 318 132 C 370 95, 420 70, 472 106 C 526 144, 568 156, 626 103 C 681 53, 724 31, 784 36" fill="none" stroke="#24FF72" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" filter="url(#growth-premium-glow)"/>
        <path class="line-main" d="M-16 176 C 42 168, 83 116, 145 126 C 208 136, 250 180, 318 132 C 370 95, 420 70, 472 106 C 526 144, 568 156, 626 103 C 681 53, 724 31, 784 36" fill="none" stroke="url(#growth-gradient)" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="line-shine" d="M-16 176 C 42 168, 83 116, 145 126 C 208 136, 250 180, 318 132 C 370 95, 420 70, 472 106 C 526 144, 568 156, 626 103 C 681 53, 724 31, 784 36" fill="none" stroke="url(#growth-shine-gradient)" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
        <circle class="line-end-orb" cx="784" cy="36" r="15" fill="rgba(91,255,111,.2)"/>
        <circle class="line-end-core" cx="784" cy="36" r="5.5" fill="url(#growth-end-gradient)"/>
      </svg>
      <div class="growth-pill">↗ Growing</div>
    </article>

    <article class="launch-card">
      <div>
        <img class="launch-logo" src="/logos/airo.svg" alt="Airo"/>
        <h3>Looking to launch<br/>Your game?</h3>
      </div>
      <a class="shine-btn launch-action" href="#contact">
        <span>Pitch us</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17h10V7M17 17 7 7"/></svg>
      </a>
    </article>
  </section>
  {/if}

  {#if currentPath === '/' || currentPath === '/about' || currentPath === '/games' || currentPath === '/careers' || currentPath === '/legal'}
    {#if currentPath !== '/legal'}
      <WorkWithUsForm initialTab={currentPath === '/careers' ? 'Careers' : 'Game'} />
    {/if}
    <Footer onNavigate={handleNavbarNavigate} />
  {/if}
</main>