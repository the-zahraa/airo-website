<script>
  import { onMount, tick as svelteTick } from 'svelte';

  const homeCtaTiles = [
    '/top-hits/A2.jpeg',
    '/top-hits/A3.png',
    '/top-hits/A4.avif',
    '/top-hits/A5.avif',
    '/top-hits/A6.avif',
    '/top-hits/A7.webp',
    '/top-hits/A8.avif'
  ];

  export let onNavigate = () => {};

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
    { value: '12+', label: 'Brand Partners' },
    { value: '84+', label: 'Countries Reached' },
    { value: 'Fully Owned', label: 'Content' }
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
      image.dataset.fallbackFailed = 'true';
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
  let storyVideoMobileFullscreen = false;

  function isSmallScreen() {
    return typeof window !== 'undefined' && window.matchMedia?.('(max-width: 700px)')?.matches;
  }

  function canUseHoverPreview() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches
    );
  }

  async function previewStoryVideo() {
    if (!canUseHoverPreview() || storyVideoStarted || storyVideoPaused || !storyVideoEl) return;

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
    if (!storyVideoPreviewing || storyVideoStarted || storyVideoPaused || !storyVideoEl) return;

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
    storyVideoMobileFullscreen = isSmallScreen();
    await svelteTick();

    try {
      if (storyVideoEl) {
        storyVideoEl.pause();
        if (restart) storyVideoEl.currentTime = 0;
        storyVideoEl.controls = storyVideoMobileFullscreen;
        storyVideoEl.muted = false;
        storyVideoEl.volume = 1;
        storyVideoEl.disablePictureInPicture = true;
      }

      await storyVideoEl?.play?.();

      if (storyVideoMobileFullscreen && storyVideoEl) {
        window.setTimeout(() => {
          try {
            if (storyVideoEl.webkitEnterFullscreen) {
              storyVideoEl.webkitEnterFullscreen();
            } else if (storyVideoEl.requestFullscreen) {
              storyVideoEl.requestFullscreen().catch(() => {});
            }
          } catch (error) {
            // Keep inline playback if mobile fullscreen is not allowed by the browser.
          }
        }, 60);
      }
    } catch (error) {
      storyVideoStarted = false;
      storyVideoPaused = false;
      storyVideoPreviewing = false;
      storyVideoMobileFullscreen = false;
      console.warn('Our Story video could not start. Add the video file at public/videos/our-story.mp4', error);
    }
  }

  function pauseStoryVideo() {
    if (!storyVideoEl || !storyVideoStarted || storyVideoPaused) return;

    storyVideoEl.pause();
    storyVideoEl.muted = true;
    storyVideoEl.controls = false;
    storyVideoPaused = true;
    storyVideoMobileFullscreen = false;
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
    storyVideoMobileFullscreen = false;

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
      window.history.replaceState({}, '', window.location.pathname || '/');
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
      window.history.replaceState({}, '', window.location.pathname || '/');
    }

    smoothScrollToElement(target, 22);
  }

  function navigateToGames(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.currentTarget?.blur?.();
    unlockPageScroll();
    onNavigate?.('/games', { smooth: true });
  }


  let topHitActiveIndex = 0;
  let topHitsScrollProgress = 0;
  let topHitsRowWrapEl;

  function updateTopHitsScrollProgress(event) {
    const scrollEl = event?.currentTarget || topHitsRowWrapEl;
    if (!scrollEl) return;

    if (topHitsProgressRaf) return;

    topHitsProgressRaf = requestAnimationFrame(() => {
      const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
      topHitsScrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollEl.scrollLeft / maxScroll)) : 0;
      topHitsProgressRaf = null;
    });
  }

  let topHitsScrollRaf;
  let topHitsProgressRaf;

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


  function homeReveal(node, options = 0) {
    if (typeof window === 'undefined') return {};

    const settings = typeof options === 'number' ? { delay: options } : options || {};
    const delay = Number(settings.delay || 0);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    node.style.setProperty('--home-reveal-delay', `${delay}ms`);
    node.classList.add('home-reveal');

    if (settings.transform === false) {
      node.classList.add('home-reveal-opacity-only');
    }

    if (reduce) {
      node.classList.add('home-visible');
      return {};
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('home-visible');
          observer.unobserve(node);
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
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
  let heroStatsAnimated = false;
  let heroSectionEl;
  let heroActive = true;
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
    heroStatsAnimated = true;
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
    if (typeof window === 'undefined') return null;

    // Do not wait for requestIdleCallback here.
    // On animation-heavy pages the browser may stay "busy", so stickers appear late or pop in.
    return window.setTimeout(task, 90);
  }

  function cancelIdleWork(id) {
    if (!id || typeof window === 'undefined') return;
    window.clearTimeout(id);
  }

  function resetPeakCounter() {
    if (peakCounterRaf) cancelAnimationFrame(peakCounterRaf);
    peakCounterRaf = null;
    peakCcuValue = formatCounter(peakCcuTarget);
  }

  function animatePeakCounter() {
    resetPeakCounter();

    const duration = isSmallScreen() ? 900 : 1250;
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

  function statIconPath(icon) {
    if (icon === 'ccu') return '/stickers/pc.tgs';
    if (icon === 'visits') return '/stickers/vg.tgs';
    return '/stickers/ex.tgs';
  }

  function statIconClass(icon) {
    if (icon === 'ccu') return 'stats-icon-team';
    if (icon === 'visits') return 'stats-icon-visits';
    return 'stats-icon-game';
  }

  function createIsolatedStickerMount(container) {
    if (!container || typeof document === 'undefined') return container;

    container.innerHTML = '';
    container.dataset.stickerReady = 'false';

    if (container.attachShadow) {
      const root = container.shadowRoot || container.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          :host {
            display: inline-block;
            line-height: 0;
            flex: 0 0 auto;
          }

          .lottie-sticker-mount,
          .lottie-sticker-mount > div,
          .lottie-sticker-mount svg,
          .lottie-sticker-mount canvas {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }

          .lottie-sticker-mount svg {
            overflow: visible !important;
          }
        </style>
        <span class="lottie-sticker-mount"></span>
      `;

      return root.querySelector('.lottie-sticker-mount');
    }

    const mount = document.createElement('span');
    mount.className = 'lottie-sticker-mount';
    mount.style.cssText = 'display:block;width:100%;height:100%;line-height:0;pointer-events:none;';
    container.appendChild(mount);
    return mount;
  }

  const activeStickerHandles = new Set();
  let stickerWakeRaf;

  function stickerHasVisual(container) {
    if (!container) return false;

    const root = container.shadowRoot || container;
    return !!root?.querySelector?.('svg, canvas');
  }

  function wakeStickerAnimations({ force = false } = {}) {
    if (typeof window === 'undefined') return;

    if (stickerWakeRaf) cancelAnimationFrame(stickerWakeRaf);

    stickerWakeRaf = requestAnimationFrame(() => {
      stickerWakeRaf = null;

      activeStickerHandles.forEach((handle) => {
        if (!handle || handle.destroyed || !handle.container?.isConnected) return;

        if (force || !stickerHasVisual(handle.container)) {
          handle.reload?.({ force: true });
        } else {
          handle.play?.();
        }
      });
    });
  }

  function lottieSticker(container, path) {
    let handle = loadSticker(container, path);

    return {
      update(nextPath) {
        if (nextPath === path) {
          handle?.reload?.({ force: !stickerHasVisual(container) });
          return;
        }

        path = nextPath;
        handle?.destroy?.();
        handle = loadSticker(container, path);
      },
      destroy() {
        handle?.destroy?.();
      }
    };
  }

  function loadSticker(container, path) {
    if (!container || !path) return null;

    let animation;
    let idleId;
    let destroyed = false;
    let loading = false;
    let loadVersion = 0;

    const handle = {
      container,
      get destroyed() {
        return destroyed;
      },
      play() {
        try {
          animation?.play?.();
        } catch (error) {
          // Ignore renderer recovery errors and let reload handle missing stickers.
        }
      },
      reload({ force = false } = {}) {
        if (destroyed || !container?.isConnected) return;
        if (loading && !force) return;
        if (!force && animation && stickerHasVisual(container)) {
          container.dataset.stickerReady = 'true';
          animation.play?.();
          return;
        }

        loadVersion += 1;
        const version = loadVersion;
        loading = true;
        container.dataset.stickerReady = 'false';

        cancelIdleWork(idleId);
        idleId = null;

        try {
          animation?.destroy?.();
        } catch (error) {
          // A destroyed route can leave a stale renderer. Rebuild cleanly.
        }

        animation = null;
        const mount = createIsolatedStickerMount(container);

        idleId = scheduleIdleWork(async () => {
          try {
            const lottie = await getLottieModule();

            if (destroyed || version !== loadVersion || !container?.isConnected || !mount) return;

            const baseOptions = {
              container: mount,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid meet',
                progressiveLoad: false
              }
            };

            if (/\.tgs$/i.test(path)) {
              if (typeof DecompressionStream !== 'undefined') {
                try {
                  const response = await fetch(path, { cache: 'force-cache' });
                  const buffer = await response.arrayBuffer();
                  const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));
                  const animationData = await new Response(stream).json();

                  if (destroyed || version !== loadVersion || !container?.isConnected) return;

                  animation = lottie.loadAnimation({
                    ...baseOptions,
                    animationData
                  });

                  container.dataset.stickerReady = 'true';
                  loading = false;
                  return;
                } catch (error) {
                  // Fall back to a JSON export with the same filename when the browser cannot decode .tgs.
                }
              }

              if (destroyed || version !== loadVersion || !container?.isConnected) return;

              animation = lottie.loadAnimation({
                ...baseOptions,
                path: path.replace(/\.tgs$/i, '.json')
              });

              container.dataset.stickerReady = 'true';
              loading = false;
              return;
            }

            animation = lottie.loadAnimation({
              ...baseOptions,
              path
            });

            container.dataset.stickerReady = 'true';
            loading = false;
          } catch (error) {
            loading = false;
            container.dataset.stickerReady = 'false';
          }
        });
      },
      destroy() {
        destroyed = true;
        loading = false;
        activeStickerHandles.delete(handle);
        cancelIdleWork(idleId);
        idleId = null;

        try {
          animation?.destroy?.();
        } catch (error) {
          // Route changes can destroy DOM before lottie finishes cleaning up.
        }

        animation = null;
      }
    };

    activeStickerHandles.add(handle);
    handle.reload({ force: true });
    return handle;
  }

  onMount(() => {
    unlockPageScroll();

    const stickerAnimations = [
      loadSticker(pantherAwardEl, '/stickers/panther-award.json'),
      loadSticker(statsStickerEl, '/stickers/stats.tgs')
    ].filter(Boolean);

    const handleStickerWake = () => wakeStickerAnimations({ force: true });
    const handleVisibilityWake = () => {
      if (!document.hidden) wakeStickerAnimations({ force: true });
    };

    window.addEventListener('pageshow', handleStickerWake);
    window.addEventListener('focus', handleStickerWake);
    document.addEventListener('visibilitychange', handleVisibilityWake);

    svelteTick().then(() => {
      wakeStickerAnimations({ force: true });
      window.setTimeout(() => wakeStickerAnimations({ force: true }), 260);
      window.setTimeout(() => wakeStickerAnimations({ force: false }), 900);
    });

    let observer;
    let statsObserver;
    let heroStatsObserver;
    let heroSectionObserver;

    if (heroSectionEl) {
      heroSectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          heroActive = !!entry?.isIntersecting;
        },
        {
          threshold: [0, 0.01],
          rootMargin: '180px 0px 180px 0px'
        }
      );

      heroSectionObserver.observe(heroSectionEl);
    }

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

          if (entry?.isIntersecting && ratio >= 0.35 && !heroStatsAnimated) {
            animateHeroStats();
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
      window.removeEventListener('pageshow', handleStickerWake);
      window.removeEventListener('focus', handleStickerWake);
      document.removeEventListener('visibilitychange', handleVisibilityWake);
      if (stickerWakeRaf) cancelAnimationFrame(stickerWakeRaf);
      stickerWakeRaf = null;
      if (peakCounterRaf) cancelAnimationFrame(peakCounterRaf);
      if (heroStatsRaf) cancelAnimationFrame(heroStatsRaf);
      if (topHitsScrollRaf) cancelAnimationFrame(topHitsScrollRaf);
      if (topHitsProgressRaf) cancelAnimationFrame(topHitsProgressRaf);
      observer?.disconnect();
      statsObserver?.disconnect();
      heroStatsObserver?.disconnect();
      heroSectionObserver?.disconnect();
      stickerAnimations.forEach((animation) => animation.destroy());
      [...activeStickerHandles].forEach((handle) => handle.destroy?.());
      activeStickerHandles.clear();
      resetStoryVideo();
    };
  });
</script>

<svelte:head>
  <link rel="preload" as="image" href="/hero-mobile.webp?v=3" fetchpriority="high" type="image/webp" media="(max-width: 560px)" />
  <link rel="preload" as="image" href="/hero.webp?v=3" fetchpriority="high" type="image/webp" media="(min-width: 561px)" />
  <link rel="prefetch" href="/stickers/stats.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/panther-award.json" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/wr.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/pc.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/vg.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/ex.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/pu.tgs" as="fetch" crossorigin="anonymous" />
</svelte:head>

<picture aria-hidden="true">
  <source media="(max-width: 560px)" srcset="/hero-mobile.webp?v=3" type="image/webp" />
  <source srcset="/hero.webp?v=3" type="image/webp" />
  <img
    class="home-hero-bg-art"
    src="/hero.webp?v=3"
    alt=""
    loading="eager"
    fetchpriority="high"
    decoding="async"
    draggable="false"
  />
</picture>

<div class="dot-field dot-field-main"></div>
<div class="dot-field dot-field-lower"></div>
<div class="soft-columns"></div>

<section bind:this={heroSectionEl} class={`hero-section${heroActive ? ' is-hero-active' : ' is-hero-idle'}`}>
  <div class="hero-copy">
    <h1 class="hero-main-title"><span class="hero-title-line hero-title-line-one">Your Game</span> <span class="hero-title-line hero-title-line-two">Could Be Next</span></h1>
    <p>Airo backs Roblox games others overlook, helping them reach more players, stronger revenue,<br/>and real momentum.</p>
    <button type="button" class="video-btn" on:click={scrollToStory}>
      <span
        class="reel-play-icon reel-lottie-icon"
        style="display: inline-block; line-height: 0; pointer-events: none; transform: scale(1.16); transform-origin: center;"
        use:lottieSticker={'/stickers/wr.tgs'}
        aria-hidden="true"
      ></span>
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
              loading="eager"
              fetchpriority={index < 4 ? "high" : "auto"}
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
          <span
            class={`connected-stat-icon solid-stat-icon stat-lottie-icon ${statIconClass(item.icon)}`}
            style="display: block; line-height: 0; pointer-events: none; transform: scale(1.16); transform-origin: center;"
            use:lottieSticker={statIconPath(item.icon)}
            aria-hidden="true"
          ></span>
        </div>
        <div>
          <strong>{heroStatValues[index]}</strong>
          <span>{item.label}</span>
        </div>
      </article>
    {/each}
  </div>
</section>

<section class="story-section" id="story">
  <div class="section-title title-with-icon" use:homeReveal>
    <h2>Meet Airo</h2>
  </div>
  <p class="section-lead" use:homeReveal={70}>We back overlooked Roblox games and help them grow into something bigger.</p>
  <div
    class="video-card"
    use:homeReveal={130}
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
      preload="metadata"
      poster={storyVideoThumbSrc}
      playsinline
      muted={!storyVideoStarted || storyVideoPaused}
      controls={storyVideoMobileFullscreen && storyVideoStarted && !storyVideoPaused}
      disablepictureinpicture
      controlslist="nodownload noplaybackrate noremoteplayback"
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
  <div class="brands-kicker" aria-label="Brands" use:homeReveal>
    <span class="brands-corner brands-corner-tl"></span>
    <span class="brands-corner brands-corner-tr"></span>
    <strong>Brands</strong>
    <span class="brands-corner brands-corner-bl"></span>
    <span class="brands-corner brands-corner-br"></span>
  </div>
  <h2 use:homeReveal={60}>Trusted By Teams Worldwide</h2>
  <p use:homeReveal={110}>From brand partners to owned content, Airo works across games, studios, and creator-led experiences built to reach players around the world.</p>

  <div class="brand-badges" use:homeReveal={170}>
    {#each brandBadges as badge}
      <div class="brand-badge">
        <strong>{badge.value}</strong>
        <span>{badge.label}</span>
      </div>
    {/each}
  </div>

  <div class="logo-cloud" aria-label="Brand logos" use:homeReveal={220}>
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
  <div class="hits-head" use:homeReveal>
    <div>
      <span class="vertical-accent"></span>
      <h2>Our top hits</h2>
      <p>Here are some of our top games</p>
    </div>
    <a class="view-btn shine-btn" href="/games" on:click={navigateToGames}>View all games</a>
  </div>

  <div bind:this={topHitsRowWrapEl} class="top-hits-row-wrap" use:homeReveal={90} aria-label="Airo top hit games" on:scroll={updateTopHitsScrollProgress}>
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
    use:homeReveal={150}
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
  <div class="stats-section-head" use:homeReveal>
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
    <article use:homeReveal={80}>
      <strong>+1B</strong>
      <span>Total visits across all our experiences on ROBLOX.</span>
    </article>
    <article use:homeReveal={130}>
      <strong>+41</strong>
      <span>Games acquired to-date. we are always scouting for more games & UGC group</span>
    </article>
  </div>

  <article class="award-card" use:homeReveal={180}>
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

  <article bind:this={growthCardEl} class={`growth-card${growthInView ? ' is-visible' : ''}`} use:homeReveal={{ delay: 230, transform: false }}>
    <span class="growth-label">
      <span
        style="display: inline-block; width: 24px; height: 24px; flex: 0 0 24px; line-height: 0; pointer-events: none;"
        use:lottieSticker={'/stickers/pu.tgs'}
        aria-hidden="true"
      ></span>
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

  <article class="home-desktop-cta" use:homeReveal={280} aria-label="Pitch Airo your game">
    <div class="home-desktop-cta-copy">
      <img class="home-desktop-cta-logo" src="/logos/airo.svg" alt="Airo" />
      <h3>Looking to launch<br />Your game?</h3>
    </div>

    <a class="home-desktop-cta-button" href="#contact" on:click={scrollToContact}>
      <span>Pitch us</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 17h10V7M17 17 7 7" />
      </svg>
    </a>

    <div class="home-desktop-cta-tiles" aria-hidden="true">
      {#each homeCtaTiles as tile, index}
        <figure class={`home-desktop-cta-tile home-desktop-cta-tile-${index + 1}`}>
          <img src={tile} alt="" loading="lazy" />
        </figure>
      {/each}
    </div>
  </article>

  <article class="launch-card" use:homeReveal={280}>
    <div>
      <img class="launch-logo" src="/logos/airo.svg" alt="Airo"/>
      <h3>Looking to launch<br/>Your game?</h3>
    </div>
    <a class="launch-action" href="#contact" on:click={scrollToContact}>
      <span>Pitch us</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17h10V7M17 17 7 7"/></svg>
    </a>
  </article>
</section>

<style>
  .reel-lottie-icon {
    width: 28px !important;
    height: 28px !important;
    transform: scale(1.28) !important;
  }

  .stat-lottie-icon {
    width: 62px !important;
    height: 62px !important;
    transform: scale(1.26) !important;
  }


  .connected-stat-box {
    position: relative;
    isolation: isolate;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.145), rgba(255, 255, 255, 0.045) 42%, rgba(255, 255, 255, 0.07)),
      rgba(12, 7, 20, 0.28) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.36),
      inset 0 -1px 0 rgba(255, 255, 255, 0.075),
      inset 0 0 18px rgba(255, 255, 255, 0.045),
      0 12px 32px rgba(0, 0, 0, 0.24),
      0 0 10px rgba(115, 0, 255, 0.08) !important;
    backdrop-filter: blur(18px) saturate(148%);
    -webkit-backdrop-filter: blur(18px) saturate(148%);
    overflow: hidden;
  }

  .connected-stat-box::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    background:
      linear-gradient(145deg,
        rgba(255, 255, 255, 0.48) 0%,
        rgba(255, 255, 255, 0.16) 28%,
        rgba(255, 255, 255, 0.055) 55%,
        rgba(255, 255, 255, 0.22) 100%);
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 0;
  }

  .connected-stat-box::after {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    background:
      linear-gradient(150deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.045) 26%, transparent 52%),
      radial-gradient(circle at 28% 18%, rgba(255, 255, 255, 0.18), transparent 23%),
      radial-gradient(circle at 78% 78%, rgba(115, 0, 255, 0.08), transparent 36%);
    box-shadow:
      inset 0 0 14px rgba(255, 255, 255, 0.035),
      inset 0 0 22px rgba(0, 0, 0, 0.045);
    opacity: 0.82;
    pointer-events: none;
    z-index: 0;
  }

  .connected-stat-icon {
    position: relative;
    z-index: 1;
  }

  .mini-panels article > strong,
  .award-icon,
  .growth-label {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    backdrop-filter: blur(18px) saturate(155%);
    -webkit-backdrop-filter: blur(18px) saturate(155%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.38),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1),
      inset 0 0 18px rgba(255, 255, 255, 0.05),
      0 14px 34px rgba(0, 0, 0, 0.24),
      0 0 0 1px rgba(255, 255, 255, 0.04) !important;
  }

  .mini-panels article > strong {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.045) 36%, rgba(255, 255, 255, 0.11) 68%, rgba(255, 255, 255, 0.04)),
      radial-gradient(circle at 22% 16%, rgba(255, 255, 255, 0.3), transparent 32%),
      radial-gradient(circle at 82% 84%, rgba(150, 64, 255, 0.28), transparent 42%),
      linear-gradient(135deg, rgba(115, 0, 255, 0.58), rgba(150, 64, 255, 0.22)) !important;
    border: 1px solid rgba(218, 198, 255, 0.28) !important;
  }

  .award-icon {
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.06) 34%, rgba(255, 255, 255, 0.16) 70%, rgba(255, 255, 255, 0.055)),
      radial-gradient(circle at 24% 14%, rgba(255, 255, 255, 0.42), transparent 31%),
      radial-gradient(circle at 78% 82%, rgba(255, 209, 76, 0.32), transparent 46%),
      linear-gradient(135deg, rgba(255, 214, 89, 0.6), rgba(194, 128, 24, 0.24)) !important;
    border: 1px solid rgba(255, 235, 166, 0.36) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.48),
      inset 0 -1px 0 rgba(255, 231, 140, 0.16),
      inset 0 0 18px rgba(255, 228, 120, 0.07),
      0 14px 34px rgba(0, 0, 0, 0.24),
      0 0 18px rgba(255, 190, 54, 0.12) !important;
  }

  .award-icon svg {
    position: relative;
    z-index: 1;
  }

  .growth-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.045) 34%, rgba(255, 255, 255, 0.1) 68%, rgba(255, 255, 255, 0.04)),
      radial-gradient(circle at 24% 14%, rgba(255, 255, 255, 0.28), transparent 32%),
      radial-gradient(circle at 82% 84%, rgba(82, 255, 119, 0.18), transparent 42%),
      linear-gradient(135deg, rgba(41, 255, 112, 0.18), rgba(20, 207, 86, 0.065)) !important;
    border: 1px solid rgba(151, 255, 170, 0.24) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.34),
      inset 0 -1px 0 rgba(121, 255, 146, 0.08),
      inset 0 0 18px rgba(255, 255, 255, 0.045),
      0 14px 34px rgba(0, 0, 0, 0.22),
      0 0 14px rgba(54, 255, 105, 0.07) !important;
  }

  .mini-panels article > strong::before,
  .award-icon::before,
  .growth-label::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    background:
      linear-gradient(150deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.05) 28%, transparent 54%),
      radial-gradient(circle at 28% 18%, rgba(255, 255, 255, 0.18), transparent 26%);
    pointer-events: none;
    z-index: 0;
  }

  .growth-label > span {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 560px) {
    .hero-main-title .hero-title-line {
      display: block;
      white-space: nowrap;
      font-size: 1em;
      line-height: .98;
    }

    .hero-main-title .hero-title-line-two {
      margin-top: 2px;
    }

    .reel-lottie-icon {
      width: 34px !important;
      height: 34px !important;
      transform: scale(1.36) !important;
    }

    .stat-lottie-icon {
      width: 68px !important;
      height: 68px !important;
      transform: scale(1.34) !important;
    }
  }

  @media (max-width: 900px) {
    .growth-card,
    .growth-card.is-visible {
      transform: translateY(0) scale(1) !important;
      animation: none !important;
      filter: none !important;
    }
  }



  @media (max-width: 560px) {
    .stats-panel-section .award-sticker {
      width: 138px !important;
      height: 126px !important;
    }
  }

  @media (max-width: 900px) {
    .growth-card.is-visible .line-haze,
    .growth-card.is-visible .line-glow,
    .growth-card.is-visible .line-main {
      animation-duration: 1.18s !important;
      animation-delay: .08s !important;
      animation-timing-function: cubic-bezier(.5, 0, .16, 1) !important;
    }

    .growth-card.is-visible .line-shine {
      animation-duration: 1.02s !important;
      animation-delay: .12s !important;
      animation-timing-function: cubic-bezier(.5, 0, .16, 1) !important;
    }

    .growth-card.is-visible .line-end-orb,
    .growth-card.is-visible .line-end-core {
      animation-duration: .5s !important;
      animation-delay: 1.14s !important;
    }

    .growth-card.is-visible .growth-pill {
      animation-duration: .9s !important;
      animation-delay: .76s !important;
    }

    .growth-card.is-visible .growth-pill::before {
      animation-duration: .75s !important;
      animation-delay: .96s !important;
    }
  }


  :global(.home-reveal) {
    opacity: 0;
    transform: var(--home-reveal-from, translateY(22px));
    transition:
      opacity .68s ease var(--home-reveal-delay, 0ms),
      transform .68s ease var(--home-reveal-delay, 0ms);
    will-change: opacity, transform;
  }

  :global(.home-reveal.home-reveal-opacity-only) {
    transform: none;
    will-change: opacity;
  }

  :global(.home-reveal.home-visible) {
    opacity: 1;
    transform: var(--home-reveal-to, translateY(0));
  }

  :global(.home-reveal.home-reveal-opacity-only.home-visible) {
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.home-reveal) {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      will-change: auto !important;
    }
  }



  /* Desktop-only Home CTA: uses the current About CTA desktop dimensions, tile system, and visual treatment. */
  .home-desktop-cta {
    display: none;
  }

  @media (min-width: 901px) {
    .stats-panel-section > .launch-card {
      display: none !important;
    }

    .home-desktop-cta {
      position: relative;
      z-index: 2;
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      width: min(1260px, calc(100% + 18px));
      min-height: clamp(184px, 17.2vw, 236px);
      margin: clamp(24px, 2.5vw, 38px) auto 0;
      padding: clamp(24px, 3.1vw, 40px) clamp(34px, 4.6vw, 58px);
      border: 1px solid rgba(233, 216, 255, .18);
      border-radius: clamp(34px, 5.2vw, 76px);
      overflow: hidden;
      isolation: isolate;
      background: #070509;
      box-shadow:
        0 0 0 18px rgba(115, 0, 255, .08),
        0 24px 90px rgba(115, 0, 255, .36);
    }

    .home-desktop-cta::before {
      content: '';
      position: absolute;
      z-index: 0;
      inset: -8%;
      background:
        radial-gradient(ellipse at 4% 50%, rgba(232, 228, 255, .88), rgba(180, 118, 255, .62) 13%, rgba(115, 0, 255, .35) 31%, transparent 46%),
        radial-gradient(ellipse at 15% 50%, rgba(115, 0, 255, .72), transparent 45%),
        linear-gradient(90deg, rgba(115, 0, 255, .55), rgba(115, 0, 255, .12));
      filter: blur(8px);
      pointer-events: none;
    }

    .home-desktop-cta-copy {
      position: relative;
      z-index: 4;
      width: min(560px, 55%);
    }

    .home-desktop-cta-logo {
      display: block;
      width: clamp(52px, 5.2vw, 76px);
      height: auto;
      margin: 0 0 clamp(8px, .8vw, 12px);
    }

    .home-desktop-cta-copy h3 {
      max-width: 600px;
      margin: 0;
      color: #fff;
      font-size: clamp(32px, 3.1vw, 48px);
      font-weight: 800;
      line-height: 1.04;
      letter-spacing: -.058em;
    }

    .home-desktop-cta-button {
      position: absolute;
      z-index: 6;
      right: clamp(42px, 6vw, 76px);
      bottom: clamp(14px, 2.2vw, 28px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 0;
      padding: 14px 26px;
      border: 1px solid rgba(255, 255, 255, .68);
      border-radius: 999px;
      color: #fff;
      background:
        linear-gradient(135deg, rgba(255, 255, 255, .22), rgba(255, 255, 255, .06) 28%, rgba(115, 0, 255, .44) 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, .34),
        inset 0 -18px 34px rgba(115, 0, 255, .22),
        0 14px 38px rgba(0, 0, 0, .34),
        0 0 28px rgba(115, 0, 255, .22);
      text-decoration: none;
      font-weight: 800;
      backdrop-filter: blur(18px) saturate(1.35);
      -webkit-backdrop-filter: blur(18px) saturate(1.35);
      transition: transform .35s ease, background .35s ease, border-color .35s ease;
    }

    .home-desktop-cta-button svg {
      width: 24px;
      height: 24px;
      overflow: visible;
      transition: transform .35s cubic-bezier(.19, 1, .22, 1);
    }

    .home-desktop-cta-button path {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.9;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 26;
      stroke-dashoffset: 0;
      transition: stroke-dashoffset .45s ease;
    }

    .home-desktop-cta-button:hover {
      transform: translate(2px, -2px);
      border-color: rgba(255, 255, 255, .88);
      background:
        linear-gradient(135deg, rgba(255, 255, 255, .28), rgba(255, 255, 255, .08) 28%, rgba(115, 0, 255, .56) 100%);
    }

    .home-desktop-cta-button:hover svg {
      transform: translate(4px, 4px);
    }

    .home-desktop-cta-button:hover path {
      animation: arrowDraw .65s cubic-bezier(.19, 1, .22, 1);
    }

    .home-desktop-cta-tiles {
      position: absolute;
      z-index: 2;
      top: 0;
      right: auto;
      bottom: 0;
      left: calc(50% - clamp(54px, 4.5vw, 68px));
      width: min(566px, 47.55vw);
      transform: scale(.95);
      transform-origin: center right;
      pointer-events: none;
    }

    .home-desktop-cta-tile {
      position: absolute;
      width: clamp(74px, 8.2vw, 118px);
      height: clamp(108px, 11vw, 154px);
      margin: 0;
      overflow: hidden;
      border: 1.4px solid rgba(202, 158, 255, .20);
      border-radius: clamp(16px, 1.75vw, 24px);
      background: rgba(169, 87, 255, .24);
      box-shadow: 0 14px 38px rgba(2, 0, 4, .54);
      transform: matrix(.999014, -.0444006, .406138, .913812, 0, 0);
    }

    .home-desktop-cta-tile::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(255, 255, 255, .055), rgba(6, 2, 10, .06));
      mix-blend-mode: normal;
      pointer-events: none;
    }

    .home-desktop-cta-tile img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      filter: saturate(1.2) contrast(1.08) brightness(1.04);
    }

    .home-desktop-cta-tile-1 { left: 24%; top: 7%; background: linear-gradient(180deg, #3F1170, #7400ED); }
    .home-desktop-cta-tile-2 { left: 51%; top: 7%; background: linear-gradient(180deg, rgba(148, 64, 237, 0), #3F1170); }
    .home-desktop-cta-tile-3 {
      left: calc(100% - clamp(158px, 12vw, 184px));
      top: 7%;
      background: #06020A;
    }
    .home-desktop-cta-tile-3::after {
      background: linear-gradient(180deg, rgba(255, 255, 255, .025), rgba(6, 2, 10, .30));
      mix-blend-mode: normal;
    }
    .home-desktop-cta-tile-3 img {
      filter: saturate(1.02) contrast(1.08) brightness(1.03);
    }
    .home-desktop-cta-tile-4 { left: 24%; top: 55%; background: #06020A; }
    .home-desktop-cta-tile-5 { left: 51%; top: 55%; background: linear-gradient(180deg, #06020A, #3F1170); }
    .home-desktop-cta-tile-6 {
      left: calc(100% - clamp(158px, 12vw, 184px));
      top: 55%;
      background: rgba(169, 87, 255, .24);
      opacity: .72;
    }
    .home-desktop-cta-tile-7 {
      left: 0;
      top: 31%;
      background: rgba(169, 87, 255, .24);
      opacity: .72;
    }
  }

</style>
