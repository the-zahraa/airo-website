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

  const lineShapes = Array.from({ length: 13 });

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
  <div class="footer-light" aria-hidden="true">
    <div class="footer-light-stage">
      <div class="footer-ellipse footer-ellipse-2"></div>
      <div class="footer-ellipse footer-ellipse-3"></div>
      <div class="footer-ellipse footer-ellipse-4"></div>
    </div>
  </div>

  <div class="footer-line-effect" aria-hidden="true">
    {#each lineShapes as _}
      <span></span>
    {/each}
  </div>

  <div class="footer-vector-dots" aria-hidden="true"></div>

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
    position: relative;
    z-index: 1;
    isolation: isolate;
    width: 100%;
    margin: 0;
    padding: clamp(96px, 9vw, 148px) 0 clamp(22px, 2.2vw, 32px);
    color: #fff;
    background: linear-gradient(to bottom, rgba(3, 0, 6, 0) 0%, rgba(3, 0, 6, .72) 34%, #030006 64%, #030006 100%);
    overflow: visible;
  }

  .airo-footer::before {
    content: '';
    position: absolute;
    z-index: 0;
    left: 0;
    right: 0;
    top: -420px;
    height: calc(100% + 420px);
    pointer-events: none;
    background:
      linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(3, 0, 6, .18) 16%,
        rgba(3, 0, 6, .46) 39%,
        rgba(3, 0, 6, .34) 58%,
        rgba(115, 0, 255, .14) 78%,
        rgba(115, 0, 255, .22) 100%);
  }

  .footer-shell {
    position: relative;
    z-index: 5;
    width: min(1088px, calc(100vw - 96px));
    margin: 0 auto;
  }

  .footer-light {
    position: absolute;
    z-index: 0;
    left: 0;
    right: 0;
    top: -420px;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
    background: transparent;
  }

  .footer-light::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,0) 36%, rgba(0,0,0,0) 100%);
    opacity: .2;
  }

  .footer-light::after {
    content: none;
  }

  .footer-light-stage {
    position: absolute;
    inset: 0;
    opacity: 1;
    mix-blend-mode: normal;
  }

  .footer-ellipse {
    position: absolute;
    border-radius: 9999px;
    pointer-events: none;
    will-change: filter;
  }

  .footer-ellipse-2 {
    width: 1653px;
    height: 1457px;
    left: calc(50% - 1653px / 2);
    bottom: -840px;
    background: #7300ff;
    filter: blur(478.985px);
    opacity: 1;
    transform: rotate(-90deg);
  }

  .footer-ellipse-3 {
    width: 609px;
    height: 1737px;
    left: calc(50% - 609px / 2);
    bottom: -955px;
    background: #af8bf9;
    filter: blur(210px);
    opacity: 1;
    transform: rotate(-90deg);
  }

  .footer-ellipse-4 {
    width: 497px;
    height: 1208px;
    left: calc(50% - 497px / 2);
    bottom: -705px;
    background: #e8e4ff;
    filter: blur(115px);
    opacity: 1;
    transform: rotate(-90deg);
  }


  .footer-line-effect {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: -560px;
    bottom: 0;
    width: min(1500px, 112vw);
    height: auto;
    transform: translateX(-50%);
    pointer-events: none;
    overflow: hidden;
    opacity: .26;
    mix-blend-mode: soft-light;
    background:
      repeating-linear-gradient(
        90deg,
        transparent 0 46px,
        rgba(255, 255, 255, .035) 46px 50px,
        rgba(255, 255, 255, .095) 50px 52px,
        rgba(255, 255, 255, .035) 52px 56px,
        transparent 56px 78px
      );
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.18) 14%, #000 34%, #000 76%, rgba(0,0,0,.18) 91%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.18) 14%, #000 34%, #000 76%, rgba(0,0,0,.18) 91%, transparent 100%);
  }

  .footer-line-effect span {
    display: none;
  }

  .footer-line-effect span:nth-child(1) { width: 131.06px; left: -135px; }
  .footer-line-effect span:nth-child(2) { width: 131.06px; left: -3.94px; }
  .footer-line-effect span:nth-child(3) { width: 129.79px; left: 127.13px; }
  .footer-line-effect span:nth-child(4) { width: 131.06px; left: 256.92px; }
  .footer-line-effect span:nth-child(5) { width: 131.06px; left: 387.98px; }
  .footer-line-effect span:nth-child(6) { width: 131.06px; left: 519.04px; }
  .footer-line-effect span:nth-child(7) { width: 131.06px; left: 650.1px; }
  .footer-line-effect span:nth-child(8) { width: 129.79px; left: 781.17px; }
  .footer-line-effect span:nth-child(9) { width: 131.06px; left: 910.96px; }
  .footer-line-effect span:nth-child(10) { width: 131.06px; left: 1042.02px; }
  .footer-line-effect span:nth-child(11) { width: 131.06px; left: 1173.08px; }
  .footer-line-effect span:nth-child(12) { width: 129.79px; left: 1304.15px; }
  .footer-line-effect span:nth-child(13) { width: 131.06px; left: 1433.94px; }

  .footer-vector-dots {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    top: -420px;
    bottom: 0;
    opacity: .7;
    background-image:
      radial-gradient(rgba(88, 31, 155, .72) 1px, transparent 1.25px);
    background-size: 32px 32px;
    background-position: center top;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,.05) 0%, rgba(0,0,0,.55) 19%, #000 42%, #000 100%);
    pointer-events: none;
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
      padding-top: 112px;
    }

    .airo-footer::before,
    .footer-light,
    .footer-vector-dots {
      top: -340px;
    }

    .footer-line-effect {
      top: -470px;
      width: min(980px, 108vw);
      padding-inline: 22px;
      opacity: .4;
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

    .footer-light-stage {
      inset: 0;
      transform: none;
    }

    .footer-ellipse-2 {
      width: 1320px;
      height: 1164px;
      left: calc(50% - 1320px / 2);
      bottom: -650px;
      filter: blur(360px);
      opacity: 1;
    }

    .footer-ellipse-3 {
      width: 486px;
      height: 1386px;
      left: calc(50% - 486px / 2);
      bottom: -735px;
      filter: blur(168px);
      opacity: 1;
    }

    .footer-ellipse-4 {
      width: 397px;
      height: 966px;
      left: calc(50% - 397px / 2);
      bottom: -490px;
      filter: blur(92px);
      opacity: 1;
    }
  }

  @media (max-width: 700px) {
    .airo-footer {
      padding: 82px 0 26px;
      background: #030006;
    }

    .airo-footer::before,
    .footer-light,
    .footer-vector-dots {
      top: -240px;
    }

    .footer-line-effect {
      top: -360px;
      width: min(760px, 116vw);
      padding-inline: 12px;
      opacity: .32;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,.22) 18%, rgba(0,0,0,.74) 38%, #000 62%, rgba(0,0,0,.16) 92%, rgba(0,0,0,0) 100%);
    }

    .footer-line-effect span {
      width: 38px !important;
      top: -120px;
      height: calc(100% + 240px);
    }

    .airo-footer::before {
      height: calc(100% + 240px);
    }

    .footer-shell {
      width: calc(100vw - 32px);
    }

    .footer-light {
      background: transparent;
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

    .footer-light::before {
      opacity: .2;
    }

    .footer-light::after {
      content: none;
    }

    .footer-light-stage {
      inset: 0;
      transform: none;
    }

    .footer-ellipse-2 {
      width: 980px;
      height: 864px;
      left: calc(50% - 980px / 2);
      bottom: -560px;
      filter: blur(250px);
      opacity: 1;
      transform: translateZ(0) rotate(-90deg);
    }

    .footer-ellipse-3 {
      width: 360px;
      height: 1027px;
      left: calc(50% - 360px / 2);
      bottom: -545px;
      filter: blur(124px);
      opacity: 1;
      transform: translateZ(0) rotate(-90deg);
    }

    .footer-ellipse-4 {
      width: 294px;
      height: 715px;
      left: calc(50% - 294px / 2);
      bottom: -420px;
      filter: blur(72px);
      opacity: 1;
      transform: translateZ(0) rotate(-90deg);
    }

    .footer-vector-dots {
      background-size: 24px 24px;
      opacity: .54;
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