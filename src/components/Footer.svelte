<script>
  export let onNavigate = () => {};

  const studiosLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Games', href: '/games' }
  ];

  const companyLinks = [
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/work-with-us' },
    { label: 'Pitch a Game', href: '/work-with-us' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/legal' },
    { label: 'Terms of Service', href: '/legal' },
    { label: 'Cookie Policy', href: '/legal' }
  ];

  function normalizePath(path) {
    const clean = (path || '/').split('#')[0].split('?')[0];
    return clean === '' ? '/' : clean.replace(/\/$/, '') || '/';
  }

  function scrollToAnchor(hash) {
    const targetId = (hash || '').replace('#', '');
    const target = document.getElementById(targetId);

    if (!target || typeof window === 'undefined') return;

    const page = document.documentElement;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const maxScroll = Math.max(0, page.scrollHeight - window.innerHeight);
    const safeTop = Math.min(Math.max(targetTop, 0), maxScroll);

    window.scrollTo({ top: safeTop, behavior: 'smooth' });
  }

  async function handleLinkClick(event, href) {
    if (!href) return;

    if (href.startsWith('#')) {
      event.preventDefault();
      event.stopPropagation();
      scrollToAnchor(href);
      return;
    }

    if (!href.startsWith('/')) return;

    event.preventDefault();

    const [pathPart, hashPart] = href.split('#');
    await onNavigate(normalizePath(pathPart || '/'));

    if (hashPart) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToAnchor(`#${hashPart}`));
      });
    }
  }
</script>

