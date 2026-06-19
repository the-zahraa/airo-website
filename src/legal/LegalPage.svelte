<script>
  import { onMount, tick } from 'svelte';

  export let onNavigate = () => {};

  const sections = [
    { id: 'overview', title: '1. Overview' },
    { id: 'information-we-collect', title: '2. Information we collect' },
    { id: 'how-we-use-your-information', title: '3. How we use your information' },
    { id: 'legal-bases', title: '4. Legal bases (EEA / UK users)' },
    { id: 'how-we-share-information', title: '5. How we share information' },
    { id: 'international-transfers', title: '6. International transfers' },
    { id: 'how-long-we-keep-information', title: '7. How long we keep information' },
    { id: 'your-rights', title: '8. Your rights' },
    { id: 'childrens-privacy', title: "9. Children's privacy" },
    { id: 'security', title: '10. Security' },
    { id: 'third-party-links', title: '11. Third-party links and services' },
    { id: 'changes-to-this-policy', title: '12. Changes to this Policy' },
    { id: 'contact-us', title: '13. Contact us' }
  ];

  let activeSection = sections[0].id;
  let scrollEndTimer;
  let observer;
  let programmaticScroll = false;

  let layoutEl;
  let tocRailEl;
  let tocEl;
  let contentEndEl;
  let tocMode = 'normal';
  let tocLeft = 0;
  let tocTop = 126;
  let tocWidth = 354;
  let tocBottomTop = 0;
  let tocRaf = 0;

  function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getHeaderOffset() {
    if (typeof window === 'undefined') return 116;
    return window.innerWidth <= 560 ? 88 : window.innerWidth <= 860 ? 96 : 120;
  }

  function getTocOffset() {
    if (typeof window === 'undefined') return 126;
    if (window.innerWidth <= 1100) return 112;
    return 126;
  }

  function updateTocPosition() {
    if (typeof window === 'undefined') return;

    if (window.innerWidth <= 860 || !layoutEl || !tocRailEl || !tocEl) {
      tocMode = 'normal';
      return;
    }

    const layoutRect = layoutEl.getBoundingClientRect();
    const railRect = tocRailEl.getBoundingClientRect();
    const pageY = window.scrollY || window.pageYOffset || 0;
    const layoutTop = pageY + layoutRect.top;
    const fixedTop = getTocOffset();
    const tocHeight = tocEl.offsetHeight;

    // The box should stop with the real end of the legal text, not with the
    // decorative spacing before the footer. The previous version used the full
    // legal-layout height, which made the TOC float in the purple empty area.
    const contentEndRect = contentEndEl?.getBoundingClientRect();
    const contentEndY = contentEndRect
      ? pageY + contentEndRect.bottom + 26
      : layoutTop + layoutEl.offsetHeight;

    tocTop = fixedTop;
    tocLeft = railRect.left;
    tocWidth = railRect.width;
    tocBottomTop = Math.max(0, contentEndY - layoutTop - tocHeight);

    if (pageY + fixedTop <= layoutTop) {
      tocMode = 'normal';
    } else if (pageY + fixedTop + tocHeight >= contentEndY) {
      tocMode = 'bottom';
    } else {
      tocMode = 'fixed';
    }
  }

  function requestTocUpdate() {
    if (typeof window === 'undefined') return;
    cancelAnimationFrame(tocRaf);
    tocRaf = requestAnimationFrame(updateTocPosition);
  }

  function scrollToTarget(id, behavior = 'smooth') {
    if (typeof window === 'undefined') return;

    const target = document.getElementById(id);
    if (!target) return;

    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - getHeaderOffset());

    activeSection = id;
    programmaticScroll = true;

    window.scrollTo({
      top,
      left: 0,
      behavior: prefersReducedMotion() ? 'auto' : behavior
    });

    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      activeSection = id;
      programmaticScroll = false;
    }, behavior === 'smooth' && !prefersReducedMotion() ? 760 : 0);
  }

  function goToSection(event, id) {
    event.preventDefault();

    scrollToTarget(id);
  }

  function goToHome(event) {
    event.preventDefault();
    onNavigate('/');
  }

  onMount(async () => {
    await tick();

    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    observer = new IntersectionObserver(
      (entries) => {
        if (programmaticScroll) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - getHeaderOffset()) - Math.abs(b.boundingClientRect.top - getHeaderOffset()));

        if (visible[0]?.target?.id) {
          activeSection = visible[0].target.id;
        }
      },
      {
        threshold: [0.12, 0.22, 0.36, 0.52],
        rootMargin: '-20% 0px -64% 0px'
      }
    );

    nodes.forEach((node) => observer.observe(node));

    const handleRouteHeroScroll = (event) => {
      if (event?.detail?.path === '/legal') {
        activeSection = sections[0].id;
        programmaticScroll = false;
      }
    };

    window.addEventListener('airo:route-hero-scroll', handleRouteHeroScroll);

    requestTocUpdate();
    window.addEventListener('scroll', requestTocUpdate, { passive: true });
    window.addEventListener('resize', requestTocUpdate);

    // Refreshing /legal should always land on the hero, not on the last
    // clicked overview/section anchor. The TOC still scrolls internally, but
    // it no longer leaves a hash that the browser restores on reload.
    if (window.location.hash) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    activeSection = sections[0].id;
    programmaticScroll = false;

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      requestTocUpdate();
    });

    return () => {
      clearTimeout(scrollEndTimer);
      cancelAnimationFrame(tocRaf);
      observer?.disconnect();
      window.removeEventListener('scroll', requestTocUpdate);
      window.removeEventListener('resize', requestTocUpdate);
      window.removeEventListener('airo:route-hero-scroll', handleRouteHeroScroll);
    };
  });
