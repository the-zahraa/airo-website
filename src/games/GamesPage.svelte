<script>
  import { onMount } from 'svelte';
  import lottie from 'lottie-web';

  const stickerJsonPath = '/stickers/games-cat.json';

  function freshStickerUrl(path) {
    return `${path}?v=${Date.now()}`;
  }

  const modes = ['Most active', 'Least active'];

  const baseGameCards = [
    {
      title: 'Bubble Gum Simulator Infinity',
      studio: 'Airo',
      status: 'Active',
      value: '+2.8M',
      tone: 'positive',
      metric: 'Monthly players'
    },
    {
      title: 'Update Project Power',
      studio: 'Airo',
      status: 'Scaling',
      value: '+418K',
      tone: 'positive',
      metric: 'Recent visits'
    },
    {
      title: 'Timeshock Ultimate',
      studio: 'Airo',
      status: 'Active',
      value: '+189K',
      tone: 'positive',
      metric: 'Returning players'
    },
    {
      title: 'Blossom Simulator Infinity',
      studio: 'Airo',
      status: 'Testing',
      value: '+92K',
      tone: 'positive',
      metric: 'New sessions'
    },
    {
      title: 'Robbling Simulator Infinity',
      studio: 'Airo',
      status: 'Review',
      value: '-4.8%',
      tone: 'negative',
      metric: 'Needs update'
    },
    {
      title: 'Update Project Server',
      studio: 'Airo',
      status: 'Active',
      value: '+71K',
      tone: 'positive',
      metric: 'Active users'
    }
  ];

  const gameCards = Array.from({ length: 35 }, (_, index) => ({
    ...baseGameCards[index % baseGameCards.length]
  }));

  let selectedMode = modes[0];
  let catStickerEl;
  let catStickerLoaded = false;
  let stickerAnimation;

  $: sortedGames = selectedMode === 'Least active'
    ? [...gameCards].reverse()
    : gameCards;

  async function readJsonAnimation(path) {
    const response = await fetch(path, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Missing sticker JSON file: ${path}`);
    }

    return response.json();
  }

  async function loadCatSticker() {
    if (!catStickerEl) return;

    let animationData;

    try {
      animationData = await readJsonAnimation(freshStickerUrl(stickerJsonPath));
    } catch (error) {
      console.warn('Add the Games sticker JSON at public/stickers/games-cat.json. Keep your .tgs files too; the page renders the browser-ready JSON version.', error);
      return;
    }

    catStickerEl.innerHTML = '';
    catStickerLoaded = true;

    stickerAnimation = lottie.loadAnimation({
      container: catStickerEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        progressiveLoad: true
      }
    });
  }


  onMount(() => {
    loadCatSticker();

    return () => {
      stickerAnimation?.destroy?.();
    };
  });

  function reveal(node, delay = 0) {
    if (typeof window === 'undefined') return {};

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.style.setProperty('--reveal-delay', `${delay}ms`);
    node.classList.add('page-reveal');

    if (reduce) {
      node.classList.add('page-visible');
      return {};
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('page-visible');
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
</script>

<svelte:head>
  <title>Games | Airo</title>
  <meta name="description" content="Explore Airo's Roblox game portfolio and active experiences." />
</svelte:head>

<div class="games-page">
  <div class="games-light games-light-left"></div>
  <div class="games-light games-light-right"></div>

  <section class="games-hero" aria-label="Airo games hero">
    <div class="games-label" aria-label="Games" use:reveal>
      <span class="corner corner-tl"></span>
      <span class="corner corner-tr"></span>
      <strong>Games</strong>
      <span class="corner corner-bl"></span>
      <span class="corner corner-br"></span>
    </div>

    <h1 use:reveal={60}>Our experiences</h1>
    <p use:reveal={120}>Airo operates a portfolio of games played by millions worldwide.</p>

    <div class="games-mascot-stage" class:has-sticker={catStickerLoaded} aria-label="Games cat sticker placeholder" use:reveal={180}>
      <div class="games-mascot-sticker" bind:this={catStickerEl}></div>

      {#if !catStickerLoaded}
        <div class="games-mascot-fallback" aria-hidden="true">
          <span></span>
          <strong>CAT STICKER</strong>
          <small>public/stickers/games-cat.json</small>
        </div>
      {/if}
    </div>
  </section>

  <section class="games-list-section" aria-label="Airo game cards">
    <div class="games-sort" role="tablist" aria-label="Sort games" use:reveal>
      <span>Sort by</span>
      <div class="games-sort-pill">
        {#each modes as mode}
          <button
            type="button"
            class:active={selectedMode === mode}
            role="tab"
            aria-selected={selectedMode === mode}
            onclick={() => selectedMode = mode}
          >
            {mode}
          </button>
        {/each}
      </div>
    </div>

    <div class="games-grid">
      {#each sortedGames as game, index}
        <article class="portfolio-card" use:reveal={(index % 9) * 35}>
          <div class="portfolio-card-sheen"></div>
          <div class={`portfolio-status ${game.tone}`}>
            <span></span>
            {game.value}
          </div>
          <div class="portfolio-card-fill">
            <div class="portfolio-card-lines" aria-hidden="true"></div>
          </div>
          <div class="portfolio-copy">
            <h2>{game.title}</h2>
            <div class="portfolio-brand" aria-label={`By ${game.studio}`}>
              <span>By</span>
              <img src="/logos/airo.svg" alt={game.studio} />
            </div>
          </div>
        </article>
      {/each}
    </div>
  </section>
</div>

<style>
  .games-page {
    position: relative;
    z-index: 1;
    isolation: isolate;
    width: 100%;
    min-height: 100vh;
    padding: clamp(128px, 11vw, 170px) 0 clamp(36px, 5vw, 72px);
    color: #fff;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 0%, rgba(115, 0, 255, .22), transparent 31%),
      linear-gradient(180deg, rgba(6, 1, 11, .18) 0%, rgba(3, 0, 6, .46) 38%, rgba(3, 0, 6, .76) 100%);
  }

  .games-page::before {
    content: none;
  }

  .games-light {
    position: absolute;
    z-index: -2;
    pointer-events: none;
    border-radius: 9999px;
    filter: blur(90px);
    mix-blend-mode: screen;
  }

  .games-light-left {
    width: min(430px, 42vw);
    height: min(560px, 56vw);
    left: max(-320px, -28vw);
    top: 118px;
    background: rgba(115, 0, 255, .34);
  }

  .games-light-right {
    width: min(430px, 42vw);
    height: min(570px, 57vw);
    right: max(-320px, -28vw);
    top: 108px;
    background: rgba(150, 64, 255, .36);
  }

  .games-light-center {
    width: min(760px, 72vw);
    height: 320px;
    left: 50%;
    top: 260px;
    transform: translateX(-50%);
    background: rgba(115, 0, 255, .18);
    filter: blur(108px);
  }

  .games-hero {
    position: relative;
    z-index: 2;
    width: min(920px, calc(100vw - 42px));
    margin: 0 auto;
    text-align: center;
  }

  .games-label {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-width: 0;
    height: 66px;
    padding: 0 24px;
    margin: 0 auto 16px;
    color: rgba(255,255,255,.96);
    font-size: 21px;
    line-height: 66px;
    font-weight: 500;
    letter-spacing: .06em;
    white-space: nowrap;
  }

  .games-label strong {
    position: relative;
    z-index: 2;
    font: inherit;
  }

  .games-label::before,
  .games-label::after {
    content: none;
    display: none;
  }

  .games-label .corner {
    position: absolute;
    width: 9px;
    height: 9px;
    border-color: rgba(255,255,255,.9);
    border-style: solid;
  }

  .games-label .corner-tl { left: 0; top: 19px; border-width: 2.25px 0 0 2.25px; }
  .games-label .corner-tr { right: 0; top: 19px; border-width: 2.25px 2.25px 0 0; }
  .games-label .corner-bl { left: 0; bottom: 14px; border-width: 0 0 2.25px 2.25px; }
  .games-label .corner-br { right: 0; bottom: 14px; border-width: 0 2.25px 2.25px 0; }

  .games-hero h1 {
    margin: 0;
    font-size: clamp(40px, 4.65vw, 64px);
    line-height: 1.12;
    letter-spacing: -.018em;
    font-weight: 600;
    text-shadow: none;
    white-space: nowrap;
  }

  .games-hero p {
    width: min(760px, calc(100vw - 40px));
    margin: 18px auto 0;
    color: rgba(255,255,255,.7);
    font-size: clamp(14px, 1.34vw, 18.5px);
    line-height: 1.58;
    font-weight: 400;
    letter-spacing: 0;
    white-space: nowrap;
  }

  .games-mascot-stage {
    position: relative;
    width: min(560px, 88vw);
    height: clamp(228px, 25vw, 330px);
    margin: clamp(4px, 1vw, 12px) auto 0;
  }

  .games-mascot-card {
    display: none;
    position: absolute;
    left: 50%;
    bottom: 0;
    width: min(445px, 80vw);
    height: clamp(104px, 11vw, 138px);
    transform: translateX(-50%);
    border-radius: 34px;
    border: 1px solid rgba(255,255,255,.15);
    background:
      radial-gradient(circle at 50% 0%, rgba(159, 80, 255, .18), transparent 54%),
      linear-gradient(180deg, rgba(23, 5, 35, .74), rgba(10, 2, 17, .38));
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.14),
      0 34px 80px rgba(0,0,0,.34);
    opacity: .94;
  }

  .games-mascot-card::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent);
    opacity: .46;
    mask-image: linear-gradient(to bottom, #000, transparent 72%);
  }

  .games-mascot-sticker {
    position: absolute;
    z-index: 2;
    left: 50%;
    bottom: 0;
    width: clamp(207px, 21.6vw, 306px);
    height: clamp(207px, 21.6vw, 306px);
    transform: translateX(-50%);
    filter: drop-shadow(0 28px 42px rgba(0,0,0,.62));
  }

  .games-mascot-fallback {
    position: absolute;
    z-index: 3;
    left: 50%;
    bottom: 20px;
    width: clamp(188px, 20vw, 270px);
    height: clamp(188px, 20vw, 270px);
    transform: translateX(-50%);
    display: grid;
    place-items: center;
    align-content: center;
    gap: 7px;
    border-radius: 50%;
    color: rgba(255,255,255,.78);
    background: transparent;
    border: 1px dashed rgba(255,255,255,.18);
    box-shadow: none;
    text-align: center;
  }

  .games-mascot-fallback span {
    width: 78px;
    height: 58px;
    border-radius: 50% 50% 42% 42%;
    border: 1px solid rgba(255,255,255,.34);
    background: radial-gradient(circle at 33% 38%, #fff 0 3px, transparent 4px), radial-gradient(circle at 68% 38%, #fff 0 3px, transparent 4px);
    opacity: .75;
  }

  .games-mascot-fallback strong {
    font-size: 10px;
    letter-spacing: .12em;
    font-weight: 700;
  }

  .games-mascot-fallback small {
    width: 100%;
    padding: 0 12px;
    color: rgba(255,255,255,.52);
    font-size: 8px;
    line-height: 1.3;
    word-break: break-word;
  }

  .games-list-section {
    position: relative;
    z-index: 2;
    width: min(1088px, calc(100vw - 52px));
    margin: clamp(20px, 2.4vw, 34px) auto 0;
  }

  .games-sort {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin: 0 auto clamp(22px, 2.4vw, 34px);
    color: rgba(255,255,255,.62);
    font-size: 13.8px;
  }

  .games-sort span {
    margin-right: 0;
  }

  .games-sort-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 4.4px;
    border: 0;
    border-radius: 999px;
    background: #7300ff;
    box-shadow: none;
  }

  .games-sort button {
    appearance: none;
    min-width: 111px;
    height: 43px;
    padding: 0 13px;
    border: 0;
    border-radius: 999px;
    color: rgba(255,255,255,.42);
    background: transparent;
    box-shadow: none;
    cursor: pointer;
    font-size: 15.2px;
    font-weight: 700;
    transition: color .25s ease, opacity .25s ease;
  }

  .games-sort button:hover,
  .games-sort button.active {
    color: #fff;
    background: transparent;
    box-shadow: none;
    transform: none;
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(18px, 1.75vw, 26px);
  }

  .portfolio-card {
    position: relative;
    min-height: clamp(224px, 20vw, 286px);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 22px;
    background: linear-gradient(180deg, rgba(10, 8, 16, .92), rgba(4, 3, 8, .82));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.1);
    animation: none;
  }
  .portfolio-card-sheen { display: none; }

  .portfolio-status {
    position: absolute;
    z-index: 4;
    top: 12px;
    right: 12px;
    display: inline-flex;
    align-items: center;
    gap: 5.5px;
    height: 22px;
    padding: 0 10px;
    border-radius: 999px;
    color: #fff;
    font-size: 11px;
    line-height: 1;
    letter-spacing: -.01em;
    font-weight: 700;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 8px 24px rgba(0,0,0,.32);
  }

  .portfolio-status span {
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 10px currentColor;
  }

  .portfolio-status.positive {
    background: linear-gradient(135deg, #00792f, #00db63);
  }

  .portfolio-status.negative {
    background: linear-gradient(135deg, #8a001d, #ff3f5c);
  }

  .portfolio-card-fill {
    position: absolute;
    inset: 1px 1px 72px;
    border-radius: 21px 21px 14px 14px;
    overflow: hidden;
    background: linear-gradient(180deg, rgba(255,255,255,.035), transparent 76%);
  }

  .portfolio-card-lines {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, transparent, rgba(255,255,255,.055), transparent),
      repeating-linear-gradient(90deg, transparent 0 38px, rgba(255,255,255,.035) 39px 40px, transparent 41px 78px);
    opacity: .32;
    transform: skewY(-6deg) translateY(-22px);
  }

  .portfolio-copy {
    position: absolute;
    z-index: 3;
    left: 18px;
    right: 18px;
    bottom: 16px;
  }

  .portfolio-copy h2 {
    margin: 0 0 7px;
    color: #fff;
    font-size: clamp(16.5px, 1.36vw, 20.25px);
    line-height: 1.18;
    letter-spacing: -.035em;
    font-weight: 700;
  }

  .portfolio-brand {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 16px;
    margin-top: 0;
    color: rgba(255,255,255,.42);
    vertical-align: middle;
  }

  .portfolio-brand span {
    display: inline-flex;
    align-items: center;
    color: rgba(255,255,255,.42);
    font-size: 10.5px;
    line-height: 1;
    font-weight: 500;
    letter-spacing: -.01em;
  }

  .portfolio-brand img {
    display: block;
    width: auto;
    height: 13px;
    object-fit: contain;
    opacity: .46;
    filter: grayscale(1) brightness(.74);
  }


  @media (max-width: 900px) {
    .games-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .games-page {
      padding-top: 118px;
    }

    .games-list-section {
      width: min(420px, calc(100vw - 30px));
    }

    .games-hero p {
      width: min(420px, calc(100vw - 30px));
      white-space: normal;
    }

    .games-sort {
      flex-wrap: wrap;
      gap: 7px;
    }

    .games-sort span {
      width: 100%;
      margin: 0 0 2px;
      text-align: center;
    }

    .games-sort-pill {
      width: 100%;
    }

    .games-sort button {
      flex: 1 1 0;
      min-width: 0;
    }

    .games-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .portfolio-card {
      min-height: 228px;
      border-radius: 20px;
    }

    .mobile-break {
      display: none;
    }
  }


  @media (max-width: 640px) {
    .games-page {
      background: linear-gradient(180deg, rgba(6, 1, 11, .18) 0%, rgba(3, 0, 6, .46) 38%, rgba(3, 0, 6, .76) 100%);
    }

    .games-light {
      display: none;
    }

    .games-sort button,
    .games-sort button:hover,
    .games-sort button:focus,
    .games-sort button:focus-visible,
    .games-sort button:active,
    .games-sort button.active {
      background: transparent !important;
      box-shadow: none !important;
      outline: none !important;
      transform: none !important;
      -webkit-tap-highlight-color: transparent;
    }

    .games-sort button {
      color: rgba(255,255,255,.42) !important;
    }

    .games-sort button.active {
      color: #fff !important;
    }
  }

  :global(.page-reveal) {
    opacity: 0;
    transform: var(--reveal-from, translate3d(0, 22px, 0));
    transition: opacity .68s ease var(--reveal-delay, 0ms), transform .68s cubic-bezier(.19, 1, .22, 1) var(--reveal-delay, 0ms);
    will-change: opacity, transform;
  }

  :global(.page-reveal.page-visible) {
    opacity: 1;
    transform: var(--reveal-to, translate3d(0, 0, 0));
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.page-reveal) {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }

</style>
