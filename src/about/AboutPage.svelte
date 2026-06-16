<script>
  import { featureRows, team } from './aboutData.js';

  const heroStripeWidths = [103, 103, 102, 103, 103, 103, 103, 102, 103, 103, 103, 102, 103];

  function iconPath(type) {
    if (type === 'cube') return 'M7 8.5 12 5.8l5 2.7v6.1l-5 2.8-5-2.8V8.5Zm5 2.6 5-2.6M12 11.1 7 8.5M12 11.1v6.3';
    if (type === 'infinity') return 'M7.2 14.5c-2 0-3.4-1.4-3.4-3.1s1.4-3.1 3.4-3.1c3.3 0 4.3 6.2 7.6 6.2 2 0 3.4-1.4 3.4-3.1s-1.4-3.1-3.4-3.1c-3.3 0-4.3 6.2-7.6 6.2Z';
    if (type === 'chart') return 'M5 17V9m6 8V5m6 12v-6M4 18h16';
    if (type === 'rocket') return 'M12.5 14.5 9.5 17.5l-3-3 3-3C10.8 7.6 13.3 5 18.8 4.2c-.8 5.5-3.4 8-7.3 9.3Zm-3.2 3.2-3.1 1 1-3.1m7.4-8.1h.1';
    if (type === 'gamepad') return 'M7.3 10.2h9.4c2 0 3.6 1.6 3.6 3.6v1.2c0 1.5-1 2.8-2.5 3.1-.9.2-1.7-.2-2.2-.9l-1.1-1.4h-5l-1.1 1.4c-.5.7-1.4 1.1-2.2.9A3.2 3.2 0 0 1 3.7 15v-1.2c0-2 1.6-3.6 3.6-3.6Zm.2 2.4v2.7m-1.4-1.35h2.8m7.4-.1h.1m2.1 0h.1';
    if (type === 'chat') return 'M5 6.5h14v9H9l-4 3v-12Z';
    if (type === 'cursor') return 'M6 4.5 18 12l-5.1 1.2 3.2 5.5-2.2 1.2-3.1-5.4L7.2 18 6 4.5Z';
    return 'M12 4.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1L5 11.5l5.1-1.9L12 4.5Z';
  }
</script>

