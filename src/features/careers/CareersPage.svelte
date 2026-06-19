<script>
  import './styles/CareersPage.css';
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