<footer class="airo-footer" aria-label="Site footer">

  <div class="footer-shell">
    <div class="footer-main">
      <div class="footer-brand">
        <a class="footer-logo" href="/" aria-label="Airo home" onclick={(event) => handleLinkClick(event, '/') }>
          <img src="/logos/airo.svg" alt="Airo" />
        </a>

        <p>
          Airo backs Roblox games others overlook,<br />
          helping them reach more players, stronger revenue, and real momentum.
        </p>

        <div class="footer-details" aria-label="Airo contact details">
          <a class="detail-row" href="https://maps.google.com/?q=London%2C%20United%20Kingdom" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22s7-6.15 7-13A7 7 0 0 0 5 9c0 6.85 7 13 7 13Z" />
              <circle cx="12" cy="9" r="2.45" />
            </svg>
            <span>London, United Kingdom</span>
          </a>

          <a class="detail-row" href="mailto:hello@airo.gg">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.75 6.75h16.5v11H3.75v-11Z" />
              <path d="m4.25 7.25 7.75 6 7.75-6" />
            </svg>
            <span>hello@airo.gg</span>
          </a>
        </div>
      </div>

      <nav class="footer-nav" aria-label="Footer navigation">
        <div class="footer-column">
          <h2>Studios</h2>
          {#each studiosLinks as link}
            <a href={link.href} onclick={(event) => handleLinkClick(event, link.href)}>{link.label}</a>
          {/each}
        </div>

        <div class="footer-column">
          <h2>Company</h2>
          {#each companyLinks as link}
            <a href={link.href} onclick={(event) => handleLinkClick(event, link.href)}>{link.label}</a>
          {/each}
        </div>

        <div class="footer-column">
          <h2>Legal</h2>
          {#each legalLinks as link}
            <a href={link.href} onclick={(event) => handleLinkClick(event, link.href)}>{link.label}</a>
          {/each}
        </div>
      </nav>

      <div class="footer-details footer-details-mobile" aria-label="Airo contact details">
        <a class="detail-row" href="https://maps.google.com/?q=London%2C%20United%20Kingdom" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22s7-6.15 7-13A7 7 0 0 0 5 9c0 6.85 7 13 7 13Z" />
            <circle cx="12" cy="9" r="2.45" />
          </svg>
          <span>London, United Kingdom</span>
        </a>

        <a class="detail-row" href="mailto:hello@airo.gg">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.75 6.75h16.5v11H3.75v-11Z" />
            <path d="m4.25 7.25 7.75 6 7.75-6" />
          </svg>
          <span>hello@airo.gg</span>
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <span>Copyright ©2026 All Rights Reserved by Airo</span>
      <a class="footer-touch" href="/work-with-us" onclick={(event) => handleLinkClick(event, '/work-with-us')}>
        <span>Get in touch</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 19 19 5M8 5h11v11" />
        </svg>
      </a>
    </div>
  </div>
</footer>

<style>
  .airo-footer {
    --footer-purple-w: 1653px;
    --footer-purple-h: 1457px;
    --footer-purple-y: 320px;
    --footer-lavender-w: 609px;
    --footer-lavender-h: 1737px;
    --footer-lavender-y: 345px;
    --footer-white-w: 497px;
    --footer-white-h: 1208px;
    --footer-white-y: 270px;
    --footer-dot-size: 32px;
    --footer-dot-alpha: .7;

    position: relative;
    z-index: 1;
    isolation: isolate;
    width: 100%;
    margin: 0;
    padding: clamp(96px, 9vw, 148px) 0 clamp(22px, 2.2vw, 32px);
    color: #fff;
    background-color: transparent;
    background-image:
      radial-gradient(rgba(88, 31, 155, var(--footer-dot-alpha)) 1px, transparent 1.25px),
      linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(3, 0, 6, .18) 16%,
        rgba(3, 0, 6, .46) 39%,
        rgba(3, 0, 6, .34) 58%,
        rgba(115, 0, 255, .14) 78%,
        rgba(115, 0, 255, .22) 100%),
      radial-gradient(ellipse var(--footer-white-w) var(--footer-white-h) at 50% calc(100% + var(--footer-white-y)),
        rgba(232, 228, 255, .74) 0%,
        rgba(232, 228, 255, .44) 14%,
        rgba(232, 228, 255, .17) 34%,
        transparent 70%),
      radial-gradient(ellipse var(--footer-lavender-w) var(--footer-lavender-h) at 50% calc(100% + var(--footer-lavender-y)),
        rgba(175, 139, 249, .70) 0%,
        rgba(175, 139, 249, .40) 18%,
        rgba(175, 139, 249, .15) 42%,
        transparent 74%),
      radial-gradient(ellipse var(--footer-purple-w) var(--footer-purple-h) at 50% calc(100% + var(--footer-purple-y)),
        rgba(115, 0, 255, .88) 0%,
        rgba(115, 0, 255, .54) 18%,
        rgba(115, 0, 255, .22) 44%,
        transparent 76%),
      linear-gradient(to bottom,
        rgba(3, 0, 6, 0) 0%,
        rgba(3, 0, 6, .72) 34%,
        #030006 64%,
        #030006 100%);
    background-size:
      var(--footer-dot-size) var(--footer-dot-size),
      100% 100%,
      auto,
      auto,
      auto,
      100% 100%;
    background-position:
      center top,
      center top,
      center,
      center,
      center,
      center top;
    background-repeat:
      repeat,
      no-repeat,
      no-repeat,
      no-repeat,
      no-repeat,
      no-repeat;
    overflow: hidden;
  }

  .footer-shell {
    position: relative;
    z-index: 5;
    width: min(1088px, calc(100vw - 96px));
    margin: 0 auto;
  }

  .footer-main {
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(486px, 548px);
    gap: clamp(52px, 7vw, 104px);
    align-items: start;
  }

  .footer-brand {
    min-width: 0;
  }

  .footer-logo {
    display: inline-flex;
    width: clamp(124px, 10.5vw, 156px);
  }

  .footer-logo img {
    display: block;
    width: 100%;
    height: auto;
    filter: drop-shadow(0 0 18px rgba(255,255,255,.08));
  }

  .footer-brand p {
    width: min(503px, 100%);
    margin: clamp(24px, 2.3vw, 34px) 0 0;
    color: rgba(255,255,255,.7);
    font-size: clamp(15.5px, 1.26vw, 19px);
    line-height: 1.86;
    font-weight: 300;
    letter-spacing: -0.04em;
  }

  .footer-details {
    display: grid;
    gap: 14px;
    margin-top: clamp(26px, 2.7vw, 38px);
  }

  .footer-details-mobile {
    display: none;
  }

  .detail-row {
    display: inline-flex;
    align-items: center;
    gap: 17px;
    width: fit-content;
    color: rgba(255,255,255,.7);
    font-size: clamp(13px, 1.04vw, 15.5px);
    line-height: 2;
    font-weight: 400;
    letter-spacing: -0.025em;
    transition: color .22s ease, transform .22s ease;
  }

  .detail-row:hover {
    color: #fff;
    transform: translateX(3px);
  }

  .detail-row svg {
    width: 27px;
    height: 27px;
    flex: 0 0 auto;
    color: #fff;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.65;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .detail-row svg circle {
    fill: none;
  }

  .footer-nav {
    display: grid;
    grid-template-columns: 0.78fr 1.06fr 1fr;
    gap: clamp(38px, 5vw, 72px);
  }

  .footer-column {
    display: grid;
    align-content: start;
  }

  .footer-column h2 {
    margin: 0 0 clamp(22px, 2.2vw, 30px);
    color: #fff;
    font-size: clamp(17px, 1.36vw, 20px);
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .footer-column a {
    width: fit-content;
    color: rgba(255,255,255,.7);
    font-size: clamp(13px, 1.09vw, 16px);
    line-height: 2.33;
    font-weight: 300;
    letter-spacing: -0.035em;
    transition: color .22s ease, transform .22s ease;
  }

  .footer-column a:hover {
    color: #fff;
    font-weight: 700;
    transform: translateX(3px);
  }

  .footer-bottom {
    margin-top: clamp(34px, 3.4vw, 48px);
    padding-top: clamp(18px, 1.7vw, 24px);
    border-top: 2px solid rgba(255,255,255,.25);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    color: #fff;
    font-size: clamp(12px, 1.02vw, 15px);
    line-height: 1.4;
    font-weight: 600;
    letter-spacing: -0.04em;
  }

  .footer-touch {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
    white-space: nowrap;
    opacity: .88;
    transition: opacity .22s ease, transform .22s ease;
  }

  .footer-touch svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .footer-touch:hover {
    opacity: 1;
    transform: translateX(3px) translateY(-2px);
  }

  @media (max-width: 1120px) {
    .airo-footer {
      --footer-purple-w: 1320px;
      --footer-purple-h: 1164px;
      --footer-purple-y: 250px;
      --footer-lavender-w: 486px;
      --footer-lavender-h: 1386px;
      --footer-lavender-y: 290px;
      --footer-white-w: 397px;
      --footer-white-h: 966px;
      --footer-white-y: 205px;
      padding-top: 112px;
    }

    .footer-shell {
      width: min(920px, calc(100vw - 44px));
    }

    .footer-main {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    .footer-nav {
      width: min(620px, 100%);
      gap: 34px;
    }

    .footer-bottom {
      margin-top: 48px;
    }
  }

  @media (max-width: 700px) {
    .airo-footer {
      --footer-purple-w: 980px;
      --footer-purple-h: 864px;
      --footer-purple-y: 210px;
      --footer-lavender-w: 360px;
      --footer-lavender-h: 1027px;
      --footer-lavender-y: 225px;
      --footer-white-w: 294px;
      --footer-white-h: 715px;
      --footer-white-y: 155px;
      --footer-dot-size: 24px;
      --footer-dot-alpha: .54;
      padding: 82px 0 26px;
    }

    .footer-shell {
      width: calc(100vw - 32px);
    }

    .footer-logo {
      width: 86px;
    }

    .footer-brand p {
      width: min(330px, 92vw);
      margin-top: 18px;
      font-size: 15px;
      line-height: 1.78;
    }

    .footer-details {
      gap: 10px;
      margin-top: 18px;
    }

    .footer-brand > .footer-details {
      display: none;
    }

    .footer-details-mobile {
      display: grid;
      gap: 10px;
      margin-top: 0;
    }

    .detail-row {
      gap: 10px;
      font-size: 13px;
      line-height: 1.5;
    }

    .detail-row svg {
      width: 18px;
      height: 18px;
      stroke-width: 2.45;
    }

    .footer-main {
      gap: 30px;
    }

    .footer-nav {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      width: 100%;
    }

    .footer-column h2 {
      margin-bottom: 12px;
      font-size: 15px;
      line-height: 1.2;
    }

    .footer-column a {
      font-size: 13px;
      line-height: 2.05;
    }

    .footer-bottom {
      margin-top: 30px;
      padding-top: 14px;
      border-top-width: 1px;
      gap: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .footer-touch {
      gap: 8px;
    }

    .footer-touch svg {
      width: 14px;
      height: 14px;
      stroke-width: 2.2;
    }
  }

  @media (max-width: 430px) {
    .footer-brand p {
      max-width: 300px;
    }

    .footer-nav {
      gap: 11px;
    }

    .footer-column h2 {
      font-size: 13px;
    }

    .footer-column a {
      font-size: 11px;
    }

    .footer-bottom {
      font-size: 11px;
    }
  }
</style>