<div class="about-page">
  <div class="about-glow about-glow-top"></div>
  <div class="about-glow about-glow-mid"></div>
  <div class="about-dots about-dots-one"></div>
  <div class="about-dots about-dots-two"></div>

  <section class="about-hero" aria-label="About Airo hero">
    <div class="hero-background-stack" aria-hidden="true"></div>

    <div class="hero-head">
      <div class="hero-label" aria-label="About Airo">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <strong>About Airo</strong>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>
      </div>

      <h1 class="hero-title">
        Shaping the
        <span>Future of play</span>
      </h1>
    </div>

    <div class="coded-hero-stage" aria-hidden="true">

      <div class="hero-cards-layer">
        <picture>
          <source media="(max-width: 560px)" srcset="/about/header-mobile.png" />
          <img class="hero-cards-svg" src="/about/header.svg" alt="" />
        </picture>
      </div>
    </div>
  </section>

  <section class="about-copy-section">
    <div class="section-kicker"><span></span>What we do<span></span></div>
    <h2>Built to last by people<br/>who actually play them</h2>
    <p>We believe great games don’t chase trends. They are built to last by people who actually play them.</p>
  </section>

  <section class="about-features" aria-label="Airo services">
    {#each featureRows as feature}
      <article class="feature-row">
        <div class="feature-copy">
          <h3>{feature.title}</h3>
          <p>{feature.copy}</p>
        </div>

        <div class={`feature-visual ${feature.variant}`} aria-hidden="true">
          {#if feature.variant === 'orbit'}
            <div class="service-arc"></div>
            <span class="node main icon-spark"></span>
            <span class="node left icon-gamepad"></span>
            <span class="node right icon-chat"></span>
            <span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span><span class="dot d4"></span>
          {:else if feature.variant === 'progress'}
            <div class="mini-dashboard">
              <small>Game update</small>
              <strong>+75%</strong>
              <div class="progress-track"><span></span></div>
              <div class="dash-actions"><em>Version 1.0.15</em><b>Make update</b></div>
            </div>
          {:else}
            <div class="bar-card">
              <small>The system stats</small>
              <div class="bars">
                <i style="--h:32%"></i><i style="--h:46%"></i><i style="--h:57%"></i><i style="--h:74%"></i><i style="--h:94%"></i>
              </div>
              <span>New results</span>
            </div>
          {/if}
        </div>
      </article>
    {/each}
  </section>

  <section class="team-section" aria-label="Airo team">
    <div class="section-kicker"><span></span>Our Team<span></span></div>
    <h2>Led by senior leadership</h2>
    <p>Airo’s partnerships are led directly by senior leadership, combining gameplay expertise with brand strategy to make every experience feel authentic.</p>

    <div class="team-grid">
      {#each team as member}
        <article class={`team-card ${member.tone}`}>
          <span>{member.badge}</span>
          <h3>{member.name}</h3>
          <strong>{member.role}</strong>
          <p>{member.copy}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="about-cta" aria-label="Build with Airo">
    <div>
      <h2>Build the next viral<br/>experience with us</h2>
      <p>We’re always looking for ambitious creators and partners.</p>
    </div>
    <a href="#work-with-us">Get in touch :)</a>
    <div class="cta-shapes" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  </section>



</div>

<style>
  .about-page {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: none;
    margin: 0 auto;
    padding: clamp(92px, 7.6vw, 118px) 0 0;
    overflow: hidden;
    color: #fff;
    background: #050107;
    isolation: isolate;
  }

  .about-page::before,
  .about-page::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .about-page::before,
  .about-page::after {
    display: none;
  }

  .about-glow,
  .about-dots {
    position: absolute;
    pointer-events: none;
    z-index: -1;
  }

  .about-glow-top,
  .about-glow-mid {
    display: none;
  }

  .section-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0 auto 18px;
    color: rgba(255,255,255,.78);
    font-size: 12px;
    letter-spacing: .02em;
  }

  .section-kicker span {
    width: 7px;
    height: 7px;
    border-top: 1px solid rgba(255,255,255,.6);
    border-left: 1px solid rgba(255,255,255,.6);
  }

  .section-kicker span:last-child {
    transform: rotate(180deg);
  }

  .about-hero {
    position: relative;
    min-height: clamp(700px, 92vw, 1180px);
    text-align: center;
    display: grid;
    place-items: start center;
    isolation: isolate;
  }

  .hero-background-stack {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    background: transparent;
    border-radius: 0;
  }

  .hero-fog-layer,
  .fog-shape,
  .hero-stripe-layer,
  .hero-grid-layer,
  .hero-edge-vignette,
  .hero-grain-layer {
    position: absolute;
    pointer-events: none;
  }

  .hero-fog-layer {
    left: 50%;
    top: 0;
    width: 1440px;
    height: 2805px;
    transform: translateX(-50%);
    opacity: 0.96;
    overflow: hidden;
    isolation: isolate;
  }

  .fog-shape {
    position: absolute;
    will-change: transform;
  }

  .fog-union {
    left: -1413px;
    top: -525px;
    width: 5316px;
    height: 2729.72px;
    background: #7300FF;
    filter: blur(300px);
    opacity: 0.98;
    clip-path: polygon(0 0, 50.9% 42.4%, 100% 2.6%, 100% 97.4%, 49.1% 57.6%, 0 100%);
  }

  .fog-purple-sweep {
    left: 256px;
    top: 710px;
    width: 1328.4px;
    height: 757.97px;
    background: rgba(115, 0, 255, 0.4);
    filter: blur(273.795px);
    transform: rotate(180deg);
    clip-path: polygon(0 49%, 100% 0, 100% 100%);
  }

  .fog-white-main {
    left: -196.7px;
    top: 461.5px;
    width: 1328.4px;
    height: 757.97px;
    background: #E8E4FF;
    filter: blur(138.795px);
    opacity: 0.95;
    clip-path: polygon(0 0, 100% 51%, 0 100%);
  }

  .fog-white-tight {
    left: -197px;
    top: 582px;
    width: 905px;
    height: 517px;
    background: #E8E4FF;
    filter: blur(55px);
    opacity: 0.88;
    clip-path: polygon(0 0, 100% 51%, 0 100%);
  }

  .hero-stripe-layer {
    left: 50%;
    top: clamp(580px, 50vw, 768px);
    width: 1336px;
    height: 1116px;
    display: flex;
    justify-content: flex-start;
    gap: 0;
    transform: translateX(calc(-50% - 11px));
    mix-blend-mode: soft-light;
    opacity: 0.62;
  }

  .hero-stripe {
    flex: 0 0 auto;
    height: 100%;
    background: linear-gradient(270deg, rgba(0, 0, 0, 0) -20%, rgba(255, 255, 255, 0.2) 75.76%, rgba(255, 255, 255, 0) 123.64%);
  }

  .hero-grid-layer {
    left: 50%;
    top: clamp(78px, 5.5vw, 113px);
    width: max(1424px, 102vw);
    height: 1700px;
    transform: translateX(-50%);
    opacity: 0.46;
    background-image:
      linear-gradient(rgba(234, 221, 255, 0.22) 0 0),
      linear-gradient(rgba(234, 221, 255, 0.22) 0 0);
    background-size: 5px 1px, 1px 5px;
    background-position: 0 0, 2px -2px;
    background-repeat: repeat;
    mask-image:
      linear-gradient(180deg, transparent 0%, #000 9%, rgba(0,0,0,.92) 70%, transparent 100%),
      linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%);
    mask-composite: intersect;
  }

  .hero-edge-vignette {
    inset: 0;
    z-index: 4;
    background:
      radial-gradient(ellipse at 50% 27%, transparent 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.72) 88%),
      linear-gradient(90deg, rgba(0,0,0,0.92) 0%, transparent 14%, transparent 84%, rgba(0,0,0,0.94) 100%),
      linear-gradient(180deg, transparent 0%, transparent 66%, rgba(0,0,0,0.94) 100%);
  }

  .hero-grain-layer {
    inset: 0;
    z-index: 3;
    opacity: 0.13;
    mix-blend-mode: screen;
    background-image:
      radial-gradient(circle at 19% 21%, rgba(255,255,255,.85) 0.6px, transparent 1.1px),
      radial-gradient(circle at 82% 31%, rgba(255,255,255,.75) 0.6px, transparent 1.1px),
      radial-gradient(circle at 41% 71%, rgba(255,255,255,.78) 0.6px, transparent 1.1px),
      radial-gradient(circle at 68% 86%, rgba(255,255,255,.72) 0.6px, transparent 1.1px);
    background-size: 96px 96px, 132px 132px, 157px 157px, 181px 181px;
  }

  .hero-head {
    position: relative;
    z-index: 4;
    width: min(860px, 92vw);
    margin: 0 auto;
    pointer-events: none;
  }

  .hero-label {
    position: relative;
    width: max-content;
    margin: 0 auto clamp(10px, 1.2vw, 16px);
    padding: 8px 24px 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    filter: drop-shadow(0 0 18px rgba(255,255,255,.12));
  }

  .hero-label strong {
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: clamp(13px, 1.25vw, 18px);
    line-height: 1;
    font-weight: 800;
    letter-spacing: .01em;
  }

  .hero-label .corner {
    position: absolute;
    width: 10px;
    height: 10px;
    border-color: rgba(255,255,255,.92);
    pointer-events: none;
  }

  .corner-tl { left: 0; top: 0; border-left: 2px solid; border-top: 2px solid; }
  .corner-tr { right: 0; top: 0; border-right: 2px solid; border-top: 2px solid; }
  .corner-bl { left: 0; bottom: 0; border-left: 2px solid; border-bottom: 2px solid; }
  .corner-br { right: 0; bottom: 0; border-right: 2px solid; border-bottom: 2px solid; }

  .hero-title {
    margin: 0 auto;
    width: min(650px, 84vw);
    color: #fff;
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: clamp(42px, 5.45vw, 78px);
    line-height: 1;
    font-weight: 900;
    letter-spacing: -.052em;
    text-align: center;
    filter: drop-shadow(0 12px 64px rgba(255,255,255,.1));
  }

  .hero-title span {
    display: block;
  }

  .coded-hero-stage {
    position: relative;
    z-index: 2;
    width: min(1120px, 94vw);
    height: clamp(560px, 62vw, 820px);
    margin: clamp(-118px, -7.6vw, -72px) auto 0;
    pointer-events: none;
    transform: translateZ(0);
  }

  .coded-vortex {
    position: absolute;
    left: 50%;
    top: 20%;
    width: min(820px, 72vw);
    aspect-ratio: 1;
    transform: translateX(-50%) rotateX(60deg);
    transform-style: preserve-3d;
    border-radius: 50%;
    filter: drop-shadow(0 0 22px rgba(115, 0, 255, .85));
    opacity: .95;
  }

  .coded-vortex::before,
  .coded-vortex::after,
  .coded-vortex i {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
  }

  .coded-vortex::before {
    background:
      radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.28) 0%, rgba(181, 92, 255, .52) 13%, rgba(115,0,255,.4) 24%, transparent 56%),
      conic-gradient(from 136deg at 50% 50%, transparent 0deg, rgba(122,0,255,.1) 60deg, rgba(255,255,255,.68) 118deg, rgba(128,0,255,.46) 170deg, transparent 250deg, rgba(215,182,255,.48) 318deg, transparent 360deg);
    filter: blur(14px);
  }

  .coded-vortex::after {
    inset: 18%;
    border: 2px solid rgba(255,255,255,.08);
    box-shadow:
      0 0 50px rgba(169,66,255,.42),
      inset 0 0 70px rgba(125,0,255,.22);
  }

  .coded-vortex i:nth-child(1) { inset: 9%; border: 2px solid rgba(182,102,255,.22); }
  .coded-vortex i:nth-child(2) { inset: 22%; border: 2px solid rgba(255,255,255,.12); }
  .coded-vortex i:nth-child(3) { inset: 36%; border: 2px solid rgba(124,0,255,.38); }

  .hero-cards-layer {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
  }

  .hero-cards-svg {
    position: absolute;
    left: 50%;
    top: clamp(-164px, -10vw, -98px);
    width: min(1080px, 94vw);
    max-width: none;
    height: auto;
    transform: translateX(-50%);
    display: block;
    user-select: none;
  }

  .coded-card {
    position: absolute;
    width: clamp(190px, 23vw, 330px);
    min-height: clamp(132px, 16vw, 208px);
    padding: clamp(18px, 2.2vw, 32px);
    border-radius: clamp(24px, 3vw, 40px);
    color: #fff;
    background:
      radial-gradient(circle at 72% 22%, rgba(255,255,255,.32), transparent 13%),
      radial-gradient(circle at 22% 20%, rgba(255,255,255,.14), transparent 22%),
      linear-gradient(145deg, rgba(225,190,255,.36), rgba(126, 31, 255, .58) 44%, rgba(82, 0, 180, .38) 100%);
    border: 1px solid rgba(255,255,255,.28);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.28),
      inset 0 -28px 70px rgba(255,255,255,.08),
      0 30px 88px rgba(73,0,175,.45),
      0 0 40px rgba(167,82,255,.28);
    backdrop-filter: blur(14px);
    transform-style: preserve-3d;
    overflow: hidden;
    text-align: left;
  }

  .coded-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(122deg, transparent 15%, rgba(255,255,255,.26) 46%, transparent 72%),
      repeating-linear-gradient(108deg, transparent 0 11px, rgba(255,255,255,.07) 12px 14px);
    mix-blend-mode: overlay;
    opacity: .62;
  }

  .coded-card::after {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    border: 1px solid rgba(255,255,255,.1);
  }

  .coded-card strong,
  .coded-card p,
  .card-icon {
    position: relative;
    z-index: 1;
  }

  .coded-card strong {
    display: block;
    margin-top: clamp(18px, 2vw, 28px);
    font-size: clamp(11px, 1.05vw, 15px);
    line-height: 1.24;
    letter-spacing: -.02em;
  }

  .coded-card p {
    margin: 7px 0 0;
    max-width: 16em;
    color: rgba(255,255,255,.62);
    font-size: clamp(7px, .72vw, 10px);
    line-height: 1.35;
  }

  .card-icon {
    display: grid;
    place-items: center;
    width: clamp(32px, 3.4vw, 46px);
    height: clamp(32px, 3.4vw, 46px);
    margin-left: auto;
    border-radius: 14px;
    color: rgba(255,255,255,.36);
    border: 1px solid rgba(255,255,255,.16);
    background: rgba(255,255,255,.06);
  }

  .card-icon::before,
  .coded-bubble::before,
  .node::before,
  .stat-icon::before {
    display: block;
    font-family: 'Poppins', system-ui, sans-serif;
    font-weight: 800;
    line-height: 1;
    color: rgba(255,255,255,.9);
    text-shadow: 0 0 16px rgba(255,255,255,.45);
  }

  .card-icon::before { font-size: 17px; }
  .coded-bubble::before { font-size: 21px; }
  .node::before { font-size: 18px; }
  .stat-icon::before { font-size: 11px; }
  .icon-gamepad::before { content: '◇'; }
  .icon-spark::before { content: '✦'; }
  .icon-infinity::before { content: '∞'; }
  .icon-chart::before { content: '↗'; }
  .icon-rocket::before { content: '⌁'; }
  .icon-chat::before { content: '○'; }

  .stat-icon {
    width: 16px;
    height: 16px;
    display: inline-grid;
    place-items: center;
  }

  .coded-card-back {
    opacity: .26;
    min-height: clamp(118px, 14vw, 190px);
    filter: blur(.1px);
  }

  .back-one { left: 18%; top: 6%; transform: rotate(-21deg); }
  .back-two { right: 18%; top: 6%; transform: rotate(18deg); }
  .card-gameplay { left: 0; top: 24%; transform: rotate(-8deg); }
  .card-engagement { left: 27%; top: 10%; width: clamp(230px, 28vw, 405px); transform: rotate(13deg); }
  .card-retention { left: 44%; top: 31%; transform: rotate(-4deg); }
  .card-brand { right: 0; top: 19%; transform: rotate(9deg); }

  .coded-orbit {
    position: absolute;
    z-index: 3;
    left: 50%;
    top: 51%;
    width: min(620px, 56vw);
    aspect-ratio: 1;
    transform: translateX(-50%);
  }

  .coded-orbit-disc,
  .coded-ring {
    position: absolute;
    border-radius: 50%;
  }

  .coded-orbit-disc {
    inset: 21%;
    background: radial-gradient(circle at 50% 48%, rgba(22, 10, 35, .96) 0 36%, rgba(6, 0, 12, .96) 56%, rgba(0,0,0,.9) 100%);
    box-shadow:
      inset 0 0 48px rgba(125, 0, 255, .14),
      0 0 80px rgba(95,0,200,.22);
  }

  .coded-orbit-disc::before {
    content: '';
    position: absolute;
    inset: -30%;
    border-radius: 50%;
    background: radial-gradient(circle, transparent 53%, rgba(132, 0, 255, .24) 54%, transparent 63%);
    filter: blur(4px);
  }

  .coded-ring-one { inset: 6%; border: 1px solid rgba(255,255,255,.16); }
  .coded-ring-two { inset: 18%; border: 1px solid rgba(151,49,255,.38); }
  .coded-ring-three { inset: 31%; border: 1px solid rgba(255,255,255,.08); }

  .coded-bubble {
    position: absolute;
    display: grid;
    place-items: center;
    width: clamp(40px, 5.2vw, 66px);
    height: clamp(40px, 5.2vw, 66px);
    border-radius: 999px;
    color: #fff;
    background: radial-gradient(circle at 28% 20%, rgba(255,255,255,.35), transparent 24%), linear-gradient(135deg, #a348ff, #5200a8 70%);
    border: 1px solid rgba(255,255,255,.22);
    box-shadow: 0 0 34px rgba(115,0,255,.7);
  }


  .bubble-left-top { left: 9%; top: 11%; }
  .bubble-left-mid { left: 0; top: 55%; transform: scale(.72); opacity: .72; }
  .bubble-top { left: 47%; top: 22%; transform: scale(.7); opacity: .8; }
  .bubble-right-top { right: 7%; top: 30%; transform: scale(.82); }

  .coded-stat-core {
    position: absolute;
    z-index: 2;
    inset: 0;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 22px;
  }

  .coded-stat-core span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(158,63,255,.94), rgba(90,0,190,.92));
    box-shadow: 0 0 34px rgba(115,0,255,.62);
    font-size: 12px;
    font-weight: 800;
  }



  .coded-stat-core strong {
    font-size: clamp(32px, 5.2vw, 58px);
    letter-spacing: -.04em;
    filter: drop-shadow(0 0 18px rgba(255,255,255,.18));
  }

  .about-copy-section h2,
  .team-section h2 {
    margin: 0;
    font-weight: 700;
    letter-spacing: -.052em;
    line-height: 1.08;
  }

  .floating-system {
    position: relative;
    width: min(980px, 96vw);
    height: clamp(310px, 35vw, 455px);
    margin: clamp(42px, 6vw, 82px) auto 0;
    perspective: 1100px;
  }

  .hero-vortex {
    position: absolute;
    inset: 2% 10% 0;
    border-radius: 50%;
    background:
      radial-gradient(ellipse at 50% 58%, rgba(255,255,255,.32), rgba(142,0,255,.48) 28%, rgba(87,0,155,.2) 48%, transparent 70%),
      conic-gradient(from 155deg, transparent, rgba(188,103,255,.42), transparent, rgba(115,0,255,.38), transparent);
    filter: blur(8px);
    opacity: .85;
    transform: rotateX(58deg);
  }

  .float-card {
    position: absolute;
    width: clamp(150px, 18vw, 238px);
    min-height: clamp(116px, 14vw, 164px);
    padding: clamp(16px, 2vw, 26px);
    border: 1px solid rgba(255,255,255,.24);
    border-radius: clamp(22px, 3vw, 34px);
    background:
      radial-gradient(circle at 24% 12%, rgba(255,255,255,.36), transparent 22%),
      linear-gradient(148deg, rgba(201,143,255,.3), rgba(115,0,255,.26) 45%, rgba(255,255,255,.1));
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.22),
      inset 0 -30px 56px rgba(255,255,255,.06),
      0 26px 88px rgba(93,0,202,.45);
    backdrop-filter: blur(14px);
    transform-style: preserve-3d;
    text-align: left;
    overflow: hidden;
    animation: floatCard 6s ease-in-out infinite alternate;
  }

  .float-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(115deg, transparent, rgba(255,255,255,.22), transparent 62%);
    transform: translateX(-120%);
    animation: cardSheen 5.4s ease-in-out infinite;
  }

  .float-icon {
    width: 44px;
    height: 44px;
    margin: 0 0 18px auto;
    display: grid;
    place-items: center;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,.2);
    color: rgba(255,255,255,.58);
  }

  .float-card strong {
    display: block;
    font-size: clamp(11px, 1.15vw, 15px);
    line-height: 1.25;
  }

  .float-card p {
    margin: 8px 0 0;
    color: rgba(255,255,255,.68);
    font-size: clamp(8px, .8vw, 11px);
    line-height: 1.45;
  }

  .card-a { left: 0; top: 78px; transform: rotate(-8deg) translateZ(30px); animation-delay: -.6s; }
  .card-b { left: 28%; top: 0; transform: rotate(13deg) translateZ(80px); animation-delay: -2s; }
  .card-c { right: 27%; bottom: 16px; transform: rotate(-5deg) translateZ(66px); animation-delay: -1.2s; }
  .card-d { right: 0; top: 48px; transform: rotate(10deg) translateZ(42px); animation-delay: -3s; }

  .orbit-stat {
    position: relative;
    width: min(640px, 92vw);
    height: min(640px, 92vw);
    margin: clamp(-74px, -6vw, -42px) auto 0;
    display: grid;
    place-items: center;
  }

  .orbit-stat::before {
    content: '';
    position: absolute;
    inset: 18%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,0,0,.96), rgba(6,0,14,.8) 48%, transparent 72%);
    box-shadow: inset 0 0 46px rgba(100,0,255,.15), 0 0 80px rgba(115,0,255,.22);
  }

  .orbit-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,.13);
  }

  .orbit-ring-one { inset: 8%; border-color: rgba(255,255,255,.16); }
  .orbit-ring-two { inset: 18%; border-color: rgba(115,0,255,.36); }
  .orbit-ring-three { inset: 29%; border-color: rgba(255,255,255,.08); }

  .orbit-bubble,
  .node {
    position: absolute;
    display: grid;
    place-items: center;
    color: #fff;
    border-radius: 999px;
    background: radial-gradient(circle at 28% 18%, rgba(255,255,255,.34), transparent 23%), linear-gradient(135deg, #9c3dff, #41006b);
    border: 1px solid rgba(255,255,255,.2);
    box-shadow: 0 0 30px rgba(115,0,255,.55);
  }

  .orbit-bubble { width: 64px; height: 64px; }
  .bubble-1 { left: 13%; top: 16%; }
  .bubble-2 { left: 2%; top: 54%; transform: scale(.78); opacity: .75; }
  .bubble-3 { left: 46%; top: 22%; transform: scale(.72); opacity: .82; }
  .bubble-4 { right: 10%; top: 32%; transform: scale(.86); }
  .bubble-5 { right: 17%; top: 58%; transform: scale(.74); }

  .stat-core {
    position: relative;
    z-index: 1;
    display: grid;
    justify-items: center;
    gap: 20px;
  }

  .stat-core span {
    padding: 8px 18px;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(161,71,255,.95), rgba(97,0,206,.9));
    box-shadow: 0 0 30px rgba(115,0,255,.55);
    font-size: 12px;
    font-weight: 700;
  }

  .stat-core strong {
    font-size: clamp(32px, 5.2vw, 58px);
    letter-spacing: -.04em;
  }

  .about-copy-section,
  .team-section {
    width: min(760px, 92vw);
    margin: 0 auto;
    text-align: center;
  }

  .about-copy-section {
    margin-top: clamp(-10px, 2vw, 12px);
  }

  .about-copy-section h2,
  .team-section h2 {
    font-size: clamp(30px, 4vw, 52px);
  }

  .about-copy-section p,
  .team-section > p {
    width: min(620px, 100%);
    margin: 20px auto 0;
    color: rgba(255,255,255,.62);
    font-size: clamp(14px, 1.2vw, 17px);
    line-height: 1.65;
  }

  .about-features {
    width: min(1100px, 92vw);
    margin: clamp(72px, 9vw, 122px) auto 0;
  }

  .feature-row {
    min-height: 228px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 430px);
    align-items: center;
    gap: clamp(26px, 6vw, 108px);
    border-bottom: 1px solid rgba(255,255,255,.13);
  }

  .feature-copy h3 {
    margin: 0 0 14px;
    font-size: clamp(22px, 2.5vw, 34px);
    line-height: 1.1;
    letter-spacing: -.03em;
  }

  .feature-copy p {
    max-width: 430px;
    margin: 0;
    color: rgba(255,255,255,.62);
    font-size: clamp(14px, 1.15vw, 17px);
    line-height: 1.55;
  }

  .feature-visual {
    position: relative;
    min-height: 190px;
    display: grid;
    place-items: center;
  }

  .service-arc {
    width: 340px;
    height: 118px;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    border-top: 9px solid rgba(137,28,255,.65);
    filter: drop-shadow(0 0 18px rgba(115,0,255,.9));
    transform: translateY(22px);
  }

  .node { width: 50px; height: 50px; }
  .node.main { top: 14px; left: 50%; transform: translateX(-50%); }
  .node.left { left: 26px; bottom: 30px; transform: scale(.76); background: rgba(255,255,255,.08); }
  .node.right { right: 38px; bottom: 34px; transform: scale(.76); background: rgba(255,255,255,.08); }

  .dot {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 99px;
    background: rgba(255,255,255,.25);
  }
  .d1 { left: 36%; top: 44px; } .d2 { left: 26%; top: 78px; } .d3 { right: 24%; top: 70px; } .d4 { right: 36%; bottom: 22px; }

  .mini-dashboard,
  .bar-card {
    width: min(360px, 100%);
    padding: 24px;
    border-radius: 30px;
    background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.02));
    border: 1px solid rgba(255,255,255,.1);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 28px 60px rgba(0,0,0,.32);
    text-align: left;
  }

  .mini-dashboard small,
  .bar-card small { display: block; font-weight: 700; margin-bottom: 7px; }
  .mini-dashboard strong { font-size: 26px; }
  .progress-track { height: 12px; margin: 15px 0; border-radius: 999px; background: rgba(255,255,255,.07); overflow: hidden; }
  .progress-track span { display:block; width: 78%; height:100%; border-radius: inherit; background: linear-gradient(90deg, #fff, #8a00ff); box-shadow: 0 0 18px rgba(133,0,255,.9); }
  .dash-actions { display:flex; justify-content: space-between; align-items:center; gap: 12px; }
  .dash-actions em, .dash-actions b { font-style: normal; font-size: 10px; border-radius: 999px; padding: 7px 12px; background: rgba(115,0,255,.22); }
  .dash-actions b { background: #fff; color: #10001f; }

  .bars { height: 150px; display: flex; align-items: end; gap: 17px; margin-top: 18px; }
  .bars i { width: 26px; height: var(--h); border-radius: 8px 8px 0 0; background: linear-gradient(180deg, #a640ff, #50116f); box-shadow: 0 0 20px rgba(115,0,255,.48); }
  .bar-card span { position:absolute; right:22px; top:20px; font-size:10px; color:rgba(255,255,255,.72); border:1px solid rgba(255,255,255,.1); border-radius:999px; padding:6px 10px; }
  .bar-card { position: relative; }

  .team-section {
    width: min(1080px, 92vw);
    margin-top: clamp(86px, 10vw, 138px);
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin-top: 52px;
  }

  .team-card {
    min-height: 252px;
    padding: 86px 22px 24px;
    border-radius: 28px;
    border: 1px solid rgba(255,255,255,.13);
    background: linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.012));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 32px 70px rgba(0,0,0,.34);
    text-align: left;
    position: relative;
    overflow: hidden;
  }

  .team-card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 120px;
    background: radial-gradient(circle at 82% 0, var(--card-glow), transparent 48%);
  }

  .team-card.gold { --card-glow: rgba(255, 185, 43, .62); }
  .team-card.purple { --card-glow: rgba(115, 0, 255, .72); }
  .team-card span {
    position: relative;
    z-index: 1;
    display: inline-flex;
    padding: 6px 10px;
    border-radius: 999px;
    background: var(--card-glow);
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
  }
  .team-card h3 { margin: 18px 0 8px; font-size: 20px; }
  .team-card strong { display:block; color: rgba(255,255,255,.72); font-size: 12px; }
  .team-card p { margin: 16px 0 0; color: rgba(255,255,255,.56); font-size: 12px; line-height: 1.55; }

  .about-cta {
    position: relative;
    width: min(1200px, 96vw);
    min-height: 250px;
    margin: clamp(78px, 9vw, 130px) auto 0;
    padding: clamp(32px, 5vw, 58px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    border-radius: clamp(32px, 5vw, 58px);
    background: linear-gradient(125deg, #8f24ff 0%, #7200e7 40%, #2a0644 100%);
    box-shadow: inset 0 0 0 8px rgba(255,255,255,.07), 0 38px 90px rgba(77,0,152,.55);
    overflow: hidden;
  }

  .about-cta h2 { margin: 0; font-size: clamp(28px, 4vw, 48px); line-height: 1.08; letter-spacing: -.04em; }
  .about-cta p { margin: 16px 0 0; color: rgba(255,255,255,.76); max-width: 420px; }
  .about-cta a { position: relative; z-index: 2; padding: 14px 22px; border-radius: 999px; background: rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22); font-size: 13px; }
  .cta-shapes { position:absolute; inset:0 0 0 42%; transform: skewX(-18deg); opacity:.54; }
  .cta-shapes i { position:absolute; top:-20%; width:110px; height:150%; border-radius:28px; background: linear-gradient(180deg, rgba(255,255,255,.2), rgba(0,0,0,.08)); }
  .cta-shapes i:nth-child(1){left:0}.cta-shapes i:nth-child(2){left:140px}.cta-shapes i:nth-child(3){left:280px}.cta-shapes i:nth-child(4){left:420px}

  .hero-background-stack {
    position: absolute;
    z-index: 0;
    pointer-events: none;
    inset: clamp(-240px, -16vw, -160px) 0 auto;
    height: clamp(1030px, 94vw, 1420px);
    overflow: hidden;
    background-color: #050107;
    background-image: url('/about/about.png');
    background-repeat: no-repeat;
    background-size: max(1440px, 100vw) auto;
    background-position: center clamp(-96px, -5.8vw, -48px);
  }

  .hero-background-stack::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(5, 1, 7, 0) 0%, rgba(5, 1, 7, 0) 68%, #050107 100%);
    pointer-events: none;
  }



  .hero-vector-three-svg {
    position: absolute;
    left: -197px;
    top: 582px;
    width: 905px;
    height: 517px;
    z-index: 2;
    opacity: 1;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .hero-fog-layer,
  .hero-stripe-layer,
  .hero-grid-layer,
  .hero-edge-vignette,
  .hero-grain-layer {
    display: none !important;
  }

  @media (max-width: 1100px) {
    .hero-background-stack {
      inset: clamp(-210px, -19vw, -132px) 0 auto;
      height: clamp(940px, 132vw, 1260px);
      background-size: max(1120px, 132vw) auto;
      background-position: center clamp(-86px, -7vw, -42px);
    }

    .hero-vector-three-svg {
      left: -18vw;
      top: 500px;
      width: 76vw;
      height: 43vw;
    }

    .hero-fog-layer {
      transform: translateX(-50%) scale(0.88);
      transform-origin: top center;
    }

    .hero-stripe-layer {
      top: 630px;
      transform: translateX(calc(-50% - 11px)) scale(.86);
      transform-origin: top center;
    }

    .hero-grid-layer {
      width: 128vw;
      height: 1460px;
      background-size: 4px 1px, 1px 4px;
      opacity: 0.42;
    }
  }

  @media (max-width: 740px) {
    .hero-background-stack {
      inset: clamp(-178px, -24vw, -118px) 0 auto;
      height: clamp(840px, 172vw, 1120px);
      background-size: max(980px, 178vw) auto;
      background-position: center clamp(-74px, -10vw, -34px);
    }

    .hero-vector-three-svg {
      left: -28vw;
      top: 430px;
      width: 96vw;
      height: 55vw;
    }

    .hero-fog-layer {
      transform: translateX(-50%) scale(0.72);
      transform-origin: top center;
      opacity: 0.98;
    }

    .hero-stripe-layer {
      top: 610px;
      transform: translateX(calc(-50% - 11px)) scale(.72);
      opacity: 0.48;
    }

    .hero-grid-layer {
      width: 190vw;
      height: 1240px;
      opacity: 0.34;
    }
  }

@media (max-width: 900px) {
    .about-page { padding: clamp(82px, 14vw, 108px) 0 0; }
    .about-hero { min-height: clamp(610px, 124vw, 860px); }
    .hero-title { width: min(620px, 88vw); font-size: clamp(40px, 8vw, 68px); }
    .coded-hero-stage { width: min(820px, 116vw); height: clamp(520px, 92vw, 700px); margin-top: clamp(-92px, -10vw, -54px); }
    .coded-vortex { top: 22%; width: min(620px, 92vw); }
    .coded-orbit { top: 52%; width: min(520px, 82vw); }
    .hero-cards-svg { top: clamp(-112px, -11vw, -68px); width: min(860px, 116vw); }
    .feature-row { grid-template-columns: 1fr; gap: 10px; padding: 36px 0; }
    .feature-copy { text-align: center; }
    .feature-copy p { margin-inline: auto; }
    .team-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .about-cta { flex-direction: column; align-items: flex-start; }
  }

  @media (max-width: 560px) {
    .about-hero { min-height: clamp(520px, 146vw, 680px); }
    .hero-label { margin-bottom: 8px; padding: 7px 20px 8px; }
    .hero-label strong { font-size: 13px; }
    .hero-label .corner { width: 8px; height: 8px; }
    .hero-title { width: min(390px, 92vw); font-size: clamp(34px, 11.8vw, 50px); line-height: .98; }
    .coded-hero-stage { width: 650px; max-width: 170vw; height: 520px; margin-top: -58px; margin-left: 50%; transform: translateX(-50%); }
    .coded-vortex { top: 24%; width: 470px; }
    .coded-orbit { top: 54%; width: 410px; }
    .hero-cards-svg { top: -82px; width: min(460px, 118vw); }
    .coded-bubble { width: 42px; height: 42px; }
    .coded-stat-core strong { font-size: 32px; }
    .team-grid { grid-template-columns: 1fr; }
  }



  /* Keep hero artwork from header.svg only. Coded orbit/vortex visuals removed from markup and hidden here as safety. */
  .coded-vortex,
  .coded-orbit,
  .coded-orbit-disc,
  .coded-ring,
  .coded-bubble,
  .coded-stat-core {
    display: none !important;
  }

</style>
