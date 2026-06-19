<script>
  import './styles/GamesPage.css';
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
