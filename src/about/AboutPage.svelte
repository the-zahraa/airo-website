<script>
  import { onMount } from 'svelte';
  import { featureRows, team } from './aboutData.js';
  import rowOneSvgUrl from './what-we-do-1.svg?url';
  import heroGameplayCardUrl from './hero-assets/hero-gameplay-card.svg?url';
  import heroNeerUrl from './hero-assets/hero-neer.svg?url';
  import heroHighEngagementNeerUrl from './hero-assets/hero-high-engagement-neer.svg?url';
  import heroLongRetentionNeerUrl from './hero-assets/hero-long-retention-neer.svg?url';
  import heroProvenBrandNeerUrl from './hero-assets/hero-proven-brand-neer.svg?url';
  import heroThirdShadowCardUrl from './hero-assets/hero-third-shadow-card.svg?url';
  import heroFirstShadowCardUrl from './hero-assets/hero-first-shadow-card.svg?url';
  import heroHighEngagementCardUrl from './hero-assets/hero-high-engagement-card.svg?url';
  import heroLongRetentionCardUrl from './hero-assets/hero-long-retention-card.svg?url';
  import heroProvenBrandCardUrl from './hero-assets/hero-proven-brand-card.svg?url';
  import heroRestCardsUrl from './hero-assets/hero-rest-cards.svg?url';

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

  function scrollToWorkForm(event) {
    const target = document.querySelector('#work-with-us, #work-with-us-form, #contact-form, .work-with-us, .contact-form, form');

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#work-with-us');
    }
  }


  async function fetchInlineSvg(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load SVG asset: ${url}`);
    }

    return response.text();
  }

  async function loadInlineSvgAssets() {
    const results = await Promise.allSettled([
      fetchInlineSvg(rowOneSvgUrl),
      fetchInlineSvg(heroGameplayCardUrl),
      fetchInlineSvg(heroNeerUrl),
      fetchInlineSvg(heroHighEngagementNeerUrl),
      fetchInlineSvg(heroLongRetentionNeerUrl),
      fetchInlineSvg(heroProvenBrandNeerUrl),
      fetchInlineSvg(heroThirdShadowCardUrl),
      fetchInlineSvg(heroFirstShadowCardUrl),
      fetchInlineSvg(heroHighEngagementCardUrl),
      fetchInlineSvg(heroLongRetentionCardUrl),
      fetchInlineSvg(heroProvenBrandCardUrl),
      fetchInlineSvg(heroRestCardsUrl)
    ]);

    const assignSvg = (index, assign) => {
      const result = results[index];

      if (result.status === 'fulfilled') {
        assign(result.value);
      } else {
        console.error(result.reason);
      }
    };

    assignSvg(0, (value) => { rowOneSvg = value; });
    assignSvg(1, (value) => { heroGameplayCardSvg = value; });
    assignSvg(2, (value) => { heroNeerSvg = value; });
    assignSvg(3, (value) => { heroHighEngagementNeerSvg = value; });
    assignSvg(4, (value) => { heroLongRetentionNeerSvg = value; });
    assignSvg(5, (value) => { heroProvenBrandNeerSvg = value; });
    assignSvg(6, (value) => { heroThirdShadowCardSvg = value; });
    assignSvg(7, (value) => { heroFirstShadowCardSvg = value; });
    assignSvg(8, (value) => { heroHighEngagementCardSvg = value; });
    assignSvg(9, (value) => { heroLongRetentionCardSvg = value; });
    assignSvg(10, (value) => { heroProvenBrandCardSvg = value; });
    assignSvg(11, (value) => { heroRestCardsSvg = value; });
  }

  onMount(() => {
    loadInlineSvgAssets();
    let frame;
    const cycle = 5600;

    const tick = (time) => {
      const loop = (time % cycle) / cycle;
      const progress = loop < 0.74
        ? easeOutCubic(loop / 0.74)
        : 1 - easeInOutCubic((loop - 0.74) / 0.26);

      updateProgress = Math.round(progress * updateMax);
      chartProgress = progress;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  });

  let rowOneSvg = '';

  let heroGameplayCardSvg = '';

  let heroNeerSvg = '';

  let heroHighEngagementNeerSvg = '';

  let heroLongRetentionNeerSvg = '';

  let heroProvenBrandNeerSvg = '';

  let heroThirdShadowCardSvg = '';

  let heroFirstShadowCardSvg = '';

  let heroHighEngagementCardSvg = '';

  let heroLongRetentionCardSvg = '';


  let heroProvenBrandCardSvg = '';

  let heroRestCardsSvg = '';
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
  </section>

  <section class="about-copy-section reveal-block">
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
      <article class="feature-row reveal-block" style={`--delay:${index * 140}ms`}>
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
                        <label>{item.label}</label>
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

  <section class="team-section reveal-block">
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
        <article class={`team-card ${member.tone}`} style={`--delay:${index * 90}ms`}>
          <span>{member.badge}</span>
          <h3>{member.name}</h3>
          <strong>{member.role}</strong>
          <p>{member.copy}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="about-cta reveal-block">
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
          <img src={tile} alt="" loading="lazy" decoding="async" />
        </figure>
      {/each}
    </div>
  </section>
</div>

<style>
  .about-page {
    position: relative;
    min-height: 100vh;
    padding: 0 clamp(20px, 4vw, 68px) clamp(70px, 8vw, 120px);
    color: #fff;
    background: #030006;
    overflow: hidden;
    isolation: isolate;
  }


  .about-page::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    min-height: 2805px;
    pointer-events: none;
    z-index: 0;
    background-image:
      url("data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%22818%22%20height%3D%22737%22%20viewBox%3D%220%200%20818%20737%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cg%20filter%3D%22url%28%23filter0_f_80_3105%29%22%3E%0A%3Cpath%20d%3D%22M708%20373.83C279.988%20363.17%20-73.6716%20193.502%20-197%20110V627C96.8588%20450.047%20528.774%20384.49%20708%20373.83Z%22%20fill%3D%22%23E8E4FF%22%2F%3E%0A%3C%2Fg%3E%0A%3Cdefs%3E%0A%3Cfilter%20id%3D%22filter0_f_80_3105%22%20x%3D%22-307%22%20y%3D%220%22%20width%3D%221125%22%20height%3D%22737%22%20filterUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%0A%3CfeFlood%20flood-opacity%3D%220%22%20result%3D%22BackgroundImageFix%22%2F%3E%0A%3CfeBlend%20mode%3D%22normal%22%20in%3D%22SourceGraphic%22%20in2%3D%22BackgroundImageFix%22%20result%3D%22shape%22%2F%3E%0A%3CfeGaussianBlur%20stdDeviation%3D%2255%22%20result%3D%22effect1_foregroundBlur_80_3105%22%2F%3E%0A%3C%2Ffilter%3E%0A%3C%2Fdefs%3E%0A%3C%2Fsvg%3E"),
      url("data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%22818%22%20height%3D%22737%22%20viewBox%3D%220%200%20818%20737%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cg%20filter%3D%22url%28%23filter0_f_80_3105%29%22%3E%0A%3Cpath%20d%3D%22M708%20373.83C279.988%20363.17%20-73.6716%20193.502%20-197%20110V627C96.8588%20450.047%20528.774%20384.49%20708%20373.83Z%22%20fill%3D%22%23E8E4FF%22%2F%3E%0A%3C%2Fg%3E%0A%3Cdefs%3E%0A%3Cfilter%20id%3D%22filter0_f_80_3105%22%20x%3D%22-307%22%20y%3D%220%22%20width%3D%221125%22%20height%3D%22737%22%20filterUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%0A%3CfeFlood%20flood-opacity%3D%220%22%20result%3D%22BackgroundImageFix%22%2F%3E%0A%3CfeBlend%20mode%3D%22normal%22%20in%3D%22SourceGraphic%22%20in2%3D%22BackgroundImageFix%22%20result%3D%22shape%22%2F%3E%0A%3CfeGaussianBlur%20stdDeviation%3D%2255%22%20result%3D%22effect1_foregroundBlur_80_3105%22%2F%3E%0A%3C%2Ffilter%3E%0A%3C%2Fdefs%3E%0A%3C%2Fsvg%3E"),
      url("data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%221410%22%20height%3D%221314%22%20viewBox%3D%220%200%201410%201314%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cg%20filter%3D%22url%28%23filter0_f_80_3104%29%22%3E%0A%3Cpath%20d%3D%22M1131.7%20664.388C503.442%20648.76%20-15.6749%20400.011%20-196.702%20277.59V1035.56C234.637%20776.13%20868.621%20680.016%201131.7%20664.388Z%22%20fill%3D%22%23E8E4FF%22%2F%3E%0A%3C%2Fg%3E%0A%3Cdefs%3E%0A%3Cfilter%20id%3D%22filter0_f_80_3104%22%20x%3D%22-474.292%22%20y%3D%220%22%20width%3D%221883.58%22%20height%3D%221313.15%22%20filterUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%0A%3CfeFlood%20flood-opacity%3D%220%22%20result%3D%22BackgroundImageFix%22%2F%3E%0A%3CfeBlend%20mode%3D%22normal%22%20in%3D%22SourceGraphic%22%20in2%3D%22BackgroundImageFix%22%20result%3D%22shape%22%2F%3E%0A%3CfeGaussianBlur%20stdDeviation%3D%22138.795%22%20result%3D%22effect1_foregroundBlur_80_3104%22%2F%3E%0A%3C%2Ffilter%3E%0A%3C%2Fdefs%3E%0A%3C%2Fsvg%3E"),
      url("data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%221410%22%20height%3D%221314%22%20viewBox%3D%220%200%201410%201314%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cg%20filter%3D%22url%28%23filter0_f_80_3104%29%22%3E%0A%3Cpath%20d%3D%22M1131.7%20664.388C503.442%20648.76%20-15.6749%20400.011%20-196.702%20277.59V1035.56C234.637%20776.13%20868.621%20680.016%201131.7%20664.388Z%22%20fill%3D%22%23E8E4FF%22%2F%3E%0A%3C%2Fg%3E%0A%3Cdefs%3E%0A%3Cfilter%20id%3D%22filter0_f_80_3104%22%20x%3D%22-474.292%22%20y%3D%220%22%20width%3D%221883.58%22%20height%3D%221313.15%22%20filterUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%0A%3CfeFlood%20flood-opacity%3D%220%22%20result%3D%22BackgroundImageFix%22%2F%3E%0A%3CfeBlend%20mode%3D%22normal%22%20in%3D%22SourceGraphic%22%20in2%3D%22BackgroundImageFix%22%20result%3D%22shape%22%2F%3E%0A%3CfeGaussianBlur%20stdDeviation%3D%22138.795%22%20result%3D%22effect1_foregroundBlur_80_3104%22%2F%3E%0A%3C%2Ffilter%3E%0A%3C%2Fdefs%3E%0A%3C%2Fsvg%3E"),
      url("data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%221440%22%20height%3D%222805%22%20viewBox%3D%220%200%201440%202805%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cg%20filter%3D%22url%28%23filter0_f_80_3101%29%22%3E%0A%3Cpath%20d%3D%22M256%201081.17C884.254%201096.8%201403.37%201345.55%201584.4%201467.97L1584.4%20710C1153.06%20969.428%20519.075%201065.54%20256%201081.17Z%22%20fill%3D%22%237300FF%22%20fill-opacity%3D%220.4%22%2F%3E%0A%3C%2Fg%3E%0A%3Cg%20filter%3D%22url%28%23filter1_f_80_3101%29%22%3E%0A%3Cpath%20d%3D%22M-1413%20-525C-925.448%20-193.17%20-210.347%20365.73%201292.74%20632.447C2239%20457.959%202914.74%20145.261%203903%20-452.947V2204.72C3415.45%201872.89%202700.34%201313.97%201197.25%201047.26C250.997%201221.75%20-424.745%201534.46%20-1413%202132.67V-525Z%22%20fill%3D%22%237300FF%22%2F%3E%0A%3C%2Fg%3E%0A%3Cdefs%3E%0A%3Cfilter%20id%3D%22filter0_f_80_3101%22%20x%3D%22-291.59%22%20y%3D%22162.41%22%20width%3D%222423.58%22%20height%3D%221853.15%22%20filterUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%0A%3CfeFlood%20flood-opacity%3D%220%22%20result%3D%22BackgroundImageFix%22%2F%3E%0A%3CfeBlend%20mode%3D%22normal%22%20in%3D%22SourceGraphic%22%20in2%3D%22BackgroundImageFix%22%20result%3D%22shape%22%2F%3E%0A%3CfeGaussianBlur%20stdDeviation%3D%22273.795%22%20result%3D%22effect1_foregroundBlur_80_3101%22%2F%3E%0A%3C%2Ffilter%3E%0A%3Cfilter%20id%3D%22filter1_f_80_3101%22%20x%3D%22-2013%22%20y%3D%22-1125%22%20width%3D%226516%22%20height%3D%223929.72%22%20filterUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%0A%3CfeFlood%20flood-opacity%3D%220%22%20result%3D%22BackgroundImageFix%22%2F%3E%0A%3CfeBlend%20mode%3D%22normal%22%20in%3D%22SourceGraphic%22%20in2%3D%22BackgroundImageFix%22%20result%3D%22shape%22%2F%3E%0A%3CfeGaussianBlur%20stdDeviation%3D%22300%22%20result%3D%22effect1_foregroundBlur_80_3101%22%2F%3E%0A%3C%2Ffilter%3E%0A%3C%2Fdefs%3E%0A%3C%2Fsvg%3E"),
      linear-gradient(180deg, rgba(115, 0, 255, .20) 0%, rgba(115, 0, 255, .16) 36%, rgba(115, 0, 255, .07) 64%, rgba(3, 0, 6, 0) 100%);
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat;
    background-position:
      -197px 160px,
      -178px 144px,
      -196.7px 48px,
      -158px 68px,
      center top,
      center top;
    background-size:
      818px 737px,
      854px 770px,
      1410px 1314px,
      1468px 1368px,
      max(1440px, 100vw) auto,
      100% 100%;
    opacity: 1;
  }

  .about-page::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background-image: radial-gradient(circle, rgba(160, 94, 255, .22) 1px, transparent 1.35px);
    background-size: 28px 28px;
    opacity: .42;
    mask-image: linear-gradient(to bottom, #000 0%, rgba(0,0,0,.7) 44%, rgba(0,0,0,.3) 76%, transparent 100%);
  }

  .about-hero {
    position: relative;
    z-index: 2;
    min-height: clamp(640px, 70vw, 1040px);
    display: grid;
    align-content: start;
    margin-inline: calc(-1 * clamp(20px, 4vw, 68px));
    padding-inline: clamp(20px, 4vw, 68px);
    padding-top: clamp(54px, 6.8vw, 104px);
    overflow: visible;
    background: transparent;
  }

  .about-hero::before,
  .about-hero::after {
    content: none;
  }

  .hero-light {
    display: none;
  }

  .hero-head {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .section-kicker {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: rgba(255,255,255,.82);
    font-size: clamp(11px, .9vw, 14px);
    letter-spacing: -.02em;
  }

  .section-kicker span {
    width: 7px;
    height: 7px;
    border-left: 1px solid rgba(255,255,255,.7);
    border-top: 1px solid rgba(255,255,255,.7);
  }

  .section-kicker span:last-child { transform: rotate(180deg); }

  .hero-head h1 {
    margin: 18px 0 0;
    font-size: clamp(48px, 6.6vw, 94px);
    line-height: 1.03;
    letter-spacing: -.06em;
    font-weight: 900;
    text-shadow: 0 12px 52px rgba(0,0,0,.35);
  }

  .hero-art {
    position: relative;
    z-index: 2;
    display: block;
    width: min(1160px, 116vw);
    height: clamp(520px, 52vw, 760px);
    max-width: none;
    margin: clamp(-30px, -2.4vw, -16px) auto 0;
    transform: translateX(-1.5%);
    filter: drop-shadow(0 34px 90px rgba(115,0,255,.34));
    animation: heroFloat 7s ease-in-out infinite alternate;
  }

  .hero-composition {
    overflow: visible;
    pointer-events: none;
  }

  .hero-first-card-wrap {
    --hero-card-scale: clamp(.72, 26vw, 1);
    position: absolute;
    left: clamp(-22px, 3.4vw, 34px);
    top: clamp(130px, 16vw, 204px);
    width: 347px;
    height: 347px;
    transform-origin: top left;
    transform: scale(var(--hero-card-scale));
    z-index: 3;
  }

  .hero-rest-cards-svg {
    --hero-card-scale: clamp(.72, 26vw, 1);
    position: absolute;
    left: clamp(-22px, 3.4vw, 34px);
    top: clamp(130px, 16vw, 204px);
    width: 1248px;
    height: 520px;
    transform-origin: top left;
    transform: scale(var(--hero-card-scale));
    pointer-events: none;
    z-index: 2;
    overflow: visible;
  }

  .hero-rest-cards-base {
    position: relative;
    z-index: 1;
    width: 1248px;
    height: 520px;
  }

  .hero-rest-cards-base :global(svg) {
    display: block;
    width: 1248px;
    height: 520px;
    overflow: visible;
  }

  .hero-rest-cards-base :global(svg > foreignObject:first-child),
  .hero-rest-cards-base :global(svg > foreignObject:first-child + g),
  .hero-rest-cards-base :global(svg > foreignObject:nth-of-type(2)),
  .hero-rest-cards-base :global(svg > foreignObject:nth-of-type(2) + g),
  .hero-rest-cards-base :global(svg > foreignObject:nth-of-type(3)),
  .hero-rest-cards-base :global(svg > foreignObject:nth-of-type(3) + g) {
    opacity: 0;
  }

  .hero-shadow-near-first-card-svg {
    position: absolute;
    left: -82px;
    top: -118px;
    width: 335px;
    height: 335px;
    pointer-events: none;
    z-index: 1;
    isolation: isolate;
  }

  .hero-shadow-near-first-card-svg :global(svg) {
    display: block;
    width: 335px;
    height: 335px;
    overflow: visible;
  }

  .hero-shadow-near-third-card-svg {
    position: absolute;
    left: 567px;
    top: -174px;
    width: 332px;
    height: 329px;
    pointer-events: none;
    z-index: 1;
    isolation: isolate;
  }

  .hero-shadow-near-third-card-svg :global(svg) {
    display: block;
    width: 332px;
    height: 329px;
    overflow: visible;
  }

  .hero-high-engagement-card-svg {
    position: absolute;
    left: 169.53px;
    top: -99.3px;
    width: 499px;
    height: 500px;
    pointer-events: none;
    z-index: 4;
    isolation: isolate;
  }

  .hero-high-engagement-neer {
    position: absolute;
    left: 156px;
    top: -98px;
    width: 421px;
    height: 387px;
    pointer-events: none;
    z-index: 2;
    opacity: .42;
    mix-blend-mode: plus-lighter;
  }

  .hero-high-engagement-neer :global(svg) {
    display: block;
    width: 421px;
    height: 387px;
    overflow: visible;
  }

  .hero-high-engagement-card-svg :global(svg) {
    position: relative;
    z-index: 1;
    display: block;
    width: 499px;
    height: 500px;
    overflow: visible;
  }

  .hero-long-retention-card-svg {
    position: absolute;
    left: 514.81px;
    top: 21.1px;
    width: 417px;
    height: 420px;
    pointer-events: none;
    z-index: 3;
    isolation: isolate;
  }

  .hero-long-retention-neer {
    position: absolute;
    left: 38px;
    top: -9px;
    width: 416px;
    height: 416px;
    pointer-events: none;
    z-index: 2;
    opacity: .42;
    mix-blend-mode: plus-lighter;
  }

  .hero-long-retention-neer :global(svg) {
    display: block;
    width: 416px;
    height: 416px;
    overflow: visible;
  }

  .hero-long-retention-card-svg :global(svg) {
    position: relative;
    z-index: 1;
    display: block;
    width: 417px;
    height: 420px;
    overflow: visible;
  }

  .hero-proven-brand-card-svg {
    position: absolute;
    left: 786.86px;
    top: -95.32px;
    width: 454px;
    height: 460px;
    pointer-events: none;
    z-index: 4;
    isolation: isolate;
  }

  .hero-proven-brand-neer {
    position: absolute;
    left: 75px;
    top: -80px;
    width: 416px;
    height: 345px;
    pointer-events: none;
    z-index: 2;
    opacity: .42;
    mix-blend-mode: plus-lighter;
  }

  .hero-proven-brand-neer :global(svg) {
    display: block;
    width: 416px;
    height: 345px;
    overflow: visible;
  }

  .hero-proven-brand-card-svg :global(svg) {
    position: relative;
    z-index: 1;
    display: block;
    width: 454px;
    height: 460px;
    overflow: visible;
  }

  .hero-first-card-neer,
  .hero-first-card-neer-right {
    position: absolute;
    inset: 0;
    width: 347px;
    height: 347px;
    pointer-events: none;
    z-index: 2;
    opacity: .34;
    mix-blend-mode: plus-lighter;
    overflow: hidden;
    clip-path: polygon(0 13.75%, 86.2% 0, 100% 86.2%, 13.75% 100%);
    clip-path: path('M 42.175 40.962 L 256.884 6.725 C 280.177 3.011 302.070 18.882 305.784 42.175 L 340.021 256.884 C 343.735 280.177 327.863 302.070 304.571 305.784 L 89.862 340.021 C 66.569 343.735 44.676 327.863 40.962 304.571 L 6.725 89.862 C 3.011 66.569 18.882 44.676 42.175 40.962 Z');
  }

  .hero-first-card-neer :global(svg) {
    position: absolute;
    right: -124px;
    bottom: -86px;
    display: block;
    width: 348px;
    height: auto;
    overflow: visible;
  }

  .hero-first-card-neer-right :global(svg) {
    position: absolute;
    right: -112px;
    top: -96px;
    display: block;
    width: 332px;
    height: auto;
    overflow: visible;
  }

  .hero-gameplay-svg-card {
    position: absolute;
    left: 0;
    top: 0;
    width: 347px;
    height: 347px;
    z-index: 1;
    transform-origin: center;
    isolation: isolate;
    overflow: hidden;
    clip-path: polygon(0 13.75%, 86.2% 0, 100% 86.2%, 13.75% 100%);
    clip-path: path('M 42.175 40.962 L 256.884 6.725 C 280.177 3.011 302.070 18.882 305.784 42.175 L 340.021 256.884 C 343.735 280.177 327.863 302.070 304.571 305.784 L 89.862 340.021 C 66.569 343.735 44.676 327.863 40.962 304.571 L 6.725 89.862 C 3.011 66.569 18.882 44.676 42.175 40.962 Z');
    filter: drop-shadow(-6.9081px -6.9081px 34.5405px rgba(12, 1, 24, .30));
  }

  .hero-gameplay-svg-card::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(97.05% 97.05% at 50% 2.95%, rgba(115, 0, 255, 0.62) 0%, rgba(202, 158, 255, 0.28) 100%),
      linear-gradient(141.33deg, rgba(115, 0, 255, 0.58) 13.73%, rgba(115, 0, 255, 0.46) 94.46%);
    box-shadow:
      inset 0 -11.6476px 16.1513px rgba(0, 0, 0, 0.62),
      inset 0 0 21.7421px 3.10602px rgba(216, 255, 134, 0.26),
      inset 0 9.31805px 24.6152px -8.54154px rgba(229, 255, 72, 0.18);
  }

  .hero-gameplay-svg-card::after {
    content: none;
  }

  .hero-gameplay-svg-card :global(svg) {
    position: relative;
    z-index: 1;
    display: block;
    width: 347px;
    height: 347px;
    overflow: visible;
  }

  .about-copy-section,
  .team-section {
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .about-copy-section { margin-top: clamp(-64px, -3.8vw, -26px); }

  .about-copy-section h2,
  .team-section h2 {
    margin: 0;
    font-size: clamp(28px, 3.6vw, 46px);
    line-height: 1.12;
    letter-spacing: -.055em;
    font-weight: 800;
  }

  .about-copy-section p,
  .team-section > p {
    width: min(540px, 92vw);
    margin: 13px auto 0;
    color: rgba(255,255,255,.55);
    font-size: clamp(13px, 1.2vw, 16px);
    line-height: 1.55;
  }

  /* WHAT WE DO / FIGMA ROWS */
  .about-features {
    position: relative;
    z-index: 2;
    width: min(1138px, 100%);
    margin: clamp(36px, 4.8vw, 66px) auto 0;
  }

  .feature-row {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.04fr) minmax(360px, .96fr);
    gap: clamp(38px, 6vw, 92px);
    align-items: center;
    min-height: clamp(210px, 21vw, 300px);
    padding: clamp(32px, 3.8vw, 54px) 0;
    border-bottom: 1px solid rgba(255,255,255,.12);
    isolation: isolate;
  }

  .feature-row::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.16) 12%, rgba(255,255,255,.10) 72%, transparent 100%);
    opacity: .72;
    pointer-events: none;
  }

  .feature-copy {
    position: relative;
    z-index: 2;
  }

  .feature-copy h3 {
    margin: 0;
    max-width: 644px;
    color: #fff;
    font-size: clamp(24px, 2.55vw, 38px);
    line-height: 1.31;
    font-weight: 500;
    letter-spacing: 0;
  }

  .feature-copy p {
    margin: clamp(10px, 1.2vw, 14px) 0 0;
    max-width: 632px;
    color: rgba(255,255,255,.60);
    font-size: clamp(14px, 1.45vw, 21px);
    line-height: 1.59;
    letter-spacing: .06em;
    font-weight: 500;
  }

  .feature-visual {
    position: relative;
    z-index: 1;
    min-height: clamp(180px, 18vw, 270px);
    display: grid;
    place-items: center;
    overflow: visible;
    pointer-events: none;
  }

  .svg-shell {
    position: relative;
    display: grid;
    place-items: center;
    width: min(514px, 100%);
    transform-origin: center;
    will-change: transform;
    filter: drop-shadow(0 18px 42px rgba(115,0,255,.16));
    animation: visualDriftOne 8s cubic-bezier(.45,0,.25,1) infinite alternate;
  }

  .svg-shell :global(svg) {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }

  .svg-shell :global(line),
  .svg-shell :global(path[stroke]) {
    vector-effect: non-scaling-stroke;
  }

  .svg-feature-1 :global(svg > g[opacity="0.2"] line) {
    stroke-dasharray: 6.14 6.14;
    animation: connectorFlow 3.6s linear infinite;
  }

  .svg-feature-1 :global(g[mask] path[stroke]) {
    stroke-dasharray: 360;
    stroke-dashoffset: 360;
    animation: waveDraw 5.8s cubic-bezier(.25,.1,.22,1) infinite;
  }

  .svg-feature-1 :global(circle[r="12.2802"]) {
    transform-box: fill-box;
    transform-origin: center;
    animation: nodeSettle 5.6s ease-in-out infinite;
  }

  .svg-feature-1 :global(circle[r="36.7268"]) {
    transform-box: fill-box;
    transform-origin: center;
    animation: iconPlateFloat 5.2s ease-in-out infinite;
  }

  .svg-feature-1 :global(path[stroke-linecap="round"]) {
    stroke-dasharray: 120;
    stroke-dashoffset: 120;
    animation: iconStrokeDraw 5.4s cubic-bezier(.22,.61,.36,1) infinite;
  }

  .svg-feature-1 :global(g[filter*="filter23"]),
  .svg-feature-1 :global(g[filter*="filter25"]),
  .svg-feature-1 :global(g[filter*="filter27"]) {
    opacity: .58;
    animation: iconHaloBreath 5.4s ease-in-out infinite;
  }

  .update-widget,
  .chart-widget {
    width: min(467px, 98%);
    animation: visualDriftTwo 8.4s cubic-bezier(.45,0,.25,1) infinite alternate;
  }

  .update-card {
    position: relative;
    width: 100%;
    min-height: 272px;
    padding: 44px 46px 34px;
    border-radius: 60px;
    background: rgba(7,5,9,.5);
    border: 1px solid rgba(255,255,255,.12);
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(202,158,255,.08);
  }

  .update-card::before {
    content: '';
    position: absolute;
    right: 13%;
    bottom: 14%;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(115,0,255,.55), transparent 68%);
    filter: blur(16px);
    opacity: .62;
  }

  .update-title,
  .update-number-row,
  .update-track,
  .update-bottom {
    position: relative;
    z-index: 2;
  }

  .update-title {
    font-weight: 500;
    font-size: clamp(19px, 2.05vw, 25px);
    line-height: 1.3;
  }

  .update-number-row {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    margin-top: 8px;
  }

  .update-number-row strong {
    display: block;
    min-width: 68px;
    color: #fff;
    font-size: clamp(28px, 2.8vw, 33px);
    line-height: 1.22;
    font-weight: 600;
    text-shadow: none;
  }

  .update-sun {
    width: 26px;
    height: 26px;
    overflow: visible;
    filter: drop-shadow(0 0 12px rgba(154,53,255,.82));
    animation: sunSpin 5.6s linear infinite;
  }

  .update-sun circle,
  .update-sun path {
    fill: none;
    stroke: #fff;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: .95;
    animation: sunPulse 2.8s ease-in-out infinite;
  }

  .update-track {
    width: 100%;
    height: 20px;
    margin-top: 22px;
    border-radius: 999px;
    background: rgba(7,5,9,.55);
    border: 1px solid rgba(255,255,255,.1);
    overflow: hidden;
  }

  .update-track i {
    display: block;
    height: 100%;
    width: 0;
    border-radius: inherit;
    background: linear-gradient(90deg, #9A35FF, #7F00FF);
    box-shadow: 0 0 18px rgba(127,0,255,.8);
  }

  .update-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 42px;
  }

  .update-bottom span {
    padding: 4px 15px;
    border-radius: 999px;
    background: rgba(115,0,255,.36);
    color: rgba(255,255,255,.9);
    font-size: 10px;
    letter-spacing: .06em;
  }

  .update-bottom button {
    position: relative;
    padding: 12px 27px;
    border: 0;
    border-radius: 999px;
    color: #fff;
    background: rgba(7,5,9,.62);
    font: inherit;
    font-size: 12px;
    overflow: visible;
  }

  .update-bottom button i {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #fff;
    opacity: 0;
    animation: updatePop 5.6s ease-in-out infinite;
  }

  .update-bottom button i:nth-child(1) { transform: translate(18px,-20px); animation-delay: .12s; }
  .update-bottom button i:nth-child(2) { transform: translate(30px,2px); animation-delay: .22s; }
  .update-bottom button i:nth-child(3) { transform: translate(12px,18px); animation-delay: .32s; }

  .chart-widget { width: min(450px, 96%); animation-name: visualDriftThree; }

  .chart-card {
    position: relative;
    width: 100%;
    min-height: 232px;
    padding: 0 0 12px;
    color: #ffeeff;
  }

  .chart-card::before {
    content: '';
    position: absolute;
    right: 5%;
    top: 8%;
    width: 82px;
    height: 168px;
    background: linear-gradient(180deg,#7300FF,transparent 129%);
    filter: blur(10px);
    opacity: .74;
  }

  .chart-top {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 22px;
  }

  .chart-top strong {
    color: #ffeeff;
    font-size: clamp(19px, 2vw, 24px);
    font-weight: 700;
  }

  .chart-top span {
    padding: 7px 16px;
    border-radius: 999px;
    background: rgba(7,5,9,.55);
    color: rgba(255,255,255,.92);
    font-size: 10px;
  }

  .chart-area {
    --chart-start: 72px;
    position: relative;
    height: 190px;
    padding-left: 46px;
  }

  .chart-area > b {
    position: absolute;
    left: var(--chart-start);
    right: 0;
    height: 1px;
    border-top: 1px solid rgba(255,238,255,.08);
  }

  .chart-area > b:nth-of-type(1) { bottom: 0; border-color: rgba(255,238,255,.16); }
  .chart-area > b:nth-of-type(2) { bottom: 76px; }
  .chart-area > b:nth-of-type(3) { bottom: 120px; }
  .chart-area > b:nth-of-type(4) { bottom: 164px; }

  .chart-area > em {
    position: absolute;
    left: 0;
    color: #ffeeff;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
  }

  .chart-area > em:nth-of-type(1) { bottom: 150px; }
  .chart-area > em:nth-of-type(2) { bottom: 106px; }
  .chart-area > em:nth-of-type(3) { bottom: 62px; }

  .chart-area > small {
    position: absolute;
    left: 0;
    bottom: 20px;
    color: #fff;
    font-size: 12px;
  }

  .chart-bars {
    position: absolute;
    left: var(--chart-start);
    right: 26px;
    bottom: 0;
    height: 178px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .chart-column {
    position: relative;
    width: 34px;
    height: 178px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .chart-column i {
    display: block;
    width: 30px;
    min-height: 4px;
    border-radius: 8px 8px 0 0;
    background: rgba(107,0,237,.55);
    box-shadow: 0 0 12px rgba(115,0,255,.25);
  }

  .chart-column i.hot {
    background: #7300FF;
    box-shadow: 0 0 18px rgba(115,0,255,.85);
  }

  .chart-number {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,.94);
    font-size: 10px;
    line-height: 1;
    white-space: nowrap;
    transition: none;
  }

  .chart-column label {
    display: none;
    position: absolute;
    left: 50%;
    bottom: -20px;
    transform: translateX(-50%);
    color: rgba(255,255,255,.78);
    font-size: 10px;
    white-space: nowrap;
  }

  .team-section {
    margin: clamp(54px,6.4vw,92px) auto 0;
    width: min(1120px,100%);
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 18px;
    margin-top: 42px;
  }

  .team-card {
    --side-core: #7300ff;
    --side-mid: #a35dff;
    --side-hot: #f0dcff;
    position: relative;
    min-height: clamp(250px, 23vw, 350px);
    padding: clamp(120px, 11.6vw, 178px) clamp(16px, 1.45vw, 24px) clamp(22px, 1.9vw, 30px);
    border-radius: clamp(28px, 3vw, 42px);
    text-align: left;
    background: #070509;
    border: 1.35px solid rgba(196,169,235,.42);
    overflow: visible;
    isolation: isolate;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.026), 0 14px 42px rgba(0,0,0,.32);
  }

  .team-card::before,
  .team-card::after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 11%;
    width: 10px;
    height: 74%;
    border-radius: 999px;
    pointer-events: none;
    opacity: .24;
    background:
      linear-gradient(180deg, transparent 0%, var(--side-hot) 19%, var(--side-hot) 81%, transparent 100%) center / 5px 67% no-repeat,
      linear-gradient(180deg, transparent 0%, var(--side-mid) 14%, var(--side-mid) 86%, transparent 100%) center / 7px 77% no-repeat,
      linear-gradient(180deg, transparent 0%, var(--side-core) 9%, var(--side-core) 91%, transparent 100%) center / 10px 100% no-repeat;
    filter: blur(3.6px);
    transform: translateZ(0) scaleY(.96);
    animation: teamSideGlow 6.2s ease-in-out infinite alternate;
  }

  .team-card::before { left: -3px; }
  .team-card::after { right: -3px; animation-delay: .55s; }

  .team-card:nth-child(odd),
  .team-card.gold {
    --side-core: #ffae00;
    --side-mid: #f9dc8b;
    --side-hot: #fff8e4;
    border-color: rgba(255,210,119,.36);
  }

  .team-card span {
    position: relative;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: clamp(104px, 10.7vw, 154px);
    min-height: clamp(19px, 1.65vw, 24px);
    padding: 0 clamp(12px, 1vw, 16px);
    border-radius: 999px;
    background: rgba(42,0,88,.76);
    color: #fff;
    font-size: clamp(8.5px, .72vw, 11px);
    line-height: 1;
    letter-spacing: .055em;
    font-weight: 800;
    overflow: hidden;
    box-shadow: inset 0 0 0 5px rgba(115,0,255,.82), 0 0 16px rgba(115,0,255,.22);
    white-space: nowrap;
    text-shadow: 0 1px 8px rgba(0,0,0,.65);
  }

  .team-card.gold span,
  .team-card:nth-child(odd) span {
    background: rgba(70,45,0,.78);
    color: #fff;
    box-shadow: inset 0 0 0 5px rgba(255,174,0,.86), 0 0 16px rgba(255,174,0,.18);
  }

  .team-card h3 {
    position: relative;
    z-index: 2;
    margin: clamp(18px, 2vw, 28px) 0 4px;
    font-size: clamp(18px, 1.55vw, 23px);
    line-height: 1.1;
    letter-spacing: .055em;
    font-weight: 800;
    color: rgba(255,255,255,.99);
    text-shadow: 0 0 14px rgba(255,255,255,.10);
  }

  .team-card strong { display: none; }

  .team-card p {
    position: relative;
    z-index: 2;
    margin: clamp(14px, 1.35vw, 20px) 0 0;
    font-size: clamp(11px, .96vw, 14px);
    line-height: 1.72;
    letter-spacing: .055em;
    font-weight: 600;
    color: rgba(255,255,255,.70);
    text-shadow: 0 0 12px rgba(255,255,255,.06);
  }

  .about-cta {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    width: min(1260px, calc(100% + 18px));
    min-height: clamp(218px, 21vw, 290px);
    margin: clamp(56px,7vw,96px) auto 0;
    padding: clamp(32px, 4.2vw, 54px) clamp(40px, 6.4vw, 78px);
    border-radius: clamp(42px, 6.8vw, 100px);
    background: #070509;
    overflow: hidden;
    border: 1px solid rgba(233,216,255,.18);
    box-shadow: 0 0 0 18px rgba(115,0,255,.08), 0 24px 90px rgba(115,0,255,.36);
  }

  .about-cta::before {
    content: '';
    position: absolute;
    inset: -8%;
    background:
      radial-gradient(ellipse at 4% 50%, rgba(232,228,255,.88), rgba(180,118,255,.62) 13%, rgba(115,0,255,.35) 31%, transparent 46%),
      radial-gradient(ellipse at 15% 50%, rgba(115,0,255,.72), transparent 45%),
      linear-gradient(90deg, rgba(115,0,255,.55), rgba(115,0,255,.12));
    filter: blur(8px);
  }

  .about-cta::after {
    content: '';
    position: absolute;
    inset: 20px;
    border-radius: inherit;
    border: 1px solid rgba(255,255,255,.08);
    pointer-events: none;
  }

  .cta-copy {
    position: relative;
    z-index: 4;
    width: min(390px, 48%);
  }

  .about-cta h2 {
    margin: 0;
    font-size: clamp(26px, 3vw, 46px);
    line-height: 1.18;
    letter-spacing: -.045em;
  }

  .about-cta p {
    margin: 18px 0 0;
    color: rgba(255,255,255,.82);
    font-size: clamp(14px, 1.35vw, 20px);
    line-height: 1.35;
  }

  .cta-button {
    z-index: 6;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    position: absolute;
    right: clamp(42px, 6vw, 76px);
    bottom: clamp(14px, 2.2vw, 28px);
    margin: 0;
    transform: none;
    padding: 14px 26px;
    border-radius: 999px;
    background: rgba(115,0,255,.35);
    border: 1px solid rgba(246,242,255,.55);
    font-weight: 800;
    color: #fff;
    text-decoration: none;
    box-shadow: inset 0 0 24px rgba(255,255,255,.08), 0 8px 28px rgba(0,0,0,.26);
    transition: transform .35s ease, background .35s ease, border-color .35s ease;
  }

  .cta-button svg {
    width: 24px;
    height: 24px;
    overflow: visible;
    transition: transform .35s cubic-bezier(.19,1,.22,1);
  }

  .cta-button path {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 26;
    stroke-dashoffset: 0;
    transition: stroke-dashoffset .45s ease;
  }

  .cta-button:hover {
    transform: translate(2px,-2px);
    background: rgba(115,0,255,.52);
    border-color: rgba(255,255,255,.86);
  }

  .cta-button:hover svg { transform: translate(4px,4px); }
  .cta-button:hover path { animation: arrowDraw .65s cubic-bezier(.19,1,.22,1); }

  .cta-tiles {
    position: absolute;
    z-index: 2;
    inset: 0;
    left: 43%;
    pointer-events: none;
  }

  .cta-tile {
    position: absolute;
    width: clamp(96px, 12vw, 173px);
    height: clamp(140px, 17.4vw, 252px);
    margin: 0;
    border-radius: clamp(22px, 2.4vw, 33px);
    overflow: hidden;
    background: rgba(169,87,255,.24);
    border: 2px solid rgba(202,158,255,.20);
    box-shadow: 0 24px 80px #020004;
    transform: matrix(0.999014,-0.0444006,0.406138,0.913812,0,0);
  }

  .cta-tile::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(115,0,255,.12), rgba(6,2,10,.26));
    mix-blend-mode: screen;
  }

  .cta-tile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: .72;
    filter: saturate(1.08) contrast(1.05);
  }

  .cta-tile-1 { left: 16%; top: -13%; background: linear-gradient(180deg,#3F1170,#7400ED); }
  .cta-tile-2 { left: 38%; top: -13%; background: linear-gradient(180deg,rgba(148,64,237,0),#3F1170); }
  .cta-tile-3 { left: 60%; top: -13%; background: #7D00FF; }
  .cta-tile-4 { left: 84%; top: -13%; background: #06020A; }
  .cta-tile-5 { left: -12%; top: 33%; background: linear-gradient(180deg,#06020A,#3F1170); }
  .cta-tile-6 { left: 20%; top: 51%; background: rgba(169,87,255,.24); opacity: .72; }
  .cta-tile-7 { left: 47%; top: 51%; background: rgba(169,87,255,.24); opacity: .72; }

  .reveal-block {
    animation: revealUp .8s both;
    animation-delay: var(--delay,0ms);
  }

  @keyframes teamSideGlow {
    from { opacity: .18; transform: translateZ(0) scaleY(.92); }
    to { opacity: .30; transform: translateZ(0) scaleY(1); }
  }

  @keyframes revealUp {
    from { opacity: 0; transform: translateY(28px); filter: blur(5px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  @keyframes heroArtFloat {
    to { transform: translateX(-1.5%) translateY(-10px); }
  }

  @keyframes heroCardFloat {
    to { translate: 0 -12px; }
  }

  @keyframes ringBreath {
    to { transform: translateX(-50%) translateY(-10px) scale(1.02); filter: drop-shadow(0 0 70px rgba(115,0,255,.72)); }
  }

  @keyframes orbitFloat {
    to { translate: 0 -8px; }
  }

  @keyframes heroFloat { to { transform: translateX(-1.5%) translateY(-12px); } }
  @keyframes visualDriftOne { to { transform: translate3d(0,-7px,0) rotate(-1deg); } }
  @keyframes visualDriftTwo { to { transform: translate3d(0,-6px,0) rotate(.5deg); } }
  @keyframes visualDriftThree { to { transform: translate3d(0,-6px,0) rotate(-.45deg); } }
  @keyframes connectorFlow { to { stroke-dashoffset: -24.56; } }

  @keyframes waveDraw {
    0% { stroke-dashoffset: 360; opacity: .36; }
    32%, 68% { stroke-dashoffset: 0; opacity: .95; }
    100% { stroke-dashoffset: -360; opacity: .42; }
  }

  @keyframes nodeSettle {
    0%, 100% { transform: translateY(0) scale(1); opacity: .55; }
    45% { transform: translateY(-3px) scale(1.02); opacity: .78; }
  }

  @keyframes iconPlateFloat {
    0%,100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-4px) scale(1.025); }
  }

  @keyframes iconStrokeDraw {
    0% { stroke-dashoffset: 120; opacity: .55; }
    34%, 74% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: -120; opacity: .58; }
  }

  @keyframes iconHaloBreath {
    0%,100% { opacity: .46; }
    50% { opacity: .72; }
  }

  @keyframes sunSpin {
    to { transform: rotate(360deg); }
  }

  @keyframes sunPulse {
    0%,100% { opacity: .78; filter: drop-shadow(0 0 8px rgba(154,53,255,.58)); }
    50% { opacity: 1; filter: drop-shadow(0 0 18px rgba(154,53,255,.95)); }
  }

  @keyframes sunDraw {
    0% { stroke-dashoffset: 90; opacity: .55; }
    34%, 74% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: -90; opacity: .6; }
  }

  @keyframes updatePop {
    0%, 66%, 100% { opacity: 0; scale: .5; }
    72% { opacity: .88; scale: 1; }
    88% { opacity: 0; scale: 0; translate: 18px -18px; }
  }

  @keyframes arrowDraw {
    0% { stroke-dashoffset: 26; }
    100% { stroke-dashoffset: 0; }
  }

  @media (max-width: 1180px) {
    .feature-row {
      grid-template-columns: minmax(0, .98fr) minmax(330px, .86fr);
      gap: clamp(28px, 4vw, 56px);
    }
  }

  @media (max-width: 900px) {
    .about-page { padding-inline: 18px; }
    .about-hero {
      min-height: clamp(560px,130vw,820px);
      margin-inline: -18px;
      padding-inline: 18px;
    }
    .hero-art { width: min(920px,162vw); }
    .about-copy-section { margin-top: -40px; }

    .about-features {
      width: min(760px, 100%);
      margin-top: 34px;
    }

    .feature-row {
      grid-template-columns: minmax(0, 1fr) minmax(170px, 42%);
      gap: clamp(12px, 3.2vw, 24px);
      min-height: clamp(156px, 36vw, 220px);
      padding: clamp(28px, 6vw, 42px) 0;
      align-items: center;
    }

    .feature-copy { text-align: left; }

    .feature-copy h3 {
      font-size: clamp(16px, 4.15vw, 24px);
      line-height: 1.32;
      letter-spacing: -.015em;
    }

    .feature-copy p {
      max-width: 330px;
      margin-top: 7px;
      font-size: clamp(11px, 2.95vw, 15px);
      line-height: 1.48;
      letter-spacing: .025em;
    }

    .feature-visual {
      min-height: clamp(128px, 33vw, 180px);
      justify-items: end;
    }

    .svg-shell { width: min(246px, 49vw); }
    .update-widget { width: min(226px, 47vw); }
    .chart-widget { width: min(220px, 46vw); }
    .update-card { min-height: 150px; padding: 22px; border-radius: 30px; }
    .update-track { height: 12px; margin-top: 12px; }
    .update-bottom { margin-top: 18px; gap: 8px; }
    .update-bottom span { font-size: 7px; padding: 3px 8px; }
    .update-bottom button { font-size: 7px; padding: 6px 10px; }
    .chart-card { min-height: 148px; }
    .chart-area { --chart-start: 44px; height: 128px; padding-left: 30px; }
    .chart-bars { right: 8px; height: 120px; }
    .chart-column { width: 22px; height: 120px; }
    .chart-column i { width: 18px; }
    .chart-top { margin-bottom: 8px; }
    .chart-top strong { font-size: 12px; }
    .chart-top span { font-size: 7px; padding: 5px 8px; }

    .team-grid { grid-template-columns: repeat(2,1fr); }
    .about-cta { flex-direction: column; align-items: flex-start; border-radius: 42px; padding: 34px 28px; min-height: 390px; }
    .cta-copy { width: min(390px, 100%); }
    .cta-button { position: relative; right: auto; bottom: auto; margin: 0; transform: translateY(0); }
    .cta-button:hover { transform: translateX(2px); }
    .cta-tiles { left: 4%; top: 34%; transform: scale(.8); transform-origin: left top; }
  }

  @media (max-width: 560px) {
    .hero-head h1 { font-size: 43px; }
    .about-hero {
      min-height: 610px;
      padding-top: 48px;
    }
    .hero-art { width: min(780px,190vw); }

    .hero-first-card-neer-right :global(svg) {
      right: -118px;
      top: -104px;
      width: 320px;
    }

    .about-copy-section h2,
    .team-section h2 {
      font-size: clamp(28px, 8vw, 34px);
    }

    .feature-row {
      grid-template-columns: minmax(0, 1fr) minmax(128px, 41%);
      gap: 10px;
      min-height: 150px;
    }

    .feature-copy h3 { font-size: clamp(15px, 4.35vw, 18px); }
    .feature-copy p { font-size: clamp(10px, 2.9vw, 12px); }
    .svg-shell { width: min(190px, 48vw); }
    .update-widget { width: min(178px, 45vw); }
    .chart-widget { width: min(174px, 44vw); }

    .team-grid { grid-template-columns: 1fr; }
    .cta-tiles { transform: scale(.62); }
  }

  @media (max-width: 390px) {
    .feature-row {
      grid-template-columns: minmax(0, 1fr) minmax(116px, 39%);
      gap: 8px;
    }

    .feature-copy h3 { font-size: 14px; }
    .feature-copy p { font-size: 9.8px; line-height: 1.43; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-art,
    .reveal-block,
    .svg-shell,
    .svg-shell :global(*),
    .feature-visual :global(*),
    .update-widget,
    .chart-widget {
      animation-duration: .001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .001ms !important;
    }
  }

  /* v typography alignment with latest Careers reference + 20% smaller What we do rows */
  .about-page h1,
  .about-page h2,
  .about-page h3,
  .about-page p {
    margin: 0;
  }

  .section-kicker {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    width: auto;
    min-width: max-content;
    height: 42px;
    padding: 0 18px;
    margin-bottom: clamp(20px, 2.4vw, 30px);
    color: #fff;
    font-size: clamp(15px, 1.25vw, 19px);
    line-height: 42px;
    font-weight: 600;
    letter-spacing: .035em;
    text-align: center;
  }

  .section-kicker.hero-kicker {
    height: 66px;
    padding: 0 22px;
    margin-bottom: 0;
    font-size: 19px;
    line-height: 66px;
    font-weight: 500;
    letter-spacing: .06em;
  }

  .section-kicker strong {
    font: inherit;
    display: block;
    white-space: nowrap;
  }

  .section-kicker span,
  .section-kicker span:last-child,
  .section-kicker .corner {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 0;
    transform: none !important;
    pointer-events: none;
    color: rgba(255,255,255,.9);
    background: transparent;
  }

  .section-kicker .corner-tl {
    left: 0;
    top: 7px;
    border-left: 2px solid currentColor;
    border-top: 2px solid currentColor;
  }

  .section-kicker .corner-tr {
    right: 0;
    top: 7px;
    border-right: 2px solid currentColor;
    border-top: 2px solid currentColor;
  }

  .section-kicker .corner-bl {
    left: 0;
    bottom: 7px;
    border-left: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
  }

  .section-kicker .corner-br {
    right: 0;
    bottom: 7px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
  }

  .section-kicker.hero-kicker .corner {
    width: 9px;
    height: 9px;
  }

  .section-kicker.hero-kicker .corner-tl,
  .section-kicker.hero-kicker .corner-tr {
    top: 19px;
  }

  .section-kicker.hero-kicker .corner-bl,
  .section-kicker.hero-kicker .corner-br {
    bottom: 14px;
  }

  .hero-head h1,
  .about-copy-section h2,
  .team-section > h2 {
    font-size: clamp(40px, 4.65vw, 64px);
    line-height: 1.12;
    letter-spacing: -.018em;
    font-weight: 600;
    text-shadow: 0 0 42px rgba(255,255,255,.20);
  }

  .hero-head h1 {
    margin-top: 22px;
  }

  .about-copy-section {
    width: min(760px, 100%);
    margin-left: auto;
    margin-right: auto;
  }

  .about-copy-section p,
  .team-section > p {
    width: min(690px, 100%);
    margin: clamp(16px, 1.8vw, 24px) auto 0;
    color: rgba(255,255,255,.7);
    font-size: clamp(14px, 1.34vw, 18.5px);
    line-height: 1.58;
    font-weight: 400;
    letter-spacing: 0;
  }

  .about-features {
    width: min(910px, 100%);
    margin-top: clamp(18px, 2.8vw, 38px);
  }

  .feature-row {
    grid-template-columns: minmax(0, 1.04fr) minmax(288px, .96fr);
    gap: clamp(30px, 4.8vw, 74px);
    min-height: clamp(168px, 16.8vw, 240px);
    padding: clamp(26px, 3.05vw, 43px) 0;
  }

  .feature-copy h3 {
    max-width: 515px;
    font-size: clamp(19px, 2.04vw, 30px);
    line-height: 1.31;
    font-weight: 500;
    letter-spacing: 0;
  }

  .feature-copy p {
    max-width: 506px;
    margin-top: clamp(8px, .96vw, 11px);
    font-size: clamp(11.2px, 1.16vw, 16.8px);
    line-height: 1.59;
    letter-spacing: .04em;
    font-weight: 500;
  }

  .feature-visual {
    min-height: clamp(144px, 14.4vw, 216px);
  }

  .svg-shell {
    width: min(411px, 100%);
  }

  .update-widget {
    width: min(374px, 98%);
  }

  .update-card {
    min-height: 218px;
    padding: 35px 37px 27px;
    border-radius: 48px;
  }

  .chart-widget {
    width: min(360px, 96%);
  }

  .chart-card {
    min-height: 186px;
  }

  @media (max-width: 900px) {
    .section-kicker.small {
      height: 38px;
      padding: 0 16px;
      margin-bottom: clamp(18px, 3.6vw, 26px);
      font-size: clamp(13px, 3.2vw, 17px);
      line-height: 38px;
    }

    .section-kicker.hero-kicker {
      height: 58px;
      font-size: clamp(15px, 4vw, 18px);
      line-height: 58px;
    }

    .hero-head h1,
    .about-copy-section h2,
    .team-section > h2 {
      font-size: clamp(34px, 9.8vw, 52px);
      line-height: 1.08;
      letter-spacing: -.035em;
    }

    .about-features {
      width: min(608px, 100%);
      margin-top: 24px;
    }

    .feature-row {
      grid-template-columns: minmax(0, 1fr) minmax(136px, 42%);
      gap: clamp(10px, 2.55vw, 19px);
      min-height: clamp(125px, 28.8vw, 176px);
      padding: clamp(22px, 4.8vw, 34px) 0;
    }

    .feature-copy h3 {
      font-size: clamp(13px, 3.32vw, 19px);
    }

    .feature-copy p {
      max-width: 264px;
      margin-top: 6px;
      font-size: clamp(9px, 2.36vw, 12px);
      line-height: 1.48;
      letter-spacing: .02em;
    }

    .feature-visual {
      min-height: clamp(102px, 26.4vw, 144px);
    }

    .svg-shell { width: min(197px, 39vw); }
    .update-widget { width: min(181px, 38vw); }
    .chart-widget { width: min(176px, 37vw); }
    .update-card { min-height: 120px; padding: 18px; border-radius: 24px; }
    .chart-card { min-height: 118px; }
  }

  @media (max-width: 560px) {
    .hero-head h1 {
      font-size: clamp(34px, 9.8vw, 43px);
    }

    .about-copy-section h2,
    .team-section > h2 {
      font-size: clamp(34px, 9.8vw, 43px);
    }

    .feature-row {
      grid-template-columns: minmax(0, 1fr) minmax(102px, 41%);
      gap: 8px;
      min-height: 120px;
    }

    .feature-copy h3 { font-size: clamp(12px, 3.48vw, 14.5px); }
    .feature-copy p { font-size: clamp(8px, 2.32vw, 9.6px); }
    .svg-shell { width: min(152px, 38vw); }
    .update-widget { width: min(142px, 36vw); }
    .chart-widget { width: min(139px, 35vw); }
  }


  /* Targeted fixes: clean four-corner kickers + requested What we do/Team refinements */
  .section-kicker .corner {
    z-index: 3;
    display: block !important;
    opacity: 1 !important;
    background: transparent !important;
  }

  .section-kicker .corner::before,
  .section-kicker .corner::after {
    content: none !important;
    display: none !important;
  }

  .section-kicker .corner-br {
    right: 0 !important;
    bottom: 7px !important;
    border-right: 2px solid currentColor !important;
    border-bottom: 2px solid currentColor !important;
  }

  .section-kicker.hero-kicker .corner-br {
    bottom: 14px !important;
  }

  .svg-shell {
    animation: none !important;
    transform: none !important;
  }

  .svg-feature-1 :global(svg > g[opacity="0.2"]),
  .svg-feature-1 :global(circle[r="12.2802"]) {
    display: none !important;
  }

  .svg-feature-1 :global(circle[r="36.7268"]) {
    animation: none !important;
    transform: none !important;
    fill: rgba(9, 7, 15, .82) !important;
    stroke: rgba(255, 255, 255, .30) !important;
    stroke-width: 3px !important;
    filter: drop-shadow(0 10px 22px rgba(0,0,0,.34)) drop-shadow(0 0 13px rgba(255,255,255,.06)) !important;
  }

  .svg-feature-1 :global(path[stroke-linecap="round"]),
  .svg-feature-1 :global(line[stroke-linecap="round"]),
  .svg-feature-1 :global(polyline[stroke-linecap="round"]) {
    stroke-dasharray: 120;
    stroke-dashoffset: 120;
    animation: iconStrokeDraw 2.8s cubic-bezier(.22,.61,.36,1) infinite !important;
  }

  .svg-feature-1 :global(g[mask] path[stroke]) {
    animation-duration: 2.8s !important;
  }

  .svg-feature-1 :global(g[filter*="filter23"]),
  .svg-feature-1 :global(g[filter*="filter25"]),
  .svg-feature-1 :global(g[filter*="filter27"]) {
    opacity: .42 !important;
    animation: iconHaloBreath 2.8s ease-in-out infinite !important;
  }

  .update-card::before {
    display: none !important;
  }

  .update-track i {
    box-shadow: 0 0 10px rgba(127,0,255,.46);
  }

  .update-bottom button {
    border: 1px solid rgba(255,255,255,.26) !important;
    background: rgba(7,5,9,.72) !important;
    box-shadow: inset 0 0 0 1px rgba(202,158,255,.12), 0 8px 24px rgba(0,0,0,.22);
  }

  .update-bottom button i {
    display: none !important;
  }

  .chart-card::before,
  .chart-column i.hot {
    box-shadow: none !important;
  }

  .chart-card::before {
    display: none !important;
  }

  .chart-top {
    justify-content: flex-start;
  }

  .chart-area > em,
  .chart-area > small {
    line-height: 1;
    transform: translateY(50%);
  }

  .chart-area > em:nth-of-type(1) { bottom: 164px; }
  .chart-area > em:nth-of-type(2) { bottom: 120px; }
  .chart-area > em:nth-of-type(3) { bottom: 76px; }
  .chart-area > small { bottom: 0; }

  @media (min-width: 901px) {
    .team-section {
      width: min(980px, 100%);
    }

    .team-grid {
      width: min(920px, 100%);
      margin: 42px auto 0;
      gap: 16px;
    }

    .team-card {
      min-height: clamp(325px, 29vw, 430px);
      padding: clamp(142px, 13vw, 205px) clamp(14px, 1.15vw, 20px) clamp(28px, 2.4vw, 38px);
    }
  }


  /* responsive refinement: hero + what we do only */
  @media (max-width: 900px) {
    .about-hero {
      min-height: clamp(690px, 126vw, 920px);
      padding-top: clamp(94px, 12vw, 118px);
    }

    .hero-head {
      width: min(520px, 92vw);
      margin: 0 auto;
    }

    .hero-head h1 {
      font-size: clamp(36px, 8.4vw, 52px);
      line-height: 1.06;
    }

    .hero-art {
      width: 100%;
      height: clamp(880px, 116vw, 1030px);
      margin-top: clamp(8px, 1vw, 14px);
      transform: none;
    }

    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      --hero-card-scale: .9;
      left: calc(50% - 334px);
      top: clamp(88px, 10vw, 112px);
      transform: scale(var(--hero-card-scale));
      transform-origin: 334px top;
    }

    .hero-high-engagement-card-svg {
      left: 169.53px;
      top: -99.3px;
    }

    .hero-long-retention-card-svg {
      left: -29px;
      top: 482px;
    }

    .hero-proven-brand-card-svg {
      left: 243.05px;
      top: 376px;
    }
  }

  @media (max-width: 680px) {
    .about-hero {
      min-height: clamp(920px, 206vw, 1040px);
      padding-top: 102px;
    }

    .hero-head h1 {
      font-size: clamp(34px, 9.4vw, 46px);
    }

    .hero-art {
      height: clamp(930px, 206vw, 1040px);
      margin-top: 2px;
    }

    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      --hero-card-scale: .8;
      left: calc(50% - 334px);
      top: clamp(94px, 14vw, 110px);
      transform-origin: 334px top;
    }

    .about-copy-section {
      width: min(420px, 100%);
      margin-top: clamp(18px, 6vw, 40px);
    }

    .about-copy-section h2 {
      font-size: clamp(30px, 8.6vw, 40px);
      line-height: 1.08;
    }

    .about-copy-section p {
      width: min(360px, 92vw);
      font-size: clamp(12.5px, 3.5vw, 15px);
      line-height: 1.52;
    }

    .about-features {
      width: min(420px, 100%);
      margin-top: 24px;
    }

    .feature-row {
      grid-template-columns: 1fr;
      gap: 16px;
      min-height: auto;
      padding: 30px 0;
      text-align: center;
    }

    .feature-copy {
      text-align: center;
    }

    .feature-copy h3 {
      max-width: 360px;
      margin-inline: auto;
      font-size: clamp(21px, 6.6vw, 30px);
      line-height: 1.18;
    }

    .feature-copy p {
      max-width: 350px;
      margin-inline: auto;
      margin-top: 10px;
      font-size: clamp(12px, 3.55vw, 15px);
      line-height: 1.5;
      letter-spacing: 0;
    }

    .feature-visual {
      justify-items: center;
      min-height: 190px;
    }

    .svg-shell {
      width: min(310px, 86vw);
    }

    .update-widget {
      width: min(286px, 84vw);
    }

    .chart-widget {
      width: min(286px, 84vw);
    }

    .update-card {
      min-height: 176px;
      padding: 26px 28px 22px;
      border-radius: 34px;
    }

    .chart-card {
      min-height: 168px;
    }
  }

  @media (max-width: 560px) {
    .about-hero {
      min-height: clamp(900px, 214vw, 1010px);
      padding-top: 104px;
    }

    .section-kicker.hero-kicker {
      height: 46px;
      padding-inline: 18px;
      font-size: 14px;
      line-height: 46px;
    }

    .section-kicker.hero-kicker .corner-tl,
    .section-kicker.hero-kicker .corner-tr {
      top: 13px;
    }

    .section-kicker.hero-kicker .corner-bl,
    .section-kicker.hero-kicker .corner-br {
      bottom: 10px !important;
    }

    .hero-head h1 {
      margin-top: 12px;
      font-size: clamp(31px, 9.4vw, 40px);
      letter-spacing: -.04em;
    }

    .hero-art {
      height: clamp(900px, 214vw, 1000px);
      margin-top: 0;
    }

    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      --hero-card-scale: .72;
      left: calc(50% - 334px);
      top: clamp(92px, 16vw, 104px);
      transform-origin: 334px top;
    }

    .about-copy-section {
      margin-top: clamp(18px, 6vw, 36px);
    }

    .feature-row {
      padding: 28px 0;
      gap: 14px;
    }

    .feature-visual {
      min-height: 172px;
    }

    .svg-shell {
      width: min(286px, 84vw);
    }

    .update-widget,
    .chart-widget {
      width: min(270px, 82vw);
    }
  }

  @media (max-width: 480px) {
    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      --hero-card-scale: .62;
      left: calc(50% - 334px);
      transform-origin: 334px top;
    }
  }

  @media (max-width: 430px) {
    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      --hero-card-scale: .55;
      left: calc(50% - 334px);
      transform-origin: 334px top;
    }
  }

  @media (max-width: 390px) {
    .about-hero {
      min-height: 860px;
      padding-top: 100px;
    }

    .hero-head h1 {
      font-size: clamp(29px, 9.6vw, 36px);
    }

    .hero-art {
      height: 850px;
      margin-top: 0;
    }

    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      --hero-card-scale: .5;
      left: calc(50% - 334px);
      top: 92px;
      transform-origin: 334px top;
    }

    .about-copy-section {
      margin-top: 18px;
    }

    .feature-copy h3 {
      font-size: clamp(20px, 6.4vw, 24px);
    }

    .feature-copy p {
      font-size: clamp(11.5px, 3.45vw, 13px);
    }

    .feature-visual {
      min-height: 156px;
    }

    .svg-shell {
      width: min(256px, 82vw);
    }

    .update-widget,
    .chart-widget {
      width: min(246px, 80vw);
    }
  }


  /* small screens only: last row spacing + chart title placement */
  @media (max-width: 900px) {
    .about-features .feature-row:nth-child(3) {
      grid-template-columns: minmax(0, .86fr) minmax(230px, 48%);
      gap: clamp(52px, 9vw, 92px);
    }

    .about-features .feature-row:nth-child(3) .feature-visual {
      padding-left: clamp(24px, 5vw, 54px);
      justify-items: end;
    }
  }

  @media (max-width: 680px) {
    .about-features .feature-row:nth-child(3) {
      grid-template-columns: 1fr;
      gap: 66px;
    }

    .about-features .feature-row:nth-child(3) .feature-visual {
      padding-left: 0;
      justify-items: center;
      margin-top: 24px;
    }

    .about-features .feature-row:nth-child(3) .chart-card {
      display: flex;
      flex-direction: column;
    }

    .about-features .feature-row:nth-child(3) .chart-area {
      order: 1;
    }

    .about-features .feature-row:nth-child(3) .chart-top {
      order: 2;
      justify-content: center;
      margin: 14px 0 0;
      text-align: center;
    }
  }

  @media (max-width: 560px) {
    .about-features .feature-row:nth-child(3) {
      gap: 60px;
    }

    .about-features .feature-row:nth-child(3) .feature-visual {
      margin-top: 22px;
    }
  }

  @media (max-width: 390px) {
    .about-features .feature-row:nth-child(3) {
      gap: 54px;
    }
  }


  /* smaller screens only: tighten hero-to-What-we-do spacing, solid row-one icon plates, and narrower bottom-aligned team cards */
  @media (max-width: 680px) {
    .about-hero {
      min-height: clamp(820px, 188vw, 930px);
    }

    .hero-art {
      height: clamp(820px, 188vw, 930px);
    }

    .about-copy-section {
      margin-top: clamp(-84px, -13vw, -46px);
    }

    .svg-feature-1 :global(circle[r="36.7268"]) {
      opacity: 1 !important;
      fill: #09070f !important;
      fill-opacity: 1 !important;
      stroke-opacity: 1 !important;
    }

    .svg-feature-1 :global(g[filter*="filter23"]),
    .svg-feature-1 :global(g[filter*="filter25"]),
    .svg-feature-1 :global(g[filter*="filter27"]) {
      opacity: 1 !important;
    }

    .team-section {
      width: min(420px, 100%);
    }

    .team-grid {
      width: min(326px, 86vw);
      grid-template-columns: 1fr;
      justify-items: center;
      gap: 18px;
      margin: 34px auto 0;
    }

    .team-card {
      width: 100%;
      min-height: clamp(392px, 106vw, 468px);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: clamp(172px, 42vw, 220px) 22px 30px;
    }
  }

  @media (max-width: 560px) {
    .about-hero {
      min-height: clamp(760px, 190vw, 870px);
    }

    .hero-art {
      height: clamp(760px, 190vw, 870px);
    }

    .about-copy-section {
      margin-top: clamp(-94px, -16vw, -58px);
    }

    .team-grid {
      width: min(312px, 84vw);
      margin-top: 30px;
    }

    .team-card {
      min-height: clamp(404px, 116vw, 472px);
      padding: clamp(184px, 50vw, 232px) 22px 30px;
    }
  }

  @media (max-width: 390px) {
    .about-hero {
      min-height: 730px;
    }

    .hero-art {
      height: 720px;
    }

    .about-copy-section {
      margin-top: -64px;
    }

    .team-grid {
      width: min(296px, 84vw);
    }

    .team-card {
      min-height: 420px;
      padding: 198px 20px 28px;
    }
  }


  /* targeted refinements: desktop CTA grid, solid first-row icons, bottom-aligned team text */
  .svg-feature-1 :global(circle[r="36.7268"]) {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
    fill: #09070f !important;
    fill-opacity: 1 !important;
    stroke: rgba(255,255,255,.34) !important;
    stroke-opacity: 1 !important;
  }

  .svg-feature-1 :global(path[stroke-linecap="round"]),
  .svg-feature-1 :global(line[stroke-linecap="round"]),
  .svg-feature-1 :global(polyline[stroke-linecap="round"]),
  .svg-feature-1 :global(g[mask] path[stroke]) {
    animation: none !important;
    stroke-dasharray: none !important;
    stroke-dashoffset: 0 !important;
  }

  .svg-feature-1 :global(g[filter*="filter23"]),
  .svg-feature-1 :global(g[filter*="filter25"]),
  .svg-feature-1 :global(g[filter*="filter27"]) {
    opacity: 1 !important;
    animation: none !important;
  }

  .team-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .team-card span {
    margin-bottom: clamp(20px, 2vw, 30px);
  }

  .team-card h3 {
    margin: 0 0 6px;
  }

  @media (min-width: 901px) {
    .about-cta::after {
      display: none;
    }

    .cta-tiles {
      top: 0;
      right: 0;
      bottom: 0;
      left: 49%;
      transform: none;
      transform-origin: center;
    }

    .cta-tile {
      width: clamp(58px, 6.8vw, 98px);
      height: clamp(86px, 9vw, 124px);
      border-radius: clamp(16px, 1.75vw, 24px);
      border-width: 1.4px;
      box-shadow: 0 18px 46px rgba(2,0,4,.72);
    }

    .cta-tile-1 { left: 4%; top: 12%; }
    .cta-tile-2 { left: 32%; top: 12%; }
    .cta-tile-3 { left: calc(100% - clamp(26px, 3.2vw, 46px)); top: 12%; }
    .cta-tile-4 { left: 4%; top: 58%; }
    .cta-tile-5 { left: 32%; top: 58%; }
    .cta-tile-6 { left: calc(100% - clamp(26px, 3.2vw, 46px)); top: 58%; }
    .cta-tile-7 { display: none; }
  }

  @media (max-width: 680px) {
    .team-card span {
      margin-bottom: 24px;
    }
  }


  /* focused requested refinements: team title level, smaller mobile cards, desktop CTA layout, solid first-row What-we-do icons */
  .svg-feature-1 .svg-shell,
  .svg-feature-1 .svg-shell :global(*) {
    animation: none !important;
    transition: none !important;
  }

  .svg-feature-1 :global(circle[r="36.7268"]) {
    opacity: 1 !important;
    fill: #09070f !important;
    fill-opacity: 1 !important;
    stroke: rgba(255,255,255,.34) !important;
    stroke-opacity: 1 !important;
  }

  .svg-feature-1 :global(g[filter*="filter23"]),
  .svg-feature-1 :global(g[filter*="filter25"]),
  .svg-feature-1 :global(g[filter*="filter27"]) {
    opacity: 1 !important;
  }

  @media (min-width: 901px) {
    .team-card span {
      margin-bottom: clamp(22px, 1.9vw, 30px);
    }

    .team-card h3 {
      display: flex;
      align-items: flex-end;
      min-height: clamp(26px, 2.2vw, 34px);
      margin: 0 0 clamp(12px, 1.15vw, 18px);
    }

    .team-card p {
      min-height: clamp(72px, 5.8vw, 88px);
    }

    .cta-tiles {
      left: 54%;
      right: -2%;
    }

    .cta-tile {
      width: clamp(70px, 7.7vw, 112px);
      height: clamp(102px, 10.4vw, 146px);
    }

    .cta-tile-1 { left: 24%; top: 7%; }
    .cta-tile-2 { left: 51%; top: 7%; }
    .cta-tile-3 { left: calc(100% - clamp(34px, 4vw, 58px)); top: 7%; }
    .cta-tile-4 { left: 24%; top: 55%; }
    .cta-tile-5 { left: 51%; top: 55%; }
    .cta-tile-6 { left: calc(100% - clamp(34px, 4vw, 58px)); top: 55%; }
    .cta-tile-7 { display: block; left: 0; top: 31%; }
  }

  @media (max-width: 680px) {
    .team-section {
      width: min(390px, 100%);
    }

    .team-grid {
      width: min(292px, 80vw);
      gap: 16px;
      margin-top: 28px;
    }

    .team-card {
      min-height: clamp(330px, 92vw, 390px);
      padding: clamp(140px, 38vw, 184px) 20px 26px;
    }

    .team-card span {
      margin-bottom: 24px;
    }
  }

  @media (max-width: 560px) {
    .team-grid {
      width: min(276px, 78vw);
    }

    .team-card {
      min-height: clamp(324px, 98vw, 382px);
      padding: clamp(134px, 44vw, 178px) 19px 25px;
    }
  }

  @media (max-width: 390px) {
    .team-grid {
      width: min(260px, 78vw);
    }

    .team-card {
      min-height: 340px;
      padding: 150px 18px 24px;
    }
  }


  /* focused CTA text/card positioning refinements */
  .about-cta h2 {
    white-space: nowrap;
  }

  @media (min-width: 901px) {
    .cta-tile-3 { left: calc(100% - clamp(70px, 6.5vw, 92px)); }
    .cta-tile-6 { left: calc(100% - clamp(70px, 6.5vw, 92px)); }
  }

  @media (max-width: 680px) {
    .about-cta h2 {
      font-size: clamp(20px, 6vw, 28px);
      letter-spacing: -.058em;
    }

    .cta-tiles {
      left: 50%;
      right: auto;
      top: 42%;
      bottom: auto;
      width: min(350px, calc(100% - 18px));
      height: 218px;
      transform: translateX(-50%);
      transform-origin: center top;
    }

    .cta-tile {
      width: clamp(58px, 18vw, 78px);
      height: clamp(84px, 26vw, 112px);
      border-radius: clamp(15px, 4.8vw, 22px);
    }

    .cta-tile-1 { left: 18%; top: 0; }
    .cta-tile-2 { left: 46%; top: 0; }
    .cta-tile-3 { left: calc(100% - clamp(50px, 15.8vw, 68px)); top: 0; }
    .cta-tile-7 { display: block; left: 2%; top: 34%; }
    .cta-tile-4 { left: 18%; top: 62%; }
    .cta-tile-5 { left: 46%; top: 62%; }
    .cta-tile-6 { left: calc(100% - clamp(50px, 15.8vw, 68px)); top: 62%; }
  }

  @media (max-width: 420px) {
    .about-cta h2 {
      font-size: clamp(17px, 5.2vw, 21px);
    }

    .cta-tiles {
      top: 44%;
      width: min(320px, calc(100% - 12px));
      height: 198px;
    }
  }


  /* final focused CTA + team alignment refinements */
  .about-cta h2 {
    font-size: clamp(24px, 2.35vw, 36px);
    line-height: 1.12;
  }

  .about-cta p {
    white-space: nowrap;
    font-size: clamp(13px, 1.08vw, 17px);
  }

  .cta-button {
    background:
      linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.06) 28%, rgba(115,0,255,.44) 100%);
    border-color: rgba(255,255,255,.68);
    backdrop-filter: blur(18px) saturate(1.35);
    -webkit-backdrop-filter: blur(18px) saturate(1.35);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.34),
      inset 0 -18px 34px rgba(115,0,255,.22),
      0 14px 38px rgba(0,0,0,.34),
      0 0 28px rgba(115,0,255,.22);
  }

  .cta-button:hover {
    background:
      linear-gradient(135deg, rgba(255,255,255,.28), rgba(255,255,255,.08) 28%, rgba(115,0,255,.56) 100%);
    border-color: rgba(255,255,255,.88);
  }

  @media (min-width: 901px) {
    .team-card {
      display: grid;
      grid-template-rows: 1fr auto auto auto;
      justify-content: stretch;
      align-content: end;
    }

    .team-card span {
      align-self: end;
      justify-self: start;
      margin: 0 0 clamp(18px, 1.55vw, 24px);
    }

    .team-card h3 {
      display: flex;
      align-items: flex-end;
      height: clamp(42px, 3.1vw, 52px);
      min-height: 0;
      margin: 0 0 clamp(12px, 1vw, 16px);
    }

    .team-card p {
      height: clamp(78px, 6vw, 96px);
      min-height: 0;
      margin: 0;
      overflow: hidden;
    }

    .cta-copy {
      width: min(540px, 52%);
    }

    .cta-tile-3,
    .cta-tile-6 {
      left: calc(100% - clamp(116px, 10.4vw, 148px));
    }
  }

  @media (max-width: 680px) {
    .about-cta h2 {
      font-size: clamp(14px, 4.15vw, 18px);
      line-height: 1.08;
      letter-spacing: -.06em;
    }

    .about-cta p {
      white-space: nowrap;
      font-size: clamp(10px, 2.95vw, 13px);
      line-height: 1.2;
      margin-top: 12px;
      letter-spacing: -.015em;
    }
  }


  /* final focused refinements: CTA balance, top-right tile tint, hero card centering, team spacing */
  .about-cta {
    width: min(1260px, 100%);
    margin-left: auto;
    margin-right: auto;
  }

  .about-cta::after {
    content: none !important;
    display: none !important;
  }

  .cta-tile-3 {
    background: #06020A !important;
  }

  .cta-tile-3::after {
    background: linear-gradient(180deg, rgba(255,255,255,.025), rgba(6,2,10,.30)) !important;
    mix-blend-mode: normal !important;
  }

  .cta-tile-3 img {
    filter: saturate(.92) contrast(1.04) !important;
  }

  .team-card span {
    margin-bottom: clamp(10px, .9vw, 14px) !important;
  }

  @media (min-width: 901px) {
    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      left: clamp(-40px, 1vw, 10px);
    }

    .cta-tiles {
      left: 53%;
      right: -1%;
    }

    .cta-tile-3,
    .cta-tile-6 {
      left: calc(100% - clamp(98px, 9vw, 126px));
    }
  }

  @media (max-width: 900px) {
    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      left: calc(50% - 348px);
    }
  }

  @media (max-width: 680px) {
    .about-cta {
      align-items: center;
      padding-top: 42px;
      padding-left: 24px;
      padding-right: 24px;
    }

    .cta-copy {
      width: min(360px, 100%);
      margin-top: 10px;
      text-align: left;
      align-self: flex-start;
    }

    .about-cta h2 {
      font-size: clamp(17px, 5.1vw, 22px);
      line-height: 1.1;
    }

    .about-cta p {
      font-size: clamp(11.5px, 3.35vw, 14px);
      line-height: 1.22;
      margin-top: 12px;
    }

    .cta-tiles {
      left: 50%;
      width: min(350px, calc(100% - 10px));
      transform: translateX(-50%);
    }

    .cta-tile-3,
    .cta-tile-6 {
      left: calc(100% - clamp(62px, 18vw, 76px));
    }

    .team-card span {
      margin-bottom: 14px !important;
    }
  }

  @media (max-width: 420px) {
    .cta-copy {
      margin-top: 12px;
    }

    .about-cta h2 {
      font-size: clamp(16.5px, 5.35vw, 20px);
    }

    .about-cta p {
      font-size: clamp(10.8px, 3.45vw, 12.8px);
    }

    .cta-tiles {
      width: min(326px, calc(100% - 8px));
    }
  }


  /* final requested CTA size/text/mobile-button refinements */
  .cta-title-keep {
    white-space: nowrap;
  }

  @media (min-width: 901px) {
    .about-cta {
      width: min(1120px, 94%);
      min-height: clamp(184px, 17.2vw, 236px);
      padding: clamp(24px, 3.1vw, 40px) clamp(34px, 4.6vw, 58px);
      border-radius: clamp(34px, 5.2vw, 76px);
    }

    .cta-copy {
      width: min(560px, 55%);
    }

    .about-cta h2 {
      max-width: 600px;
      white-space: normal;
      font-size: clamp(32px, 3.1vw, 48px);
      line-height: 1.04;
      letter-spacing: -.058em;
    }

    .about-cta p {
      margin-top: clamp(18px, 1.5vw, 24px);
      white-space: nowrap;
      font-size: clamp(15px, 1.3vw, 20px);
      line-height: 1.22;
    }

    .cta-tiles {
      transform: scale(.9);
      transform-origin: center right;
    }
  }

  @media (max-width: 680px) {
    .cta-button {
      align-self: flex-start;
      margin-left: 0;
    }
  }


  /* final focused CTA card strength + mobile text refinements */
  .cta-tile {
    box-shadow: 0 14px 38px rgba(2, 0, 4, .54) !important;
  }

  .cta-tile::after {
    background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(6,2,10,.06)) !important;
    mix-blend-mode: normal !important;
  }

  .cta-tile img {
    opacity: 1 !important;
    filter: saturate(1.2) contrast(1.08) brightness(1.04) !important;
  }

  .cta-tile-3 img {
    filter: saturate(1.02) contrast(1.08) brightness(1.03) !important;
  }

  @media (max-width: 680px) {
    .about-cta h2 {
      font-size: clamp(20px, 6.35vw, 26px);
      line-height: 1.08;
    }

    .about-cta p {
      font-size: clamp(13px, 3.85vw, 16px);
      line-height: 1.24;
    }
  }


  /* final requested hero centering + mobile CTA title wrap */
  .hero-art {
    width: min(1248px, calc(100vw - 2 * clamp(20px, 4vw, 68px)));
    transform: none !important;
    animation: none !important;
  }

  @media (min-width: 901px) {
    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      left: 0 !important;
    }
  }

  @media (max-width: 900px) {
    .hero-art {
      width: 100%;
      transform: none !important;
      animation: none !important;
    }

    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      left: calc(50% - 334px) !important;
    }
  }

  @media (max-width: 680px) {
    .hero-first-card-wrap,
    .hero-rest-cards-svg {
      left: calc(50% - 334px) !important;
    }

    .about-cta h2 {
      max-width: 100%;
      white-space: normal !important;
      overflow: visible;
    }

    .cta-title-keep {
      display: block;
      max-width: 100%;
      white-space: normal !important;
    }
  }

</style>
