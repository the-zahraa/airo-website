<script>
  import './styles/Footer.css';
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