</script>

<div class="legal-page">
  <div class="legal-hero-lighting" aria-hidden="true">
    <svg class="legal-hero-light-svg" viewBox="-265 585.549 1970 1011.291" fill="none" preserveAspectRatio="none">
      <g filter="url(#legal_light_blur_main)" opacity="0.98" style="mix-blend-mode:screen">
        <path d="M-265 585.549C-84.3875 708.484 180.521 915.542 737.335 1014.35C1087.87 949.711 1338.2 833.864 1704.3 612.243V1596.84C1523.69 1473.91 1258.78 1266.84 701.961 1168.03C351.424 1232.68 101.097 1348.53 -265 1570.15V585.549Z" fill="#7300FF" />
      </g>
      <g filter="url(#legal_light_blur_mid)" opacity="0.9" style="mix-blend-mode:screen">
        <path d="M-265 697.663C-169.03 762.986 21.8951 864.014 273.708 946.925C543.527 1035.76 835.01 1035.02 1108.62 958.637C1315.08 900.999 1527.24 821.29 1705 713.68V1477.12C1607.33 1410.64 1383.32 1307.17 1106.95 1223.46C835.083 1141.11 543.595 1137.83 272.493 1222.67C90.0909 1279.75 -93.8502 1357.5 -265 1461.1V697.663Z" fill="#AF8BF9" />
      </g>
      <g filter="url(#legal_light_blur_edge_left)" opacity="1" style="mix-blend-mode:screen">
        <path d="M642.588 1084.72C213.352 1074.05 -141.319 904.095 -265 820.455V1338.31C29.6992 1161.07 462.85 1095.4 642.588 1084.72Z" fill="#E8E4FF" />
      </g>
      <g filter="url(#legal_light_blur_edge_right)" opacity="1" style="mix-blend-mode:screen">
        <path d="M797.412 1074.05C1226.65 1084.72 1581.32 1254.67 1705 1338.31L1705 820.454C1410.3 997.701 977.15 1063.37 797.412 1074.05Z" fill="#E8E4FF" />
      </g>
      <g filter="url(#legal_light_blur_edge_core_left)" opacity="0.66" style="mix-blend-mode:screen">
        <path d="M642.588 1084.72C213.352 1074.05 -141.319 904.095 -265 820.455V1338.31C29.6992 1161.07 462.85 1095.4 642.588 1084.72Z" fill="#E8E4FF" />
      </g>
      <g filter="url(#legal_light_blur_edge_core_right)" opacity="0.66" style="mix-blend-mode:screen">
        <path d="M797.412 1074.05C1226.65 1084.72 1581.32 1254.67 1705 1338.31L1705 820.454C1410.3 997.701 977.15 1063.37 797.412 1074.05Z" fill="#E8E4FF" />
      </g>
      <defs>
        <filter id="legal_light_blur_main" x="-850.549" y="-0.000183105" width="3140.4" height="2182.39" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="330" result="effect1_foregroundBlur" />
        </filter>
        <filter id="legal_light_blur_mid" x="-512.883" y="449.78" width="2465.77" height="1275.22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="175" result="effect1_foregroundBlur" />
        </filter>
        <filter id="legal_light_blur_edge_left" x="-362.592" y="722.863" width="1102.77" height="713.042" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="72" result="effect1_foregroundBlur" />
        </filter>
        <filter id="legal_light_blur_edge_right" x="699.82" y="722.863" width="1102.77" height="713.042" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="72" result="effect1_foregroundBlur" />
        </filter>
        <filter id="legal_light_blur_edge_core_left" x="-328.592" y="756.863" width="1034.77" height="645.042" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="38" result="effect1_foregroundBlur" />
        </filter>
        <filter id="legal_light_blur_edge_core_right" x="733.82" y="756.863" width="1034.77" height="645.042" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="38" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  </div>
  <div class="legal-dot-field legal-dot-field-top" aria-hidden="true"></div>
  <div class="legal-dot-smile" aria-hidden="true"></div>
  <div class="legal-dot-field legal-dot-field-mid" aria-hidden="true"></div>

  <section id="legal-hero" class="legal-hero" aria-label="Legal page hero">
    <div class="legal-label" aria-label="Legal">
      <i class="label-corner corner-top-left" aria-hidden="true"></i>
      <i class="label-corner corner-top-right" aria-hidden="true"></i>
      <i class="label-corner corner-bottom-left" aria-hidden="true"></i>
      <i class="label-corner corner-bottom-right" aria-hidden="true"></i>
      <strong>Legal</strong>
    </div>

    <h1>Privacy Policy</h1>

    <div class="legal-updated">Last updated: April 18, 2026</div>

    <p>
      Plain-English summary of what Airo collects, why we collect it, and what choices you have. The full terms are below.
    </p>
  </section>

  <section class="legal-layout" bind:this={layoutEl} aria-label="Privacy policy content">
    <div class="legal-toc-rail" bind:this={tocRailEl}>
      <aside
        class="legal-toc"
        class:toc-fixed={tocMode === 'fixed'}
        class:toc-bottom={tocMode === 'bottom'}
        bind:this={tocEl}
        style={tocMode === 'fixed'
          ? `left: ${tocLeft}px; top: ${tocTop}px; width: ${tocWidth}px;`
          : tocMode === 'bottom'
            ? `top: ${tocBottomTop}px; width: ${tocWidth}px;`
            : ''}
        aria-label="Privacy policy table of contents"
      >
      {#each sections as section}
        <a
          href={`#${section.id}`}
          class:active={activeSection === section.id}
          aria-current={activeSection === section.id ? 'true' : undefined}
          onclick={(event) => goToSection(event, section.id)}
        >{section.title}</a>
        {/each}
      </aside>
    </div>

    <article class="legal-content">
      <section id="overview" class="policy-section">
        <h2>1. Overview</h2>
        <p>
          This Privacy Policy explains how Airo (“Airo”, “we”, “us” or “our”) collects, uses and protects information when you visit Airo.gg, contact us, apply to work with us, or use any related services we operate on the Roblox platform. By using the site or submitting information to us, you agree to the practices described here. If you do not agree, please do not use the site or submit information to us.
        </p>
      </section>

      <section id="information-we-collect" class="policy-section">
        <h2>2. Information we collect</h2>
        <p>We collect the following categories of information:</p>
        <ul>
          <li><strong>Information you provide.</strong> When you fill in our contact form, apply to a role, or pitch a Roblox experience to us, you may provide your name, Discord username, Roblox username, email address, portfolio link, public links, existing player data, and any other information you choose to include in the message to us.</li>
          <li><strong>Technical information.</strong> When you visit this site, we may automatically receive standard log data such as your IP address, device type, browser, operating system, referring URL, the pages you view, and the times and dates of your visits.</li>
          <li><strong>Cookies and similar technologies.</strong> We use a small number of cookies and local-storage tools to remember preferences and to keep the site counters and contact form working. We can also use privacy-friendly analytics to understand which pages are visited.</li>
          <li><strong>Roblox account information.</strong> If you pitch a Roblox experience, Roblox may share your username, account ID and certain game-related data with us in line with the Roblox Terms of Use and the Roblox Privacy Policy.</li>
        </ul>
        <p>
          We do not knowingly request or collect government IDs, payment card details, or biometric data through the site.
        </p>
      </section>

      <section id="how-we-use-your-information" class="policy-section">
        <h2>3. How we use your information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your enquiries, applications and pitches.</li>
          <li>Evaluate Roblox experiences proposed for partnership or acquisition.</li>
          <li>Recruit, screen and onboard candidates for open roles.</li>
          <li>Operate, secure and improve the site and our games.</li>
          <li>Send transactional updates related to your enquiry or application.</li>
          <li>Comply with legal obligations and enforce our terms.</li>
          <li>We do not sell your personal information, and we do not use it for cross-context behavioural advertising.</li>
        </ul>
      </section>

      <section id="legal-bases" class="policy-section">
        <h2>4. Legal bases (EEA / UK users)</h2>
        <p>
          If you are in the European Economic Area or the United Kingdom, we process your personal data on the following legal bases:
        </p>
        <ul>
          <li><strong>Consent</strong> — when you submit information through our contact form or opt in to communications.</li>
          <li><strong>Legitimate interests</strong> — to operate, secure and improve the site, to evaluate business opportunities, and to recruit talent.</li>
          <li><strong>Legal obligation</strong> — where we are required to retain or disclose information to comply with applicable law.</li>
        </ul>
      </section>

      <section id="how-we-share-information" class="policy-section">
        <h2>5. How we share information</h2>
        <p>
          We share information only with parties that need it to help us operate. These include:
        </p>
        <ul>
          <li><strong>Service providers.</strong> Hosting, analytics, email, scheduling and hiring tools that process data on our behalf under written agreements.</li>
          <li><strong>Roblox Corporation.</strong> Where information is related to Roblox experiences, we process personal data in line with our privacy policy and Roblox’s own terms.</li>
          <li><strong>Professional advisers.</strong> Lawyers, accountants and auditors when needed for transactions or compliance.</li>
          <li><strong>Acquirers and partners.</strong> If Airo is involved in a merger, acquisition or asset transfer, information may be transferred as part of that transaction.</li>
          <li><strong>Authorities.</strong> When we are required to do so by law, court order, or to protect our rights, users, or the public.</li>
        </ul>
      </section>

      <section id="international-transfers" class="policy-section">
        <h2>6. International transfers</h2>
        <p>
          Airo operates globally and our service providers may be located outside your country. When we transfer personal data internationally, we rely on appropriate safeguards, such as Standard Contractual Clauses or equivalent mechanisms, to protect that data.
        </p>
      </section>

      <section id="how-long-we-keep-information" class="policy-section">
        <h2>7. How long we keep information</h2>
        <p>
          We keep personal information only for as long as we need it for the purpose set out in this Policy, including to satisfy legal, accounting or reporting requirements. Typical retention periods are:
        </p>
        <ul>
          <li>Contact-form submissions: up to 24 months from last activity.</li>
          <li>Job applications: up to 12 months after the role is closed, unless you consent to longer retention.</li>
          <li>Acquisition pitches: up to 36 months for ongoing business records.</li>
          <li>Server and security logs: up to 90 days.</li>
        </ul>
      </section>

      <section id="your-rights" class="policy-section">
        <h2>8. Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct, delete or port your personal data, to object to or restrict certain processing, and to withdraw consent. Residents of California, the EEA and the UK have additional rights under the CCPA/CPRA, GDPR and UK GDPR respectively.
        </p>
        <p>
          To exercise any of these rights, contact us at privacy@pumped.gg. We will respond within the time required by applicable law.
        </p>
      </section>

      <section id="childrens-privacy" class="policy-section">
        <h2>9. Children’s privacy</h2>
        <p>
          The site is not directed to children under 13 and we do not knowingly collect personal information from children under 13 through the site. If you believe a child has submitted personal information to us, contact privacy@pumped.gg and we will delete it.
        </p>
        <p>
          Roblox experiences can involve users under 13. Roblox manages platform child privacy controls. Please review the Roblox Privacy and Cookie Policy for details on how Roblox handles information.
        </p>
      </section>

      <section id="security" class="policy-section">
        <h2>10. Security</h2>
        <p>
          We use technical and organisational measures designed to protect personal information against unauthorised access, loss or misuse. No system is perfectly secure, however, and we cannot guarantee absolute security of information transmitted to or stored by us.
        </p>
      </section>

      <section id="third-party-links" class="policy-section">
        <h2>11. Third-party links and services</h2>
        <p>
          The site links to third-party solutions such as Roblox, Discord and TikTok. We are not responsible for the privacy practices of those services. Please review their privacy policies before sharing information with them.
        </p>
      </section>

      <section id="changes-to-this-policy" class="policy-section">
        <h2>12. Changes to this Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The “Last updated” date at the top reflects the most recent revision. Material changes will be highlighted on the site or notified through other appropriate channels.
        </p>
      </section>

      <section id="contact-us" class="policy-section policy-contact">
        <h2>13. Contact us</h2>
        <p>If you have questions about this Policy or how we handle your information, contact us at:</p>
        <ul>
          <li><a href="mailto:privacy@pumped.gg">privacy@pumped.gg</a></li>
          <li><a href="https://pumped.gg" target="_blank" rel="noreferrer">pumped.gg</a></li>
        </ul>
      </section>

      <p class="legal-note">
        This document is provided for transparency. It is not legal advice. If you need tailored legal guidance for your jurisdiction, please consult a qualified attorney.
      </p>

      <a class="back-home" bind:this={contentEndEl} href="/" aria-label="Back to home" onclick={goToHome}>
        <span>Back to home</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17h10V7M17 17 7 7" /></svg>
      </a>
    </article>
  </section>
</div>

<style>
  :global(.site-shell.legal-route) {
    background: #030006;
  }

  :global(.site-shell.legal-route .hero-section.empty-route-section) {
    min-height: 0;
    padding-top: 0;
  }

  :global(.site-shell.legal-route .airo-footer) {
    margin-top: -20px;
  }

  .legal-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: clamp(74px, 6.6vw, 100px) 0 0;
    overflow-x: clip;
    overflow-y: visible;
    color: #fff;
    background:
      radial-gradient(ellipse at 50% 390px, rgba(115, 0, 255, .3) 0%, rgba(115, 0, 255, .16) 36%, rgba(115, 0, 255, .055) 58%, transparent 78%),
      linear-gradient(180deg, #010002 0%, #010002 118px, #020004 245px, #06000d 470px, #07000f 660px, #030006 980px, #030006 100%);
    isolation: isolate;
  }

  .legal-page::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 260px;
    width: min(1500px, 138vw);
    height: 470px;
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(ellipse at 50% 42%, rgba(115,0,255,.58) 0%, rgba(115,0,255,.22) 52%, transparent 80%);
    filter: blur(128px);
    opacity: .36;
    mix-blend-mode: screen;
  }

  .legal-page::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: clamp(270px, 24vw, 390px);
    pointer-events: none;
    z-index: 2;
    background: linear-gradient(180deg,
      #010002 0%,
      rgba(1,0,2,.99) 28%,
      rgba(1,0,2,.82) 48%,
      rgba(1,0,2,.42) 70%,
      rgba(1,0,2,.12) 88%,
      transparent 100%);
    opacity: .96;
  }

  .legal-hero-lighting,
  .legal-dot-field {
    position: absolute;
    pointer-events: none;
    z-index: 1;
  }

  .legal-hero-lighting {
    left: 50%;
    top: clamp(-58px, -3.4vw, -24px);
    width: min(2060px, 146vw);
    height: clamp(620px, 54vw, 780px);
    transform: translateX(-50%);
    overflow: hidden;
    opacity: 1;
    filter: blur(1.55px);
    mix-blend-mode: screen;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.35) 5%, #000 15%, #000 73%, rgba(0,0,0,.46) 88%, transparent 98%);
    mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.35) 5%, #000 15%, #000 73%, rgba(0,0,0,.46) 88%, transparent 98%);
  }

  .legal-hero-light-svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .legal-dot-field {
    left: 50%;
    transform: translateX(-50%);
    background-image: radial-gradient(circle, rgba(236, 230, 255, .34) 1px, transparent 1.35px);
    background-size: 20px 20px;
    mask-image: radial-gradient(ellipse at 50% 30%, #000 0 48%, rgba(0,0,0,.58) 64%, transparent 88%);
    opacity: .5;
  }

  .legal-dot-field-top {
    top: 0;
    width: min(1424px, calc(100vw - 48px));
    height: 1040px;
  }

  .legal-dot-smile {
    position: absolute;
    pointer-events: none;
    z-index: 1;
    left: 50%;
    top: 76px;
    width: min(1220px, calc(100vw - 76px));
    height: 285px;
    transform: translateX(-50%);
    background-image: radial-gradient(circle, rgba(236, 230, 255, .38) 1px, transparent 1.35px);
    background-size: 20px 20px;
    opacity: .26;
    -webkit-mask-image:
      radial-gradient(ellipse 56% 82% at 50% -14%, transparent 0 50%, rgba(0,0,0,.9) 53%, rgba(0,0,0,.48) 60%, transparent 70%),
      linear-gradient(90deg, transparent 0%, rgba(0,0,0,.34) 13%, #000 28%, #000 72%, rgba(0,0,0,.34) 87%, transparent 100%);
    mask-image:
      radial-gradient(ellipse 56% 82% at 50% -14%, transparent 0 50%, rgba(0,0,0,.9) 53%, rgba(0,0,0,.48) 60%, transparent 70%),
      linear-gradient(90deg, transparent 0%, rgba(0,0,0,.34) 13%, #000 28%, #000 72%, rgba(0,0,0,.34) 87%, transparent 100%);
    -webkit-mask-composite: source-in;
    mask-composite: intersect;
  }

  .legal-dot-field-mid {
    top: 820px;
    width: min(1030px, 92vw);
    height: 2380px;
    opacity: .12;
    background-size: 24px 24px;
    mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 68%, transparent 100%);
  }

  .legal-hero,
  .legal-layout {
    position: relative;
    z-index: 3;
  }

  .legal-hero {
    animation: legal-enter .78s cubic-bezier(.22, 1, .36, 1) both;
    will-change: opacity, transform;
  }

  .legal-layout {
    animation: legal-layout-enter .72s cubic-bezier(.22, 1, .36, 1) .08s both;
    will-change: opacity;
  }

  .legal-hero {
    width: min(900px, calc(100vw - 44px));
    margin: 0 auto;
    text-align: center;
    padding: clamp(78px, 6.3vw, 96px) 0 clamp(48px, 5.2vw, 72px);
  }

  .legal-label {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 138px;
    height: 40px;
    color: rgba(255,255,255,.92);
    font-size: 18px;
    line-height: 1;
    letter-spacing: .02em;
  }

  .legal-label .label-corner {
    position: absolute;
    width: 10px;
    height: 10px;
    opacity: .88;
    box-shadow: 0 0 14px rgba(255,255,255,.14);
  }

  .corner-top-left {
    left: 0;
    top: 0;
    border-top: 2px solid rgba(255,255,255,.92);
    border-left: 2px solid rgba(255,255,255,.92);
  }

  .corner-top-right {
    right: 0;
    top: 0;
    border-top: 2px solid rgba(255,255,255,.92);
    border-right: 2px solid rgba(255,255,255,.92);
  }

  .corner-bottom-left {
    left: 0;
    bottom: 0;
    border-left: 2px solid rgba(255,255,255,.92);
    border-bottom: 2px solid rgba(255,255,255,.92);
  }

  .corner-bottom-right {
    right: 0;
    bottom: 0;
    border-right: 2px solid rgba(255,255,255,.92);
    border-bottom: 2px solid rgba(255,255,255,.92);
  }

  .legal-label strong {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    line-height: 1;
    font-weight: 500;
  }

  .legal-hero h1 {
    margin: 12px 0 0;
    font-size: clamp(44px, 4.45vw, 64px);
    line-height: 1.04;
    letter-spacing: -.043em;
    font-weight: 600;
    text-shadow: 0 18px 60px rgba(0,0,0,.3);
  }

  .legal-updated {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: min(286px, 82vw);
    height: 34px;
    margin-top: 17px;
    padding: 0 18px;
    border-radius: 34.15px;
    background: rgba(116,0,255,.2);
    border: 1px solid rgba(231,211,255,.16);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 14px 36px rgba(115,0,255,.18);
    color: #fff;
    font-size: clamp(11px, .84vw, 12.25px);
    font-weight: 400;
    line-height: 1.61;
    text-align: center;
  }

  .legal-hero p {
    width: min(650px, 90vw);
    margin: 22px auto 0;
    color: rgba(255,255,255,.7);
    font-size: clamp(13.5px, 1.08vw, 15.8px);
    line-height: 1.62;
    font-weight: 400;
    text-align: center;
  }

  .legal-layout {
    width: min(1186px, calc(100vw - 96px));
    margin: 0 auto;
    display: grid;
    grid-template-columns: 354px minmax(0, 1fr);
    gap: clamp(44px, 5vw, 84px);
    align-items: start;
  }

  .legal-toc-rail {
    position: relative;
    justify-self: center;
    align-self: stretch;
    width: min(354px, 100%);
    min-height: 100%;
  }

  .legal-toc {
    position: relative;
    width: 100%;
    max-height: min(556px, calc(100vh - 154px));
    padding: 46px 36px;
    overflow-y: auto;
    overscroll-behavior: contain;
    border-radius: 58px;
    background:
      radial-gradient(circle at 24% 0%, rgba(115,0,255,.16), transparent 34%),
      linear-gradient(180deg, rgba(22, 4, 36, .72), rgba(4,0,8,.48));
    border: 1px solid rgba(231,211,255,.13);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.035),
      inset 0 0 0 1px rgba(255,255,255,.018),
      0 32px 90px rgba(0,0,0,.25);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    scrollbar-width: none;
  }

  .legal-toc.toc-fixed {
    position: fixed;
    z-index: 30;
  }

  .legal-toc.toc-bottom {
    position: absolute;
    left: 0;
    bottom: auto;
    z-index: 2;
  }

  .legal-toc::-webkit-scrollbar {
    display: none;
  }

  .legal-toc a {
    display: block;
    position: relative;
    padding: 0 0 0 14px;
    margin: 0 0 17px;
    color: rgba(255,255,255,.58);
    font-size: clamp(11px, .88vw, 14px);
    line-height: 1.35;
    transition: color .24s ease, transform .24s cubic-bezier(.22, 1, .36, 1), opacity .24s ease;
  }

  .legal-toc a:last-child {
    margin-bottom: 0;
  }

  .legal-toc a::before {
    content: '';
    position: absolute;
    left: 0;
    top: .62em;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: rgba(255,255,255,.58);
    box-shadow: 0 0 16px rgba(115,0,255,.5);
    transition: background .24s ease, box-shadow .24s ease, transform .24s cubic-bezier(.22, 1, .36, 1);
  }

  .legal-toc a:hover,
  .legal-toc a:focus-visible,
  .legal-toc a.active {
    color: #fff;
    transform: translateX(2px);
  }

  .legal-toc a:hover::before,
  .legal-toc a:focus-visible::before,
  .legal-toc a.active::before {
    background: #7300ff;
    box-shadow: 0 0 18px rgba(115,0,255,.88);
    transform: scale(1.4);
  }

  .legal-content {
    max-width: 720px;
    padding-bottom: clamp(70px, 7vw, 112px);
  }

  .policy-section {
    scroll-margin-top: 120px;
    margin: 0 0 clamp(34px, 4.2vw, 58px);
  }

  .policy-section h2 {
    margin: 0 0 13px;
    color: #fff;
    font-size: clamp(26px, 2.55vw, 42px);
    line-height: 1.12;
    letter-spacing: -.045em;
    font-weight: 700;
  }

  .policy-section p,
  .policy-section li,
  .legal-note {
    color: rgba(255,255,255,.62);
    font-size: clamp(12px, .95vw, 15px);
    line-height: 1.82;
    font-weight: 300;
  }

  .policy-section p {
    margin: 0 0 17px;
  }

  .policy-section ul {
    list-style: none;
    margin: 18px 0 0;
    padding: 0;
  }

  .policy-section li {
    position: relative;
    margin: 0 0 12px;
    padding-left: 18px;
  }

  .policy-section li::before {
    content: '';
    position: absolute;
    left: 0;
    top: .78em;
    width: 8px;
    height: 2px;
    border-radius: 999px;
    background: #7300ff;
    box-shadow: 0 0 14px rgba(115,0,255,.84);
  }

  .policy-section strong {
    color: rgba(255,255,255,.9);
    font-weight: 600;
  }

  .policy-section a {
    color: #e7d3ff;
    text-decoration: underline;
    text-decoration-color: rgba(115,0,255,.74);
    text-underline-offset: 4px;
  }

  .policy-contact {
    margin-bottom: 70px;
  }

  .legal-note {
    width: min(640px, 100%);
    margin: 0 0 22px;
    color: rgba(255,255,255,.46);
  }

  .back-home {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    height: 36px;
    padding: 0 16px 0 18px;
    border-radius: 999px;
    background:
      radial-gradient(circle at 25% 16%, rgba(255,255,255,.4), transparent 18%),
      linear-gradient(135deg, #a55bff 0%, #7c00ff 45%, #6a00e8 100%);
    box-shadow:
      inset 0 0 0 1px rgba(255,255,255,.18),
      inset 0 12px 22px rgba(255,255,255,.14),
      0 10px 34px rgba(115,0,255,.34);
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    overflow-x: clip;
    overflow-y: visible;
  }

  .back-home svg {
    width: 13px;
    height: 13px;
  }

  .back-home path {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @keyframes legal-enter {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes legal-layout-enter {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 1100px) {
    .legal-layout {
      width: min(960px, calc(100vw - 56px));
      grid-template-columns: 280px minmax(0, 1fr);
      gap: 42px;
    }

    .legal-toc-rail {
      width: min(280px, 100%);
    }

    .legal-toc {
      border-radius: 42px;
      padding: 34px 28px;
    }
  }

  @media (max-width: 860px) {
    .legal-page {
      padding-top: 88px;
    }

    .legal-page::after {
      height: 330px;
      background: linear-gradient(180deg, #010002 0%, rgba(1,0,2,.97) 32%, rgba(1,0,2,.66) 58%, rgba(1,0,2,.18) 84%, transparent 100%);
    }

    .legal-hero-lighting {
      top: clamp(-38px, -3vw, -18px);
      width: 190vw;
      height: clamp(570px, 72vw, 720px);
      opacity: 1;
      filter: blur(2.2px);
    }

    .legal-dot-smile {
      top: 66px;
      width: 114vw;
      height: 235px;
      opacity: .2;
      background-size: 18px 18px;
      -webkit-mask-image: radial-gradient(ellipse 72% 78% at 50% -12%, transparent 0 50%, rgba(0,0,0,.82) 53%, rgba(0,0,0,.42) 61%, transparent 70%);
      mask-image: radial-gradient(ellipse 72% 78% at 50% -12%, transparent 0 50%, rgba(0,0,0,.82) 53%, rgba(0,0,0,.42) 61%, transparent 70%);
    }

    .legal-hero {
      padding-top: 82px;
      padding-bottom: 54px;
    }

    .legal-hero h1 {
      font-size: clamp(42px, 6vw, 50px);
      line-height: 1.04;
    }

    .legal-layout {
      width: min(720px, calc(100vw - 34px));
      display: block;
    }

    .legal-toc-rail {
      width: 100%;
      min-height: 0;
      margin: 0 auto 48px;
    }

    .legal-toc,
    .legal-toc.toc-fixed,
    .legal-toc.toc-bottom {
      position: relative;
      left: auto !important;
      top: auto !important;
      bottom: auto;
      width: min(440px, 100%) !important;
      max-height: none;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px 14px;
      margin: 0 auto;
      padding: 22px;
      border-radius: 28px;
      overflow: visible;
    }

    .legal-toc a {
      margin: 0;
      font-size: 11px;
      line-height: 1.35;
    }

    .legal-content {
      width: 100%;
      max-width: none;
      margin: 0;
      padding-bottom: 72px;
      text-align: left;
    }
  }

  @media (max-width: 560px) {
    .legal-page {
      padding-top: 80px;
    }

    .legal-page::after {
      height: 290px;
      background: linear-gradient(180deg, #010002 0%, rgba(1,0,2,.96) 34%, rgba(1,0,2,.58) 62%, rgba(1,0,2,.14) 86%, transparent 100%);
    }

    .legal-hero-lighting {
      top: -24px;
      width: 242vw;
      height: 570px;
      opacity: 1;
      filter: blur(2.7px);
    }

    .legal-dot-smile {
      top: 54px;
      width: 126vw;
      height: 205px;
      opacity: .18;
      background-size: 17px 17px;
    }

    .legal-hero {
      width: min(100%, calc(100vw - 28px));
      padding-top: 58px;
      padding-bottom: 44px;
    }

    .legal-label {
      width: 118px;
      height: 34px;
      font-size: 14px;
    }

    .legal-label .label-corner {
      width: 9px;
      height: 9px;
      border-width: 2px;
    }

    .legal-hero h1 {
      margin-top: 8px;
      font-size: clamp(36px, 10.4vw, 46px);
      line-height: 1.08;
    }

    .legal-updated {
      height: 32px;
      margin-top: 15px;
      font-size: 12px;
    }

    .legal-hero p {
      width: min(340px, 94%);
      margin-top: 20px;
      font-size: 13px;
    }

    .legal-layout {
      width: min(100%, calc(100vw - 24px));
    }

    .legal-toc,
    .legal-toc.toc-fixed,
    .legal-toc.toc-bottom {
      width: min(344px, 100%) !important;
      grid-template-columns: 1fr;
      gap: 8px;
      padding: 18px 16px 20px;
      border-radius: 24px;
    }

    .legal-toc a {
      padding-left: 12px;
      padding-right: 0;
    }

    .legal-content {
      width: 100%;
      max-width: none;
      margin: 0;
    }

    .policy-section {
      scroll-margin-top: 92px;
    }

    .policy-section h2 {
      font-size: 25px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .legal-hero,
    .legal-layout {
      animation: none;
      opacity: 1;
      transform: none;
    }

    .legal-toc a,
    .legal-toc a::before {
      transition: none;
    }
  }
</style>
