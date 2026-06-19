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
    --footer-top-bleed: 420px;
    --footer-dot-size: 32px;
    --footer-dot-alpha: .7;

    /* Original footer ellipse values converted into one stable painted background. */
    --footer-purple-x: 2415px;
    --footer-purple-y: 2611px;
    --footer-purple-center: 112px;
    --footer-lavender-x: 2157px;
    --footer-lavender-y: 1029px;
    --footer-lavender-center: 87px;
    --footer-white-x: 1438px;
    --footer-white-y: 727px;
    --footer-white-center: 92px;
    --footer-white-core-x: 620px;
    --footer-white-core-y: 245px;
    --footer-white-core-center: 49px;

    position: relative;
    z-index: 1;
    isolation: isolate;
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: clamp(96px, 9vw, 148px) 0 clamp(22px, 2.2vw, 32px);
    color: #fff;
    background: linear-gradient(to bottom, rgba(3, 0, 6, 0) 0%, rgba(3, 0, 6, .72) 34%, #030006 64%, #030006 100%);
    overflow-x: clip;
    overflow-y: visible;
  }

  .airo-footer::before {
    content: '';
    position: absolute;
    z-index: 0;
    left: 0;
    right: 0;
    top: calc(-1 * var(--footer-top-bleed));
    height: calc(100% + var(--footer-top-bleed));
    pointer-events: none;
    background-image:
      radial-gradient(rgba(88, 31, 155, var(--footer-dot-alpha)) 1px, transparent 1.25px),
      radial-gradient(ellipse var(--footer-white-core-x) var(--footer-white-core-y) at 50% calc(100% + var(--footer-white-core-center)),
        rgba(255, 255, 255, 1) 0%,
        rgba(248, 246, 255, 1) 18%,
        rgba(232, 228, 255, .94) 36%,
        rgba(232, 228, 255, .54) 58%,
        transparent 84%),
      radial-gradient(ellipse var(--footer-white-x) var(--footer-white-y) at 50% calc(100% + var(--footer-white-center)),
        rgba(232, 228, 255, .98) 0%,
        rgba(232, 228, 255, .90) 16%,
        rgba(232, 228, 255, .60) 34%,
        rgba(232, 228, 255, .28) 58%,
        transparent 86%),
      radial-gradient(ellipse var(--footer-lavender-x) var(--footer-lavender-y) at 50% calc(100% + var(--footer-lavender-center)),
        rgba(175, 139, 249, 1) 0%,
        rgba(175, 139, 249, .82) 18%,
        rgba(175, 139, 249, .48) 38%,
        rgba(175, 139, 249, .22) 60%,
        transparent 84%),
      radial-gradient(ellipse var(--footer-purple-x) var(--footer-purple-y) at 50% calc(100% + var(--footer-purple-center)),
        rgba(115, 0, 255, 1) 0%,
        rgba(115, 0, 255, .82) 24%,
        rgba(115, 0, 255, .50) 48%,
        rgba(115, 0, 255, .24) 70%,
        transparent 94%),
      linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(3, 0, 6, .08) 12%,
        rgba(3, 0, 6, .22) 28%,
        rgba(3, 0, 6, .42) 48%,
        rgba(3, 0, 6, .30) 64%,
        rgba(115, 0, 255, .12) 82%,
        rgba(115, 0, 255, .20) 100%);
    background-size:
      var(--footer-dot-size) var(--footer-dot-size),
      100% 100%,
      100% 100%,
      100% 100%,
      100% 100%,
      100% 100%;
    background-position:
      center top,
      center bottom,
      center bottom,
      center bottom,
      center bottom,
      center top;
    background-repeat:
      repeat,
      no-repeat,
      no-repeat,
      no-repeat,
      no-repeat,
      no-repeat;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.34) 16%, #000 34%, #000 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.34) 16%, #000 34%, #000 100%);
  }

  @supports not (overflow: clip) {
    .airo-footer {
      overflow-x: hidden;
    }
  }

  .footer-shell {
    position: relative;
    z-index: 5;
    width: min(1088px, calc(100vw - 96px));
    max-width: calc(100% - 96px);
    margin: 0 auto;
  }

  .footer-main {
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(486px, 548px);
    gap: clamp(52px, 7vw, 104px);
    align-items: start;
    min-width: 0;
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
    max-width: 100%;
    min-width: 0;
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

  .detail-row span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .footer-nav {
    display: grid;
    grid-template-columns: 0.78fr 1.06fr 1fr;
    gap: clamp(38px, 5vw, 72px);
    min-width: 0;
  }

  .footer-column {
    display: grid;
    align-content: start;
    min-width: 0;
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
    max-width: 100%;
    min-width: 0;
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
    min-width: 0;
  }

  .footer-bottom > span {
    min-width: 0;
    flex: 1 1 auto;
    overflow-wrap: anywhere;
  }

  .footer-touch {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
    white-space: nowrap;
    flex: 0 0 auto;
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

  @media (hover: none) and (pointer: coarse) {
    .detail-row:hover,
    .footer-column a:hover,
    .footer-touch:hover {
      transform: none;
    }
  }


  @media (max-width: 1120px) {
    .airo-footer {
      --footer-top-bleed: 340px;
      --footer-purple-x: 1884px;
      --footer-purple-y: 2040px;
      --footer-purple-center: 68px;
      --footer-lavender-x: 1722px;
      --footer-lavender-y: 822px;
      --footer-lavender-center: 42px;
      --footer-white-x: 1150px;
      --footer-white-y: 581px;
      --footer-white-center: 2px;
      --footer-white-core-x: 530px;
      --footer-white-core-y: 210px;
      --footer-white-core-center: 7px;
      padding-top: 112px;
    }

    .footer-shell {
      width: min(920px, calc(100% - 44px));
      max-width: calc(100% - 44px);
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
      --footer-top-bleed: 240px;
      --footer-purple-x: 1364px;
      --footer-purple-y: 1480px;
      --footer-purple-center: 128px;
      --footer-lavender-x: 1275px;
      --footer-lavender-y: 608px;
      --footer-lavender-center: 32px;
      --footer-white-x: 859px;
      --footer-white-y: 438px;
      --footer-white-center: 55px;
      --footer-white-core-x: 430px;
      --footer-white-core-y: 176px;
      --footer-white-core-center: 44px;
      --footer-dot-size: 24px;
      --footer-dot-alpha: .54;
      padding: 82px 0 26px;
    }

    .footer-shell {
      width: calc(100% - 32px);
      max-width: calc(100% - 32px);
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
      max-width: 100%;
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