<script>
  import { onMount } from 'svelte';
  import lottie from 'lottie-web';

  const stickerJsonPath = '/stickers/games-cat.json';

  function freshStickerUrl(path) {
    return `${path}?v=${Date.now()}`;
  }

  const modes = ['Most active', 'Least active'];

  const gameCards = [
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
</script>

<svelte:head>
  <title>Games | Airo</title>
  <meta name="description" content="Explore Airo's Roblox game portfolio and active experiences." />
</svelte:head>

<div class="games-page">
  <div class="games-light games-light-left"></div>
  <div class="games-light games-light-right"></div>
  <div class="games-light games-light-center"></div>
  <div class="games-dots games-dots-top"></div>
  <div class="games-dots games-dots-grid"></div>

  <section class="games-hero" aria-label="Airo games hero">
    <div class="games-label" aria-label="Games">
      <span class="corner corner-tl"></span>
      <span class="corner corner-tr"></span>
      <strong>Games</strong>
      <span class="corner corner-bl"></span>
      <span class="corner corner-br"></span>
    </div>

    <h1>Our experiences</h1>
    <p>Airo operates a portfolio of<br class="mobile-break" /> games played by millions worldwide.</p>

    <div class="games-mascot-stage" class:has-sticker={catStickerLoaded} aria-label="Games cat sticker placeholder">
      <div class="games-mascot-glow"></div>
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
    <div class="games-sort" role="tablist" aria-label="Sort games">
      <span>Sort by</span>
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

    <div class="games-grid">
      {#each sortedGames as game, index}
        <article class="portfolio-card" style={`--card-delay:${index * 72}ms`}>
          <div class="portfolio-card-sheen"></div>
          <div class={`portfolio-status ${game.tone}`}>
            <span></span>
            {game.value}
          </div>
          <div class="portfolio-card-fill">
            <div class="portfolio-card-lines" aria-hidden="true"></div>
          </div>
          <div class="portfolio-copy">
            <span>{game.metric}</span>
            <h2>{game.title}</h2>
            <p>by {game.studio}</p>
          </div>
          <a class="portfolio-link" href="https://www.roblox.com/" target="_blank" rel="noreferrer" aria-label={`Open ${game.title}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M10 7h7v7" /></svg>
          </a>
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
      radial-gradient(circle at 50% 0%, rgba(115, 0, 255, .28), transparent 31%),
      linear-gradient(180deg, rgba(6, 1, 11, .3) 0%, rgba(3, 0, 6, .64) 38%, rgba(3, 0, 6, .94) 100%);
  }

  .games-page::before {
    content: '';
    position: absolute;
    z-index: -3;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 3% 15%, rgba(115, 0, 255, .44), transparent 20%),
      radial-gradient(circle at 99% 16%, rgba(142, 63, 255, .46), transparent 21%),
      radial-gradient(circle at 50% 24%, rgba(92, 0, 160, .32), transparent 32%),
      linear-gradient(180deg, #050107 0%, #030005 74%, #030005 100%);
  }

  .games-page::after {
    content: '';
    position: absolute;
    z-index: -1;
    left: 50%;
    top: 0;
    width: min(1120px, 96vw);
    height: 100%;
    transform: translateX(-50%);
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(232, 228, 255, .14) 1px, transparent 1.32px);
    background-size: 24px 24px;
    opacity: .34;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,.75), rgba(0,0,0,.42) 54%, transparent 96%);
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

  .games-dots {
    position: absolute;
    pointer-events: none;
    z-index: -1;
    background-image: radial-gradient(circle, rgba(255, 255, 255, .18) 1px, transparent 1.4px);
    background-size: 22px 22px;
  }

  .games-dots-top {
    left: 50%;
    top: 108px;
    width: min(1180px, 96vw);
    height: 410px;
    transform: translateX(-50%);
    opacity: .42;
    mask-image: radial-gradient(ellipse at 50% 50%, #000 0 34%, rgba(0,0,0,.48) 61%, transparent 86%);
  }

  .games-dots-grid {
    left: 50%;
    top: 520px;
    width: min(1180px, 96vw);
    height: 1160px;
    transform: translateX(-50%);
    opacity: .2;
    mask-image: linear-gradient(to bottom, transparent 0%, #000 18%, #000 72%, transparent 100%);
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
    min-width: 82px;
    min-height: 26px;
    padding: 2px 14px;
    margin-bottom: 20px;
    color: rgba(255,255,255,.96);
    font-size: 13px;
    line-height: 1;
    letter-spacing: .025em;
  }

  .games-label strong {
    position: relative;
    z-index: 2;
    font-weight: 500;
  }

  .games-label::before,
  .games-label::after {
    content: '';
    position: absolute;
    left: 14px;
    right: 14px;
    height: 1px;
    background: rgba(255,255,255,.46);
  }

  .games-label::before { top: 2px; }
  .games-label::after { bottom: 2px; }

  .games-label .corner {
    position: absolute;
    width: 7px;
    height: 7px;
    border-color: rgba(255,255,255,.68);
    border-style: solid;
  }

  .games-label .corner-tl { left: 5px; top: 0; border-width: 1px 0 0 1px; }
  .games-label .corner-tr { right: 5px; top: 0; border-width: 1px 1px 0 0; }
  .games-label .corner-bl { left: 5px; bottom: 0; border-width: 0 0 1px 1px; }
  .games-label .corner-br { right: 5px; bottom: 0; border-width: 0 1px 1px 0; }

  .games-hero h1 {
    margin: 0;
    font-size: clamp(46px, 5.85vw, 76px);
    line-height: .98;
    letter-spacing: -.06em;
    font-weight: 700;
    text-shadow: 0 20px 70px rgba(115,0,255,.28);
  }

  .games-hero p {
    width: min(360px, 90vw);
    margin: 18px auto 0;
    color: rgba(255,255,255,.68);
    font-size: clamp(14px, 1.2vw, 17px);
    line-height: 1.58;
    font-weight: 400;
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

  .games-mascot-glow {
    position: absolute;
    left: 50%;
    bottom: 18px;
    width: min(420px, 76vw);
    height: 170px;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at 50% 58%, rgba(115, 0, 255, .34), rgba(115, 0, 255, .1) 42%, transparent 76%);
    filter: blur(34px);
    opacity: .78;
    pointer-events: none;
  }

  .games-mascot-sticker {
    position: absolute;
    z-index: 2;
    left: 50%;
    bottom: 0;
    width: clamp(230px, 24vw, 340px);
    height: clamp(230px, 24vw, 340px);
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
    gap: 8px;
    margin: 0 auto clamp(22px, 2.4vw, 34px);
    color: rgba(255,255,255,.62);
    font-size: 12px;
  }

  .games-sort span {
    margin-right: 6px;
  }

  .games-sort button {
    appearance: none;
    min-width: 112px;
    height: 36px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 999px;
    color: rgba(255,255,255,.62);
    background: rgba(255,255,255,.035);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.1);
    cursor: pointer;
    transition: transform .25s ease, color .25s ease, border-color .25s ease, background .25s ease, box-shadow .25s ease;
  }

  .games-sort button:hover,
  .games-sort button.active {
    color: #fff;
    border-color: rgba(255,255,255,.22);
    background: linear-gradient(135deg, #7300FF, #9B42FF);
    box-shadow: 0 14px 38px rgba(115,0,255,.34), inset 0 1px 0 rgba(255,255,255,.24);
    transform: translateY(-1px);
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
    background:
      radial-gradient(circle at 50% 0%, rgba(115,0,255,.08), transparent 48%),
      linear-gradient(180deg, rgba(10, 8, 16, .92), rgba(4, 3, 8, .82));
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.1),
      0 28px 70px rgba(0,0,0,.28);
    animation: cardReveal .55s cubic-bezier(.16,1,.3,1) backwards;
    animation-delay: var(--card-delay);
  }

  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(18px) scale(.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .portfolio-card::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(255,255,255,.09) 1px, transparent 1.3px);
    background-size: 18px 18px;
    opacity: .1;
    mask-image: linear-gradient(to bottom, #000, transparent 72%);
  }

  .portfolio-card::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255,255,255,.13), transparent 32%, rgba(115,0,255,.12) 72%, transparent);
    opacity: .38;
  }

  .portfolio-card-sheen {
    position: absolute;
    inset: -1px;
    pointer-events: none;
    border-radius: inherit;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.12) 38%, transparent 54%);
    opacity: .16;
    transform: translateX(-36%);
    transition: transform .75s ease, opacity .4s ease;
  }

  .portfolio-card:hover .portfolio-card-sheen {
    transform: translateX(36%);
    opacity: .32;
  }

  .portfolio-status {
    position: absolute;
    z-index: 4;
    top: 12px;
    right: 12px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 18px;
    padding: 0 8px;
    border-radius: 999px;
    color: #fff;
    font-size: 9px;
    line-height: 1;
    letter-spacing: -.01em;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 8px 24px rgba(0,0,0,.32);
  }

  .portfolio-status span {
    width: 4px;
    height: 4px;
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
    background:
      radial-gradient(circle at 50% 10%, rgba(123,54,255,.22), transparent 52%),
      linear-gradient(180deg, rgba(255,255,255,.035), transparent 76%);
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

  .portfolio-copy span {
    display: block;
    margin-bottom: 7px;
    color: rgba(255,255,255,.43);
    font-size: 10px;
    line-height: 1.3;
  }

  .portfolio-copy h2 {
    margin: 0 0 5px;
    color: #fff;
    font-size: clamp(13px, 1.08vw, 16px);
    line-height: 1.2;
    letter-spacing: -.035em;
    font-weight: 600;
  }

  .portfolio-copy p {
    margin: 0;
    color: rgba(255,255,255,.58);
    font-size: 11px;
    line-height: 1.2;
  }

  .portfolio-link {
    position: absolute;
    z-index: 5;
    left: 15px;
    bottom: 14px;
    width: 21px;
    height: 21px;
    display: grid;
    place-items: center;
    color: rgba(255,255,255,.72);
    opacity: 0;
    transform: translateX(-5px);
    transition: opacity .25s ease, transform .25s ease, color .25s ease;
  }

  .portfolio-link svg {
    width: 15px;
    height: 15px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .portfolio-card:hover .portfolio-link {
    opacity: 1;
    transform: translateX(0);
    color: #fff;
  }

  .portfolio-card:hover {
    border-color: rgba(255,255,255,.22);
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

    .games-sort {
      flex-wrap: wrap;
      gap: 7px;
    }

    .games-sort span {
      width: 100%;
      margin: 0 0 2px;
      text-align: center;
    }

    .games-sort button {
      flex: 1 1 126px;
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
</style>
