<script>
  import { onMount, tick as svelteTick } from 'svelte';
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

  function smoothScrollToElement(target, offset = 12) {
    if (typeof window === 'undefined' || !target) return;

    unlockPageScroll();

    const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);

    window.scrollTo({
      top: targetTop,
      left: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });

    requestAnimationFrame(unlockPageScroll);
    window.setTimeout(unlockPageScroll, 420);
    window.setTimeout(unlockPageScroll, 920);
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
    { value: '385,928', target: 385928, start: 246000, label: 'Peak ccu', icon: 'ccu' },
    { value: '2,719,383,201', target: 2719383201, start: 1890000000, label: 'Visit the game', icon: 'visits' },
    { value: '+1,591,802', target: 1591802, start: 870000, prefix: '+', label: 'Experiences', icon: 'experiences' }
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

  const topHitFallbackExtensions = ['png', 'jpeg', 'jpg', 'webp', 'avif'];
  const topHitFallbacks = (label, preferred = 'png') => [
    `/top-hits/${label}.${preferred}`,
    ...topHitFallbackExtensions
      .filter((extension) => extension !== preferred)
      .map((extension) => `/top-hits/${label}.${extension}`)
  ];

  // IMPORTANT: these filenames come from the uploaded zip.
  // A1.png and A1.jpeg are two different images, so both are used exactly as they are.
  const topHits = [
    { label: 'A1.png', src: '/top-hits/A1.png', fallbacks: ['/top-hits/A1.png'], title: 'Bubble Gum Simulator INFINITY', ccu: '381,647 CCU', alt: 'Bubble Gum Simulator INFINITY artwork' },
    { label: 'A1.jpeg', src: '/top-hits/A1.jpeg', fallbacks: ['/top-hits/A1.jpeg'], title: 'Timebomb Ultimate 💣💥', ccu: '4,516 CCU', alt: 'Timebomb Ultimate artwork' },
    { label: 'A2.jpeg', src: '/top-hits/A2.jpeg', fallbacks: ['/top-hits/A2.jpeg'], title: 'Airo Partner Experience', ccu: 'Live game', alt: 'Airo partner experience artwork' },
    { label: 'A3.png', src: '/top-hits/A3.png', fallbacks: ['/top-hits/A3.png'], title: '[👊UPDATE] Project Power', ccu: '4,392 CCU', alt: 'Project Power artwork' },
    { label: 'A4.avif', src: '/top-hits/A4.avif', fallbacks: ['/top-hits/A4.avif'], title: 'Tunados Brasil', ccu: '2,491 CCU', alt: 'Tunados Brasil artwork' },
    { label: 'A5.avif', src: '/top-hits/A5.avif', fallbacks: ['/top-hits/A5.avif'], title: 'Be A Blackhole! 🕳️', ccu: '1,002 CCU', alt: 'Be A Blackhole artwork' },
    { label: 'A6.avif', src: '/top-hits/A6.avif', fallbacks: ['/top-hits/A6.avif'], title: '[☠️] Don’t Fall To Acid', ccu: '924 CCU', alt: 'Don’t Fall To Acid artwork' },
    { label: 'A7.webp', src: '/top-hits/A7.webp', fallbacks: ['/top-hits/A7.webp'], title: 'Carbilife 🏝️ RP', ccu: '815 CCU', alt: 'Carbilife RP artwork' },
    { label: 'A8.avif', src: '/top-hits/A8.avif', fallbacks: ['/top-hits/A8.avif'], title: 'Steal A Brainrot Child 👶', ccu: '655 CCU', alt: 'Steal A Brainrot Child artwork' },
    { label: 'A9.avif', src: '/top-hits/A9.avif', fallbacks: ['/top-hits/A9.avif'], title: 'Guess The Song Or Die', ccu: '529 CCU', alt: 'Guess The Song Or Die artwork' },
    { label: 'A10.avif', src: '/top-hits/A10.avif', fallbacks: ['/top-hits/A10.avif'], title: 'Haze PVP - Season 2', ccu: '523 CCU', alt: 'Haze PVP Season 2 artwork' }
  ];

  function fallbackTopHitImage(event, hit) {
    const image = event?.currentTarget;
    if (!image || !hit) return;

    const fallbackList = hit.fallbacks?.length ? hit.fallbacks : [hit.src];
    const attempt = Number(image.dataset.fallbackAttempt || 0) + 1;

    if (attempt >= fallbackList.length) {
      image.style.opacity = '0';
      return;
    }

    image.dataset.fallbackAttempt = String(attempt);
    image.src = fallbackList[attempt];
  }

  const heroCards = topHits.slice(0, 7).map((hit) => ({
    src: hit.src,
    fallbacks: hit.fallbacks,
    title: hit.title,
    alt: hit.alt
  }));

  const storyVideoSrc = '/videos/our-story.mp4';
  const storyVideoThumbSrc = '/videos/our-story-thumbnail.png?v=3';

  let storyVideoEl;
  let storyVideoStarted = false;
  let storyVideoPreviewing = false;
  let storyVideoPaused = false;

  async function previewStoryVideo() {
    if (storyVideoStarted || storyVideoPaused || !storyVideoEl) return;

    storyVideoPreviewing = true;
    await svelteTick();

    try {
      storyVideoEl.muted = true;
      storyVideoEl.controls = false;
      await storyVideoEl.play();
    } catch (error) {
      storyVideoPreviewing = false;
    }
  }

  function stopStoryPreview() {
    if (storyVideoStarted || storyVideoPaused || !storyVideoEl) return;

    storyVideoPreviewing = false;
    storyVideoEl.pause();
    storyVideoEl.currentTime = 0;
    storyVideoEl.muted = true;
    storyVideoEl.controls = false;
  }

  async function playStoryVideo({ restart = false } = {}) {
    storyVideoStarted = true;
    storyVideoPaused = false;
    storyVideoPreviewing = false;
    await svelteTick();

    try {
      if (storyVideoEl) {
        storyVideoEl.pause();
        if (restart) storyVideoEl.currentTime = 0;
        storyVideoEl.controls = false;
        storyVideoEl.muted = false;
        storyVideoEl.volume = 1;
        storyVideoEl.disablePictureInPicture = true;
      }

      await storyVideoEl?.play?.();
    } catch (error) {
      storyVideoStarted = false;
      storyVideoPaused = false;
      storyVideoPreviewing = false;
      console.warn('Our Story video could not start. Add the video file at public/videos/our-story.mp4', error);
    }
  }

  function pauseStoryVideo() {
    if (!storyVideoEl || !storyVideoStarted || storyVideoPaused) return;

    storyVideoEl.pause();
    storyVideoEl.muted = true;
    storyVideoEl.controls = false;
    storyVideoPaused = true;
    storyVideoPreviewing = false;
  }

  function toggleStoryVideo(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.currentTarget?.blur?.();

    if (storyVideoPaused) {
      playStoryVideo({ restart: false });
      return;
    }

    playStoryVideo({ restart: true });
  }

  function handleStoryVideoCardClick(event) {
    if (!storyVideoStarted || storyVideoPaused) return;
    if (event?.target?.closest?.('.story-video-trigger')) return;

    pauseStoryVideo();
  }

  function resetStoryVideo() {
    storyVideoStarted = false;
    storyVideoPreviewing = false;
    storyVideoPaused = false;

    if (storyVideoEl) {
      storyVideoEl.pause();
      storyVideoEl.currentTime = 0;
      storyVideoEl.muted = true;
      storyVideoEl.controls = false;
    }
  }

  function scrollToStory(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.currentTarget?.blur?.();

    if (typeof window === 'undefined') return;

    const target = document.getElementById('story');
    if (!target) return;

    if (window.location.hash) {
      window.history.replaceState({}, '', normalizePath(window.location.pathname));
    }

    smoothScrollToElement(target, 12);
  }

  function scrollToContact(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.currentTarget?.blur?.();

    if (typeof window === 'undefined') return;

    const target =
      document.getElementById('contact') ||
      document.getElementById('work-with-us') ||
      document.querySelector('.work-with-us-section, .contact-section, .work-form, form');

    if (!target) return;

    if (window.location.hash) {
      window.history.replaceState({}, '', normalizePath(window.location.pathname));
    }

    smoothScrollToElement(target, 22);
  }

  function navigateToGames(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.currentTarget?.blur?.();
    unlockPageScroll();
    handleNavbarNavigate('/games', { smooth: true });
  }


  let topHitActiveIndex = 0;
  let topHitsScrollProgress = 0;
  let topHitsRowWrapEl;

  function updateTopHitsScrollProgress(event) {
    const scrollEl = event?.currentTarget || topHitsRowWrapEl;
    if (!scrollEl) return;

    const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
    topHitsScrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollEl.scrollLeft / maxScroll)) : 0;
  }

  let topHitsScrollRaf;

  function setTopHitsScrollFromPointer(event, trackEl) {
    const scrollEl = topHitsRowWrapEl;
    if (!scrollEl || !trackEl) return;

    const rect = trackEl.getBoundingClientRect();
    const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
    if (!rect.width || maxScroll <= 0) return;

    const localX = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
    const progress = localX / rect.width;
    const targetLeft = progress * maxScroll;

    if (topHitsScrollRaf) cancelAnimationFrame(topHitsScrollRaf);
    topHitsScrollRaf = requestAnimationFrame(() => {
      scrollEl.scrollLeft = targetLeft;
      topHitsScrollProgress = progress;
      topHitsScrollRaf = null;
    });
  }

  function handleTopHitsScrollPointerDown(event) {
    event.preventDefault();
    const trackEl = event.currentTarget;
    trackEl.setPointerCapture?.(event.pointerId);
    setTopHitsScrollFromPointer(event, trackEl);

    const handleMove = (moveEvent) => setTopHitsScrollFromPointer(moveEvent, trackEl);
    const cleanup = (cleanupEvent) => {
      trackEl.releasePointerCapture?.(cleanupEvent?.pointerId || event.pointerId);
      trackEl.removeEventListener('pointermove', handleMove);
      trackEl.removeEventListener('pointerup', cleanup);
      trackEl.removeEventListener('pointercancel', cleanup);
    };

    trackEl.addEventListener('pointermove', handleMove);
    trackEl.addEventListener('pointerup', cleanup, { once: true });
    trackEl.addEventListener('pointercancel', cleanup, { once: true });
  }

  function handleTopHitsScrollKeydown(event) {
    const scrollEl = topHitsRowWrapEl;
    if (!scrollEl) return;

    const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
    if (maxScroll <= 0) return;

    const step = event.shiftKey ? maxScroll * 0.2 : maxScroll * 0.08;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollEl.scrollLeft = Math.min(maxScroll, scrollEl.scrollLeft + step);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollEl.scrollLeft = Math.max(0, scrollEl.scrollLeft - step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      scrollEl.scrollLeft = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      scrollEl.scrollLeft = maxScroll;
    }

    updateTopHitsScrollProgress({ currentTarget: scrollEl });
  }


  function getTopHitOffset(index) {
    const length = topHits.length;
    let offset = (index - topHitActiveIndex + length) % length;

    if (offset > length / 2) offset -= length;

    return offset;
  }

  function topHitPositionClass(index) {
    const offset = getTopHitOffset(index);

    if (offset === 0) return 'is-center';
    if (offset === 1) return 'is-right-one';
    if (offset === 2) return 'is-right-two';
    if (offset === -1) return 'is-left-one';
    if (offset === -2) return 'is-left-two';

    return 'is-hidden';
  }

  function topHitCardStyle(index) {
    return `--i:${index}; --offset:${getTopHitOffset(index)};`;
  }

  function nextTopHit() {
    topHitActiveIndex = (topHitActiveIndex + 1) % topHits.length;
  }

  function prevTopHit() {
    topHitActiveIndex = (topHitActiveIndex - 1 + topHits.length) % topHits.length;
  }

  function selectTopHit(index) {
    topHitActiveIndex = index;
  }

  let pantherAwardEl;
  let statsStickerEl;
  let statsBannerEl;
  let statsBannerInView = false;
  let growthCardEl;
  let growthInView = false;
  let hitsSectionEl;
  let hitsInView = false;
  let peakCounterRaf;
  let heroStatsEl;
  let heroStatsRaf;
  let lottieModulePromise;
  const peakCcuTarget = 385928;
  const peakCcuStart = 246000;
  let peakCcuValue = formatCounter(peakCcuTarget);
  let heroStatValues = stats.map((item) => item.value);

  function formatCounter(value) {
    return Math.round(value).toLocaleString('en-US');
  }

  function formatHeroStat(item, value) {
    return `${item.prefix || ''}${formatCounter(value)}`;
  }

  function resetHeroStats() {
    if (heroStatsRaf) cancelAnimationFrame(heroStatsRaf);
    heroStatsRaf = null;
    heroStatValues = stats.map((item) => item.value);
  }

  function animateHeroStats() {
    resetHeroStats();

    const duration = 1250;
    const start = performance.now();
    const easeOutQuart = (progress) => 1 - Math.pow(1 - progress, 4);

    heroStatValues = stats.map((item) => formatHeroStat(item, item.start));

    const run = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutQuart(progress);

      heroStatValues = stats.map((item) => formatHeroStat(item, item.start + (item.target - item.start) * eased));

      if (progress < 1) {
        heroStatsRaf = requestAnimationFrame(run);
      } else {
        heroStatsRaf = null;
        heroStatValues = stats.map((item) => item.value);
      }
    };

    heroStatsRaf = requestAnimationFrame(run);
  }

  function getLottieModule() {
    if (!lottieModulePromise) {
      lottieModulePromise = import('lottie-web').then((module) => module.default || module);
    }

    return lottieModulePromise;
  }

  function scheduleIdleWork(task) {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      return window.requestIdleCallback(task, { timeout: 1800 });
    }

    return window.setTimeout(task, 180);
  }

  function cancelIdleWork(id) {
    if (!id) return;

    if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(id);
    } else if (typeof window !== 'undefined') {
      window.clearTimeout(id);
    }
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

  function loadSticker(container, path) {
    if (!container) return null;

    container.innerHTML = '';

    let animation;
    let idleId;
    let destroyed = false;

    const handle = {
      destroy() {
        destroyed = true;
        cancelIdleWork(idleId);
        animation?.destroy?.();
      }
    };

    idleId = scheduleIdleWork(async () => {
      try {
        const lottie = await getLottieModule();

        if (destroyed || !container) return;

        const baseOptions = {
          container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
            progressiveLoad: true
          }
        };

        if (/\.tgs$/i.test(path)) {
          if (typeof DecompressionStream !== 'undefined') {
            try {
              const response = await fetch(path, { cache: 'force-cache' });
              const buffer = await response.arrayBuffer();
              const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));
              const animationData = await new Response(stream).json();

              if (destroyed || !container) return;
              animation = lottie.loadAnimation({
                ...baseOptions,
                animationData
              });
              return;
            } catch (error) {
              // Fall back to a JSON export with the same filename when the browser cannot decode .tgs.
            }
          }

          if (destroyed || !container) return;
          animation = lottie.loadAnimation({
            ...baseOptions,
            path: path.replace(/\.tgs$/i, '.json')
          });
          return;
        }

        animation = lottie.loadAnimation({
          ...baseOptions,
          path
        });
      } catch (error) {
        // Keep the page responsive even if an animation asset is missing or delayed.
      }
    });

    return handle;
  }


  onMount(() => {
    unlockPageScroll();

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

    const handlePopState = () => {
      currentPath = normalizePath(window.location.pathname);
      requestAnimationFrame(() => scrollToRouteHero(currentPath, 'auto'));
    };

    window.addEventListener('popstate', handlePopState);

    const stickerAnimations = [
      loadSticker(pantherAwardEl, '/stickers/panther-award.json'),
      loadSticker(statsStickerEl, '/stickers/stats.tgs')
    ].filter(Boolean);

    let observer;
    let statsObserver;
    let heroStatsObserver;

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

    if (heroStatsEl) {
      heroStatsObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const ratio = entry?.intersectionRatio || 0;

          if (entry?.isIntersecting && ratio >= 0.35) {
            animateHeroStats();
          } else if (!entry?.isIntersecting || ratio <= 0.08) {
            resetHeroStats();
          }
        },
        {
          threshold: [0, 0.08, 0.35, 0.6],
          rootMargin: '-8% 0px -12% 0px'
        }
      );

      heroStatsObserver.observe(heroStatsEl);
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


    return () => {
      if (peakCounterRaf) cancelAnimationFrame(peakCounterRaf);
      if (heroStatsRaf) cancelAnimationFrame(heroStatsRaf);
      observer?.disconnect();
      window.removeEventListener('popstate', handlePopState);
      statsObserver?.disconnect();
      heroStatsObserver?.disconnect();
      stickerAnimations.forEach((animation) => animation.destroy());
    };
  });
