<script>
  import { onMount } from 'svelte';

  let perksSection;
  let perksLoop = 0;
  let reduceMotion = false;
  let rafId;
  let lastTime = 0;
  let loopSeconds = 0;
  let perksInView = true;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };

  const loadTgsPlayer = () => {
    if (typeof document === 'undefined' || customElements.get('tgs-player')) return;

    const existing = document.querySelector('script[data-tgs-player-loader]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/tgs-player.js';
    script.async = true;
    script.dataset.tgsPlayerLoader = 'true';
    document.head.appendChild(script);
  };

  onMount(() => {
    loadTgsPlayer();

    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      perksLoop = 0.02;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        perksInView = entry.isIntersecting;
        if (perksInView) lastTime = performance.now();
      },
      { threshold: 0.08, rootMargin: '140px 0px 140px 0px' }
    );

    if (perksSection) observer.observe(perksSection);

    const tick = (time) => {
      if (!lastTime) lastTime = time;
      const delta = Math.min(46, time - lastTime);
      lastTime = time;

      if (perksInView) {
        loopSeconds += delta / 1000;
        perksLoop = (loopSeconds / 12.2) % 1;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  });

  const perks = [
    {
      title: 'Remote first',
      copy: 'Work from anywhere with a focused remote setup.',
      icon: '/stickers/remote.tgs'
    },
    {
      title: 'Growth with Airo',
      copy: 'Grow your craft while helping scale Roblox games.',
      icon: '/stickers/growth.tgs'
    },
    {
      title: 'Team outings',
      copy: 'Build stronger bonds through meetups, games, and team fun.',
      icon: '/stickers/tc.tgs'
    },
    {
      title: 'Company salary',
      copy: 'We reward great work with pay that values your skill.',
      icon: '/stickers/salary.tgs'
    },
    {
      title: 'Health&wellness support',
      copy: 'Your well-being matters. We provide support where possible.',
      icon: '/stickers/health.tgs'
    },
    {
      title: 'Network',
      copy: 'Connect with Airo team and partners.',
      icon: '/stickers/network.tgs'
    }
  ];

  const values = [
    {
      number: '1.',
      title: 'The same goal',
      copy: 'We operate with efficiency since we all have the same goal: innovation',
      tone: 'purple',
      icon: '/stickers/goal.tgs'
    },
    {
      number: '3.',
      title: 'Be a team',
      copy: 'Airo is tight-knit and supportive — we win, learn, and ship together.',
      tone: 'green',
      icon: '/stickers/team.tgs'
    },
    {
      number: '2.',
      title: 'Speed with care',
      copy: 'We move fast, but never let speed erode our craft, quality, or communication.',
      tone: 'gold',
      icon: '/stickers/speed.tgs'
    }
  ];

  const process = [
    {
      title: 'Apply',
      copy: 'Send us your portfolio, profile, or just a quick intro. No formal cover letter required.',
      detail: 'Upload your portfolio',
      type: 'progress',
      icon: 'apply'
    },
    {
      title: 'Chat',
      copy: '20-minute call with the hiring lead to talk about you, the role, and what you want to build.',
      detail: 'Voice call with hiring lead',
      type: 'messages',
      icon: 'phone'
    },
    {
      title: 'Show your craft',
      copy: 'A short, paid task or technical conversation tailored to the role — never a homework dump.',
      detail: 'Your task stats',
      type: 'checklist',
      icon: 'craft'
    },
    {
      title: 'Offer',
      copy: 'Decision within a week. Onboarding is quick, supported, and your first project ready on day one.',
      detail: 'Your project is ready',
      type: 'offer',
      icon: 'offer'
    }
  ];

  let showAllRoles = false;

  const jobs = [
    { title: 'Acquisition executive', team: 'Growth', location: 'Remote', type: 'Full-time', tags: ['Roblox', 'Sales', 'Research'] },
    { title: 'Game designer', team: 'Product', location: 'Remote', type: 'Contract', tags: ['Roblox', 'Systems', 'UX'] },
    { title: 'Icon maker', team: 'Creative', location: 'Remote', type: 'Freelance', tags: ['3D', '2D', 'Thumbnails'] },
    { title: 'Graphic designer', team: 'Creative', location: 'Remote', type: 'Full-time', tags: ['Brand', 'Social', 'Figma'] },
    { title: 'Motion designer', team: 'Creative', location: 'Remote', type: 'Freelance', tags: ['2D', 'After Effects', 'Lottie'] },
    { title: 'Senior designer', team: 'Design', location: 'Remote', type: 'Full-time', tags: ['UI/UX', 'Art Direction', 'Systems'] },
    { title: 'Animation executive', team: 'Production', location: 'Remote', type: 'Contract', tags: ['Animation', 'Pipeline', 'QA'] },
    { title: 'Acquisition executive', team: 'Growth', location: 'Remote', type: 'Part-time', tags: ['Sourcing', 'Discord', 'Outreach'] },
    { title: 'Acquisition executive', team: 'Growth', location: 'Remote', type: 'Full-time', tags: ['Deals', 'Leads', 'Roblox'] }
  ];



  function cardPhase(index) {
    return (perksLoop + index / perks.length) % 1;
  }

  function cardActive(index) {
    const phase = cardPhase(index);
    const focusIn = smooth((phase - 0.46) / 0.2);
    const focusOut = smooth((0.86 - phase) / 0.18);
    const clarity = clamp(Math.min(focusIn, focusOut));

    return clarity > 0.72;
  }

  function cardStyle(index) {
    const phase = cardPhase(index);
    const row = Math.floor(index / 2);
    const column = index % 2;

    // Self-contained motion: the cards scroll inside the perks stage only.
    // No page-scroll binding, no layout-height changes, only transform/opacity/filter.
    const fadeIn = smooth(phase / 0.16);
    const fadeOut = smooth((1 - phase) / 0.16);
    const visible = Math.min(fadeIn, fadeOut);
    const focusIn = smooth((phase - 0.46) / 0.2);
    const focusOut = smooth((0.86 - phase) / 0.18);
    const clarity = clamp(Math.min(focusIn, focusOut));

    const y = (4 + phase * 328).toFixed(3);
    const drift = Math.sin((phase * Math.PI * 2) + column * 0.85);
    const x = (drift * (10 - clarity * 4)).toFixed(3);
    const scale = (0.86 + clarity * 0.16).toFixed(4);
    const blur = (7.25 * (1 - clarity)).toFixed(3);
    const opacity = (visible * (0.18 + clarity * 0.72)).toFixed(4);
    const tilt = '0.000';
    const zIndex = Math.floor(4 + clarity * 18 + phase * 2);

    return `--perk-row:${row}; --perk-col:${column}; --perk-phase:${phase.toFixed(4)}; --perk-clarity:${clarity.toFixed(4)}; --loop-x:${x}px; --loop-y:${y}px; --loop-scale:${scale}; --loop-blur:${blur}px; --loop-opacity:${opacity}; --loop-tilt:${tilt}deg; --loop-zindex:${zIndex};`;
  }

  function processStickerSrc(name) {
    const stickers = {
      apply: '/stickers/apply.tgs',
      phone: '/stickers/chat.tgs',
      craft: '/stickers/show.tgs',
      offer: '/stickers/offer.tgs'
    };

    return stickers[name] || '/stickers/apply.tgs';
  }


  let scrollFrame;

  function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getScrollOffset() {
    if (typeof window === 'undefined') return 0;
    return window.innerWidth <= 860 ? 92 : 118;
  }

  function scrollToSection(id, event) {
    event?.preventDefault?.();
    event?.currentTarget?.blur?.();

    if (typeof window === 'undefined') return;

    const target = document.getElementById(id);
    if (!target) return;

    if (scrollFrame) cancelAnimationFrame(scrollFrame);

    scrollFrame = requestAnimationFrame(() => {
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - getScrollOffset());

      window.scrollTo({
        top,
        left: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });

      scrollFrame = null;
    });
  }

  function scrollToJobs(event) {
    scrollToSection('job-openings', event);
  }

  function scrollToPerks(event) {
    scrollToSection('perks', event);
  }

  function scrollToForm(event) {
    scrollToSection('work-with-us', event);
  }

  function watchReveal(node, className, delay = 0) {
    if (typeof window === 'undefined') return {};

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.style.setProperty('--reveal-delay', `${delay}ms`);
    node.classList.add(className);

    if (reduce) {
      node.classList.add('career-visible');
      return {};
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('career-visible');
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

  function reveal(node, delay = 0) {
    return watchReveal(node, 'career-reveal', delay);
  }

  function getCardRevealDelay(settings = 0) {
    if (typeof window === 'undefined') return 0;

    const options = typeof settings === 'number' ? { index: settings } : settings || {};
    const index = options.index || 0;
    const base = options.base || 0;
    const step = options.step || 86;
    const mobileStep = options.mobileStep || 145;
    const isSmall = window.innerWidth <= 700;

    return base + index * (isSmall ? mobileStep : step);
  }

  function cardReveal(node, settings = 0) {
    return reveal(node, getCardRevealDelay(settings));
  }

  function fadeCardReveal(node, settings = 0) {
    return watchReveal(node, 'career-fade-card-reveal', getCardRevealDelay(settings));
  }
</script>

<svelte:head>
  <title>Careers — Airo</title>
  <meta name="description" content="Join Airo and help grow the next generation of Roblox games." />
</svelte:head>

<div class="careers-page">
  <div class="career-bg" aria-hidden="true">
    <span class="glow glow-left"></span>
    <span class="glow glow-right"></span>
    <span class="glow glow-center"></span>
    <span class="career-lines"></span>
  </div>

  <section id="career-hero" class="career-hero" aria-labelledby="career-hero-title">
    <div class="hero-content" use:reveal>
      <div class="section-kicker hero-kicker" aria-label="We are hiring">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <strong>We are hiring</strong>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>
      </div>

      <h1 id="career-hero-title">Join our journey!</h1>
      <p>
        Airo builds and operates a portfolio of Roblox experiences played by millions. We're looking for sharp, kind, ambitious people to help us build the next wave.
      </p>

      <div class="hero-careers-sticker" aria-hidden="true">
        <tgs-player src="/stickers/careers.tgs" autoplay loop mode="normal"></tgs-player>
      </div>

      <div class="hero-actions" aria-label="Career quick actions">
        <button class="primary-btn" type="button" onclick={scrollToJobs}>
          <span>See open roles</span>
          <svg class="hero-arrow hero-arrow-up" viewBox="0 0 24 24" aria-hidden="true">
            <path class="arrow-main" pathLength="100" d="M6.8 17.2L17.2 6.8" />
            <path class="arrow-head" pathLength="100" d="M10.2 6.8H17.2" />
            <path class="arrow-head" pathLength="100" d="M17.2 6.8V13.8" />
          </svg>
        </button>
        <button class="ghost-btn" type="button" onclick={scrollToPerks}>
          <span>Why Airo</span>
          <svg class="hero-arrow hero-arrow-down" viewBox="0 0 24 24" aria-hidden="true">
            <path class="arrow-main" pathLength="100" d="M12 5.5V18.5" />
            <path class="arrow-head" pathLength="100" d="M6.8 13.3L12 18.5" />
            <path class="arrow-head" pathLength="100" d="M17.2 13.3L12 18.5" />
          </svg>
        </button>
      </div>
    </div>
  </section>

  <section id="perks" class="perks-section" aria-labelledby="perks-title" bind:this={perksSection}>
    <div class="perks-sticky">
      <div class="section-heading perks-heading" use:reveal>
        <div class="section-kicker small" aria-label="Perks">
          <span class="corner corner-tl"></span>
          <span class="corner corner-tr"></span>
          <strong>Perks</strong>
          <span class="corner corner-bl"></span>
          <span class="corner corner-br"></span>
        </div>
        <h2 id="perks-title">Working at Airo is full of perks</h2>
        <p>We make sure you're supported with the right balance of growth opportunities, flexibility, and benefits that help you thrive both at work and in life.</p>
      </div>

      <div class="perks-stage" style={`--perks-loop:${perksLoop.toFixed(4)};`} aria-label="Airo career perks" use:reveal={90}>
        <div class="perks-progress" aria-hidden="true"><span></span></div>
        <div class="perks-aurora" aria-hidden="true"></div>
        {#each perks as perk, index}
          <article
            class:perk-active={cardActive(index)}
            class={`perk-card perk-scroll-card perk-card-${index + 1}`}
            style={cardStyle(index)}
            use:fadeCardReveal={{ index, step: 76, mobileStep: 135 }}
          >
            <span class="card-icon" aria-hidden="true">
              <tgs-player src={perk.icon} autoplay loop mode="normal"></tgs-player>
            </span>
            <div>
              <h3>{perk.title}</h3>
              {#if perk.copy}
                <p>{perk.copy}</p>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section class="values-section" aria-labelledby="values-title">
    <div class="section-heading" use:reveal>
      <div class="section-kicker small" aria-label="Culture">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <strong>Culture</strong>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>
      </div>
      <h2 id="values-title">Our core values</h2>
    </div>

    <div class="culture-stage culture-stage-built" use:reveal={80}>
      <div class="culture-art" aria-hidden="true">
        <span class="culture-floor-glow"></span>
        <img class="culture-beams-combined" src="/culture-beams-combined.svg" alt="" />
      </div>

      <article class="value-card value-top tone-purple" style="--value-delay: 90ms;" use:fadeCardReveal={{ index: 0, step: 100, mobileStep: 145 }}>
        <span class="value-icon" aria-hidden="true">
          <tgs-player src={values[0].icon} autoplay loop mode="normal"></tgs-player>
        </span>
        <div>
          <h3><span>{values[0].number}</span> {values[0].title}</h3>
          <p>{values[0].copy}</p>
        </div>
      </article>

      <article class="value-card value-left tone-green" style="--value-delay: 240ms;" use:fadeCardReveal={{ index: 1, step: 100, mobileStep: 145 }}>
        <span class="value-icon" aria-hidden="true">
          <tgs-player src={values[1].icon} autoplay loop mode="normal"></tgs-player>
        </span>
        <div>
          <h3><span>{values[1].number}</span> {values[1].title}</h3>
          <p>{values[1].copy}</p>
        </div>
      </article>

      <article class="value-card value-right tone-gold" style="--value-delay: 330ms;" use:fadeCardReveal={{ index: 2, step: 100, mobileStep: 145 }}>
        <span class="value-icon" aria-hidden="true">
          <tgs-player src={values[2].icon} autoplay loop mode="normal"></tgs-player>
        </span>
        <div>
          <h3><span>{values[2].number}</span> {values[2].title}</h3>
          <p>{values[2].copy}</p>
        </div>
      </article>

      <img class="values-logo" src="/logos/airo.svg" alt="Airo" />
    </div>

  </section>

  <section class="process-section" aria-labelledby="process-title">
    <div class="section-heading" use:reveal>
      <div class="section-kicker small" aria-label="Process">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <strong>Process</strong>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>
      </div>
      <h2 id="process-title">How hiring works</h2>
      <p>Four clear steps. No jargon, no surprises.</p>
    </div>

    <div class="process-grid hiring-process-grid">
      {#each process as item, index}
        <article class={`process-card process-card-${item.type}`} use:cardReveal={{ index, step: 92, mobileStep: 155 }}>
          <div class="process-top">
            <span class="card-icon process-icon" aria-hidden="true">
              <tgs-player src={processStickerSrc(item.icon)} autoplay loop mode="normal"></tgs-player>
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </div>
          </div>

          {#if item.type === 'progress'}
            <div class="process-upload" aria-hidden="true">
              <div class="upload-row">
                <span class="upload-icon upload-cloud-icon">
                  <tgs-player src="/stickers/upload.tgs" autoplay loop mode="normal"></tgs-player>
                </span>
                <strong>Upload your portfolio</strong>
                <em>(PDF–JPEG–WEBP)</em>
                <b>93%</b>
              </div>
              <div class="upload-bar"><span></span></div>
            </div>
          {:else if item.type === 'messages'}
            <div class="process-call" aria-hidden="true">
              <div class="call-title">
                <span class="call-bars"><i></i><i></i><i></i><i></i></span>
                <strong>Voice call with hiring lead</strong>
                <em>19:45 minute remaining</em>
              </div>
              <div class="audio-player">
                <span class="play-button">
                  <svg class="play-state play-state-play" viewBox="0 0 24 24"><path d="M9 7.5 17 12l-8 4.5v-9Z" /></svg>
                  <svg class="play-state play-state-pause" viewBox="0 0 24 24"><path d="M8.5 7.5h2.5v9H8.5v-9Zm4.5 0h2.5v9H13v-9Z" /></svg>
                </span>
                <span class="waveform voice-running-line">
                  <span class="voice-progress-line"></span>
                  {#each Array(28) as _, waveIndex}
                    <i style={`--wave-index:${waveIndex}`}></i>
                  {/each}
                </span>
                <span class="audio-divider" aria-hidden="true"></span>
                <span class="hang-icon clean-phone-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5.35c-1.55 0-2.8 1.25-2.8 2.8v3.35c0 1.55 1.25 2.8 2.8 2.8s2.8-1.25 2.8-2.8V8.15c0-1.55-1.25-2.8-2.8-2.8Z" />
                    <path d="M6.65 11.15c0 3.15 2.2 5.35 5.35 5.35s5.35-2.2 5.35-5.35" />
                    <path d="M12 16.5v2.15M9.25 20.25h5.5" />
                  </svg>
                </span>
              </div>
            </div>
          {:else if item.type === 'checklist'}
            <div class="process-craft" aria-hidden="true">
              <div class="task-list">
                <strong>Your task stats</strong>
                <span><i></i>Quest accepted</span>
                <span><i></i>Mission completed</span>
                <span><i></i>Rewards unlocked</span>
              </div>
              <div class="task-ring">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="45"></circle>
                  <circle class="ring-progress" cx="60" cy="60" r="45"></circle>
                </svg>
                <span class="task-ring-content">
                  <strong>Progress</strong>
                  <b>98%</b>
                </span>
              </div>
            </div>
          {:else}
            <div class="process-offer" aria-hidden="true">
              <div class="ready-line">
                <span>
                  <svg viewBox="0 0 24 24"><path d="m6.5 12.2 3.4 3.4 7.6-8" /></svg>
                </span>
                <strong>Your project is ready</strong>
              </div>
              <div class="offer-timeline">
                {#each Array(5) as _, stepIndex}
                  <i style={`--step-index:${stepIndex}`}></i>
                {/each}
                <span class="offer-runner"></span>
              </div>
              <div class="offer-labels">
                <span>in progress</span>
                <span>Complete</span>
              </div>
            </div>
          {/if}
        </article>
      {/each}
    </div>
  </section>

  <section id="job-openings" class="jobs-section jobs-section-figma" aria-labelledby="jobs-title">
    <div class="section-heading jobs-heading" use:reveal>
      <div class="section-kicker small" aria-label="For job">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <strong>For job</strong>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>
      </div>
      <h2 id="jobs-title">Job openings</h2>
      <p>We are always looking for smart and creative people. If you do not see a role that fits, reach out and tell us how you can help Airo grow.</p>
      <div class="open-roles-pill" aria-label="5 open roles">
        <span></span>
        <strong>5 Open roles</strong>
      </div>
    </div>

    <div class={`jobs-grid jobs-grid-figma ${showAllRoles ? 'expanded' : ''}`}>
      {#each jobs.slice(0, showAllRoles ? 5 : 3) as job, index}
        <article class="job-card job-card-figma" use:cardReveal={{ index, step: 82, mobileStep: 145 }}>
          <h3>{job.title}</h3>
          <div class="job-tags">
            <span class="tag-growth">{job.team}</span>
            <span class="tag-remote">{job.location}</span>
            <span class="tag-time">{job.type}</span>
          </div>
          <div class="job-line"></div>
          <div class="job-bottom">
            <small>$50K - $65K</small>
            <button type="button" onclick={scrollToForm}>Submit</button>
          </div>
        </article>
      {/each}
    </div>

    <div class="jobs-more jobs-view-all" use:reveal>
      <span></span>
      <button type="button" onclick={() => (showAllRoles = !showAllRoles)}>
        {showAllRoles ? 'Show less' : 'View all roles'}
      </button>
      <span></span>
    </div>
  </section>
</div>

<style>
  :global(.site-shell.careers-route) {
    padding-bottom: 0;
    background:
      radial-gradient(circle at 50% 12%, rgba(115,0,255,.2), transparent 22%),
      linear-gradient(180deg, #050107 0%, #030005 100%);
  }

  :global(.site-shell.careers-route .hero-section.empty-route-section) {
    min-height: 0;
    padding-top: 0;
  }

  .careers-page {
    position: relative;
    z-index: 1;
    width: 100%;
    overflow-x: clip;
    overflow-y: visible;
    color: #fff;
    padding: 0 0 clamp(36px, 5vw, 72px);
    isolation: isolate;
  }

  @supports not (overflow: clip) {
    .careers-page { overflow-x: hidden; }
  }

  .career-bg,
  .career-bg span {
    position: absolute;
    pointer-events: none;
  }

  .career-bg {
    inset: 0;
    z-index: -1;
    overflow: hidden;
  }

  .glow {
    border-radius: 9999px;
    filter: blur(95px);
    mix-blend-mode: screen;
  }

  .glow-left {
    left: max(-340px, -16vw);
    top: 0;
    width: min(590px, 48vw);
    height: 1180px;
    background: linear-gradient(180deg, rgba(115,0,255,.95), rgba(115,0,255,.12) 68%, transparent);
    opacity: .72;
  }

  .glow-right {
    right: max(-360px, -18vw);
    top: -50px;
    width: min(640px, 50vw);
    height: 1240px;
    background: linear-gradient(180deg, rgba(115,0,255,.95), rgba(175,139,249,.34) 46%, transparent);
    opacity: .75;
  }

  .glow-center {
    left: 50%;
    top: 2410px;
    width: min(780px, 78vw);
    height: 1120px;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at 50% 35%, rgba(232,228,255,.78), rgba(175,139,249,.42) 20%, rgba(115,0,255,.46) 42%, transparent 74%);
    opacity: .82;
  }

  .career-lines {
    left: 50%;
    top: 240px;
    width: min(1180px, 96vw);
    height: 3260px;
    transform: translateX(-50%);
    opacity: .1;
    background: repeating-linear-gradient(90deg, transparent 0 88px, rgba(255,255,255,.09) 89px 90px, transparent 91px 136px);
    mask-image: linear-gradient(180deg, transparent, #000 13%, #000 80%, transparent);
  }

  .career-hero,
  .perks-section,
  .values-section,
  .process-section,
  .jobs-section,
  .careers-video {
    position: relative;
    width: min(1050px, calc(100vw - 48px));
    margin-left: auto;
    margin-right: auto;
  }

  .career-hero {
    width: 100%;
    max-width: none;
    height: 760px;
    min-height: 760px;
    text-align: center;
    scroll-margin-top: 0;
  }

  .hero-content {
    position: absolute;
    left: 50%;
    top: 136px;
    width: min(710px, calc(100vw - 40px));
    height: 560px;
    transform: translateX(-50%);
    --reveal-from: translate(-50%, 18px);
    --reveal-to: translate(-50%, 0);
  }

  .section-kicker {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 154px;
    height: 36px;
    margin-bottom: 12px;
    color: #fff;
    font-size: clamp(11px, .95vw, 14px);
    line-height: 1;
    font-weight: 500;
    letter-spacing: .035em;
  }

  .hero-kicker {
    position: absolute;
    left: 50%;
    top: 0;
    width: 194px;
    min-width: 194px;
    height: 66px;
    margin: 0;
    transform: translateX(-50%);
    font-size: 19px;
    line-height: 66px;
    font-weight: 500;
    letter-spacing: .06em;
  }

  .section-kicker.small {
    min-width: 112px;
    height: 32px;
    margin-bottom: 8px;
    font-size: clamp(10px, .88vw, 13px);
  }

  .section-kicker .corner {
    position: absolute;
    width: 8px;
    height: 8px;
    border-color: rgba(255,255,255,.9);
  }

  .corner-tl { left: 0; top: 4px; border-left: 1.5px solid; border-top: 1.5px solid; }
  .corner-tr { right: 0; top: 4px; border-right: 1.5px solid; border-top: 1.5px solid; }
  .corner-bl { left: 0; bottom: 4px; border-left: 1.5px solid; border-bottom: 1.5px solid; }
  .corner-br { right: 0; bottom: 4px; border-right: 1.5px solid; border-bottom: 1.5px solid; }

  .hero-kicker .corner {
    width: 9px;
    height: 9px;
    border-width: 2.25px;
  }

  .hero-kicker .corner-tl { left: 0; top: 19px; }
  .hero-kicker .corner-tr { right: 0; top: 19px; }
  .hero-kicker .corner-bl { left: 0; bottom: 14px; }
  .hero-kicker .corner-br { right: 0; bottom: 14px; }

  .section-kicker strong {
    font: inherit;
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  .career-hero h1 {
    position: absolute;
    left: 50%;
    top: 88px;
    width: min(660px, 100%);
    height: auto;
    transform: translateX(-50%);
    font-size: clamp(40px, 4.65vw, 64px);
    line-height: 1.12;
    letter-spacing: -.018em;
    font-weight: 600;
    text-shadow: 0 0 42px rgba(255,255,255,.26);
    white-space: nowrap;
  }

  .career-hero p {
    position: absolute;
    left: 50%;
    top: 178px;
    width: min(690px, 100%);
    height: auto;
    margin: 0;
    transform: translateX(-50%);
    color: rgba(255,255,255,.7);
    font-size: clamp(14px, 1.34vw, 18.5px);
    line-height: 1.58;
    font-weight: 400;
    letter-spacing: 0;
    text-align: center;
  }

  .hero-careers-sticker {
    position: absolute;
    left: 50%;
    top: 278px;
    z-index: 3;
    width: clamp(132px, 12.8vw, 168px);
    height: clamp(132px, 12.8vw, 168px);
    transform: translateX(-50%);
    pointer-events: none;
    filter: drop-shadow(0 16px 42px rgba(115, 0, 255, .44)) drop-shadow(0 0 22px rgba(232, 228, 255, .2));
  }

  .hero-careers-sticker :global(tgs-player) {
    display: block;
    width: 100%;
    height: 100%;
  }

  .hero-actions {
    position: absolute;
    left: 50%;
    top: 472px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    width: 404px;
    height: 52px;
    margin: 0;
    transform: translateX(-50%);
    flex-wrap: nowrap;
  }

  .primary-btn,
  .ghost-btn,
  .jobs-more button,
  .job-card button {
    appearance: none;
    border: 0;
    color: #fff;
    font: inherit;
    cursor: pointer;
  }

  .primary-btn,
  .ghost-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: 194px;
    height: 51px;
    min-height: 51px;
    padding: 0;
    border-radius: 52.6999px;
    font-size: 16.7px;
    line-height: 1;
    font-weight: 500;
    letter-spacing: 0;
    overflow: hidden;
    transform: translateZ(0);
    will-change: transform;
    transition: transform .25s ease, border-color .25s ease, background .25s ease;
  }

  .primary-btn {
    background: rgba(115, 0, 255, .6);
    background-blend-mode: screen;
    box-shadow: 0 5.4566px 77.9514px -0.779514px rgba(48, 0, 105, 0.4), inset 0 1px 0 rgba(255,255,255,.15);
  }

  .ghost-btn {
    background: linear-gradient(90deg, #1E0042 0%, #2C0062 100%);
    border: 0;
    box-shadow: 0 5.4566px 77.9514px -0.779514px rgba(48, 0, 105, 0.4), inset 0 1px 0 rgba(255,255,255,.12);
    backdrop-filter: blur(14px);
  }

  .primary-btn::before,
  .ghost-btn::before {
    content: '';
    position: absolute;
    inset: -80% auto -80% -45%;
    width: 45%;
    transform: rotate(16deg);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
    opacity: 0;
    transition: transform .55s ease, opacity .25s ease;
  }

  .primary-btn:hover,
  .ghost-btn:hover,
  .jobs-more button:hover,
  .job-card button:hover {
    transform: translateY(-2px);
  }

  .primary-btn:hover::before,
  .ghost-btn:hover::before {
    opacity: .7;
    transform: translateX(360%) rotate(16deg);
  }

  .primary-btn svg,
  .ghost-btn svg {
    position: relative;
    z-index: 1;
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.1px;
    stroke-linecap: round;
    stroke-linejoin: round;
    overflow: visible;
  }

  .primary-btn span,
  .ghost-btn span {
    position: relative;
    z-index: 1;
  }

  .primary-btn path,
  .ghost-btn path {
    stroke-dasharray: 100;
    stroke-dashoffset: 0;
  }

  .primary-btn:hover path,
  .primary-btn:focus-visible path,
  .ghost-btn:hover path,
  .ghost-btn:focus-visible path {
    animation: heroArrowDraw 1180ms cubic-bezier(.19, 1, .22, 1) both;
  }

  .primary-btn:hover .arrow-head,
  .primary-btn:focus-visible .arrow-head,
  .ghost-btn:hover .arrow-head,
  .ghost-btn:focus-visible .arrow-head {
    animation-delay: 210ms;
  }

  .primary-btn:hover .hero-arrow-up,
  .primary-btn:focus-visible .hero-arrow-up {
    animation: heroArrowNudgeUp 900ms cubic-bezier(.19, 1, .22, 1) both;
  }

  .ghost-btn:hover .hero-arrow-down,
  .ghost-btn:focus-visible .hero-arrow-down {
    animation: heroArrowNudgeDown 900ms cubic-bezier(.19, 1, .22, 1) both;
  }

  #perks,
  #job-openings,
  :global(#work-with-us) {
    scroll-margin-top: 118px;
  }

  @keyframes heroArrowDraw {
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes heroArrowNudgeUp {
    0% { transform: translate(0, 0); }
    42% { transform: translate(3px, -3px); }
    100% { transform: translate(0, 0); }
  }

  @keyframes heroArrowNudgeDown {
    0% { transform: translateY(0); }
    42% { transform: translateY(4px); }
    100% { transform: translateY(0); }
  }

  .perks-section {
    width: min(1120px, calc(100vw - 72px));
    min-height: auto;
    margin-top: clamp(22px, 3.2vw, 54px);
    scroll-margin-top: 118px;
    overflow: visible;
  }

  .perks-sticky {
    position: relative;
    top: auto;
    min-height: auto;
    display: grid;
    align-content: start;
    padding: clamp(14px, 2vw, 26px) 0 clamp(46px, 6vw, 82px);
  }

  .section-heading {
    text-align: center;
    width: min(650px, 100%);
    margin: 0 auto clamp(30px, 4vw, 48px);
  }

  .section-heading h2 {
    font-size: clamp(30px, 3.8vw, 51px);
    line-height: 1.06;
    font-weight: 650;
    letter-spacing: -.06em;
  }

  .section-heading p {
    width: min(610px, 100%);
    margin: 13px auto 0;
    color: rgba(255,255,255,.56);
    font-size: clamp(12px, 1.03vw, 15px);
    line-height: 1.55;
    letter-spacing: -.025em;
  }

  .perks-grid,
  .process-grid,
  .jobs-grid {
    display: grid;
    gap: 16px;
  }

  .perks-grid {
    width: min(790px, 100%);
    margin: 0 auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .perk-card,
  .process-card,
  .job-card {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(202,158,255,.16);
    background:
      linear-gradient(180deg, rgba(255,255,255,.052), rgba(255,255,255,.018)),
      rgba(10, 5, 16, .74);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.08),
      0 24px 64px rgba(0,0,0,.34),
      0 0 34px rgba(115,0,255,.1);
    backdrop-filter: blur(18px);
  }

  .perk-card::before,
  .process-card::before,
  .job-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 16% 18%, rgba(157,64,255,.27), transparent 27%),
      radial-gradient(circle at 92% 6%, rgba(255,255,255,.08), transparent 34%);
    opacity: .7;
    pointer-events: none;
  }

  .perk-card {
    min-height: 118px;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    gap: 15px;
    padding: 20px;
    border-radius: 25px;
  }

  .card-icon {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #7300ff, #a954ff);
    box-shadow: 0 12px 34px rgba(115,0,255,.43), inset 0 1px 0 rgba(255,255,255,.22);
  }

  .card-icon svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: #fff;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .card-icon :global(tgs-player) {
    display: block;
    width: 22px;
    height: 22px;
  }

  .perk-card h3,
  .process-card h3,
  .job-card h3,
  .value-card h3 {
    position: relative;
    z-index: 1;
    font-size: clamp(15px, 1.35vw, 18px);
    line-height: 1.1;
    font-weight: 650;
    letter-spacing: -.035em;
  }

  .perk-card p,
  .process-card p,
  .value-card p {
    position: relative;
    z-index: 1;
    margin-top: 7px;
    color: rgba(255,255,255,.58);
    font-size: 12px;
    line-height: 1.45;
    letter-spacing: -.02em;
  }

  .perks-heading {
    width: min(900px, 100%);
    margin-bottom: clamp(24px, 3.5vw, 42px);
  }

  .perks-heading .section-kicker.small {
    min-width: 120px;
    height: 42px;
    margin-bottom: clamp(18px, 2.4vw, 28px);
    font-size: clamp(18px, 1.7vw, 24px);
    font-weight: 700;
    letter-spacing: -.025em;
  }

  .perks-heading .section-kicker.small .corner {
    width: 10px;
    height: 10px;
    border-width: 2.2px;
  }

  .perks-heading h2 {
    font-size: clamp(34px, 4.1vw, 52px);
    line-height: 1;
    letter-spacing: -.055em;
    font-weight: 700;
  }

  .perks-heading p {
    width: min(820px, 100%);
    margin-top: clamp(14px, 1.8vw, 22px);
    color: rgba(255,255,255,.82);
    font-size: clamp(14px, 1.35vw, 18px);
    line-height: 1.42;
    font-weight: 560;
    letter-spacing: -.035em;
  }

  .perks-stage {
    position: relative;
    width: min(1040px, 100%);
    height: clamp(500px, 44vw, 560px);
    margin: 0 auto;
    perspective: 1300px;
    isolation: isolate;
    overflow: visible;
    border-radius: clamp(32px, 4vw, 54px);
    pointer-events: none;
    touch-action: pan-y;
    contain: layout size;
  }

  .perks-stage::before,
  .perks-stage::after,
  .perks-aurora {
    content: '';
    position: absolute;
    pointer-events: none;
    z-index: 0;
  }

  .perks-stage::before {
    left: 50%;
    bottom: -2%;
    width: 96%;
    height: 57%;
    transform: translateX(-50%);
    border-radius: 44% 44% 16% 16%;
    background:
      radial-gradient(ellipse at 50% 84%, rgba(255,255,255,.5), transparent 9%),
      radial-gradient(ellipse at 50% 72%, rgba(178,123,255,.42), transparent 25%),
      radial-gradient(ellipse at 12% 72%, rgba(137,0,255,.34), transparent 18%),
      radial-gradient(ellipse at 88% 72%, rgba(137,0,255,.3), transparent 18%);
    filter: blur(30px);
    opacity: .5;
  }

  .perks-stage::after {
    inset: 5% 2% -6%;
    border-radius: 58px;
    background-image: radial-gradient(circle, rgba(255,255,255,.28) 1px, transparent 1.35px);
    background-size: 7px 7px;
    opacity: .23;
    mask-image: radial-gradient(ellipse at 50% 60%, #000 0 25%, rgba(0,0,0,.76) 40%, transparent 70%);
    filter: blur(.2px);
  }

  .perks-aurora {
    left: 50%;
    bottom: 3%;
    width: 96%;
    height: 51%;
    transform: translateX(-50%) translateY(8px);
    border-radius: 999px;
    background:
      radial-gradient(ellipse at 18% 63%, rgba(255,255,255,.68), transparent 5%),
      radial-gradient(ellipse at 83% 62%, rgba(255,255,255,.58), transparent 5%),
      radial-gradient(ellipse at 50% 75%, rgba(255,255,255,.22), transparent 17%),
      radial-gradient(ellipse at 50% 48%, rgba(115,0,255,.35), transparent 42%);
    filter: blur(40px);
    opacity: .52;
    mix-blend-mode: screen;
  }

  .perks-progress {
    position: absolute;
    left: 50%;
    top: 22px;
    bottom: 32px;
    width: 1px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, transparent, rgba(255,255,255,.12), transparent);
    z-index: 1;
    overflow: hidden;
  }

  .perks-progress span {
    display: block;
    width: 100%;
    height: 34%;
    background: linear-gradient(180deg, rgba(255,255,255,0), rgba(203,166,255,.58), rgba(115,0,255,.1), rgba(255,255,255,0));
    box-shadow: 0 0 12px rgba(164,78,255,.42);
    animation: perksRailScroll 3.6s linear infinite;
  }

  @keyframes perksRailScroll {
    from { transform: translateY(-115%); }
    to { transform: translateY(315%); }
  }

  .perks-stage .perk-card {
    position: absolute;
    top: 0;
    z-index: var(--loop-zindex);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: clamp(12px, 1.5vw, 20px);
    width: 42.5%;
    height: clamp(104px, 9.8vw, 124px);
    min-height: 0;
    padding: 0 clamp(17px, 2vw, 28px);
    border-radius: clamp(22px, 2.2vw, 32px);
    border: 1px solid rgba(213,184,255,.22);
    background:
      radial-gradient(circle at 9% 30%, rgba(124,24,255,.14), transparent 31%),
      linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.014)),
      rgba(5, 2, 9, .94);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.08),
      0 18px 46px rgba(0,0,0,.46),
      0 0 0 1px rgba(115,0,255,.05),
      0 0 26px rgba(145,62,255,.11);
    backdrop-filter: blur(22px) saturate(132%);
    opacity: var(--loop-opacity);
    filter: blur(var(--loop-blur)) saturate(calc(.84 + var(--perk-clarity) * .24));
    transform-origin: center;
    transform-style: preserve-3d;
    transform: translate3d(var(--loop-x), var(--loop-y), 0) translateZ(0) scale(var(--loop-scale)) rotate(var(--loop-tilt));
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    pointer-events: none;
    will-change: transform, opacity, filter;
  }

  .perks-stage .perk-card:nth-of-type(odd) {
    left: 4.5%;
  }

  .perks-stage .perk-card:nth-of-type(even) {
    left: 53%;
  }

  .perks-stage .perk-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(110deg, transparent 0 20%, rgba(255,255,255,.14) 34%, transparent 52%),
      radial-gradient(circle at 14% 50%, rgba(153,70,255,.22), transparent 26%);
    opacity: calc(var(--perk-clarity) * .32);
    pointer-events: none;
    transform: translateX(calc(-22% + var(--perk-clarity) * 10%));
  }

  .perks-stage .perk-card::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(115deg, rgba(202,165,255,.52), rgba(115,0,255,.1) 42%, rgba(255,255,255,.2));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    opacity: calc(.1 + var(--perk-clarity) * .28);
    pointer-events: none;
  }

  .perks-stage .perk-active {
    border-color: rgba(218,190,255,.52);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.11),
      0 30px 78px rgba(0,0,0,.62),
      0 0 0 1px rgba(115,0,255,.08),
      0 0 38px rgba(164,78,255,.16);
  }

  .perks-stage .card-icon {
    width: clamp(44px, 4.6vw, 64px);
    height: clamp(44px, 4.6vw, 64px);
    border-radius: clamp(15px, 1.5vw, 21px);
    background: linear-gradient(135deg, #7400ff 0%, #8f22ff 48%, #b05dff 100%);
    box-shadow:
      0 0 calc(10px + var(--perk-clarity) * 14px) rgba(115,0,255,.44),
      0 14px 34px rgba(115,0,255,.28),
      inset 0 2px 0 rgba(255,255,255,.2);
    transform: scale(calc(.92 + var(--perk-clarity) * .12));
    transition: transform 120ms ease-out, box-shadow 120ms ease-out;
  }

  .perks-stage .perk-card:nth-child(2n) .card-icon {
    background: linear-gradient(135deg, #9650f4 0%, #a358f1 55%, #c083ff 100%);
  }

  .perks-stage .card-icon svg {
    width: clamp(24px, 2.4vw, 34px);
    height: clamp(24px, 2.4vw, 34px);
    stroke-width: 1.9;
    filter: drop-shadow(0 0 10px rgba(255,255,255,.22));
  }

  .perks-stage .card-icon :global(tgs-player) {
    display: block;
    width: clamp(24px, 2.4vw, 34px);
    height: clamp(24px, 2.4vw, 34px);
    filter: drop-shadow(0 0 10px rgba(255,255,255,.22));
  }

  .perks-stage .perk-card h3 {
    font-size: clamp(13px, 1.35vw, 20px);
    line-height: 1.06;
    text-transform: uppercase;
    letter-spacing: .07em;
    font-weight: 700;
  }

  .perks-stage .perk-card p {
    margin-top: clamp(6px, .65vw, 10px);
    color: rgba(255,255,255, calc(.44 + var(--perk-clarity) * .24));
    font-size: clamp(10.5px, .92vw, 13.5px);
    line-height: 1.42;
    letter-spacing: .02em;
    font-weight: 500;
  }


  .values-section {
    margin-top: clamp(88px, 10vw, 146px);
  }

  .values-orbit {
    position: relative;
    width: min(930px, 100%);
    height: clamp(420px, 50vw, 610px);
    margin: 0 auto;
  }

  .value-beams {
    position: absolute;
    inset: 0;
    overflow: visible;
  }

  .beam {
    fill: none;
    stroke: url(#career-beam);
    stroke-width: 4;
    stroke-linecap: round;
    filter: url(#career-beam-glow);
    opacity: .86;
    stroke-dasharray: 8 15;
    animation: beamFlow 9s linear infinite;
  }

  .beam-2 { animation-duration: 11s; }
  .beam-3 { animation-duration: 10s; animation-direction: reverse; }

  @keyframes beamFlow {
    to { stroke-dashoffset: -180; }
  }

  .values-logo {
    position: absolute;
    left: 50%;
    top: 53%;
    width: clamp(96px, 11vw, 154px);
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 0 30px rgba(175,139,249,.8));
  }

  .value-card {
    position: absolute;
    z-index: 2;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 13px;
    align-items: center;
    width: min(292px, 34vw);
    min-height: 98px;
    padding: 20px 22px;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,.16);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.13), 0 24px 80px rgba(0,0,0,.4);
    backdrop-filter: blur(18px);
  }

  .value-card > span {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 12px 30px rgba(0,0,0,.24);
  }

  .tone-purple {
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    background: linear-gradient(135deg, rgba(115,0,255,.95), rgba(161,71,255,.58) 55%, rgba(255,255,255,.06));
  }

  .tone-purple > span { background: linear-gradient(135deg, #7400ff, #bb73ff); }

  .tone-green {
    left: 0;
    bottom: 64px;
    background: linear-gradient(135deg, rgba(21,203,39,.9), rgba(69,205,68,.45) 55%, rgba(255,255,255,.055));
  }

  .tone-green > span { background: linear-gradient(135deg, #0bbf2b, #35e85e); }

  .tone-gold {
    right: 0;
    bottom: 64px;
    background: linear-gradient(135deg, rgba(236,151,37,.88), rgba(255,190,75,.34) 55%, rgba(255,255,255,.055));
  }

  .tone-gold > span { background: linear-gradient(135deg, #e99420, #ffd173); }

  .wide-placeholder,
  .careers-video {
    position: relative;
    display: grid;
    place-items: center;
    text-align: center;
    overflow: hidden;
    border-radius: clamp(32px, 4.2vw, 56px);
    border: 1px solid rgba(203,166,255,.22);
    background:
      radial-gradient(circle at 50% 42%, rgba(255,255,255,.24), rgba(175,139,249,.18) 17%, rgba(115,0,255,.12) 34%, transparent 72%),
      linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.015)),
      rgba(11, 5, 18, .75);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 24px 80px rgba(0,0,0,.42);
  }

  .wide-placeholder {
    width: min(860px, 100%);
    height: clamp(178px, 18vw, 236px);
    margin: clamp(8px, 1vw, 16px) auto 0;
  }

  .wide-placeholder::before,
  .careers-video::before {
    content: '';
    position: absolute;
    inset: -70% 26%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.38), transparent);
    transform: rotate(18deg);
    opacity: .5;
    filter: blur(12px);
  }

  .wide-placeholder span,
  .careers-video span {
    font-size: 13px;
    color: rgba(255,255,255,.76);
  }

  .wide-placeholder small,
  .careers-video small {
    margin-top: 5px;
    color: rgba(255,255,255,.48);
    font-size: 12px;
  }

  .process-section {
    margin-top: clamp(100px, 12vw, 170px);
  }

  .process-grid {
    width: min(810px, 100%);
    margin: 0 auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .process-card {
    min-height: 252px;
    display: flex;
    flex-direction: column;
    border-radius: 28px;
    padding: 22px;
  }

  .process-top {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 15px;
  }

  .process-card small {
    position: relative;
    z-index: 1;
    display: block;
    margin-top: auto;
    color: rgba(255,255,255,.48);
    font-size: 12px;
    letter-spacing: -.02em;
  }

  .mini-progress,
  .mini-chat,
  .mini-list,
  .mini-offer {
    position: relative;
    z-index: 1;
    margin-top: 22px;
  }

  .mini-progress {
    height: 14px;
    border-radius: 999px;
    background: rgba(255,255,255,.08);
    overflow: hidden;
  }

  .mini-progress span {
    display: block;
    width: 76%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #7300ff, #d292ff);
    box-shadow: 0 0 26px rgba(115,0,255,.8);
  }

  .mini-chat {
    display: grid;
    gap: 9px;
  }

  .mini-chat span {
    display: block;
    height: 13px;
    border-radius: 999px;
    background: rgba(255,255,255,.12);
  }

  .mini-chat span:nth-child(1) { width: 78%; background: rgba(115,0,255,.62); }
  .mini-chat span:nth-child(2) { width: 56%; }
  .mini-chat span:nth-child(3) { width: 88%; background: rgba(175,139,249,.23); }
  .mini-chat span:nth-child(4) { width: 38%; }

  .mini-list {
    display: grid;
    gap: 11px;
    margin-left: 0;
    padding: 0;
    list-style: none;
  }

  .mini-list li {
    height: 12px;
    width: 72%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,.3), rgba(255,255,255,.06));
  }

  .mini-list li::before {
    content: '✓';
    display: inline-grid;
    place-items: center;
    width: 17px;
    height: 17px;
    margin-right: 8px;
    transform: translateY(-2px);
    border-radius: 99px;
    color: #fff;
    font-size: 10px;
    background: #7300ff;
    box-shadow: 0 0 18px rgba(115,0,255,.7);
  }

  .mini-offer {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    height: 72px;
  }

  .mini-offer span {
    flex: 1;
    border-radius: 12px 12px 6px 6px;
    background: linear-gradient(180deg, rgba(168,85,247,.9), rgba(115,0,255,.18));
    box-shadow: 0 0 22px rgba(115,0,255,.35);
  }

  .mini-offer span:nth-child(1) { height: 42%; }
  .mini-offer span:nth-child(2) { height: 68%; }
  .mini-offer span:nth-child(3) { height: 92%; }

  .jobs-section {
    margin-top: clamp(100px, 12vw, 170px);
  }

  .jobs-filter {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin: -18px 0 24px;
  }

  .jobs-filter button {
    height: 31px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid rgba(203,166,255,.18);
    background: rgba(255,255,255,.055);
    color: rgba(255,255,255,.64);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: -.015em;
  }

  .jobs-filter button.active {
    color: #fff;
    background: linear-gradient(135deg, #1ccb3a, #0c9b22);
    border-color: rgba(255,255,255,.18);
    box-shadow: 0 10px 28px rgba(34,197,94,.24), inset 0 1px 0 rgba(255,255,255,.28);
  }

  .jobs-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 15px;
  }

  .job-card {
    min-height: 172px;
    border-radius: 24px;
    padding: 18px;
  }

  .job-meta,
  .job-tags,
  .job-bottom {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
  }

  .job-meta {
    justify-content: space-between;
    gap: 10px;
    color: rgba(255,255,255,.46);
    font-size: 10px;
    letter-spacing: .02em;
    text-transform: uppercase;
  }

  .job-card h3 {
    margin-top: 14px;
    font-size: clamp(15px, 1.28vw, 18px);
  }

  .job-tags {
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 13px;
  }

  .job-tags span {
    display: inline-flex;
    align-items: center;
    min-height: 20px;
    padding: 0 8px;
    border-radius: 999px;
    background: rgba(115,0,255,.28);
    border: 1px solid rgba(203,166,255,.16);
    color: rgba(255,255,255,.75);
    font-size: 10px;
    font-weight: 600;
  }

  .job-tags span:nth-child(3n+2) {
    background: rgba(255,196,82,.18);
  }

  .job-bottom {
    justify-content: space-between;
    margin-top: 22px;
  }

  .job-bottom small {
    color: rgba(255,255,255,.48);
    font-size: 11px;
  }

  .job-card button,
  .jobs-more button {
    min-height: 29px;
    padding: 0 13px;
    border-radius: 999px;
    background: linear-gradient(135deg, #7300ff, #b155ff);
    box-shadow: 0 10px 28px rgba(115,0,255,.38), inset 0 1px 0 rgba(255,255,255,.22);
    font-size: 11px;
    font-weight: 700;
    transition: transform .25s ease;
  }

  .jobs-more {
    display: flex;
    justify-content: center;
    margin-top: 26px;
  }

  .jobs-more button {
    min-height: 38px;
    padding: 0 20px;
  }

  .careers-video {
    width: min(820px, calc(100vw - 56px));
    height: clamp(210px, 19vw, 270px);
    margin-top: clamp(92px, 10vw, 142px);
  }

  :global(.career-reveal) {
    opacity: 0;
    transform: var(--reveal-from, translateY(22px));
    transition: opacity .68s ease var(--reveal-delay, 0ms), transform .68s ease var(--reveal-delay, 0ms);
  }

  :global(.career-reveal.career-visible) {
    opacity: 1;
    transform: var(--reveal-to, translateY(0));
  }

  :global(.career-fade-card-reveal) {
    opacity: 0;
    transition: opacity .72s ease var(--reveal-delay, 0ms);
  }

  :global(.career-fade-card-reveal.career-visible) {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .beam,
    .primary-btn::before,
    .ghost-btn::before,
    .primary-btn path,
    .ghost-btn path,
    .hero-arrow,
    .perks-stage::before,
    .perks-stage::after,
    .perks-aurora,
    .perks-stage .perk-card {
      animation: none !important;
      transition: none;
    }
  }



  @media (prefers-reduced-motion: reduce) {
    .perks-heading {
      opacity: 1;
      transform: none;
    }

    .perks-stage .perk-card,
    .perks-stage .perk-card::before,
    .perks-stage .card-icon {
      transition: none !important;
    }

    .perks-stage .perk-card {
      transition: none !important;
    }
  }
  @media (hover: none) {
    .primary-btn:hover,
    .ghost-btn:hover {
      transform: translateZ(0);
    }

    .primary-btn:hover::before,
    .ghost-btn:hover::before {
      opacity: 0;
    }
  }

  @media (max-width: 860px) {
    .careers-page {
      padding-top: 0;
    }

    #perks,
    #job-openings,
    :global(#work-with-us) {
      scroll-margin-top: 92px;
    }

    .career-hero {
      height: clamp(540px, 118vw, 640px);
      min-height: clamp(540px, 118vw, 640px);
    }

    .hero-content {
      top: clamp(90px, 18vw, 126px);
      width: min(690px, calc(100vw - 32px));
      height: 390px;
    }

    .hero-kicker {
      width: clamp(138px, 38vw, 170px);
      min-width: clamp(138px, 38vw, 170px);
      height: clamp(48px, 12.5vw, 58px);
      font-size: clamp(12px, 3.45vw, 15px);
      line-height: clamp(48px, 12.5vw, 58px);
    }

    .hero-kicker .corner {
      width: 8px;
      height: 8px;
      border-width: 2px;
    }

    .hero-kicker .corner-tl,
    .hero-kicker .corner-tr { top: 16px; }

    .hero-kicker .corner-bl,
    .hero-kicker .corner-br { bottom: 16px; }

    .career-hero h1 {
      top: clamp(50px, 12vw, 62px);
      width: 100%;
      height: auto;
      font-size: clamp(34px, 9.8vw, 52px);
      line-height: 1.08;
      white-space: normal;
      letter-spacing: -.035em;
    }

    .career-hero p {
      top: clamp(132px, 30vw, 158px);
      width: min(560px, 100%);
      height: auto;
      font-size: clamp(12.8px, 3.15vw, 16.5px);
      line-height: 1.55;
    }

    .hero-careers-sticker {
      top: clamp(222px, 50vw, 252px);
      width: clamp(62px, 15vw, 74px);
      height: clamp(62px, 15vw, 74px);
    }

    .hero-actions {
      top: clamp(322px, 72vw, 354px);
      width: 100%;
      max-width: 400px;
      height: clamp(42px, 10vw, 50px);
      gap: clamp(8px, 2.6vw, 13px);
      padding: 0;
    }

    .primary-btn,
    .ghost-btn {
      flex: 1 1 0;
      width: auto;
      height: clamp(42px, 10.8vw, 52px);
      min-height: clamp(42px, 10.8vw, 52px);
      font-size: clamp(11.5px, 3vw, 15.5px);
      line-height: 1;
      gap: 7px;
      border-radius: 999px;
    }

    .primary-btn svg,
    .ghost-btn svg {
      width: clamp(10px, 3vw, 13px);
      height: clamp(10px, 3vw, 13px);
    }

    .perks-grid,
    .process-grid,
    .jobs-grid {
      grid-template-columns: 1fr;
      width: min(560px, 100%);
      margin-left: auto;
      margin-right: auto;
    }

    .values-orbit {
      height: auto;
      display: grid;
      gap: 14px;
      padding: 116px 0 96px;
    }

    .value-beams {
      inset: -70px 0 -70px;
    }

    .value-card,
    .tone-purple,
    .tone-green,
    .tone-gold {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      transform: none;
      width: min(420px, 100%);
      margin: 0 auto;
    }

    .values-logo {
      top: 50%;
      opacity: .82;
    }

    .career-hero,
    .perks-section,
    .values-section,
    .process-section,
    .jobs-section,
    .careers-video {
      width: min(100% - 34px, 720px);
    }

    .perks-section {
      min-height: auto;
      margin-top: 0;
      width: min(100% - 34px, 720px);
    }

    .perks-sticky {
      top: auto;
      min-height: auto;
      padding: 12px 0 46px;
    }

    .perks-heading {
      margin-bottom: 26px;
    }

    .perks-heading .section-kicker.small {
      min-width: 112px;
      height: 42px;
      margin-bottom: 22px;
      font-size: clamp(15px, 4.6vw, 22px);
    }

    .perks-heading h2 {
      font-size: clamp(30px, 8vw, 46px);
      line-height: 1.03;
    }

    .perks-heading p {
      margin-top: 14px;
      font-size: clamp(14px, 3.65vw, 18px);
      line-height: 1.43;
      font-weight: 500;
      color: rgba(255,255,255,.78);
    }

    .perks-stage {
      width: min(100%, 560px);
      height: clamp(560px, 120vw, 660px);
      perspective: 900px;
      overflow: visible;
      contain: layout size;
    }

    .perks-progress {
      left: 13px;
      top: 20px;
      bottom: 30px;
    }

    .perks-stage .perk-card,
    .perks-stage .perk-card:nth-of-type(odd),
    .perks-stage .perk-card:nth-of-type(even) {
      left: 50%;
      top: 0;
      width: min(100% - 28px, 430px);
      height: clamp(104px, 25vw, 132px);
      padding: clamp(14px, 4vw, 20px);
      transform: translate3d(calc(-50% + var(--loop-x)), var(--loop-y), 0) translateZ(0) scale(var(--loop-scale)) rotate(calc(var(--loop-tilt) * .35));
    }

    .perks-stage .perk-card h3 {
      font-size: clamp(13px, 4vw, 18px);
    }

    .perks-stage .perk-card p {
      font-size: clamp(10.5px, 3.15vw, 13.5px);
    }

    .perks-stage .card-icon {
      width: clamp(42px, 12vw, 58px);
      height: clamp(42px, 12vw, 58px);
    }
  }


  @media (max-width: 560px) {
    .careers-page {
      padding-top: 0;
    }

    .career-hero {
      height: 570px;
      min-height: 570px;
    }

    .hero-content {
      top: 78px;
      width: min(100% - 34px, 390px);
      height: 445px;
    }

    .hero-careers-sticker {
      top: 254px;
      width: 58px;
      height: 58px;
    }

    .hero-actions {
      top: 330px;
      width: 100%;
      height: auto;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }

    .primary-btn,
    .ghost-btn {
      justify-content: center;
      width: 100%;
      height: 48px;
      min-height: 48px;
      font-size: 14px;
    }

    .perk-card,
    .process-card,
    .job-card {
      border-radius: 22px;
    }

    .process-card {
      min-height: 230px;
    }

    .values-orbit {
      padding-top: 92px;
      padding-bottom: 74px;
    }

    .value-card {
      grid-template-columns: 1fr;
      text-align: center;
      justify-items: center;
    }
  }

  /* v33 culture section: real Svelte cards over the provided center-beam SVG */
  .values-section {
    width: min(1060px, calc(100vw - 48px));
    margin-top: clamp(78px, 8.2vw, 118px);
    overflow: visible;
  }

  .values-section > .section-heading {
    width: min(580px, 100%);
    margin-bottom: clamp(10px, 1.8vw, 22px);
  }

  .culture-stage-built {
    position: relative;
    width: min(1000px, 100%);
    height: clamp(540px, 59vw, 650px);
    margin: 0 auto;
    isolation: isolate;
    overflow: visible;
  }

  .culture-stage-built .culture-art {
    position: absolute;
    left: 50%;
    top: -28px;
    width: min(1000px, 92vw);
    height: min(720px, 66vw);
    min-height: 520px;
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 0;
    animation: none;
  }

  .culture-beam {
    height: auto;
    mix-blend-mode: plus-lighter;
    will-change: transform, opacity, filter;
  }
  .culture-beams-combined {
    position: absolute;
    left: 50%;
    top: -76px;
    width: min(940px, 86vw);
    height: auto;
    transform: translateX(-50%);
    transform-origin: 50% 50%;
    mix-blend-mode: plus-lighter;
    filter: drop-shadow(0 0 42px rgba(150,64,255,.82));
    opacity: 1;
    pointer-events: none;
    will-change: transform, opacity, filter;
    animation: none;
  }


  .culture-beam-center {
    left: 50%;
    top: -18px;
    width: min(660px, 60vw);
    transform: translateX(-50%);
    transform-origin: 50% 50%;
    filter: drop-shadow(0 0 46px rgba(150,64,255,.92));
    opacity: 1;
    animation: cultureBeamCenterPulse 7s ease-in-out infinite;
  }

  .culture-beam-left {
    left: 50%;
    bottom: -8px;
    width: min(590px, 53vw);
    transform: translateX(-101%);
    transform-origin: 62% 90%;
    filter: drop-shadow(0 0 42px rgba(160,94,255,.66));
    opacity: .98;
    animation: cultureBeamWingLeft 8.4s ease-in-out infinite;
  }

  .culture-beam-right {
    left: 50%;
    bottom: -8px;
    width: min(580px, 53vw);
    transform: translateX(1%);
    transform-origin: 38% 90%;
    filter: drop-shadow(0 0 42px rgba(160,94,255,.66));
    opacity: .98;
    animation: cultureBeamWingRight 8.4s ease-in-out infinite;
  }

  .culture-floor-glow,
  .culture-beam {
    position: absolute;
    pointer-events: none;
  }

  .culture-floor-glow {
    left: 50%;
    bottom: 10%;
    width: 78%;
    height: 22%;
    transform: translateX(-50%);
    border-radius: 50%;
    background: radial-gradient(ellipse at 50% 55%, rgba(235,231,255,.78), rgba(144,61,255,.5) 30%, rgba(115,0,255,.28) 56%, transparent 78%);
    filter: blur(24px);
    opacity: .82;
    mix-blend-mode: plus-lighter;
  }


  .culture-stage-built .value-card {
    --value-x: 0px;
    --value-y: 0px;
    --value-enter-x: 0px;
    --value-enter-y: 22px;
    --value-float-x: 0px;
    --value-float-y: 0px;
    position: absolute;
    z-index: 5;
    display: grid;
    grid-template-columns: clamp(46px, 4.7vw, 58px) minmax(0, 1fr);
    align-items: center;
    gap: clamp(14px, 1.5vw, 22px);
    width: min(310px, 29.6vw);
    min-height: clamp(104px, 10.8vw, 128px);
    padding: clamp(16px, 1.7vw, 21px);
    border-radius: clamp(22px, 2.6vw, 30px);
    border: 1px solid rgba(255,255,255,.34);
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(255,255,255,.28) 0%, rgba(255,255,255,.075) 24%, rgba(255,255,255,.028) 58%, rgba(255,255,255,.12) 100%),
      radial-gradient(circle at 18% 2%, rgba(255,255,255,.34), transparent 30%),
      radial-gradient(circle at 74% 118%, var(--value-glass-tint), transparent 58%),
      rgba(10, 5, 18, .34);
    background-blend-mode: screen, screen, screen, normal;
    box-shadow:
      inset 0 1.5px 0 rgba(255,255,255,.46),
      inset 0 0 0 1px rgba(255,255,255,.06),
      inset 0 -20px 45px rgba(255,255,255,.055),
      0 18px 58px rgba(0,0,0,.34),
      0 0 42px var(--value-edge-glow);
    backdrop-filter: blur(46px) saturate(220%) contrast(1.12);
    -webkit-backdrop-filter: blur(46px) saturate(220%) contrast(1.12);
    opacity: 0;
    transform: translate3d(calc(var(--value-x) + var(--value-enter-x)), calc(var(--value-y) + var(--value-enter-y)), 0) scale(.965);
    animation:
      valueCardEntrance 950ms cubic-bezier(.19, 1, .22, 1) var(--value-delay, 0ms) forwards;
    will-change: transform, opacity, filter;
  }

  .culture-stage-built .value-card::before,
  .culture-stage-built .value-card::after {
    content: '';
    position: absolute;
    pointer-events: none;
  }

  .culture-stage-built .value-card::before {
    inset: -92% -26% auto -18%;
    height: 250%;
    background:
      radial-gradient(circle at var(--value-hot-x, 45%) var(--value-hot-y, 62%), var(--value-glow-1), var(--value-glow-2) 34%, transparent 66%);
    filter: blur(38px);
    opacity: .38;
    animation: none;
  }

  .culture-stage-built .value-card .value-icon::after {
    content: '';
    position: absolute;
    inset: 12%;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255,255,255,.38), transparent 42%);
    opacity: .44;
    pointer-events: none;
  }

  .culture-stage-built .value-card::after {
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(120deg, rgba(255,255,255,.46), rgba(255,255,255,.08) 14%, transparent 38%, rgba(255,255,255,.12) 74%, rgba(255,255,255,.26)),
      linear-gradient(180deg, rgba(255,255,255,.12), transparent 42%),
      radial-gradient(circle at 50% 100%, rgba(255,255,255,.24), transparent 38%);
    opacity: .54;
    mix-blend-mode: screen;
  }

  .culture-stage-built .value-card > * {
    position: relative;
    z-index: 1;
  }
  .culture-stage-built .value-card > div::before {
    content: '';
    position: absolute;
    left: -12%;
    right: -6%;
    top: -34%;
    height: 64%;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
    filter: blur(14px);
    opacity: .5;
    pointer-events: none;
    transform: rotate(-8deg);
  }


  .culture-stage-built .value-top {
    left: 50%;
    top: 10px;
    --value-x: -50%;
    --value-enter-y: 34px;
    --value-float-y: -4px;
  }

  .culture-stage-built .value-left {
    left: clamp(34px, 5vw, 74px);
    bottom: 54px;
    --value-enter-x: -28px;
    --value-enter-y: 24px;
    --value-float-x: -4px;
    --value-float-y: 3px;
  }

  .culture-stage-built .value-right {
    right: clamp(34px, 5vw, 74px);
    bottom: 54px;
    --value-enter-x: 28px;
    --value-enter-y: 24px;
    --value-float-x: 4px;
    --value-float-y: 3px;
  }

  .culture-stage-built .tone-purple {
    --value-glow-1: rgba(232,228,255,.9);
    --value-glow-2: rgba(115,0,255,.8);
    --value-edge-glow: rgba(115,0,255,.28);
    --value-glass-tint: rgba(152,70,255,.42);
    --icon-color: linear-gradient(180deg, rgba(174,113,255,.98) 0%, rgba(115,0,255,.92) 100%);
    --icon-glow: rgba(115,0,255,.72);
    --value-hot-x: 62%;
    --value-hot-y: 78%;
  }

  .culture-stage-built .tone-green {
    --value-glow-1: rgba(226,255,222,.84);
    --value-glow-2: rgba(13,255,0,.66);
    --value-edge-glow: rgba(13,255,0,.26);
    --value-glass-tint: rgba(74,255,68,.34);
    --icon-color: linear-gradient(180deg, rgba(171,255,164,.96) 0%, rgba(9,174,0,.88) 100%);
    --icon-glow: rgba(13,255,0,.62);
    --value-hot-x: 36%;
    --value-hot-y: 42%;
  }

  .culture-stage-built .tone-gold {
    --value-glow-1: rgba(255,245,219,.86);
    --value-glow-2: rgba(255,149,0,.7);
    --value-edge-glow: rgba(255,149,0,.27);
    --value-glass-tint: rgba(255,180,52,.36);
    --icon-color: linear-gradient(180deg, rgba(255,214,148,.98) 0%, rgba(224,127,0,.9) 100%);
    --icon-glow: rgba(255,149,0,.62);
    --value-hot-x: 68%;
    --value-hot-y: 36%;
  }

  .culture-stage-built .value-icon {
    display: grid;
    place-items: center;
    width: clamp(42px, 4.2vw, 52px);
    height: clamp(42px, 4.2vw, 52px);
    border-radius: clamp(13px, 1.4vw, 16px);
    position: relative;
    overflow: hidden;
    isolation: isolate;
    background:
      linear-gradient(135deg, rgba(255,255,255,.38), rgba(255,255,255,.07)),
      radial-gradient(circle at 25% 5%, rgba(255,255,255,.48), transparent 38%),
      var(--icon-color);
    opacity: .98;
    border: 1px solid rgba(255,255,255,.34);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.5),
      inset 0 -5px 14px rgba(0,0,0,.14),
      0 0 22px var(--icon-glow),
      0 0 46px var(--icon-glow);
    backdrop-filter: blur(20px) saturate(190%);
    -webkit-backdrop-filter: blur(20px) saturate(190%);
    animation: valueIconBreathe 4.6s ease-in-out infinite;
  }

  .culture-stage-built .value-icon svg {
    width: 54%;
    height: 54%;
    fill: none;
    stroke: rgba(255,255,255,.9);
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 12px rgba(255,255,255,.4));
    animation: valueIconDraw 5.4s ease-in-out infinite;
  }

  .culture-stage-built .value-icon :global(tgs-player) {
    display: block;
    width: 54%;
    height: 54%;
    filter: drop-shadow(0 0 12px rgba(255,255,255,.4));
  }

  .culture-stage-built .value-card h3 {
    font-size: clamp(16px, 1.48vw, 19.5px);
    line-height: 1.12;
    font-weight: 650;
    letter-spacing: -.045em;
    color: #fff;
  }

  .culture-stage-built .value-card h3 span {
    color: rgba(255,255,255,.15);
  }

  .culture-stage-built .value-card p {
    width: min(198px, 100%);
    margin-top: clamp(7px, .75vw, 9px);
    color: rgba(255,255,255,.62);
    font-size: clamp(10px, .84vw, 11.4px);
    line-height: 1.42;
    letter-spacing: .055em;
    font-weight: 500;
  }

  .culture-stage-built .values-logo {
    position: absolute;
    left: 50%;
    top: 50.5%;
    z-index: 3;
    width: clamp(90px, 8.6vw, 112px);
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 0 34px rgba(203,159,255,.86));
    opacity: .94;
    animation: none;
  }

  @keyframes valueCardEntrance {
    0% {
      opacity: 0;
      filter: blur(11px);
      transform: translate3d(calc(var(--value-x) + var(--value-enter-x)), calc(var(--value-y) + var(--value-enter-y)), 0) scale(.965);
    }
    100% {
      opacity: 1;
      filter: blur(0);
      transform: translate3d(var(--value-x), var(--value-y), 0) scale(1);
    }
  }

  @keyframes valueCardFloat {
    0%, 100% { transform: translate3d(var(--value-x), var(--value-y), 0) scale(1); }
    50% { transform: translate3d(calc(var(--value-x) + var(--value-float-x)), calc(var(--value-y) + var(--value-float-y)), 0) scale(1.006); }
  }

  @keyframes valueCardGlow {
    0%, 100% { opacity: .64; transform: translate3d(0, 0, 0) scale(1); }
    50% { opacity: .82; transform: translate3d(1.5%, -1%, 0) scale(1.045); }
  }

  @keyframes valueIconBreathe {
    0%, 100% { transform: translateZ(0) scale(1); box-shadow: inset 0 1px 0 rgba(255,255,255,.22), inset 0 -3px 10px rgba(0,0,0,.18), 0 0 20px var(--icon-glow), 0 0 42px var(--icon-glow); }
    50% { transform: translateZ(0) scale(1.045); box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 -3px 10px rgba(0,0,0,.16), 0 0 30px var(--icon-glow), 0 0 64px var(--icon-glow); }
  }

  @keyframes valueIconDraw {
    0%, 100% { stroke-dasharray: 1 0; opacity: .84; transform: translateY(0); }
    45% { stroke-dasharray: 14 5; opacity: 1; transform: translateY(-1px); }
  }

  @keyframes cultureArtBreathe {
    0%, 100% { opacity: .92; transform: translateX(-50%) scale(1); }
    50% { opacity: 1; transform: translateX(-50%) scale(1.012); }
  }

  @keyframes cultureCombinedBeamPulse {
    0%, 100% { opacity: .94; transform: translateX(-50%) scale(1); filter: drop-shadow(0 0 42px rgba(150,64,255,.82)); }
    50% { opacity: 1; transform: translateX(-50%) scale(1.014); filter: drop-shadow(0 0 66px rgba(203,159,255,.94)); }
  }

  @keyframes cultureBeamCenterPulse {
    0%, 100% { opacity: .94; transform: translateX(-50%) scale(1); filter: drop-shadow(0 0 42px rgba(150,64,255,.84)); }
    50% { opacity: 1; transform: translateX(-50%) scale(1.02); filter: drop-shadow(0 0 68px rgba(203,159,255,.96)); }
  }

  @keyframes cultureBeamWingLeft {
    0%, 100% { transform: translateX(-101%) translateY(0) scale(1); opacity: .92; }
    50% { transform: translateX(-101%) translateY(-5px) scale(1.02); opacity: 1; }
  }

  @keyframes cultureBeamWingRight {
    0%, 100% { transform: translateX(1%) translateY(0) scale(1); opacity: .92; }
    50% { transform: translateX(1%) translateY(-5px) scale(1.02); opacity: 1; }
  }

  @keyframes cultureSparkDrift {
    from { background-position: 0 0, 3px 5px; }
    to { background-position: 44px 52px, 63px 77px; }
  }

  @media (max-width: 980px) {
    .values-section {
      width: min(100% - 34px, 720px);
      margin-top: clamp(74px, 12vw, 116px);
    }

    .values-section > .section-heading {
      margin-bottom: 18px;
    }

    .culture-stage-built {
      width: 100%;
      height: auto;
      min-height: 0;
      display: grid;
      gap: 14px;
      padding: clamp(190px, 42vw, 280px) 0 42px;
    }

    .culture-stage-built .culture-art {
      top: -12px;
      width: min(760px, 138vw);
      height: clamp(420px, 92vw, 560px);
      min-height: 0;
      opacity: .9;
    }

    .culture-beams-combined {
      top: -48px;
      width: min(740px, 134vw);
    }

    .culture-beam-center {
      width: min(470px, 96vw);
    }

    .culture-beam-left,
    .culture-beam-right {
      width: min(410px, 82vw);
      bottom: 4px;
    }

    .culture-beam-left { transform: translateX(-101%); }
    .culture-beam-right { transform: translateX(1%); }


    .culture-stage-built .value-card,
    .culture-stage-built .value-top,
    .culture-stage-built .value-left,
    .culture-stage-built .value-right {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      width: min(430px, 100%);
      min-height: 138px;
      margin: 0 auto;
      padding: 22px;
      border-radius: 30px;
      --value-x: 0px;
      --value-y: 0px;
      --value-enter-x: 0px;
      --value-enter-y: 24px;
      --value-float-x: 0px;
      --value-float-y: 2px;
    }

    .culture-stage-built .value-top { order: 1; }
    .culture-stage-built .value-left { order: 2; }
    .culture-stage-built .value-right { order: 3; }

    .culture-stage-built .values-logo {
      top: clamp(138px, 28vw, 206px);
      width: clamp(100px, 24vw, 142px);
      opacity: .78;
    }
  }

  @media (max-width: 560px) {
    .culture-stage-built {
      padding-top: clamp(150px, 42vw, 190px);
      padding-bottom: 40px;
      gap: 12px;
    }

    .culture-stage-built .culture-art {
      width: 146vw;
      height: clamp(390px, 104vw, 500px);
      left: 50%;
      top: -4px;
    }

    .culture-stage-built .culture-beams-combined {
      top: -34px;
      width: min(600px, 148vw);
    }

    .culture-stage-built .culture-beam-center {
      width: min(360px, 92vw);
    }

    .culture-stage-built .culture-beam-left,
    .culture-stage-built .culture-beam-right {
      width: min(300px, 74vw);
      bottom: 18px;
    }

    .culture-stage-built .culture-beam-left { transform: translateX(-100%); }
    .culture-stage-built .culture-beam-right { transform: translateX(0%); }

    .culture-stage-built .value-card,
    .culture-stage-built .value-top,
    .culture-stage-built .value-left,
    .culture-stage-built .value-right {
      grid-template-columns: auto minmax(0, 1fr);
      text-align: left;
      justify-items: stretch;
      gap: 15px;
      min-height: 128px;
      padding: 18px;
      border-radius: 26px;
    }

    .culture-stage-built .value-icon {
      width: 54px;
      height: 54px;
      border-radius: 17px;
    }

    .culture-stage-built .value-card h3 {
      font-size: 20px;
    }

    .culture-stage-built .value-card p {
      margin-top: 8px;
      font-size: 11.5px;
      letter-spacing: .035em;
    }

    .culture-stage-built .values-logo {
      top: clamp(118px, 33vw, 152px);
      width: clamp(86px, 24vw, 112px);
    }
  }

  /* v40: Culture motion cleanup — no beam pulsing / no card floating, only icons stay alive */
  .culture-stage-built .culture-art,
  .culture-stage-built .culture-beams-combined,
  .culture-stage-built .value-card,
  .culture-stage-built .value-card::before,
  .culture-stage-built .values-logo {
    animation-name: none !important;
  }

  .culture-stage-built .value-card {
    transform: translate3d(var(--value-x), var(--value-y), 0) scale(1) !important;
    opacity: 1;
  }

  .culture-stage-built .value-icon,
  .culture-stage-built .value-icon svg {
    animation-play-state: running;
  }

  /* v40: process section rebuilt from the supplied PNG/SVG reference */
  .process-section {
    width: min(1194px, calc(100vw - 48px));
    margin-top: clamp(92px, 10vw, 150px);
  }

  .process-section .section-heading {
    width: min(760px, 100%);
    margin-bottom: clamp(42px, 5.4vw, 78px);
  }

  .process-section .section-kicker.small {
    min-width: 142px;
    height: 44px;
    margin-bottom: clamp(20px, 2.4vw, 32px);
    font-size: clamp(18px, 1.55vw, 25px);
    font-weight: 700;
    letter-spacing: -.025em;
  }

  .process-section .section-kicker.small .corner {
    width: 12px;
    height: 12px;
    border-width: 2.4px;
  }

  .process-section h2 {
    font-size: clamp(42px, 5.15vw, 70px);
    line-height: .98;
    letter-spacing: -.06em;
    font-weight: 760;
    text-shadow: 0 0 34px rgba(255,255,255,.18);
  }

  .process-section > .section-heading > p {
    margin-top: clamp(18px, 2vw, 28px);
    color: rgba(255,255,255,.9);
    font-size: clamp(18px, 1.75vw, 28px);
    font-weight: 650;
    line-height: 1.2;
    letter-spacing: -.045em;
  }

  .hiring-process-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(22px, 2.3vw, 30px);
    margin: 0 auto;
  }

  .hiring-process-grid .process-card {
    position: relative;
    min-height: clamp(286px, 26vw, 340px);
    padding: clamp(30px, 3vw, 43px);
    border-radius: clamp(42px, 4.2vw, 60px);
    overflow: hidden;
    border: 1.8px solid rgba(218,183,255,.5);
    background:
      radial-gradient(circle at 7% 12%, rgba(115,0,255,.24), transparent 28%),
      radial-gradient(circle at 98% 88%, rgba(115,0,255,.18), transparent 36%),
      linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.012)),
      rgba(4, 2, 8, .86);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.12),
      inset 0 -1px 0 rgba(255,255,255,.04),
      0 26px 90px rgba(0,0,0,.34);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
  }

  .hiring-process-grid .process-card::before {
    opacity: .72;
    background:
      radial-gradient(circle at 6% 9%, rgba(255,255,255,.22), transparent 10%),
      radial-gradient(circle at 2% 18%, rgba(139,35,255,.9), rgba(115,0,255,.2) 17%, transparent 35%);
    filter: blur(7px);
  }

  .hiring-process-grid .process-card::after {
    content: '';
    position: absolute;
    pointer-events: none;
    inset: auto auto -24px -60px;
    width: 250px;
    height: 150px;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(255,255,255,.7), rgba(115,0,255,.7) 32%, transparent 70%);
    filter: blur(18px);
    opacity: .35;
  }

  .hiring-process-grid .process-card-messages::after,
  .hiring-process-grid .process-card-offer::after {
    left: auto;
    right: -54px;
    background: radial-gradient(ellipse at center, rgba(255,255,255,.55), rgba(115,0,255,.7) 34%, transparent 70%);
  }

  .hiring-process-grid .process-card-checklist::after {
    left: 46%;
    bottom: -30px;
    width: 210px;
    height: 140px;
    opacity: .3;
  }

  .hiring-process-grid .process-top {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: clamp(72px, 7vw, 92px) minmax(0, 1fr);
    gap: clamp(22px, 2.3vw, 34px);
    align-items: start;
  }

  .hiring-process-grid .process-icon {
    width: clamp(72px, 7vw, 92px);
    height: clamp(72px, 7vw, 92px);
    border-radius: clamp(24px, 2.3vw, 32px);
    background:
      linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.04)),
      linear-gradient(135deg, #7300ff, #a65bff);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.34),
      0 0 24px rgba(115,0,255,.8),
      0 0 68px rgba(115,0,255,.34);
    animation: processIconPulse 3.8s ease-in-out infinite;
  }

  .hiring-process-grid .process-card-messages .process-icon,
  .hiring-process-grid .process-card-checklist .process-icon {
    background:
      linear-gradient(135deg, rgba(255,255,255,.26), rgba(255,255,255,.05)),
      linear-gradient(135deg, #9d50ff, #b76dff);
  }

  .hiring-process-grid .process-icon svg {
    width: 55%;
    height: 55%;
    stroke-width: 1.55;
    animation: processIconDraw 4.6s ease-in-out infinite;
  }

  .hiring-process-grid .process-icon :global(tgs-player) {
    display: block;
    width: 72%;
    height: 72%;
  }

  .upload-icon :global(tgs-player) {
    display: block;
    width: 30px;
    height: 30px;
  }

  .hiring-process-grid .process-card h3 {
    margin-top: clamp(8px, .9vw, 13px);
    color: #fff;
    font-size: clamp(24px, 2.2vw, 35px);
    line-height: 1.04;
    font-weight: 750;
    letter-spacing: .035em;
    text-transform: uppercase;
  }

  .hiring-process-grid .process-card p {
    width: min(420px, 100%);
    margin-top: clamp(12px, 1.2vw, 18px);
    color: rgba(255,255,255,.72);
    font-size: clamp(15px, 1.35vw, 20px);
    line-height: 1.45;
    font-weight: 550;
    letter-spacing: .035em;
  }

  .process-upload,
  .process-call,
  .process-craft,
  .process-offer {
    position: relative;
    z-index: 2;
    margin-top: clamp(32px, 3vw, 50px);
  }

  .upload-row,
  .call-title,
  .ready-line {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
  }

  .upload-row strong,
  .call-title strong,
  .ready-line strong,
  .task-list strong {
    color: #fff;
    font-size: clamp(16px, 1.55vw, 24px);
    line-height: 1;
    font-weight: 680;
    letter-spacing: -.02em;
  }

  .upload-row em,
  .call-title em {
    color: rgba(255,255,255,.56);
    font-style: normal;
    font-size: clamp(10px, .95vw, 15px);
    font-weight: 650;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  .upload-row b {
    margin-left: auto;
    color: rgba(255,255,255,.62);
    font-size: clamp(20px, 2vw, 28px);
    font-weight: 560;
    letter-spacing: -.05em;
  }

  .upload-icon,
  .volume-icon,
  .hang-icon,
  .ready-line span {
    display: inline-grid;
    place-items: center;
    flex: none;
  }

  .upload-icon svg,
  .volume-icon svg,
  .hang-icon svg,
  .ready-line svg {
    width: 26px;
    height: 26px;
    fill: none;
    stroke: rgba(241,225,255,.92);
    stroke-width: 2.1;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .upload-icon svg {
    animation: uploadLift 2.4s ease-in-out infinite;
  }

  .upload-bar {
    position: relative;
    height: 24px;
    margin-top: 28px;
    border-radius: 999px;
    overflow: hidden;
    background: rgba(255,255,255,.055);
    border: 1px solid rgba(255,255,255,.14);
  }

  .upload-bar span {
    display: block;
    width: 83%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #ec30ff, #961dff, #7300ff);
    box-shadow: 0 0 24px rgba(199,45,255,.8), 0 0 42px rgba(115,0,255,.7);
    transform-origin: left center;
    animation: uploadProgress 2.6s cubic-bezier(.2,.8,.2,1) infinite;
  }

  .upload-bar::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.34) 48%, transparent 100%);
    transform: translateX(-120%);
    animation: uploadShine 2.6s ease-in-out infinite;
  }

  .call-title {
    gap: 13px;
  }

  .call-title em {
    text-transform: none;
    font-size: clamp(10px, .9vw, 14px);
    letter-spacing: .02em;
  }

  .call-bars {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    height: 24px;
  }

  .call-bars i {
    display: block;
    width: 3px;
    border-radius: 99px;
    background: #e7d3ff;
    animation: voiceBars 1.1s ease-in-out infinite;
  }

  .call-bars i:nth-child(1) { height: 13px; animation-delay: 0s; }
  .call-bars i:nth-child(2) { height: 22px; animation-delay: .1s; }
  .call-bars i:nth-child(3) { height: 17px; animation-delay: .2s; }
  .call-bars i:nth-child(4) { height: 25px; animation-delay: .3s; }

  .audio-player {
    position: relative;
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr) auto 24px 48px;
    align-items: center;
    gap: 14px;
    min-height: 66px;
    margin-top: 24px;
    padding: 8px 13px 8px 8px;
    border-radius: 999px;
    background: linear-gradient(90deg, #7115dd, #bc25ff, #8617ff);
    box-shadow: 0 0 44px rgba(153,34,255,.64), inset 0 1px 0 rgba(255,255,255,.24);
    overflow: hidden;
  }

  .audio-player::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
    transform: translateX(-100%);
    animation: audioSweep 3.2s ease-in-out infinite;
  }

  .play-button,
  .hang-icon {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 999px;
    background: rgba(40, 7, 103, .62);
  }

  .play-button svg,
  .hang-icon svg {
    width: 27px;
    height: 27px;
    fill: rgba(231,211,255,.95);
    stroke: none;
  }

  .hang-icon {
    background: rgba(231,211,255,.9);
  }

  .hang-icon svg {
    fill: none;
    stroke: #7300ff;
    stroke-width: 2.2;
  }

  .waveform {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
  }

  .waveform i {
    display: block;
    width: 3px;
    height: calc(8px + (var(--wave-index) % 7) * 3px);
    border-radius: 99px;
    background: rgba(255,255,255,.8);
    opacity: .95;
    animation: waveformDance 1.18s ease-in-out infinite;
    animation-delay: calc(var(--wave-index) * -54ms);
  }

  .audio-player b {
    position: relative;
    z-index: 1;
    font-size: 18px;
    font-weight: 580;
  }

  .process-craft {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 150px;
    align-items: end;
    gap: 20px;
  }

  .task-list {
    display: grid;
    gap: 9px;
  }

  .task-list strong {
    margin-bottom: 8px;
  }

  .task-list span {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,.68);
    font-size: clamp(12px, 1.06vw, 15px);
    font-weight: 580;
    letter-spacing: .035em;
  }

  .task-list i {
    display: grid;
    place-items: center;
    width: 17px;
    height: 17px;
    border-radius: 999px;
    background: #ba86ff;
    box-shadow: 0 0 18px rgba(178,117,255,.54);
    animation: checkPop 2.8s ease-in-out infinite;
  }

  .task-list span:nth-child(3) i { animation-delay: .22s; }
  .task-list span:nth-child(4) i { animation-delay: .44s; }

  .task-list i::before {
    content: '✓';
    color: #3d126d;
    font-size: 11px;
    font-weight: 900;
  }

  .task-ring {
    position: relative;
    display: grid;
    place-items: center;
    width: 142px;
    height: 142px;
    justify-self: end;
  }

  .task-ring svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .task-ring circle {
    fill: none;
    stroke: rgba(255,255,255,.08);
    stroke-width: 16;
  }

  .task-ring .ring-progress {
    stroke: #8c16ff;
    stroke-linecap: butt;
    stroke-dasharray: 282.743;
    stroke-dashoffset: 282.743;
    filter: none;
    animation: taskRingProgress98 2.6s cubic-bezier(.22,.8,.22,1) infinite;
  }

  .task-ring small {
    padding: 3px 8px;
    border-radius: 999px;
    color: #fff;
    font-size: 7px;
    background: #7300ff;
  }

  .task-ring strong {
    margin-top: 4px;
    color: #fff;
    font-size: 15px;
    font-weight: 650;
  }

  .task-ring b {
    color: #fff;
    font-size: 13px;
  }

  .ready-line span {
    width: 27px;
    height: 27px;
    border-radius: 999px;
    background: #e7d3ff;
  }

  .ready-line svg {
    width: 17px;
    height: 17px;
    stroke: #1b0629;
    stroke-width: 3;
    animation: readyCheck 2.4s ease-in-out infinite;
  }

  .offer-timeline {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 42px;
    height: 56px;
  }

  .offer-timeline::before {
    content: '';
    position: absolute;
    left: 22px;
    right: 22px;
    top: 50%;
    height: 2px;
    background: rgba(255,255,255,.17);
    transform: translateY(-50%);
  }

  .offer-timeline i {
    position: relative;
    z-index: 2;
    width: 31px;
    height: 31px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.22);
    background: #1c132a;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
  }

  .offer-timeline i:last-of-type {
    background: #d727ff;
    box-shadow: 0 0 28px rgba(215,39,255,.92), 0 0 86px rgba(115,0,255,.74);
    animation: completePulse 2.4s ease-in-out infinite;
  }

  .offer-timeline b {
    position: absolute;
    right: 12px;
    top: 50%;
    width: 42%;
    height: 80px;
    transform: translateY(-50%);
    background: linear-gradient(90deg, transparent, rgba(115,0,255,.38), rgba(215,39,255,.86));
    filter: blur(18px);
    opacity: .92;
    animation: offerGlow 3.4s ease-in-out infinite;
  }

  .offer-labels {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    color: rgba(255,255,255,.48);
    font-size: 14px;
    font-weight: 560;
  }

  .offer-labels span:last-child {
    color: rgba(255,255,255,.66);
  }

  @keyframes processIconPulse {
    0%, 100% { transform: translateZ(0) scale(1); filter: brightness(1); }
    50% { transform: translateZ(0) scale(1.045); filter: brightness(1.12); }
  }

  @keyframes processIconDraw {
    0%, 100% { stroke-dasharray: 1 0; transform: translateY(0); }
    48% { stroke-dasharray: 14 4; transform: translateY(-1.5px); }
  }

  @keyframes uploadLift {
    0%, 100% { transform: translateY(0); opacity: .84; }
    50% { transform: translateY(-4px); opacity: 1; }
  }

  @keyframes uploadProgress {
    0% { transform: scaleX(.14); }
    45%, 100% { transform: scaleX(1); }
  }

  @keyframes uploadShine {
    0%, 18% { transform: translateX(-120%); opacity: 0; }
    35% { opacity: 1; }
    70%, 100% { transform: translateX(120%); opacity: 0; }
  }

  @keyframes voiceBars {
    0%, 100% { transform: scaleY(.52); opacity: .66; }
    50% { transform: scaleY(1); opacity: 1; }
  }

  @keyframes audioSweep {
    0%, 30% { transform: translateX(-100%); opacity: 0; }
    55% { opacity: .9; }
    86%, 100% { transform: translateX(110%); opacity: 0; }
  }

  @keyframes waveformDance {
    0%, 100% { transform: scaleY(.42); opacity: .54; }
    45% { transform: scaleY(1.15); opacity: 1; }
  }

  @keyframes checkPop {
    0%, 100% { transform: scale(1); }
    42% { transform: scale(1.18); }
  }

  @keyframes taskRingProgress98 {
    0%, 12% { stroke-dashoffset: 282.743; opacity: .72; }
    72%, 100% { stroke-dashoffset: 11.31; opacity: 1; }
  }

  @keyframes readyCheck {
    0% { stroke-dasharray: 0 24; }
    46%, 100% { stroke-dasharray: 24 0; }
  }

  @keyframes completePulse {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50% { transform: scale(1.1); filter: brightness(1.25); }
  }

  @keyframes offerGlow {
    0%, 100% { opacity: .64; transform: translateY(-50%) translateX(-10px); }
    50% { opacity: .95; transform: translateY(-50%) translateX(8px); }
  }

  @media (max-width: 980px) {
    .process-section {
      width: min(100% - 34px, 720px);
      margin-top: clamp(76px, 11vw, 120px);
    }

    .process-section .section-heading {
      margin-bottom: 30px;
    }

    .hiring-process-grid {
      grid-template-columns: 1fr;
      width: min(620px, 100%);
      gap: 18px;
    }

    .hiring-process-grid .process-card {
      min-height: auto;
      padding: clamp(22px, 6vw, 34px);
      border-radius: clamp(30px, 8vw, 48px);
    }

    .process-craft {
      grid-template-columns: 1fr;
    }

    .task-ring {
      justify-self: start;
      width: 126px;
      height: 126px;
    }

    .audio-player {
      grid-template-columns: 42px minmax(0, 1fr) auto 22px 42px;
      gap: 10px;
      min-height: 58px;
    }

    .waveform i:nth-child(n+19) {
      display: none;
    }
  }

  @media (max-width: 560px) {
    .hiring-process-grid .process-top {
      grid-template-columns: 62px minmax(0, 1fr);
      gap: 16px;
    }

    .hiring-process-grid .process-icon {
      width: 62px;
      height: 62px;
      border-radius: 21px;
    }

    .hiring-process-grid .process-card h3 {
      font-size: 22px;
    }

    .hiring-process-grid .process-card p {
      font-size: 13px;
      line-height: 1.44;
    }

    .upload-row,
    .call-title {
      flex-wrap: wrap;
    }

    .upload-row b {
      width: 100%;
      margin-left: 0;
    }

    .audio-player b,
    .volume-icon {
      display: none;
    }

    .audio-player {
      grid-template-columns: 40px minmax(0, 1fr) 40px;
    }

    .task-list span {
      font-size: 12px;
    }

    .offer-timeline {
      margin-top: 28px;
    }
  }


  /* v41: process tuning */
  .process-section {
    width: min(980px, calc(100vw - 48px)) !important;
    margin-top: clamp(74px, 8vw, 118px) !important;
  }

  .process-section .section-heading {
    width: min(660px, 100%) !important;
    margin-bottom: clamp(30px, 4vw, 52px) !important;
  }

  .process-section .section-kicker.small {
    min-width: 124px !important;
    height: 38px !important;
    margin-bottom: clamp(16px, 1.9vw, 24px) !important;
    font-size: clamp(16px, 1.35vw, 21px) !important;
  }

  .process-section h2 {
    font-size: clamp(36px, 4.2vw, 58px) !important;
  }

  .process-section > .section-heading > p {
    margin-top: clamp(14px, 1.5vw, 20px) !important;
    font-size: clamp(16px, 1.45vw, 22px) !important;
  }

  .hiring-process-grid {
    width: min(980px, 100%) !important;
    gap: clamp(16px, 1.8vw, 22px) !important;
  }

  .hiring-process-grid .process-card {
    min-height: clamp(218px, 22vw, 258px) !important;
    padding: clamp(22px, 2.2vw, 30px) !important;
    border-radius: clamp(30px, 3.2vw, 44px) !important;
  }

  .hiring-process-grid .process-top {
    grid-template-columns: clamp(54px, 5vw, 68px) minmax(0, 1fr) !important;
    gap: clamp(16px, 1.65vw, 22px) !important;
  }

  .hiring-process-grid .process-icon {
    width: clamp(54px, 5vw, 68px) !important;
    height: clamp(54px, 5vw, 68px) !important;
    border-radius: clamp(18px, 1.8vw, 24px) !important;
  }

  .hiring-process-grid .process-icon svg {
    width: 52% !important;
    height: 52% !important;
    stroke-width: 1.85 !important;
  }

  .hiring-process-grid .process-card h3 {
    margin-top: 4px !important;
    font-size: clamp(18px, 1.65vw, 25px) !important;
    letter-spacing: .05em !important;
  }

  .hiring-process-grid .process-card p {
    margin-top: clamp(8px, .8vw, 12px) !important;
    font-size: clamp(12.2px, 1.08vw, 15.5px) !important;
    line-height: 1.4 !important;
    letter-spacing: .035em !important;
  }

  .process-upload,
  .process-call,
  .process-craft,
  .process-offer {
    margin-top: clamp(22px, 2.3vw, 32px) !important;
  }

  .upload-row strong,
  .call-title strong,
  .ready-line strong,
  .task-list strong {
    font-size: clamp(13px, 1.25vw, 18px) !important;
  }

  .upload-row em,
  .call-title em {
    font-size: clamp(8.5px, .75vw, 11px) !important;
  }

  .upload-row b {
    font-size: clamp(17px, 1.55vw, 22px) !important;
  }

  .upload-bar {
    height: 18px !important;
    margin-top: 20px !important;
  }

  .process-call {
    margin-top: clamp(20px, 2vw, 26px) !important;
  }

  .call-title {
    align-items: center;
    min-width: 0;
  }

  .audio-player {
    grid-template-columns: 40px minmax(0, 1fr) auto 21px 40px !important;
    min-height: 52px !important;
    margin-top: 16px !important;
    padding: 6px 10px 6px 6px !important;
    gap: 10px !important;
  }

  .play-button,
  .hang-icon {
    width: 40px !important;
    height: 40px !important;
  }

  .play-button {
    overflow: hidden;
  }

  .play-state {
    position: absolute;
    width: 24px !important;
    height: 24px !important;
    inset: 50% auto auto 50%;
    transform: translate(-50%, -50%);
    fill: rgba(231,211,255,.95);
    stroke: none;
  }

  .play-state-play {
    animation: playSwapA 3.4s ease-in-out infinite;
  }

  .play-state-pause {
    animation: playSwapB 3.4s ease-in-out infinite;
  }

  .waveform {
    height: 30px;
    align-items: center;
    justify-content: center;
    padding: 0 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
    overflow: hidden;
  }

  .waveform i {
    width: 2.5px !important;
    background: linear-gradient(180deg, rgba(255,255,255,.95), rgba(231,211,255,.58)) !important;
    box-shadow: 0 0 8px rgba(255,255,255,.32);
  }

  .audio-player b {
    font-size: 14px !important;
  }

  .volume-icon svg,
  .hang-icon svg {
    width: 22px !important;
    height: 22px !important;
  }

  .process-craft {
    grid-template-columns: minmax(0, 1fr) 112px !important;
    gap: 14px !important;
    align-items: center !important;
  }

  .task-list {
    gap: 7px !important;
  }

  .task-list strong {
    margin-bottom: 6px !important;
  }

  .task-list span {
    font-size: clamp(10.5px, .95vw, 13px) !important;
  }

  .task-ring {
    width: 108px !important;
    height: 108px !important;
  }

  .task-ring circle {
    stroke-width: 12 !important;
  }

  .task-ring-content {
    position: relative;
    z-index: 3;
    display: grid;
    place-items: center;
    text-align: center;
    transform: translateZ(0);
    pointer-events: none;
  }

  .task-ring small,
  .task-ring strong,
  .task-ring b {
    position: relative !important;
    z-index: 3 !important;
    margin: 0 !important;
    line-height: 1.1 !important;
  }

  .task-ring small {
    font-size: 6px !important;
    padding: 3px 7px !important;
  }

  .task-ring strong {
    font-size: 12px !important;
    margin-top: 5px !important;
  }

  .task-ring b {
    font-size: 12px !important;
    margin-top: 4px !important;
  }

  .process-offer {
    margin-top: clamp(22px, 2.1vw, 30px) !important;
  }

  .offer-timeline {
    margin-top: 26px !important;
    height: 42px !important;
  }

  .offer-timeline i {
    width: 25px !important;
    height: 25px !important;
    display: grid;
    place-items: center;
    overflow: visible;
  }

  .offer-timeline i::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: inherit;
    background: rgba(171, 94, 255, .36);
    opacity: 0;
    animation: nodeCharge 3.8s ease-in-out infinite;
    animation-delay: calc(var(--step-index) * .34s);
  }

  .timeline-spark {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #e73aff;
    box-shadow: 0 0 10px #e73aff, 0 0 22px rgba(115,0,255,.9);
    opacity: 0;
    animation: sparkJump 3.8s cubic-bezier(.22,.8,.22,1) infinite;
    animation-delay: calc(var(--step-index) * .34s);
  }

  .offer-timeline i:last-of-type .timeline-spark {
    width: 12px;
    height: 12px;
    background: #ff35ff;
    box-shadow: 0 0 18px #ff35ff, 0 0 42px rgba(115,0,255,1);
  }

  .offer-timeline i:last-of-type::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: inherit;
    background: radial-gradient(circle, rgba(255,53,255,.9), rgba(115,0,255,.32) 45%, transparent 72%);
    filter: blur(10px);
    opacity: 0;
    animation: finalEnlighten 3.8s ease-in-out infinite;
  }

  .offer-timeline b {
    height: 58px !important;
    filter: blur(13px) !important;
  }

  .offer-labels {
    font-size: 12px !important;
  }

  @keyframes playSwapA {
    0%, 45% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    52%, 95% { opacity: 0; transform: translate(-50%, -50%) scale(.72); }
    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  @keyframes playSwapB {
    0%, 45% { opacity: 0; transform: translate(-50%, -50%) scale(.72); }
    52%, 95% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(.72); }
  }

  @keyframes nodeCharge {
    0%, 12% { opacity: 0; transform: scale(.3); }
    18%, 35% { opacity: .85; transform: scale(1); }
    46%, 100% { opacity: 0; transform: scale(.5); }
  }

  @keyframes sparkJump {
    0%, 10% { opacity: 0; transform: translateY(8px) scale(.5); }
    18%, 30% { opacity: 1; transform: translateY(-6px) scale(1); }
    42%, 100% { opacity: 0; transform: translateY(-17px) scale(.25); }
  }

  @keyframes finalEnlighten {
    0%, 70% { opacity: 0; transform: scale(.7); }
    78%, 92% { opacity: .95; transform: scale(1.08); }
    100% { opacity: 0; transform: scale(.9); }
  }

  @media (max-width: 980px) {
    .process-section {
      width: min(100% - 34px, 680px) !important;
    }

    .hiring-process-grid {
      width: min(560px, 100%) !important;
    }

    .hiring-process-grid .process-card {
      min-height: auto !important;
    }

    .process-craft {
      grid-template-columns: 1fr 104px !important;
    }
  }

  @media (max-width: 560px) {
    .hiring-process-grid .process-top {
      grid-template-columns: 52px minmax(0, 1fr) !important;
    }

    .hiring-process-grid .process-icon {
      width: 52px !important;
      height: 52px !important;
      border-radius: 18px !important;
    }

    .process-craft {
      grid-template-columns: 1fr !important;
    }

    .task-ring {
      justify-self: start !important;
    }

    .waveform i:nth-child(n+17) {
      display: none;
    }
  }


  /* v42 refinements */
  .process-section {
    width: min(920px, calc(100vw - 44px)) !important;
    margin-top: clamp(68px, 7vw, 104px) !important;
  }

  .process-section .section-heading {
    width: min(620px, 100%) !important;
    margin-bottom: clamp(24px, 3.3vw, 42px) !important;
  }

  .process-section h2 {
    font-size: clamp(32px, 3.8vw, 52px) !important;
  }

  .process-section > .section-heading > p {
    font-size: clamp(15px, 1.28vw, 20px) !important;
  }

  .hiring-process-grid {
    width: min(920px, 100%) !important;
    gap: 15px !important;
  }

  .hiring-process-grid .process-card {
    min-height: clamp(198px, 20vw, 238px) !important;
    padding: clamp(20px, 2vw, 26px) !important;
    border-radius: clamp(28px, 3vw, 40px) !important;
  }

  .hiring-process-grid .process-top {
    grid-template-columns: 50px minmax(0, 1fr) !important;
    gap: 14px !important;
  }

  .hiring-process-grid .process-icon {
    width: 50px !important;
    height: 50px !important;
    border-radius: 16px !important;
  }

  .hiring-process-grid .process-card h3 {
    font-size: clamp(17px, 1.5vw, 23px) !important;
  }

  .hiring-process-grid .process-card p {
    font-size: clamp(11.8px, .98vw, 14.5px) !important;
    margin-top: 6px !important;
  }

  .process-upload,
  .process-call,
  .process-craft,
  .process-offer {
    margin-top: 18px !important;
  }

  .upload-cloud-icon svg {
    width: 26px;
    height: 26px;
    fill: none;
    stroke: rgba(241,225,255,.96);
    stroke-width: 2.05;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .upload-cloud-shape {
    stroke-dasharray: 42 0;
    opacity: .96;
  }

  .upload-cloud-arrow {
    transform-origin: 12px 12px;
    animation: cloudArrowLift 2.2s ease-in-out infinite;
  }

  .upload-bar {
    height: 16px !important;
    margin-top: 16px !important;
  }

  .audio-player {
    grid-template-columns: 38px minmax(0, 1fr) auto auto 18px 38px !important;
    min-height: 48px !important;
    gap: 8px !important;
  }

  .play-button,
  .hang-icon {
    width: 38px !important;
    height: 38px !important;
  }

  .waveform {
    height: 28px !important;
    padding: 0 8px !important;
  }

  .voice-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 999px;
    background: rgba(58, 10, 116, .36);
    border: 1px solid rgba(255,255,255,.12);
    color: rgba(255,255,255,.84);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    position: relative;
    z-index: 1;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .voice-chip i {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 0 0 0 rgba(255,255,255,.8);
    animation: voiceChipPulse 1.8s ease-in-out infinite;
  }

  .voice-chip small {
    font-size: inherit;
    line-height: 1;
  }

  .audio-player b {
    font-size: 13px !important;
  }

  .process-craft {
    grid-template-columns: minmax(0, 1fr) 98px !important;
    gap: 12px !important;
  }

  .task-list strong {
    font-size: clamp(12px, 1.05vw, 16px) !important;
  }

  .task-list span {
    font-size: clamp(10px, .87vw, 12px) !important;
  }

  .task-ring {
    width: 96px !important;
    height: 96px !important;
  }

  .task-ring circle {
    stroke-width: 10 !important;
  }

  .task-ring small {
    font-size: 5.5px !important;
  }

  .task-ring strong {
    font-size: 10.5px !important;
    margin-top: 4px !important;
  }

  .task-ring b {
    font-size: 11px !important;
    margin-top: 3px !important;
  }

  .offer-timeline {
    margin-top: 22px !important;
    height: 38px !important;
  }

  .offer-timeline::before {
    left: 18px !important;
    right: 18px !important;
    background: linear-gradient(90deg, rgba(255,255,255,.12), rgba(255,255,255,.18), rgba(255,255,255,.12)) !important;
  }

  .offer-timeline i {
    width: 22px !important;
    height: 22px !important;
    background: #191225 !important;
  }

  .offer-timeline i::before {
    inset: 5px !important;
    background: radial-gradient(circle, rgba(222,160,255,.98), rgba(115,0,255,.24) 72%) !important;
    animation: nodeChargeSoft 3.2s ease-in-out infinite !important;
    animation-delay: calc(var(--step-index) * .28s) !important;
  }

  .timeline-spark {
    width: 6px !important;
    height: 6px !important;
    background: #efb8ff !important;
    box-shadow: 0 0 10px rgba(239,184,255,.9), 0 0 18px rgba(115,0,255,.7) !important;
    animation: sparkHopSoft 3.2s cubic-bezier(.22,.8,.22,1) infinite !important;
    animation-delay: calc(var(--step-index) * .28s) !important;
  }

  .offer-timeline i:last-of-type {
    background: #2a123c !important;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.16) !important;
  }

  .offer-timeline i:last-of-type .timeline-spark {
    width: 8px !important;
    height: 8px !important;
    background: #f3c6ff !important;
  }

  .offer-timeline i:last-of-type::after {
    inset: -7px !important;
    background: radial-gradient(circle, rgba(243,198,255,.92), rgba(115,0,255,.28) 48%, transparent 74%) !important;
    filter: blur(8px) !important;
    animation: finalGlowSoft 3.2s ease-in-out infinite !important;
  }

  .offer-runner {
    position: absolute;
    left: 18px;
    top: 50%;
    width: 10px;
    height: 10px;
    margin-top: -5px;
    border-radius: 999px;
    background: #f0c2ff;
    box-shadow: 0 0 10px rgba(240,194,255,.92), 0 0 24px rgba(115,0,255,.92);
    animation: runnerTravel 3.2s cubic-bezier(.22,.8,.22,1) infinite;
    z-index: 3;
  }

  .offer-runner::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: inherit;
    background: radial-gradient(circle, rgba(255,255,255,.65), rgba(115,0,255,.18) 56%, transparent 74%);
    filter: blur(6px);
    opacity: .8;
  }

  .offer-labels {
    font-size: 11px !important;
  }

  @keyframes cloudArrowLift {
    0%, 100% { transform: translateY(1.5px); opacity: .76; }
    48% { transform: translateY(-3.5px); opacity: 1; }
  }

  @keyframes voiceChipPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,.64); opacity: .7; }
    50% { box-shadow: 0 0 0 6px rgba(255,255,255,0); opacity: 1; }
  }

  @keyframes nodeChargeSoft {
    0%, 14% { opacity: 0; transform: scale(.4); }
    22%, 38% { opacity: .82; transform: scale(1); }
    50%, 100% { opacity: 0; transform: scale(.6); }
  }

  @keyframes sparkHopSoft {
    0%, 10% { opacity: 0; transform: translateY(5px) scale(.45); }
    20%, 30% { opacity: .95; transform: translateY(-4px) scale(1); }
    44%, 100% { opacity: 0; transform: translateY(-10px) scale(.3); }
  }

  @keyframes finalGlowSoft {
    0%, 74% { opacity: 0; transform: scale(.72); }
    82%, 92% { opacity: .84; transform: scale(1.02); }
    100% { opacity: 0; transform: scale(.85); }
  }

  @keyframes runnerTravel {
    0%, 8% { transform: translateX(0); opacity: 0; }
    14% { opacity: 1; }
    72% { transform: translateX(calc(100% + 265px)); opacity: 1; }
    84%, 100% { transform: translateX(calc(100% + 265px)); opacity: 0; }
  }

  @media (max-width: 980px) {
    .process-section {
      width: min(100% - 30px, 640px) !important;
    }
    .hiring-process-grid {
      width: min(520px, 100%) !important;
    }
    .audio-player {
      grid-template-columns: 36px minmax(0, 1fr) auto auto 16px 36px !important;
    }
  }

  @media (max-width: 560px) {
    .audio-player {
      grid-template-columns: 36px minmax(0, 1fr) auto 36px !important;
    }
    .voice-chip,
    .volume-icon,
    .audio-player b {
      display: none !important;
    }
    .process-craft {
      grid-template-columns: 1fr !important;
    }
    .task-ring {
      justify-self: start !important;
      margin-top: 10px;
    }
  }


  /* v43 refinements: reduce repeated icons, simplify voice, soften offer motion */
  .hiring-process-grid .process-card-progress .process-icon svg {
    animation: processIconDraw 4.8s ease-in-out infinite !important;
  }

  .process-card-progress .upload-cloud-icon {
    opacity: .92;
  }

  .process-call .call-title em {
    display: none !important;
  }

  .process-call .call-title {
    gap: 10px !important;
  }

  .process-call .call-bars {
    width: 18px !important;
  }

  .audio-player {
    grid-template-columns: 38px minmax(0, 1fr) 38px !important;
    min-height: 46px !important;
    padding: 5px 6px !important;
    gap: 8px !important;
  }

  .voice-chip,
  .volume-icon,
  .audio-player > b {
    display: none !important;
  }

  .waveform {
    height: 28px !important;
    padding: 0 10px !important;
    background: linear-gradient(90deg, rgba(255,255,255,.1), rgba(255,255,255,.035)) !important;
  }

  .waveform i {
    width: 2.4px !important;
    opacity: .82 !important;
  }

  .play-button,
  .hang-icon {
    width: 36px !important;
    height: 36px !important;
  }

  .play-state {
    width: 22px !important;
    height: 22px !important;
  }

  .hang-icon svg {
    width: 20px !important;
    height: 20px !important;
  }

  .offer-timeline {
    overflow: visible !important;
  }

  .timeline-spark {
    display: none !important;
    animation: none !important;
  }

  .offer-timeline i::before {
    animation: nodeGlowPass 3.6s ease-in-out infinite !important;
    animation-delay: calc(var(--step-index) * .24s) !important;
    transform: scale(.7);
  }

  .offer-runner {
    width: 13px !important;
    height: 13px !important;
    margin-top: -6.5px !important;
    background: rgba(245, 211, 255, .95) !important;
    box-shadow:
      0 0 14px rgba(245,211,255,.95),
      0 0 34px rgba(115,0,255,.9),
      0 0 70px rgba(115,0,255,.5) !important;
    animation: runnerTravelSmooth 3.6s cubic-bezier(.22,.8,.22,1) infinite !important;
  }

  .offer-runner::after {
    inset: -18px !important;
    background: radial-gradient(circle, rgba(255,255,255,.42), rgba(115,0,255,.26) 38%, transparent 72%) !important;
    filter: blur(8px) !important;
    opacity: .92 !important;
  }

  .offer-timeline i:last-of-type::after {
    animation: finalGlowSmooth 3.6s ease-in-out infinite !important;
  }

  @keyframes nodeGlowPass {
    0%, 18% { opacity: 0; transform: scale(.62); }
    28%, 44% { opacity: .74; transform: scale(1); }
    56%, 100% { opacity: 0; transform: scale(.72); }
  }

  @keyframes runnerTravelSmooth {
    0%, 8% { transform: translateX(0) scale(.85); opacity: 0; }
    14% { opacity: 1; }
    76% { transform: translateX(calc(100% + 265px)) scale(1); opacity: 1; }
    88%, 100% { transform: translateX(calc(100% + 265px)) scale(.92); opacity: 0; }
  }

  @keyframes finalGlowSmooth {
    0%, 72% { opacity: 0; transform: scale(.75); }
    80%, 98% { opacity: .82; transform: scale(1.02); }
    100% { opacity: 0; transform: scale(.86); }
  }

  @media (max-width: 980px) {
    .audio-player {
      grid-template-columns: 36px minmax(0, 1fr) 36px !important;
    }
  }

  @media (max-width: 560px) {
    .audio-player {
      grid-template-columns: 34px minmax(0, 1fr) 34px !important;
    }

    .waveform i:nth-child(n+18) {
      display: none !important;
    }
  }


  /* v44-from-v43: voice pill cleanup */
  .audio-player {
    grid-template-columns: 40px minmax(0, 1fr) 1px 40px !important;
    gap: 10px !important;
    min-height: 50px !important;
    padding: 6px 8px 6px 6px !important;
  }

  .voice-running-line {
    position: relative !important;
    height: 30px !important;
    padding: 0 6px !important;
    border-radius: 999px;
    overflow: hidden;
  }

  .voice-progress-line {
    position: absolute;
    left: 4px;
    top: 50%;
    height: 2px;
    width: 18%;
    border-radius: 999px;
    transform: translateY(-50%);
    background: linear-gradient(90deg, rgba(255,255,255,.48), rgba(255,255,255,.08));
    box-shadow: 0 0 10px rgba(255,255,255,.28);
    animation: voiceLineRunClean 3s ease-in-out infinite;
    z-index: 1;
  }

  .voice-progress-line::after {
    content: '';
    position: absolute;
    right: -3px;
    top: 50%;
    width: 6px;
    height: 6px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 0 10px rgba(255,255,255,.82);
  }

  .voice-running-line i {
    position: relative;
    z-index: 2;
    animation: waveformDanceClean 1s ease-in-out infinite !important;
    animation-delay: calc(var(--wave-index) * -50ms) !important;
  }

  .audio-divider {
    position: relative;
    z-index: 2;
    width: 1px;
    height: 24px;
    border-radius: 999px;
    background: linear-gradient(180deg, transparent, rgba(255,255,255,.42), transparent);
  }

  .clean-phone-icon {
    background: rgba(231,211,255,.92) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.38), 0 0 18px rgba(115,0,255,.22);
  }

  .clean-phone-icon svg {
    width: 22px !important;
    height: 22px !important;
    fill: none !important;
    stroke: #7300ff !important;
    stroke-width: 2.05 !important;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @keyframes voiceLineRunClean {
    0% { width: 12%; opacity: .52; }
    54% { width: 76%; opacity: .96; }
    100% { width: 12%; opacity: .52; }
  }

  @keyframes waveformDanceClean {
    0%, 100% { transform: scaleY(.55); opacity: .62; }
    50% { transform: scaleY(1.12); opacity: 1; }
  }

  /* v44-from-v43: remove the little square/pill inside the third card progress circle */
  .task-ring small {
    display: none !important;
  }

  .task-ring-content {
    gap: 4px;
  }

  .task-ring strong {
    margin-top: 0 !important;
  }

  /* v44-from-v43: one-row expandable job section matching the supplied PNG */
  .jobs-section-figma {
    width: min(1120px, calc(100vw - 48px)) !important;
    margin-top: clamp(90px, 10vw, 150px) !important;
    text-align: center;
  }

  .jobs-section-figma .jobs-heading {
    width: min(900px, 100%) !important;
    margin: 0 auto clamp(38px, 5vw, 64px) !important;
  }

  .jobs-section-figma .section-kicker.small {
    min-width: 132px !important;
    height: 44px !important;
    margin-bottom: 16px !important;
    font-size: clamp(18px, 1.45vw, 24px) !important;
    font-weight: 700 !important;
    letter-spacing: -.03em !important;
  }

  .jobs-section-figma .section-kicker.small .corner {
    width: 12px !important;
    height: 12px !important;
    border-width: 2px !important;
  }

  .jobs-section-figma h2 {
    font-size: clamp(40px, 4.45vw, 64px) !important;
    line-height: 1 !important;
    font-weight: 760 !important;
    letter-spacing: -.06em !important;
  }

  .jobs-section-figma .jobs-heading p {
    width: min(920px, 100%) !important;
    margin: 28px auto 0 !important;
    color: rgba(255,255,255,.9) !important;
    font-size: clamp(18px, 1.65vw, 27px) !important;
    line-height: 1.35 !important;
    font-weight: 650 !important;
    letter-spacing: -.04em !important;
  }

  .open-roles-pill {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 64px;
    margin-top: 22px;
    padding: 0 34px;
    border-radius: 999px;
    background: linear-gradient(135deg, #0bd91f, #069f12);
    color: #fff;
    border: 1px solid rgba(255,255,255,.28);
    box-shadow:
      0 0 0 8px rgba(255,255,255,.06),
      0 0 34px rgba(10,210,30,.5),
      inset 0 1px 0 rgba(255,255,255,.36);
  }

  .open-roles-pill span {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 0 12px rgba(255,255,255,.9);
  }

  .open-roles-pill strong {
    font-size: clamp(15px, 1.25vw, 21px);
    font-weight: 700;
    letter-spacing: -.01em;
  }

  .jobs-grid-figma {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 24px !important;
    width: 100% !important;
    margin: 0 auto !important;
  }

  .jobs-grid-figma.expanded {
    grid-template-rows: auto auto;
  }

  .job-card-figma {
    position: relative !important;
    min-height: 188px !important;
    padding: 28px 24px 20px !important;
    border-radius: 34px !important;
    text-align: left !important;
    overflow: visible !important;
    border: 1.2px solid rgba(225, 200, 255, .58) !important;
    background: #070509 !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.08),
      0 18px 60px rgba(0,0,0,.32) !important;
  }

  .job-card-figma::before,
  .job-card-figma::after {
    content: '';
    position: absolute;
    pointer-events: none;
    z-index: -1;
    border-radius: 999px;
  }

  .job-card-figma::before {
    left: -16px;
    right: -16px;
    bottom: -15px;
    height: 46px;
    background: radial-gradient(ellipse at 50% 100%, rgba(115,0,255,.95), rgba(115,0,255,.45) 48%, transparent 76%);
    filter: blur(10px);
  }

  .job-card-figma::after {
    left: 10%;
    right: 10%;
    bottom: -2px;
    height: 8px;
    background: #E8E4FF;
    filter: blur(2.8px);
    opacity: .9;
  }

  .job-card-figma:nth-child(1)::before {
    top: -15px;
    bottom: auto;
  }

  .job-card-figma:nth-child(1)::after {
    top: -2px;
    bottom: auto;
  }

  .job-card-figma:nth-child(3)::before {
    left: auto;
    right: -22px;
    top: 22%;
    bottom: auto;
    width: 42px;
    height: 70%;
    background: radial-gradient(ellipse at 100% 50%, rgba(115,0,255,.95), rgba(115,0,255,.5) 42%, transparent 72%);
  }

  .job-card-figma:nth-child(3)::after {
    left: auto;
    right: -6px;
    top: 28%;
    bottom: auto;
    width: 8px;
    height: 55%;
  }

  .job-brand {
    color: rgba(255,255,255,.56);
    font-size: 14px;
    letter-spacing: -.02em;
  }

  .job-card-figma h3 {
    margin-top: 22px !important;
    color: #fff;
    font-size: clamp(22px, 2vw, 30px) !important;
    line-height: 1.1 !important;
    font-weight: 720 !important;
    letter-spacing: .03em !important;
  }

  .job-card-figma .job-tags {
    display: flex !important;
    flex-wrap: wrap;
    gap: 7px !important;
    margin-top: 22px !important;
  }

  .job-card-figma .job-tags span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 22px;
    padding: 0 10px;
    border-radius: 999px;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .02em;
  }

  .job-card-figma .job-tags span::before {
    content: '✓';
    display: inline-grid;
    place-items: center;
    width: 10px;
    height: 10px;
    font-size: 7px;
    line-height: 1;
  }

  .job-card-figma .tag-growth { background: rgba(255,255,255,.25) !important; }
  .job-card-figma .tag-remote { background: #6c10d7 !important; }
  .job-card-figma .tag-time { background: #b48205 !important; }

  .job-card-figma .tag-remote::before { content: '●'; font-size: 8px; }
  .job-card-figma .tag-time::before { content: '○'; font-size: 9px; }

  .job-card-figma .job-line {
    height: 1px;
    margin-top: 24px;
    background: rgba(255,255,255,.12);
  }

  .job-card-figma .job-bottom {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin-top: 16px !important;
  }

  .job-card-figma small {
    color: #fff !important;
    font-size: clamp(14px, 1.15vw, 17px) !important;
    font-weight: 650 !important;
    letter-spacing: .04em !important;
  }

  .job-card-figma button {
    width: 88px !important;
    height: 30px !important;
    border-radius: 999px !important;
    background: linear-gradient(135deg, #9a18ff, #7300ff) !important;
    border: 1px solid rgba(255,255,255,.2) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 0 20px rgba(115,0,255,.28) !important;
    color: #fff !important;
    font-size: 13px !important;
    font-weight: 650 !important;
  }

  .jobs-view-all {
    display: grid !important;
    grid-template-columns: minmax(80px, 1fr) auto minmax(80px, 1fr) !important;
    align-items: center !important;
    gap: 24px !important;
    width: min(940px, 100%) !important;
    margin: 40px auto 0 !important;
  }

  .jobs-view-all span {
    height: 3px;
    border-radius: 999px;
    background: rgba(255,255,255,.95);
  }

  .jobs-view-all button {
    min-width: 190px !important;
    height: 58px !important;
    border-radius: 999px !important;
    background: linear-gradient(135deg, #9614ff, #7300ff) !important;
    color: #fff !important;
    font-size: clamp(18px, 1.45vw, 24px) !important;
    font-weight: 650 !important;
    box-shadow: 0 0 26px rgba(115,0,255,.42), inset 0 1px 0 rgba(255,255,255,.22) !important;
  }

  @media (max-width: 980px) {
    .jobs-grid-figma {
      grid-template-columns: 1fr !important;
      width: min(460px, 100%) !important;
    }

    .jobs-section-figma .jobs-heading p {
      font-size: clamp(15px, 3.6vw, 21px) !important;
    }

    .job-card-figma:nth-child(3)::before,
    .job-card-figma:nth-child(3)::after {
      top: auto;
      left: 10%;
      right: 10%;
      width: auto;
      transform: none;
    }

    .job-card-figma:nth-child(3)::before {
      bottom: -15px;
      height: 46px;
    }

    .job-card-figma:nth-child(3)::after {
      bottom: -2px;
      height: 8px;
    }
  }

  @media (max-width: 560px) {
    .audio-player {
      grid-template-columns: 36px minmax(0, 1fr) 1px 36px !important;
      gap: 8px !important;
    }

    .voice-running-line i:nth-child(n+19) {
      display: none;
    }

    .jobs-view-all {
      grid-template-columns: 1fr !important;
    }

    .jobs-view-all span {
      display: none;
    }
  }


  /* v45-from-v43: cleaner job card lighting + better voice pill phone icon */
  .jobs-grid-figma {
    isolation: isolate !important;
  }

  .job-card-figma {
    position: relative !important;
    isolation: isolate !important;
    z-index: 1 !important;
  }

  .job-card-figma::before,
  .job-card-figma::after {
    content: '' !important;
    position: absolute !important;
    pointer-events: none !important;
    z-index: -1 !important;
    border-radius: 999px !important;
    transform: translateX(-50%) !important;
    opacity: 1 !important;
  }

  /* simple Figma-style ellipse light: purple base + soft white highlight */
  .job-card-figma::before {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -11px !important;
    width: 86% !important;
    height: 24px !important;
    background: #7300FF !important;
    filter: blur(10.8px) !important;
    opacity: .82 !important;
  }

  .job-card-figma::after {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -2px !important;
    width: 64% !important;
    height: 7px !important;
    background: #E8E4FF !important;
    filter: blur(2.8px) !important;
    opacity: .78 !important;
    box-shadow: 0 0 10px rgba(175,139,249,.45) !important;
  }

  .job-card-figma:nth-child(1)::before {
    top: -11px !important;
    bottom: auto !important;
  }

  .job-card-figma:nth-child(1)::after {
    top: -2px !important;
    bottom: auto !important;
  }

  .job-card-figma:nth-child(2)::before,
  .job-card-figma:nth-child(2)::after {
    top: auto !important;
  }

  .job-card-figma:nth-child(3)::before {
    left: auto !important;
    right: -10px !important;
    top: 50% !important;
    bottom: auto !important;
    width: 24px !important;
    height: 72% !important;
    transform: translateY(-50%) !important;
    background: #7300FF !important;
    filter: blur(10.8px) !important;
    opacity: .76 !important;
  }

  .job-card-figma:nth-child(3)::after {
    left: auto !important;
    right: -2px !important;
    top: 50% !important;
    bottom: auto !important;
    width: 7px !important;
    height: 56% !important;
    transform: translateY(-50%) !important;
    background: #E8E4FF !important;
    filter: blur(2.8px) !important;
    opacity: .72 !important;
  }

  .job-card-figma:nth-child(n+4)::before {
    top: auto !important;
    bottom: -11px !important;
    left: 50% !important;
    right: auto !important;
    width: 86% !important;
    height: 24px !important;
    transform: translateX(-50%) !important;
  }

  .job-card-figma:nth-child(n+4)::after {
    top: auto !important;
    bottom: -2px !important;
    left: 50% !important;
    right: auto !important;
    width: 64% !important;
    height: 7px !important;
    transform: translateX(-50%) !important;
  }

  .clean-phone-icon {
    position: relative !important;
    background: rgba(231,211,255,.94) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.42),
      0 0 18px rgba(115,0,255,.22) !important;
  }

  .clean-phone-icon svg {
    width: 23px !important;
    height: 23px !important;
    fill: none !important;
    stroke: #7300FF !important;
    stroke-width: 2.15 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    transform: translateY(.5px) !important;
  }

  .audio-divider {
    opacity: .85 !important;
  }

  @media (max-width: 980px) {
    .job-card-figma:nth-child(3)::before,
    .job-card-figma:nth-child(3)::after {
      top: auto !important;
      left: 50% !important;
      right: auto !important;
      transform: translateX(-50%) !important;
    }

    .job-card-figma:nth-child(3)::before {
      bottom: -11px !important;
      width: 86% !important;
      height: 24px !important;
    }

    .job-card-figma:nth-child(3)::after {
      bottom: -2px !important;
      width: 64% !important;
      height: 7px !important;
    }
  }


  /* v46-from-v43: fix card lighting behind cards, voice line, phone icon, and task ring square */
  .jobs-grid-figma {
    position: relative !important;
    isolation: isolate !important;
  }

  .job-card-figma {
    position: relative !important;
    z-index: 2 !important;
    overflow: visible !important;
    isolation: auto !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.08),
      0 18px 44px rgba(0,0,0,.30) !important;
  }

  /* remove the old card-attached glow; use outside-only lights */
  .job-card-figma::before,
  .job-card-figma::after {
    pointer-events: none !important;
    z-index: -1 !important;
    border-radius: 999px !important;
    opacity: 1 !important;
  }

  .job-card-figma::before {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -23px !important;
    width: 84% !important;
    height: 20px !important;
    transform: translateX(-50%) !important;
    background: #7300FF !important;
    filter: blur(10.88px) !important;
    opacity: .78 !important;
  }

  .job-card-figma::after {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -12px !important;
    width: 62% !important;
    height: 6px !important;
    transform: translateX(-50%) !important;
    background: #E8E4FF !important;
    filter: blur(2.79px) !important;
    opacity: .70 !important;
    box-shadow: 0 0 8px rgba(175,139,249,.4) !important;
  }

  .job-card-figma:nth-child(1)::before {
    top: -23px !important;
    bottom: auto !important;
  }

  .job-card-figma:nth-child(1)::after {
    top: -12px !important;
    bottom: auto !important;
  }

  .job-card-figma:nth-child(3)::before {
    left: auto !important;
    right: -24px !important;
    top: 50% !important;
    bottom: auto !important;
    width: 20px !important;
    height: 72% !important;
    transform: translateY(-50%) !important;
    background: #7300FF !important;
    filter: blur(10.88px) !important;
    opacity: .74 !important;
  }

  .job-card-figma:nth-child(3)::after {
    left: auto !important;
    right: -13px !important;
    top: 50% !important;
    bottom: auto !important;
    width: 6px !important;
    height: 58% !important;
    transform: translateY(-50%) !important;
    background: #E8E4FF !important;
    filter: blur(2.79px) !important;
    opacity: .68 !important;
  }

  .job-card-figma:nth-child(n+4)::before {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -23px !important;
    width: 84% !important;
    height: 20px !important;
    transform: translateX(-50%) !important;
  }

  .job-card-figma:nth-child(n+4)::after {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -12px !important;
    width: 62% !important;
    height: 6px !important;
    transform: translateX(-50%) !important;
  }

  /* make the voice running line obvious inside the pill */
  .voice-running-line {
    position: relative !important;
    overflow: hidden !important;
    border-radius: 999px !important;
    padding: 0 6px !important;
  }

  .voice-progress-line {
    display: block !important;
    position: absolute !important;
    z-index: 1 !important;
    left: 6px !important;
    top: 50% !important;
    width: 12% !important;
    height: 2px !important;
    transform: translateY(-50%) !important;
    border-radius: 999px !important;
    background: linear-gradient(90deg, rgba(255,255,255,.52), rgba(255,255,255,.08)) !important;
    box-shadow: 0 0 12px rgba(255,255,255,.30) !important;
    animation: voiceLineRunFinal 2.8s ease-in-out infinite !important;
  }

  .voice-progress-line::after {
    content: '' !important;
    position: absolute !important;
    right: -3px !important;
    top: 50% !important;
    width: 6px !important;
    height: 6px !important;
    transform: translateY(-50%) !important;
    border-radius: 999px !important;
    background: #fff !important;
    box-shadow: 0 0 10px rgba(255,255,255,.86) !important;
  }

  .voice-running-line i {
    position: relative !important;
    z-index: 2 !important;
    animation: waveformDanceFinal 950ms ease-in-out infinite !important;
    animation-delay: calc(var(--wave-index) * -48ms) !important;
  }

  .clean-phone-icon {
    background: rgba(231,211,255,.96) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.48),
      0 0 16px rgba(115,0,255,.20) !important;
  }

  .clean-phone-icon svg {
    width: 22px !important;
    height: 22px !important;
    fill: none !important;
    stroke: #7300FF !important;
    stroke-width: 2.1 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    transform: translateY(.25px) !important;
  }

  /* remove square/pill appearing on the third card circle and make ring cap rounded */
  .task-ring small,
  .task-ring-content small {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }

  .task-ring .ring-progress {
    stroke-linecap: round !important;
  }

  .task-ring-content {
    gap: 4px !important;
  }

  .task-ring-content strong {
    margin-top: 0 !important;
  }

  @keyframes voiceLineRunFinal {
    0% { width: 10%; opacity: .50; }
    55% { width: 76%; opacity: .98; }
    100% { width: 10%; opacity: .50; }
  }

  @keyframes waveformDanceFinal {
    0%, 100% { transform: scaleY(.56); opacity: .62; }
    50% { transform: scaleY(1.14); opacity: 1; }
  }

  @media (max-width: 980px) {
    .job-card-figma:nth-child(3)::before {
      left: 50% !important;
      right: auto !important;
      top: auto !important;
      bottom: -23px !important;
      width: 84% !important;
      height: 20px !important;
      transform: translateX(-50%) !important;
    }

    .job-card-figma:nth-child(3)::after {
      left: 50% !important;
      right: auto !important;
      top: auto !important;
      bottom: -12px !important;
      width: 62% !important;
      height: 6px !important;
      transform: translateX(-50%) !important;
    }
  }


  /* v47-from-v43: exact fixes requested */

  /* 1) Job card light: put it BEHIND/outside the card and make it barely visible */
  .jobs-grid-figma {
    position: relative !important;
    isolation: isolate !important;
  }

  .job-card-figma {
    position: relative !important;
    overflow: visible !important;
    isolation: auto !important;
    z-index: 2 !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.08),
      0 14px 34px rgba(0,0,0,.30) !important;
  }

  .job-card-figma > * {
    position: relative;
    z-index: 2;
  }

  .job-card-figma::before,
  .job-card-figma::after {
    content: '' !important;
    position: absolute !important;
    pointer-events: none !important;
    border-radius: 999px !important;
    z-index: -1 !important;
    opacity: 1 !important;
  }

  .job-card-figma::before {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -42px !important;
    width: 78% !important;
    height: 18px !important;
    transform: translateX(-50%) !important;
    background: #7300FF !important;
    filter: blur(10.88px) !important;
    opacity: .34 !important;
  }

  .job-card-figma::after {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -31px !important;
    width: 56% !important;
    height: 5px !important;
    transform: translateX(-50%) !important;
    background: #E8E4FF !important;
    filter: blur(2.79px) !important;
    opacity: .28 !important;
    box-shadow: none !important;
  }

  .job-card-figma:nth-child(1)::before {
    top: -42px !important;
    bottom: auto !important;
  }

  .job-card-figma:nth-child(1)::after {
    top: -31px !important;
    bottom: auto !important;
  }

  .job-card-figma:nth-child(2)::before,
  .job-card-figma:nth-child(2)::after {
    top: auto !important;
  }

  .job-card-figma:nth-child(3)::before {
    left: auto !important;
    right: -42px !important;
    top: 50% !important;
    bottom: auto !important;
    width: 18px !important;
    height: 64% !important;
    transform: translateY(-50%) !important;
    background: #7300FF !important;
    filter: blur(10.88px) !important;
    opacity: .32 !important;
  }

  .job-card-figma:nth-child(3)::after {
    left: auto !important;
    right: -31px !important;
    top: 50% !important;
    bottom: auto !important;
    width: 5px !important;
    height: 48% !important;
    transform: translateY(-50%) !important;
    background: #E8E4FF !important;
    filter: blur(2.79px) !important;
    opacity: .24 !important;
  }

  .job-card-figma:nth-child(n+4)::before {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -42px !important;
    width: 78% !important;
    height: 18px !important;
    transform: translateX(-50%) !important;
  }

  .job-card-figma:nth-child(n+4)::after {
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -31px !important;
    width: 56% !important;
    height: 5px !important;
    transform: translateX(-50%) !important;
  }

  /* 2) Voice pill: visible running line + waveform movement */
  .voice-running-line {
    position: relative !important;
    overflow: hidden !important;
    border-radius: 999px !important;
    padding: 0 7px !important;
    min-height: 28px !important;
  }

  .voice-progress-line {
    display: block !important;
    position: absolute !important;
    z-index: 1 !important;
    left: 6px !important;
    top: 50% !important;
    width: 10% !important;
    height: 2px !important;
    transform: translateY(-50%) !important;
    border-radius: 999px !important;
    background: linear-gradient(90deg, rgba(255,255,255,.62), rgba(255,255,255,.12)) !important;
    box-shadow: 0 0 12px rgba(255,255,255,.38) !important;
    animation: voiceLineRunActually 2.6s ease-in-out infinite !important;
  }

  .voice-progress-line::after {
    content: '' !important;
    position: absolute !important;
    right: -3px !important;
    top: 50% !important;
    width: 6px !important;
    height: 6px !important;
    transform: translateY(-50%) !important;
    border-radius: 999px !important;
    background: #fff !important;
    box-shadow: 0 0 12px rgba(255,255,255,.9) !important;
  }

  .voice-running-line::before {
    content: '' !important;
    position: absolute !important;
    z-index: 1 !important;
    top: 0 !important;
    bottom: 0 !important;
    width: 34px !important;
    left: -42px !important;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent) !important;
    animation: voiceSweepActually 2.6s ease-in-out infinite !important;
  }

  .voice-running-line i {
    position: relative !important;
    z-index: 2 !important;
    animation: waveformDanceActually 880ms ease-in-out infinite !important;
    animation-delay: calc(var(--wave-index) * -42ms) !important;
  }

  /* 3) Right phone icon: cleaner filled receiver */
  .clean-phone-icon {
    background: rgba(231,211,255,.96) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.48),
      0 0 14px rgba(115,0,255,.18) !important;
  }

  .clean-phone-icon svg {
    width: 23px !important;
    height: 23px !important;
    fill: #7300FF !important;
    stroke: none !important;
    transform: translateY(.25px) !important;
  }

  .clean-phone-icon svg path {
    fill: #7300FF !important;
    stroke: none !important;
  }

  /* 4) Third card progress circle: delete the square/pill and prevent flat square cap */
  .task-ring small,
  .task-ring-content small {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
  }

  .task-ring .ring-progress {
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    filter: drop-shadow(0 0 12px rgba(115,0,255,.74)) !important;
  }

  .task-ring-content {
    gap: 4px !important;
  }

  .task-ring-content strong {
    margin-top: 0 !important;
  }

  @keyframes voiceLineRunActually {
    0% { width: 8%; opacity: .52; }
    54% { width: 78%; opacity: 1; }
    100% { width: 8%; opacity: .52; }
  }

  @keyframes voiceSweepActually {
    0% { transform: translateX(0); opacity: 0; }
    22% { opacity: .8; }
    72% { transform: translateX(260px); opacity: .8; }
    100% { transform: translateX(260px); opacity: 0; }
  }

  @keyframes waveformDanceActually {
    0%, 100% { transform: scaleY(.52); opacity: .62; }
    50% { transform: scaleY(1.15); opacity: 1; }
  }

  @media (max-width: 980px) {
    .job-card-figma:nth-child(3)::before {
      left: 50% !important;
      right: auto !important;
      top: auto !important;
      bottom: -42px !important;
      width: 78% !important;
      height: 18px !important;
      transform: translateX(-50%) !important;
    }

    .job-card-figma:nth-child(3)::after {
      left: 50% !important;
      right: auto !important;
      top: auto !important;
      bottom: -31px !important;
      width: 56% !important;
      height: 5px !important;
      transform: translateX(-50%) !important;
    }
  }


  /* v48-career-final: requested fixes only — behind-card lighting, voice line, right icon, task-ring artifact */
  .jobs-grid-figma {
    position: relative !important;
    isolation: isolate !important;
    overflow: visible !important;
  }

  .job-card-figma {
    position: relative !important;
    z-index: auto !important;
    overflow: visible !important;
    isolation: auto !important;
    background: #070509 !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.075),
      0 16px 38px rgba(0,0,0,.34) !important;
  }

  .job-card-figma > * {
    position: relative !important;
    z-index: 4 !important;
  }

  .job-card-figma::before,
  .job-card-figma::after {
    content: '' !important;
    position: absolute !important;
    pointer-events: none !important;
    border-radius: 999px !important;
    mix-blend-mode: screen !important;
  }

  .job-card-figma::before {
    z-index: -2 !important;
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -56px !important;
    width: 72% !important;
    height: 24px !important;
    transform: translateX(-50%) !important;
    background: rgba(115, 0, 255, .86) !important;
    filter: blur(20px) !important;
    opacity: .18 !important;
  }

  .job-card-figma::after {
    z-index: -1 !important;
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    bottom: -35px !important;
    width: 42% !important;
    height: 5px !important;
    transform: translateX(-50%) !important;
    background: rgba(232, 228, 255, .78) !important;
    filter: blur(7px) !important;
    opacity: .13 !important;
    box-shadow: none !important;
  }

  .job-card-figma:nth-child(1)::before {
    top: -56px !important;
    bottom: auto !important;
  }

  .job-card-figma:nth-child(1)::after {
    top: -35px !important;
    bottom: auto !important;
  }

  .job-card-figma:nth-child(2)::before {
    bottom: -56px !important;
    top: auto !important;
  }

  .job-card-figma:nth-child(2)::after {
    bottom: -35px !important;
    top: auto !important;
  }

  .job-card-figma:nth-child(3)::before {
    left: auto !important;
    right: -58px !important;
    top: 50% !important;
    bottom: auto !important;
    width: 24px !important;
    height: 62% !important;
    transform: translateY(-50%) !important;
    background: rgba(115, 0, 255, .82) !important;
    filter: blur(20px) !important;
    opacity: .16 !important;
  }

  .job-card-figma:nth-child(3)::after {
    left: auto !important;
    right: -34px !important;
    top: 50% !important;
    bottom: auto !important;
    width: 5px !important;
    height: 36% !important;
    transform: translateY(-50%) !important;
    background: rgba(232, 228, 255, .72) !important;
    filter: blur(7px) !important;
    opacity: .12 !important;
  }

  .jobs-grid-figma.expanded .job-card-figma:nth-child(n+4)::before {
    top: auto !important;
    bottom: -56px !important;
    left: 50% !important;
    right: auto !important;
    width: 72% !important;
    height: 24px !important;
    transform: translateX(-50%) !important;
  }

  .jobs-grid-figma.expanded .job-card-figma:nth-child(n+4)::after {
    top: auto !important;
    bottom: -35px !important;
    left: 50% !important;
    right: auto !important;
    width: 42% !important;
    height: 5px !important;
    transform: translateX(-50%) !important;
  }

  .audio-player {
    overflow: hidden !important;
  }

  .voice-running-line {
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    min-height: 30px !important;
    padding: 0 9px !important;
    overflow: hidden !important;
    border-radius: 999px !important;
    background: linear-gradient(90deg, rgba(35, 0, 75, .20), rgba(255,255,255,.08), rgba(35, 0, 75, .18)) !important;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.08) !important;
  }

  .voice-progress-line {
    display: block !important;
    position: absolute !important;
    z-index: 1 !important;
    left: 10px !important;
    top: 50% !important;
    width: 16% !important;
    height: 3px !important;
    transform: translateY(-50%) !important;
    border-radius: 999px !important;
    background: linear-gradient(90deg, rgba(255,255,255,.08), rgba(255,255,255,.9), rgba(255,255,255,.18)) !important;
    box-shadow: 0 0 14px rgba(255,255,255,.52) !important;
    animation: voiceLineRunV48 2.4s cubic-bezier(.42,0,.25,1) infinite !important;
  }

  .voice-progress-line::after {
    content: '' !important;
    position: absolute !important;
    right: -4px !important;
    top: 50% !important;
    width: 7px !important;
    height: 7px !important;
    transform: translateY(-50%) !important;
    border-radius: 999px !important;
    background: #fff !important;
    box-shadow: 0 0 13px rgba(255,255,255,.95) !important;
  }

  .voice-running-line::before {
    content: '' !important;
    position: absolute !important;
    z-index: 1 !important;
    top: 3px !important;
    bottom: 3px !important;
    left: -30% !important;
    width: 28% !important;
    border-radius: inherit !important;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.20), transparent) !important;
    animation: voiceSweepV48 2.4s cubic-bezier(.42,0,.25,1) infinite !important;
  }

  .voice-running-line i {
    position: relative !important;
    z-index: 2 !important;
    background: rgba(255,255,255,.86) !important;
    box-shadow: 0 0 8px rgba(255,255,255,.22) !important;
    transform-origin: center !important;
    animation: waveformDanceV48 820ms ease-in-out infinite !important;
    animation-delay: calc(var(--wave-index) * -39ms) !important;
  }

  .clean-phone-icon {
    background:
      radial-gradient(circle at 34% 22%, rgba(255,255,255,.82), rgba(255,255,255,.16) 30%, transparent 55%),
      rgba(231,211,255,.94) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.62),
      inset 0 -8px 14px rgba(115,0,255,.10),
      0 0 18px rgba(255,255,255,.12) !important;
  }

  .clean-phone-icon svg {
    width: 22px !important;
    height: 22px !important;
    fill: none !important;
    stroke: #7300FF !important;
    stroke-width: 2.1 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    transform: none !important;
  }

  .clean-phone-icon svg path {
    fill: none !important;
    stroke: #7300FF !important;
    stroke-width: 2.1 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
  }

  .task-ring,
  .task-ring svg {
    overflow: visible !important;
  }

  .task-ring svg {
    filter: none !important;
  }

  .task-ring circle,
  .task-ring .ring-progress {
    vector-effect: non-scaling-stroke !important;
  }

  .task-ring .ring-progress {
    animation: taskRingProgress98 2.6s cubic-bezier(.22,.8,.22,1) infinite;
    stroke: #8c16ff !important;
    stroke-dasharray: 282.743;
    stroke-dashoffset: 11.31;
    stroke-linecap: butt !important;
    stroke-linejoin: round !important;
    filter: drop-shadow(0 0 10px rgba(115,0,255,.62)) !important;
  }

  .task-ring small,
  .task-ring-content small,
  .task-ring::before,
  .task-ring::after,
  .task-ring-content::before,
  .task-ring-content::after {
    content: none !important;
    display: none !important;
  }

  @keyframes voiceLineRunV48 {
    0% { width: 12%; opacity: .45; transform: translateY(-50%) translateX(0); }
    48% { width: calc(100% - 28px); opacity: .96; transform: translateY(-50%) translateX(0); }
    78% { width: calc(100% - 28px); opacity: .72; transform: translateY(-50%) translateX(8px); }
    100% { width: 12%; opacity: .45; transform: translateY(-50%) translateX(0); }
  }

  @keyframes voiceSweepV48 {
    0% { transform: translateX(0); opacity: 0; }
    18% { opacity: .7; }
    78% { transform: translateX(430%); opacity: .7; }
    100% { transform: translateX(430%); opacity: 0; }
  }

  @keyframes waveformDanceV48 {
    0%, 100% { transform: scaleY(.5); opacity: .64; }
    50% { transform: scaleY(1.24); opacity: 1; }
  }


  @media (max-width: 980px) {
    .job-card-figma:nth-child(3)::before {
      left: 50% !important;
      right: auto !important;
      top: auto !important;
      bottom: -56px !important;
      width: 72% !important;
      height: 24px !important;
      transform: translateX(-50%) !important;
    }

    .job-card-figma:nth-child(3)::after {
      left: 50% !important;
      right: auto !important;
      top: auto !important;
      bottom: -35px !important;
      width: 42% !important;
      height: 5px !important;
      transform: translateX(-50%) !important;
    }
  }


  /* v49: Careers typography consistency + bigger hero sticker + page-dot cleanup only */
  .career-bg .career-dots,
  .career-dots {
    display: none !important;
  }

  .section-heading,
  .perks-heading,
  .process-section .section-heading,
  .jobs-section-figma .jobs-heading,
  .values-section > .section-heading {
    width: min(760px, 100%) !important;
    margin-left: auto !important;
    margin-right: auto !important;
    margin-bottom: clamp(34px, 4.6vw, 58px) !important;
    text-align: center !important;
  }

  .section-kicker.small,
  .perks-heading .section-kicker.small,
  .process-section .section-kicker.small,
  .jobs-section-figma .section-kicker.small {
    min-width: 138px !important;
    height: 42px !important;
    margin-bottom: clamp(20px, 2.4vw, 30px) !important;
    font-size: clamp(15px, 1.25vw, 19px) !important;
    line-height: 42px !important;
    font-weight: 600 !important;
    letter-spacing: .035em !important;
  }

  .section-kicker.small .corner,
  .perks-heading .section-kicker.small .corner,
  .process-section .section-kicker.small .corner,
  .jobs-section-figma .section-kicker.small .corner {
    width: 10px !important;
    height: 10px !important;
    border-width: 2px !important;
  }

  .section-heading h2,
  .perks-heading h2,
  .process-section h2,
  .jobs-section-figma h2,
  .values-section > .section-heading h2 {
    font-size: clamp(40px, 4.65vw, 64px) !important;
    line-height: 1.12 !important;
    letter-spacing: -.018em !important;
    font-weight: 600 !important;
    text-shadow: 0 0 42px rgba(255,255,255,.2) !important;
  }

  .section-heading p,
  .perks-heading p,
  .process-section > .section-heading > p,
  .jobs-section-figma .jobs-heading p {
    width: min(690px, 100%) !important;
    margin: clamp(16px, 1.8vw, 24px) auto 0 !important;
    color: rgba(255,255,255,.7) !important;
    font-size: clamp(14px, 1.34vw, 18.5px) !important;
    line-height: 1.58 !important;
    font-weight: 400 !important;
    letter-spacing: 0 !important;
  }

  @media (max-width: 860px) {
    .career-hero {
      height: clamp(680px, 132vw, 760px) !important;
      min-height: clamp(680px, 132vw, 760px) !important;
    }

    .hero-content {
      height: 590px !important;
    }

    .career-hero h1 {
      top: clamp(78px, 17vw, 94px) !important;
    }

    .career-hero p {
      top: clamp(156px, 34vw, 184px) !important;
    }

    .hero-careers-sticker {
      top: clamp(274px, 56vw, 322px) !important;
      width: clamp(116px, 27vw, 144px) !important;
      height: clamp(116px, 27vw, 144px) !important;
    }

    .hero-actions {
      top: clamp(432px, 86vw, 486px) !important;
    }

    .section-heading h2,
    .perks-heading h2,
    .process-section h2,
    .jobs-section-figma h2,
    .values-section > .section-heading h2 {
      font-size: clamp(34px, 9.8vw, 52px) !important;
      line-height: 1.08 !important;
      white-space: normal !important;
      letter-spacing: -.035em !important;
    }
  }

  @media (max-width: 560px) {
    .career-hero {
      height: 710px !important;
      min-height: 710px !important;
    }

    .hero-content {
      height: 590px !important;
    }

    .career-hero h1 {
      top: 78px !important;
    }

    .career-hero p {
      top: 164px !important;
    }

    .hero-careers-sticker {
      top: 304px !important;
      width: 122px !important;
      height: 122px !important;
    }

    .hero-actions {
      top: 452px !important;
    }

    .section-heading,
    .perks-heading,
    .process-section .section-heading,
    .jobs-section-figma .jobs-heading,
    .values-section > .section-heading {
      margin-bottom: 34px !important;
    }
  }


  /* v50: requested micro-adjustment only — kicker/title spacing, kicker scale, sticker size/no glow */
  .hero-kicker {
    font-size: 21px !important;
  }

  .career-hero h1 {
    top: 85px !important;
  }

  .hero-careers-sticker {
    width: clamp(150px, 14.4vw, 190px) !important;
    height: clamp(150px, 14.4vw, 190px) !important;
    filter: none !important;
  }

  .section-kicker.small,
  .perks-heading .section-kicker.small,
  .process-section .section-kicker.small,
  .jobs-section-figma .section-kicker.small {
    margin-bottom: clamp(18px, 2.1vw, 26px) !important;
    font-size: clamp(16.5px, 1.38vw, 20.9px) !important;
  }

  @media (max-width: 860px) {
    .hero-kicker {
      font-size: clamp(18px, 4.3vw, 21px) !important;
    }

    .career-hero h1 {
      top: clamp(75px, 16vw, 90px) !important;
    }

    .hero-careers-sticker {
      width: clamp(136px, 31vw, 166px) !important;
      height: clamp(136px, 31vw, 166px) !important;
      filter: none !important;
    }

    .section-kicker.small,
    .perks-heading .section-kicker.small,
    .process-section .section-kicker.small,
    .jobs-section-figma .section-kicker.small {
      margin-bottom: clamp(16px, 3.6vw, 23px) !important;
      font-size: clamp(15px, 3.7vw, 18.5px) !important;
    }
  }

  @media (max-width: 560px) {
    .career-hero h1 {
      top: 75px !important;
    }

    .hero-careers-sticker {
      width: 144px !important;
      height: 144px !important;
      filter: none !important;
    }

    .section-kicker.small,
    .perks-heading .section-kicker.small,
    .process-section .section-kicker.small,
    .jobs-section-figma .section-kicker.small {
      margin-bottom: 18px !important;
      font-size: 15px !important;
    }
  }


  /* v51: requested focused fixes — kicker/title spacing, fit-content labels, larger sticker, closer perks, removed placeholders */
  .hero-kicker,
  .section-kicker.small,
  .perks-heading .section-kicker.small,
  .process-section .section-kicker.small,
  .jobs-section-figma .section-kicker.small {
    width: fit-content !important;
    min-width: 0 !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
    white-space: nowrap !important;
  }

  .hero-kicker {
    height: 66px !important;
    font-size: 21px !important;
    line-height: 66px !important;
  }

  .career-hero {
    height: clamp(980px, 84vw, 1080px) !important;
    min-height: clamp(980px, 84vw, 1080px) !important;
  }

  .hero-content {
    height: 900px !important;
  }

  .career-hero h1 {
    top: 82px !important;
  }

  .hero-careers-sticker {
    top: 250px !important;
    width: clamp(300px, 28.8vw, 380px) !important;
    height: clamp(300px, 28.8vw, 380px) !important;
    filter: none !important;
  }

  .hero-actions {
    top: 700px !important;
  }

  .section-kicker.small,
  .perks-heading .section-kicker.small,
  .process-section .section-kicker.small,
  .jobs-section-figma .section-kicker.small {
    height: 42px !important;
    margin-bottom: clamp(15px, 1.8vw, 22px) !important;
    font-size: clamp(16.5px, 1.38vw, 20.9px) !important;
    line-height: 42px !important;
  }

  .section-heading,
  .perks-heading,
  .process-section .section-heading,
  .jobs-section-figma .jobs-heading,
  .values-section > .section-heading {
    margin-bottom: clamp(28px, 3.9vw, 50px) !important;
  }

  .perks-heading {
    margin-bottom: clamp(18px, 2.3vw, 30px) !important;
  }

  .perks-heading h2 {
    white-space: nowrap !important;
    width: max-content !important;
    max-width: none !important;
    margin-left: 50% !important;
    transform: translateX(-50%) !important;
  }

  .perks-stage {
    height: clamp(405px, 34vw, 455px) !important;
    margin-top: clamp(-8px, -0.7vw, -4px) !important;
  }

  .perks-stage::after {
    content: none !important;
    display: none !important;
  }

  @media (max-width: 860px) {
    .career-hero {
      height: 940px !important;
      min-height: 940px !important;
    }

    .hero-content {
      height: 850px !important;
    }

    .career-hero h1 {
      top: clamp(72px, 15vw, 86px) !important;
    }

    .hero-careers-sticker {
      top: clamp(250px, 52vw, 292px) !important;
      width: clamp(250px, 58vw, 330px) !important;
      height: clamp(250px, 58vw, 330px) !important;
      filter: none !important;
    }

    .hero-actions {
      top: clamp(650px, 122vw, 690px) !important;
    }

    .section-kicker.small,
    .perks-heading .section-kicker.small,
    .process-section .section-kicker.small,
    .jobs-section-figma .section-kicker.small {
      margin-bottom: clamp(14px, 3vw, 20px) !important;
    }

    .perks-heading h2 {
      white-space: normal !important;
      width: min(100%, 680px) !important;
      max-width: 100% !important;
      margin-left: auto !important;
      transform: none !important;
    }

    .perks-stage {
      height: clamp(440px, 92vw, 520px) !important;
    }
  }

  @media (max-width: 560px) {
    .career-hero {
      height: 900px !important;
      min-height: 900px !important;
    }

    .hero-content {
      height: 820px !important;
    }

    .career-hero h1 {
      top: 72px !important;
    }

    .hero-careers-sticker {
      top: 270px !important;
      width: 270px !important;
      height: 270px !important;
      filter: none !important;
    }

    .hero-actions {
      top: 650px !important;
    }

    .section-kicker.small,
    .perks-heading .section-kicker.small,
    .process-section .section-kicker.small,
    .jobs-section-figma .section-kicker.small {
      margin-bottom: 15px !important;
    }

    .perks-stage {
      height: 455px !important;
    }
  }


  /* v53: only core-values card color consistency + solid numbers */
  .culture-stage-built .tone-green,
  .culture-stage-built .tone-gold {
    --value-glow-1: rgba(232,228,255,.9);
    --value-glow-2: rgba(115,0,255,.8);
    --value-edge-glow: rgba(115,0,255,.28);
    --value-glass-tint: rgba(152,70,255,.42);
    --icon-color: linear-gradient(180deg, rgba(174,113,255,.98) 0%, rgba(115,0,255,.92) 100%);
    --icon-glow: rgba(115,0,255,.72);
    --value-hot-x: 62%;
    --value-hot-y: 78%;
  }

  .culture-stage-built .value-card h3 span {
    color: #fff !important;
    opacity: 1 !important;
  }


  /* v54: requested only — tighter section spacing, remove center light, lower/larger values logo */
  .perks-section {
    margin-top: clamp(10px, 1.7vw, 28px) !important;
  }

  .values-section {
    margin-top: clamp(48px, 5.2vw, 76px) !important;
  }

  .process-section {
    margin-top: clamp(48px, 5.2vw, 76px) !important;
  }

  .jobs-section,
  .jobs-section-figma {
    margin-top: clamp(54px, 5.8vw, 88px) !important;
  }

  .culture-stage-built .culture-floor-glow {
    display: none !important;
    opacity: 0 !important;
  }

  .culture-stage-built .values-logo {
    top: 55.5% !important;
    width: clamp(104px, 9.89vw, 129px) !important;
  }

  @media (max-width: 980px) {
    .perks-section {
      margin-top: clamp(8px, 2.4vw, 22px) !important;
    }

    .values-section,
    .process-section,
    .jobs-section,
    .jobs-section-figma {
      margin-top: clamp(42px, 8vw, 70px) !important;
    }

    .culture-stage-built .values-logo {
      top: clamp(152px, 31vw, 226px) !important;
      width: clamp(115px, 27.6vw, 163px) !important;
    }
  }

  @media (max-width: 560px) {
    .values-section,
    .process-section,
    .jobs-section,
    .jobs-section-figma {
      margin-top: 42px !important;
    }

    .culture-stage-built .values-logo {
      top: clamp(130px, 36vw, 167px) !important;
      width: clamp(99px, 27.6vw, 129px) !important;
    }
  }


  /* v55: requested only — remove process bulb, add value number spacing, remove connector-line shadow */
  .glow-center {
    display: none !important;
    opacity: 0 !important;
  }

  .culture-stage-built .culture-beams-combined {
    filter: none !important;
  }


  /* v56: requested only — perks bottom light removal, purple rail, tighter hero/perks gap, process-card theme for core values */
  .perks-section {
    margin-top: clamp(0px, .6vw, 10px) !important;
  }

  .perks-sticky {
    padding-top: 0 !important;
  }

  .perks-stage::before,
  .perks-aurora {
    content: none !important;
    display: none !important;
    opacity: 0 !important;
  }

  .perks-progress {
    background: linear-gradient(180deg, transparent, rgba(115,0,255,.28), rgba(169,84,255,.22), transparent) !important;
  }

  .perks-progress span {
    background: linear-gradient(180deg, rgba(115,0,255,0), #7300ff, #a954ff, rgba(115,0,255,0)) !important;
    box-shadow: 0 0 18px rgba(115,0,255,.72), 0 0 34px rgba(169,84,255,.34) !important;
  }

  .culture-stage-built .value-card {
    border: 1.8px solid rgba(218,183,255,.5) !important;
    background:
      radial-gradient(circle at 7% 12%, rgba(115,0,255,.24), transparent 28%),
      radial-gradient(circle at 98% 88%, rgba(115,0,255,.18), transparent 36%),
      linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.012)),
      rgba(4, 2, 8, .86) !important;
    background-blend-mode: normal !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.12),
      inset 0 -1px 0 rgba(255,255,255,.04),
      0 26px 90px rgba(0,0,0,.34) !important;
    backdrop-filter: blur(18px) saturate(140%) !important;
    -webkit-backdrop-filter: blur(18px) saturate(140%) !important;
  }

  .culture-stage-built .value-card::before {
    inset: 0 !important;
    height: auto !important;
    background:
      radial-gradient(circle at 6% 9%, rgba(255,255,255,.22), transparent 10%),
      radial-gradient(circle at 2% 18%, rgba(139,35,255,.9), rgba(115,0,255,.2) 17%, transparent 35%) !important;
    filter: blur(7px) !important;
    opacity: .72 !important;
    mix-blend-mode: normal !important;
  }

  .culture-stage-built .value-card::after {
    inset: auto auto -24px -60px !important;
    width: 250px !important;
    height: 150px !important;
    border-radius: 50% !important;
    background: radial-gradient(ellipse at center, rgba(255,255,255,.7), rgba(115,0,255,.7) 32%, transparent 70%) !important;
    filter: blur(18px) !important;
    opacity: .35 !important;
    mix-blend-mode: normal !important;
  }

  .culture-stage-built .value-card > div::before {
    content: none !important;
    display: none !important;
  }

  .culture-stage-built .value-card h3 span {
    color: #fff !important;
    opacity: 1 !important;
  }


  /* v57: requested only — no hero text glow/lines */
  .career-hero h1 {
    text-shadow: none !important;
  }

  .career-lines {
    display: none !important;
    opacity: 0 !important;
  }



  /* v58: restore the staggered perks motion shape, remove requested job glows only */
  .jobs-view-all button {
    box-shadow: inset 0 1px 0 rgba(255,255,255,.22) !important;
  }

  .open-roles-pill {
    box-shadow: inset 0 1px 0 rgba(255,255,255,.36) !important;
  }


  /* final requested only — navbar CTA purple for purple buttons */

  .primary-btn,
  .ghost-btn,
  .job-card button,
  .jobs-more button,
  .job-card-figma button,
  .jobs-view-all button,
  .jobs-filter button,
  .jobs-filter button.active {
    background: #7300ff !important;
    background-image: none !important;
    background-blend-mode: normal !important;
    color: #fff !important;
  }

  .primary-btn::before,
  .ghost-btn::before,
  .job-card button::before,
  .jobs-more button::before,
  .job-card-figma button::before,
  .jobs-view-all button::before {
    content: none !important;
    display: none !important;
    opacity: 0 !important;
  }



  /* v59-phone-only-requested-fixes: mobile-only spacing, static perks, removed corner shadows, solid process icons, safer upload arrow, 98% ring, complete offer runner */
  @media (max-width: 560px) {
    /* tighter phone title/subheading rhythm */
    .section-heading,
    .perks-heading,
    .process-section .section-heading,
    .jobs-heading {
      margin-bottom: 18px !important;
    }

    .section-kicker.small,
    .perks-heading .section-kicker.small,
    .process-section .section-kicker.small,
    .jobs-section-figma .section-kicker.small {
      margin-bottom: 10px !important;
    }

    .section-heading h2,
    .perks-heading h2,
    .process-section h2,
    .jobs-heading h2 {
      margin-top: 0 !important;
    }

    .section-heading p,
    .perks-heading p,
    .process-section > .section-heading > p,
    .jobs-heading p {
      margin-top: 8px !important;
      line-height: 1.36 !important;
    }

    .career-hero p {
      top: 128px !important;
      line-height: 1.42 !important;
    }

    /* lift hero buttons and remove inner arrows on phone only */
    .hero-actions {
      top: 610px !important;
      gap: 9px !important;
    }

    .hero-actions .hero-arrow {
      display: none !important;
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
    }

    .hero-actions .primary-btn,
    .hero-actions .ghost-btn {
      gap: 0 !important;
      padding-inline: 18px !important;
    }

    /* perks: static cards on phone, no back-to-back loop */
    .perks-section {
      margin-top: 0 !important;
    }

    .perks-sticky {
      padding-bottom: 22px !important;
    }

    .perks-stage {
      display: grid !important;
      gap: 12px !important;
      height: auto !important;
      min-height: 0 !important;
      width: 100% !important;
      perspective: none !important;
      contain: layout !important;
      overflow: visible !important;
    }

    .perks-progress,
    .perks-stage::before,
    .perks-stage::after,
    .perks-aurora {
      content: none !important;
      display: none !important;
      opacity: 0 !important;
    }

    .perks-stage .perk-card,
    .perks-stage .perk-card:nth-of-type(odd),
    .perks-stage .perk-card:nth-of-type(even) {
      position: relative !important;
      left: auto !important;
      top: auto !important;
      width: 100% !important;
      height: auto !important;
      min-height: 112px !important;
      opacity: 1 !important;
      filter: none !important;
      transform: none !important;
      pointer-events: auto !important;
      will-change: auto !important;
      z-index: auto !important;
    }

    .perks-stage .perk-card::before {
      opacity: .18 !important;
      transform: none !important;
    }

    .perks-stage .perk-card::after {
      opacity: .2 !important;
    }

    .perks-stage .card-icon,
    .perks-stage .card-icon svg {
      animation: none !important;
      transform: none !important;
    }

    /* culture: keep cards below heading and remove the top-left shadow corner */
    .values-section > .section-heading {
      position: relative !important;
      z-index: 6 !important;
      margin-bottom: 18px !important;
    }

    .culture-stage-built {
      position: relative !important;
      z-index: 1 !important;
      margin-top: 18px !important;
      padding-top: clamp(172px, 46vw, 212px) !important;
    }

    .culture-stage-built .value-card,
    .culture-stage-built .value-top,
    .culture-stage-built .value-left,
    .culture-stage-built .value-right {
      background:
        radial-gradient(circle at 98% 88%, rgba(115,0,255,.16), transparent 36%),
        linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.012)),
        rgba(4, 2, 8, .88) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.12),
        inset 0 -1px 0 rgba(255,255,255,.04),
        0 18px 54px rgba(0,0,0,.28) !important;
    }

    .culture-stage-built .value-card::before,
    .culture-stage-built .value-card::after,
    .culture-stage-built .value-card > div::before {
      content: none !important;
      display: none !important;
      opacity: 0 !important;
    }

    /* process: remove top-left corner shadow and make title icons solid/static */
    .hiring-process-grid .process-card {
      background:
        radial-gradient(circle at 98% 88%, rgba(115,0,255,.16), transparent 36%),
        linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.012)),
        rgba(4, 2, 8, .88) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.12),
        inset 0 -1px 0 rgba(255,255,255,.04),
        0 18px 54px rgba(0,0,0,.28) !important;
    }

    .hiring-process-grid .process-card::before {
      content: none !important;
      display: none !important;
      opacity: 0 !important;
    }

    .hiring-process-grid .process-icon,
    .hiring-process-grid .process-icon svg,
    .hiring-process-grid .process-card-progress .process-icon svg {
      animation: none !important;
      transform: none !important;
      filter: none !important;
      stroke-dasharray: none !important;
    }

    /* upload: arrow moves safely without hitting the cloud */
    .upload-cloud-arrow {
      animation: cloudArrowSafePhone 2.2s ease-in-out infinite !important;
      transform-origin: 12px 12px !important;
    }

    .upload-icon svg {
      animation: none !important;
      transform: none !important;
    }

    /* show your craft: no glow loop; circle fills once to the actual 98% value */
    .hiring-process-grid .process-card-checklist::after {
      content: none !important;
      display: none !important;
      opacity: 0 !important;
    }

    .process-craft .task-list i {
      animation: none !important;
      box-shadow: none !important;
    }

    .task-ring .ring-progress {
      stroke-dasharray: 282.743;
      stroke-dashoffset: 11.31;
      stroke-linecap: butt !important;
      animation: taskRingProgress98 2.6s cubic-bezier(.22,.8,.22,1) infinite;
      filter: none !important;
    }

    .task-ring,
    .task-ring svg {
      overflow: visible !important;
    }

    /* offer: make the ball reach the final Complete circle */
    .offer-timeline {
      position: relative !important;
      overflow: visible !important;
    }

    .offer-runner {
      left: 5px;
      top: 50% !important;
      width: 12px !important;
      height: 12px !important;
      margin-top: -6px !important;
      transform: none;
      animation: runnerReachCompletePhone 3.35s cubic-bezier(.22,.8,.22,1) infinite !important;
    }

    .offer-runner::after {
      opacity: .58 !important;
      filter: blur(6px) !important;
    }
  }

  @keyframes cloudArrowSafePhone {
    0%, 100% { transform: translateY(2.8px); opacity: .78; }
    50% { transform: translateY(.2px); opacity: 1; }
  }

  @keyframes runnerReachCompletePhone {
    0%, 8% { left: 5px; opacity: 0; }
    14% { left: 5px; opacity: 1; }
    78%, 90% { left: calc(100% - 17px); opacity: 1; }
    100% { left: calc(100% - 17px); opacity: 0; }
  }


  /* v60-phone-only-followup: culture logo only, 98% ring placement, runner reaches complete */
  @media (max-width: 560px) {
    /* Our culture: remove the mobile background design, keep only the Airo logo, and pull cards closer to title */
    .values-section > .section-heading {
      margin-bottom: 8px !important;
    }

    .culture-stage-built {
      margin-top: 0 !important;
      padding-top: 72px !important;
      padding-bottom: 34px !important;
      gap: 10px !important;
    }

    .culture-stage-built .culture-art,
    .culture-stage-built .culture-floor-glow,
    .culture-stage-built .culture-beams-combined,
    .culture-stage-built .culture-beam,
    .culture-stage-built .culture-beam-center,
    .culture-stage-built .culture-beam-left,
    .culture-stage-built .culture-beam-right {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .culture-stage-built .values-logo {
      display: block !important;
      left: 50% !important;
      top: 8px !important;
      width: 88px !important;
      transform: translateX(-50%) !important;
      opacity: .94 !important;
      filter: drop-shadow(0 0 18px rgba(115, 0, 255, .42)) !important;
      z-index: 4 !important;
    }

    /* Process third box: keep the progress ring to the right of the task text on phone */
    .process-craft {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) 96px !important;
      align-items: center !important;
      gap: 10px !important;
    }

    .process-craft .task-list {
      min-width: 0 !important;
      gap: 6px !important;
    }

    .process-craft .task-list span {
      white-space: nowrap !important;
      font-size: 11px !important;
    }

    .task-ring {
      width: 96px !important;
      height: 96px !important;
      justify-self: end !important;
      margin: 0 !important;
    }

    .task-ring circle {
      stroke-width: 10 !important;
    }

    .task-ring .ring-progress {
      stroke-dasharray: 282.743;
      stroke-dashoffset: 11.31;
      stroke-linecap: butt !important;
      stroke-linejoin: round !important;
      animation: taskRingProgress98 2.6s cubic-bezier(.22,.8,.22,1) infinite;
      filter: none !important;
    }

    .task-ring-content strong {
      font-size: 10px !important;
    }

    .task-ring-content b {
      font-size: 12px !important;
    }

    /* Offer card: keep the runner moving, but let it touch the Complete circle */
    .offer-runner {
      left: 5px;
      top: 50% !important;
      width: 12px !important;
      height: 12px !important;
      margin-top: -6px !important;
      transform: none;
      animation: runnerReachCompletePhoneV60 3.35s cubic-bezier(.22,.8,.22,1) infinite !important;
    }
  }

  @keyframes runnerReachCompletePhoneV60 {
    0%, 8% { left: 5px; opacity: 0; }
    14% { left: 5px; opacity: 1; }
    78%, 90% { left: calc(100% - 12px); opacity: 1; }
    100% { left: calc(100% - 12px); opacity: 0; }
  }


  @media (max-width: 860px) {
    :global(.site-shell.careers-route) {
      background: linear-gradient(180deg, #050107 0%, #030005 100%);
    }

    .career-bg .glow {
      display: none;
    }

    .perks-stage .perk-card.perk-active {
      border-color: rgba(213,184,255,.22) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.08),
        0 18px 46px rgba(0,0,0,.46),
        0 0 0 1px rgba(115,0,255,.05),
        0 0 26px rgba(145,62,255,.11) !important;
    }

    .perks-stage .perk-card.perk-active::before {
      opacity: .18 !important;
      transform: none !important;
    }

    .perks-stage .perk-card.perk-active::after {
      opacity: .2 !important;
    }

    .perks-stage .card-icon {
      box-shadow:
        0 12px 34px rgba(115,0,255,.43),
        inset 0 1px 0 rgba(255,255,255,.22) !important;
      transition: none !important;
    }
  }

  /* final-active-fixes: exact requested mobile/process changes */
  .task-ring .ring-progress {
    stroke-dasharray: 282.743;
    stroke-dashoffset: 282.743;
    stroke-linecap: butt;
    filter: none;
    animation: taskRingProgress98 2.6s cubic-bezier(.22,.8,.22,1) infinite;
  }

  @media (max-width: 560px) {
    .task-ring .ring-progress {
      stroke-dasharray: 282.743;
      stroke-dashoffset: 282.743;
      stroke-linecap: butt;
      filter: none;
      animation: taskRingProgress98 2.6s cubic-bezier(.22,.8,.22,1) infinite;
    }

    .offer-runner {
      left: 5px;
      animation: runnerReachCompletePhoneV60 3.35s cubic-bezier(.22,.8,.22,1) infinite !important;
    }
  }



  /* final-request: make perk stickers slightly bigger and keep 98% ring visibly open */
  .perks-stage .card-icon :global(tgs-player) {
    width: clamp(28px, 2.65vw, 38px) !important;
    height: clamp(28px, 2.65vw, 38px) !important;
  }

  .task-ring .ring-progress {
    stroke-dasharray: 282.743 !important;
    stroke-dashoffset: 282.743;
    stroke-linecap: butt !important;
    animation: taskRingProgress98 2.6s cubic-bezier(.22,.8,.22,1) infinite !important;
  }

  @media (max-width: 560px) {
    .perks-stage .card-icon :global(tgs-player) {
      width: 34px !important;
      height: 34px !important;
    }

    .task-ring .ring-progress {
      stroke-dasharray: 282.743 !important;
      stroke-dashoffset: 282.743;
      stroke-linecap: butt !important;
      animation: taskRingProgress98 2.6s cubic-bezier(.22,.8,.22,1) infinite !important;
    }
  }



  /* cards reveal one-by-one on phone without changing the card design */
  @media (max-width: 700px) {
    .perks-stage .perk-card.career-fade-card-reveal,
    .perks-stage .perk-card:nth-of-type(odd).career-fade-card-reveal,
    .perks-stage .perk-card:nth-of-type(even).career-fade-card-reveal {
      opacity: 0 !important;
      transform: translateY(18px) !important;
      transition: opacity .72s ease var(--reveal-delay, 0ms), transform .72s ease var(--reveal-delay, 0ms) !important;
    }

    .perks-stage .perk-card.career-fade-card-reveal.career-visible,
    .perks-stage .perk-card:nth-of-type(odd).career-fade-card-reveal.career-visible,
    .perks-stage .perk-card:nth-of-type(even).career-fade-card-reveal.career-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  }



  /* Culture card placement: keep the lower cards swapped and let the top card cover the beam endpoints. */
  @media (min-width: 981px) {
    .culture-stage-built .value-left {
      left: auto;
      right: clamp(34px, 5vw, 74px);
    }

    .culture-stage-built .value-right {
      left: clamp(34px, 5vw, 74px);
      right: auto;
    }

    .culture-stage-built .value-top {
      top: clamp(46px, 4vw, 58px);
    }
  }

</style>
