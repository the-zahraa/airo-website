<script>
  import './styles/AboutPage.css';
  import { onMount } from 'svelte';
  import { featureRows, team } from './data/aboutData.js';
  import heroGameplayCardSvg from './assets/hero-art/hero-gameplay-card.svg?raw';
  import heroNeerSvg from './assets/hero-art/hero-neer.svg?raw';
  import heroHighEngagementNeerSvg from './assets/hero-art/hero-high-engagement-neer.svg?raw';
  import heroLongRetentionNeerSvg from './assets/hero-art/hero-long-retention-neer.svg?raw';
  import heroProvenBrandNeerSvg from './assets/hero-art/hero-proven-brand-neer.svg?raw';
  import heroThirdShadowCardSvg from './assets/hero-art/hero-third-shadow-card.svg?raw';
  import heroFirstShadowCardSvg from './assets/hero-art/hero-first-shadow-card.svg?raw';
  import heroHighEngagementCardSvg from './assets/hero-art/hero-high-engagement-card.svg?raw';
  import heroLongRetentionCardSvg from './assets/hero-art/hero-long-retention-card.svg?raw';
  import heroProvenBrandCardSvg from './assets/hero-art/hero-proven-brand-card.svg?raw';
  import heroRestCardsSvg from './assets/hero-art/hero-rest-cards.svg?raw';

  import rowOneSvg from './assets/what-we-do-1.svg?raw';

  const ctaTiles = [
    '/top-hits/A2.jpeg',
    '/top-hits/A3.png',
    '/top-hits/A4.avif',
    '/top-hits/A5.avif',
    '/top-hits/A6.avif',
    '/top-hits/A7.webp',
    '/top-hits/A8.avif'
  ];

  const updateMax = 75;
  let updateProgress = 0;
  let chartProgress = 0;
  let mobileHeroCardsReady = false;
  let showDesktopHeroArt = typeof window === 'undefined'
    ? true
    : window.matchMedia('(min-width: 681px)').matches;

  const chartItems = [
    { label: '18k', value: 18, suffix: 'k', height: 44 },
    { label: '90k', value: 90, suffix: 'k', height: 62 },
    { label: '471k', value: 471, suffix: 'k', height: 83 },
    { label: '18m', value: 18, suffix: 'm', height: 106 },
    { label: '+45m', value: 45, suffix: 'm', prefix: '+', height: 156 }
  ];

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function barProgress(index, progress) {
    const offset = index * 0.105;
    return clamp((progress - offset) / (1 - offset));
  }

  function chartValue(item, index, progress) {
    const p = barProgress(index, progress);
    return `${item.prefix ?? ''}${Math.round(item.value * p)}${item.suffix}`;
  }

  function displayFeatureTitle(title) {
    return title === 'ROBLOX GAME DEVELOPMENT' ? 'Roblox Game Development' : title;
  }

  let mobileHeroStickerModulePromise;

  function getMobileHeroStickerModule() {
    if (!mobileHeroStickerModulePromise) {
      mobileHeroStickerModulePromise = import('lottie-web').then((module) => module.default || module);
    }

    return mobileHeroStickerModulePromise;
  }

  function mobileHeroSticker(node, path) {
    let animation;
    let destroyed = false;
    let version = 0;
    let loadedPath = '';
    const mobileQuery = typeof window === 'undefined' ? null : window.matchMedia('(max-width: 680px)');

    async function load(nextPath) {
      if (destroyed || !node.isConnected || (mobileQuery && !mobileQuery.matches)) return;
      if (animation && loadedPath === nextPath) return;

      const currentVersion = ++version;
      node.innerHTML = '';

      try {
        animation?.destroy?.();
      } catch (error) {
        // Ignore stale animation cleanup errors during route changes.
      }

      animation = null;
      loadedPath = '';

      try {
        const lottie = await getMobileHeroStickerModule();
        if (destroyed || currentVersion !== version || !node.isConnected || (mobileQuery && !mobileQuery.matches)) return;

        const options = {
          container: node,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
            progressiveLoad: false
          }
        };

        if (/\.tgs$/i.test(nextPath) && typeof DecompressionStream !== 'undefined') {
          try {
            const response = await fetch(nextPath, { cache: 'force-cache' });
            const buffer = await response.arrayBuffer();
            const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));
            const animationData = await new Response(stream).json();

            if (destroyed || currentVersion !== version || !node.isConnected || (mobileQuery && !mobileQuery.matches)) return;

            animation = lottie.loadAnimation({
              ...options,
              animationData
            });
            loadedPath = nextPath;
            return;
          } catch (error) {
            // Fall through to JSON fallback.
          }
        }

        if (destroyed || currentVersion !== version || !node.isConnected || (mobileQuery && !mobileQuery.matches)) return;

        animation = lottie.loadAnimation({
          ...options,
          path: nextPath.replace(/\.tgs$/i, '.json')
        });
        loadedPath = nextPath;
      } catch (error) {
        node.innerHTML = '';
      }
    }

    function unload() {
      version += 1;
      loadedPath = '';
      try {
        animation?.destroy?.();
      } catch (error) {
        // Ignore stale animation cleanup errors during route changes.
      }
      animation = null;
      node.innerHTML = '';
    }

    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) load(path);
      }, { rootMargin: '260px 0px' });

    function handleMobileChange(event) {
      if (event.matches) {
        if (observer) observer.observe(node);
        else load(path);
      } else {
        if (observer) observer.unobserve(node);
        unload();
      }
    }

    if (!mobileQuery || mobileQuery.matches) {
      if (observer) observer.observe(node);
      else load(path);
    }

    mobileQuery?.addEventListener?.('change', handleMobileChange);

    return {
      update(nextPath) {
        if (nextPath !== path) {
          path = nextPath;
          loadedPath = '';
          if (!mobileQuery || mobileQuery.matches) load(path);
        }
      },
      destroy() {
        destroyed = true;
        observer?.disconnect();
        mobileQuery?.removeEventListener?.('change', handleMobileChange);
        unload();
      }
    };
  }

  function scrollToWorkForm(event) {
    const target = document.querySelector('#work-with-us, #work-with-us-form, #contact-form, .work-with-us, .contact-form, form');

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#work-with-us');
    }
  }

  function aboutReveal(node, options = 0) {
    if (typeof window === 'undefined') return {};

    const settings = typeof options === 'number' ? { delay: options } : options || {};
    const delay = Number(settings.delay || 0);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    node.style.setProperty('--about-reveal-delay', `${delay}ms`);
    node.classList.add('about-scroll-reveal');

    if (reduce) {
      node.classList.add('about-visible');
      return {};
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('about-visible');
          observer.unobserve(node);
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }

  onMount(() => {
    let frame;
    let mobileHeroCardsRaf;
    let mobileHeroCardsReadyRaf;
    let isAnimatingStats = false;
    const cycle = 5600;
    const desktopHeroQuery = window.matchMedia('(min-width: 681px)');

    function updateDesktopHeroState(event = desktopHeroQuery) {
      showDesktopHeroArt = event.matches;
    }

    function tick(time) {
      const loop = (time % cycle) / cycle;
      const progress = loop < 0.74
        ? easeOutCubic(loop / 0.74)
        : 1 - easeInOutCubic((loop - 0.74) / 0.26);

      updateProgress = Math.round(progress * updateMax);
      chartProgress = progress;
      frame = requestAnimationFrame(tick);
    }

    function startStatsAnimation() {
      if (isAnimatingStats || document.hidden) return;
      isAnimatingStats = true;
      frame = requestAnimationFrame(tick);
    }

    function stopStatsAnimation() {
      isAnimatingStats = false;
      cancelAnimationFrame(frame);
    }

    mobileHeroCardsReady = false;
    mobileHeroCardsRaf = requestAnimationFrame(() => {
      mobileHeroCardsReadyRaf = requestAnimationFrame(() => {
        mobileHeroCardsReady = true;
      });
    });

    updateDesktopHeroState();
    desktopHeroQuery.addEventListener?.('change', updateDesktopHeroState);

    const features = document.querySelector('.about-features');
    const statsObserver = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) startStatsAnimation();
        else stopStatsAnimation();
      }, { rootMargin: '220px 0px' });

    if (features && statsObserver) statsObserver.observe(features);
    else startStatsAnimation();

    function handleVisibilityChange() {
      if (document.hidden) stopStatsAnimation();
      else if (!statsObserver || features?.getBoundingClientRect().top < window.innerHeight + 220) startStatsAnimation();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopStatsAnimation();
      statsObserver?.disconnect();
      desktopHeroQuery.removeEventListener?.('change', updateDesktopHeroState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(mobileHeroCardsRaf);
      cancelAnimationFrame(mobileHeroCardsReadyRaf);
    };
  });