</script>

<svelte:head>
  {#if currentPath === '/'}
    <link rel="preload" as="image" href="/hero.png?v=2" fetchpriority="high" type="image/png" />
    <link rel="prefetch" href="/stickers/stats.tgs" as="fetch" crossorigin="anonymous" />
    <link rel="prefetch" href="/stickers/panther-award.json" as="fetch" crossorigin="anonymous" />
  {/if}
</svelte:head>


<main class="site-shell" class:about-route={currentPath === '/about'} class:careers-route={currentPath === '/careers'} class:games-route={currentPath === '/games'} class:legal-route={currentPath === '/legal'}>
  <Navbar activePath={currentPath} onNavigate={handleNavbarNavigate} />

  {#if currentPath === '/'}
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
        <p>Airo is an exclusive acquisition studio embracing Creativity and innovation amongst young developers and creators.</p>
        <button type="button" class="video-btn" on:click={scrollToStory}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path class="arrow-main" pathLength="100" d="M20.3 3.7L3.7 20.3" />
            <path class="arrow-head" pathLength="100" d="M3.7 20.3H17.2" />
            <path class="arrow-head" pathLength="100" d="M3.7 20.3V6.8" />
          </svg>
          <span>Watch reel</span>
        </button>
      </div>

      <div class="hero-card-rig" aria-label="Animated featured game cards">
        <div class="hero-card-track">
          {#each heroCards as card, index}
            <article class="hero-game-card" style={`--i: ${index}; --card-image: url('${card.src}');`} aria-label={card.title}>
              <div class="hero-game-card-inner">
                <img
                  class="hero-game-card-image"
                  src={card.src}
                  alt={card.alt}
                  loading="lazy"
                  decoding="async"
                  data-fallback-attempt="0"
                  on:error={(event) => fallbackTopHitImage(event, card)}
                />
              </div>
            </article>
          {/each}
        </div>
      </div>

      <div class="stats-row" bind:this={heroStatsEl}>
        {#each stats as item, index}
          <article class="stat-item">
            <div class="stat-icon connected-stat-box">
              {#if item.icon === 'ccu'}
                <svg class="connected-stat-icon stats-motion-icon stats-icon-team" viewBox="0 0 48 48" aria-hidden="true">
                  <path class="stats-line stats-line-a" pathLength="1" d="M24 9.8a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4Z" />
                  <path class="stats-line stats-line-b" pathLength="1" d="M13.8 15.7a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
                  <path class="stats-line stats-line-c" pathLength="1" d="M34.2 15.7a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
                  <path class="stats-line stats-line-d" pathLength="1" d="M12 36.2c2.4-6.2 6.4-9.3 12-9.3s9.6 3.1 12 9.3" />
                  <path class="stats-line stats-line-e" pathLength="1" d="M5.9 34.2c1.4-4 4.2-6.1 8.1-6.1" />
                  <path class="stats-line stats-line-f" pathLength="1" d="M42.1 34.2c-1.4-4-4.2-6.1-8.1-6.1" />
                </svg>
              {:else if item.icon === 'visits'}
                <svg class="connected-stat-icon stats-motion-icon stats-icon-visits" viewBox="0 0 48 48" aria-hidden="true">
                  <path class="stats-line stats-line-a" pathLength="1" d="M8.2 34.4h31.6" />
                  <path class="stats-line stats-line-b" pathLength="1" d="M12.3 28.9l7.6-7.6 6.1 6.1 10-11" />
                  <path class="stats-line stats-line-c" pathLength="1" d="M30.3 16.4H36v5.7" />
                  <path class="stats-dot stats-dot-a" d="M12.3 28.9a2 2 0 1 0 0 .1" />
                  <path class="stats-dot stats-dot-b" d="M19.9 21.3a2 2 0 1 0 0 .1" />
                  <path class="stats-dot stats-dot-c" d="M26 27.4a2 2 0 1 0 0 .1" />
                </svg>
              {:else}
                <svg class="connected-stat-icon stats-motion-icon stats-icon-game" viewBox="0 0 48 48" aria-hidden="true">
                  <path class="stats-line stats-line-a" pathLength="1" d="M15.4 18.2h17.2c4 0 6.8 2.6 7.5 6.5l1.1 6.3c.5 3-1.5 5.8-4.5 6-2 .2-3.7-.7-5-2.6l-2.1-3.2H18.4l-2.1 3.2c-1.3 1.9-3 2.8-5 2.6-3-.2-5-3-4.5-6l1.1-6.3c.7-3.9 3.5-6.5 7.5-6.5Z" />
                  <path class="stats-line stats-line-b" pathLength="1" d="M15.2 27h8.2" />
                  <path class="stats-line stats-line-c" pathLength="1" d="M19.3 22.9v8.2" />
                  <path class="stats-line stats-line-d" pathLength="1" d="M30.6 25.1h.1" />
                  <path class="stats-line stats-line-e" pathLength="1" d="M35.1 29.3h.1" />
                </svg>
              {/if}
            </div>
            <div>
              <strong>{heroStatValues[index]}</strong>
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
      <h2>OUR STORY</h2>
    </div>
    <p class="section-lead">This section will showcase our studio, vision, and featured projects through video content</p>
    <div
      class="video-card"
      class:is-playing={storyVideoStarted}
      class:is-previewing={storyVideoPreviewing}
      class:is-paused={storyVideoPaused}
      on:mouseenter={previewStoryVideo}
      on:mouseleave={stopStoryPreview}
      on:click={handleStoryVideoCardClick}
    >
      <img
        class="story-video-thumb"
        src={storyVideoThumbSrc}
        alt="Airo Our Story video thumbnail"
        loading="lazy"
        decoding="async"
      />
      <!-- svelte-ignore a11y_media_has_caption -->
      <video
        bind:this={storyVideoEl}
        class="story-video"
        preload="auto"
        poster={storyVideoThumbSrc}
        playsinline
        muted={!storyVideoStarted || storyVideoPaused}
        controls={false}
        disablepictureinpicture
        controlslist="nodownload noplaybackrate noremoteplayback nofullscreen"
        on:ended={resetStoryVideo}
      >
        <source src={storyVideoSrc} type="video/mp4" />
      </video>


      {#if !storyVideoStarted || storyVideoPaused}
        <button
          type="button"
          class="story-video-trigger"
          on:click={toggleStoryVideo}
          aria-label="Play Our Story video"
        >
          <span class="story-play-button" aria-hidden="true">
            <span class="story-play-wave story-play-wave-one"></span>
            <span class="story-play-wave story-play-wave-two"></span>
            <svg viewBox="0 0 24 24">
              <path class="story-play-triangle" d="M8.9 6.85C8.9 5.58 10.31 4.82 11.37 5.52L18.35 10.12C19.35 10.78 19.35 12.22 18.35 12.88L11.37 17.48C10.31 18.18 8.9 17.42 8.9 16.15V6.85Z" />
            </svg>
          </span>
        </button>
      {/if}

      {#if storyVideoStarted && !storyVideoPaused}
        <button
          type="button"
          class="story-video-pause-trigger"
          on:click={(event) => { event.preventDefault(); event.stopPropagation(); pauseStoryVideo(); }}
          aria-label="Pause Our Story video"
        >
          <span class="story-pause-button" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
        </button>
      {/if}
    </div>
  </section>

  <section class="brands-section" id="brands">
    <div class="brands-kicker" aria-label="Brands">
      <span class="brands-corner brands-corner-tl"></span>
      <span class="brands-corner brands-corner-tr"></span>
      <strong>Brands</strong>
      <span class="brands-corner brands-corner-bl"></span>
      <span class="brands-corner brands-corner-br"></span>
    </div>
    <h2><span class="trusted-word">Trusted</span> by global brands</h2>
    <p>From studios to global tech leaders, our team has collaborated with partners<br class="brand-copy-break" /> who care about polished products and memorable experiences.</p>

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

  <section class="hits-section is-visible" id="games">
    <div class="hits-head">
      <div>
        <span class="vertical-accent"></span>
        <h2>Our top hits</h2>
        <p>Here are some of our top games</p>
      </div>
      <a class="view-btn shine-btn" href="/games" on:click={navigateToGames}>View all games</a>
    </div>

    <div bind:this={topHitsRowWrapEl} class="top-hits-row-wrap" aria-label="Airo top hit games" on:scroll={updateTopHitsScrollProgress}>
      <div class="top-hits-row">
        {#each topHits as hit, index}
          <article class="top-hit-card" style={`--i: ${index};`}>
            <div class="top-hit-art">
              <img
                src={hit.src}
                alt={hit.alt}
                loading="lazy"
                decoding="async"
                data-fallback-attempt="0"
                on:error={(event) => fallbackTopHitImage(event, hit)}
              />
            </div>
            <div class="top-hit-content">
              <h3>{hit.title}</h3>
              <span class="top-hit-metric"><span class="top-hit-live-dot" aria-hidden="true"></span>{hit.ccu}</span>
            </div>
          </article>
        {/each}
      </div>
    </div>
    <div
      class="top-hits-scroll-line"
      role="slider"
      tabindex="0"
      aria-label="Scroll top hit games"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(topHitsScrollProgress * 100)}
      style={`--scroll-progress: ${topHitsScrollProgress};`}
      on:pointerdown={handleTopHitsScrollPointerDown}
      on:keydown={handleTopHitsScrollKeydown}
    ><span></span></div>
  </section>

  <section class="stats-panel-section">
    <div class="stats-section-head">
      <div class="brands-kicker stats-kicker" aria-label="Stats">
        <span class="brands-corner brands-corner-tl"></span>
        <span class="brands-corner brands-corner-tr"></span>
        <strong>Stats</strong>
        <span class="brands-corner brands-corner-bl"></span>
        <span class="brands-corner brands-corner-br"></span>
      </div>
      <h2>Real growth</h2>
      <div class="stats-title-sticker" bind:this={statsStickerEl} aria-label="Stats animation"></div>
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
      <a class="shine-btn launch-action" href="#contact" on:click={scrollToContact}>
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
