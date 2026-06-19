<script>
  import { onMount, tick as svelteTick } from 'svelte';

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
      window.removeEventListener('pageshow', handleStickerWake);
      window.removeEventListener('focus', handleStickerWake);
      document.removeEventListener('visibilitychange', handleVisibilityWake);
      if (stickerWakeRaf) cancelAnimationFrame(stickerWakeRaf);
      stickerWakeRaf = null;
      if (peakCounterRaf) cancelAnimationFrame(peakCounterRaf);
      if (heroStatsRaf) cancelAnimationFrame(heroStatsRaf);
      if (topHitsScrollRaf) cancelAnimationFrame(topHitsScrollRaf);
      observer?.disconnect();
      statsObserver?.disconnect();
      heroStatsObserver?.disconnect();
      stickerAnimations.forEach((animation) => animation.destroy());
      [...activeStickerHandles].forEach((handle) => handle.destroy?.());
      activeStickerHandles.clear();
      resetStoryVideo();
    };
  });
</script>

<svelte:head>
  <link rel="preload" as="image" href="/hero.png?v=2" fetchpriority="high" type="image/png" />
  <link rel="prefetch" href="/stickers/stats.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/panther-award.json" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/wr.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/pc.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/vg.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/ex.tgs" as="fetch" crossorigin="anonymous" />
  <link rel="prefetch" href="/stickers/pu.tgs" as="fetch" crossorigin="anonymous" />
</svelte:head>

<div class="dot-field dot-field-main"></div>
<div class="dot-field dot-field-lower"></div>
<div class="soft-columns"></div>

<section class="hero-section">
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
              loading={index < 3 ? "eager" : "lazy"}
              fetchpriority={index < 3 ? "high" : "auto"}
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
  <div class="section-title title-with-icon">
    <h2>Meet Airo</h2>
  </div>
  <p class="section-lead">We back overlooked Roblox games and help them grow into something bigger.</p>
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
      preload="metadata"
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
  <h2>Trusted By Teams Worldwide</h2>
  <p>From brand partners to owned content, Airo works across games, studios, and creator-led experiences built to reach players around the world.</p>

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
      <span>Total visits across all our experiences on ROBLOX.</span>
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

  <article class="launch-card">
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

</style>