</script>

<div class="about-page">
  <section class="about-hero" aria-label="About Airo hero">
    <div class="hero-light" aria-hidden="true"></div>
    <div class="hero-head">
      <div class="section-kicker hero-kicker" aria-label="About Airo">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <strong>About Airo</strong>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>
      </div>
      <h1>Shaping the<br />Future of play</h1>
    </div>
    <div class={`mobile-hero-card-stack${mobileHeroCardsReady ? ' is-ready' : ''}`} aria-hidden="true">
      <article class="mobile-hero-card mobile-hero-card-one">
        <span>01</span>
        <div class="mobile-hero-sticker" use:mobileHeroSticker={'/stickers/scale.tgs'} aria-hidden="true"></div>
        <strong>Gameplay That Scales</strong>
        <small>Scalable gameplay built for growth, performance, and longevity.</small>
      </article>
      <article class="mobile-hero-card mobile-hero-card-two">
        <span>02</span>
        <div class="mobile-hero-sticker" use:mobileHeroSticker={'/stickers/high.tgs'} aria-hidden="true"></div>
        <strong>High Engagement</strong>
        <small>Experiences that capture attention and drive player interaction.</small>
      </article>
      <article class="mobile-hero-card mobile-hero-card-three">
        <span>03</span>
        <div class="mobile-hero-sticker" use:mobileHeroSticker={'/stickers/term.tgs'} aria-hidden="true"></div>
        <strong>Long Term Retention</strong>
        <small>Systems designed to keep players invested for the long run.</small>
      </article>
      <article class="mobile-hero-card mobile-hero-card-four">
        <span>04</span>
        <div class="mobile-hero-sticker" use:mobileHeroSticker={'/stickers/performance.tgs'} aria-hidden="true"></div>
        <strong>Proven Brand Performance</strong>
        <small>A track record of growth, results, and successful game launches.</small>
      </article>
    </div>
    {#if showDesktopHeroArt}
      <div class="hero-art hero-composition" aria-label="Airo strategy cards and engagement system">
        <div class="hero-rest-cards-svg" aria-hidden="true">
          <div class="hero-rest-cards-base">
            {@html heroRestCardsSvg}
          </div>
          <div class="hero-shadow-near-first-card-svg">
            {@html heroFirstShadowCardSvg}
          </div>
          <div class="hero-shadow-near-third-card-svg">
            {@html heroThirdShadowCardSvg}
          </div>
          <div class="hero-high-engagement-card-svg">
            <div class="hero-high-engagement-neer">{@html heroHighEngagementNeerSvg}</div>
            {@html heroHighEngagementCardSvg}
          </div>
          <div class="hero-long-retention-card-svg">
            <div class="hero-long-retention-neer">{@html heroLongRetentionNeerSvg}</div>
            {@html heroLongRetentionCardSvg}
          </div>
          <div class="hero-proven-brand-card-svg">
            <div class="hero-proven-brand-neer">{@html heroProvenBrandNeerSvg}</div>
            {@html heroProvenBrandCardSvg}
          </div>
        </div>
        <div class="hero-first-card-wrap" aria-hidden="true">
          <div class="hero-first-card-neer">{@html heroNeerSvg}</div>
          <div class="hero-first-card-neer-right">{@html heroNeerSvg}</div>
          <div class="hero-gameplay-svg-card">
            {@html heroGameplayCardSvg}
          </div>
        </div>
      </div>
    {/if}
  </section>

  <section class="about-copy-section reveal-block" use:aboutReveal>
    <div class="section-kicker small" aria-label="What we do">
      <span class="corner corner-tl"></span>
      <span class="corner corner-tr"></span>
      <strong>What we do</strong>
      <span class="corner corner-bl"></span>
      <span class="corner corner-br"></span>
    </div>
    <h2>Built to last by people<br />who actually play them</h2>
    <p>We believe great games don’t chase trends. They are built to last by people who actually play them.</p>
  </section>

  <section class="about-features" aria-label="Airo services">
    {#each featureRows as feature, index}
      <article class="feature-row reveal-block" style={`--delay:${index * 140}ms`} use:aboutReveal={index * 110}>
        <div class="feature-copy">
          <h3>{displayFeatureTitle(feature.title)}</h3>
          <p>{feature.copy}</p>
        </div>

        <div class={`feature-visual svg-feature svg-feature-${index + 1}`} aria-hidden="true">
          {#if index === 0}
            <div class="svg-shell">
              {@html rowOneSvg}
            </div>
          {:else if index === 1}
            <div class="update-widget">
              <div class="update-card">
                <div class="update-title">Game update</div>
                <div class="update-number-row">
                  <svg class="update-sun" viewBox="0 0 32 32" aria-hidden="true">
                    <circle cx="16" cy="16" r="5.8" />
                    <path d="M16 2.7v5.1M16 24.2v5.1M2.7 16h5.1M24.2 16h5.1M6.6 6.6l3.6 3.6M21.8 21.8l3.6 3.6M25.4 6.6l-3.6 3.6M10.2 21.8l-3.6 3.6" />
                  </svg>
                  <strong>{updateProgress}%</strong>
                </div>

                <div class="update-track">
                  <i style={`width:${updateProgress}%`}></i>
                </div>

                <div class="update-bottom">
                  <span>Version 1.443.2</span>
                  <button type="button">More update</button>
                </div>
              </div>
            </div>
          {:else}
            <div class="chart-widget">
              <div class="chart-card">
                <div class="chart-top">
                  <strong>The system stats</strong>
                </div>

                <div class="chart-area">
                  <em>S3</em><em>S2</em><em>S1</em>
                  <b></b><b></b><b></b><b></b>
                  <small>Player</small>
                  <div class="chart-bars">
                    {#each chartItems as item, chartIndex}
                      <div class="chart-column">
                        <span
                          class="chart-number"
                          style={`bottom:${Math.max(18, item.height * barProgress(chartIndex, chartProgress) + 22)}px`}
                        >{chartValue(item, chartIndex, chartProgress)}</span>
                        <i
                          class:hot={chartIndex === chartItems.length - 1}
                          style={`height:${Math.max(4, item.height * barProgress(chartIndex, chartProgress))}px`}
                        ></i>
                        <span class="chart-label">{item.label}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </article>
    {/each}
  </section>

  <section class="team-section reveal-block" use:aboutReveal>
    <div class="section-kicker small" aria-label="Our Team">
      <span class="corner corner-tl"></span>
      <span class="corner corner-tr"></span>
      <strong>Our Team</strong>
      <span class="corner corner-bl"></span>
      <span class="corner corner-br"></span>
    </div>
    <h2>Led by senior leadership</h2>
    <p>Airo’s partnerships are led directly by senior leadership, combining gameplay expertise with hands-on energy to make every experience feel authentic.</p>

    <div class="team-grid">
      {#each team as member, index}
        <article class={`team-card ${member.tone}`} style={`--delay:${index * 90}ms`} use:aboutReveal={index * 95}>
          <span>{member.badge}</span>
          <h3>{member.name}</h3>
          <strong>{member.role}</strong>
          <p>{member.copy}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="about-cta reveal-block" use:aboutReveal>
    <div class="cta-copy">
      <h2><span class="cta-title-keep">Build the next viral experience</span> with us</h2>
      <p>We’re always looking to amplify creators and partners.</p>
    </div>

    <a class="cta-button" href="#work-with-us" on:click={scrollToWorkForm} aria-label="Go to work with us form">
      <span>Get in touch</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6L18 18M18 18H8M18 18V8" />
      </svg>
    </a>

    <div class="cta-tiles" aria-hidden="true">
      {#each ctaTiles as tile, index}
        <figure class={`cta-tile cta-tile-${index + 1}`}>
          <img src={tile} alt="" loading="lazy" />
        </figure>
      {/each}
    </div>

    <article class="about-mobile-launch-card" aria-label="Get in touch with Airo">
      <div>
        <img class="about-mobile-launch-logo" src="/logos/airo.svg" alt="Airo" />
        <h3>Build the next viral<br />experience with us</h3>
        <p>We’re always looking to amplify creators and partners.</p>
      </div>
      <a class="about-mobile-launch-action" href="#work-with-us" on:click={scrollToWorkForm}>
        <span>Get in touch</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17h10V7M17 17 7 7" /></svg>
      </a>
    </article>
  </section>
</div>
