<script>
  export let initialTab = 'Game';

  const tabs = ['Game', 'UGC', 'Careers'];
  const currencies = [
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'CAD', symbol: '$', label: 'Canadian Dollar' }
  ];

  const jobRoles = [
    'Game Scout',
    'Roblox Developer',
    'UI/UX Designer',
    'Motion Designer',
    'Community Manager',
    'Other'
  ];

  function normalizeTab(tab) {
    return tabs.includes(tab) ? tab : tabs[0];
  }

  let selectedTab = normalizeTab(initialTab);
  let selectedCurrency = 'USD';
  let selectedJobRole = '';
  let syncedInitialTab = initialTab;

  $: if (initialTab !== syncedInitialTab) {
    selectedTab = normalizeTab(initialTab);
    syncedInitialTab = initialTab;
  }

  $: selectedCurrencyData = currencies.find((currency) => currency.code === selectedCurrency) || currencies[0];

  $: helperText = selectedTab === 'Careers'
    ? 'Applying to join the Airo team'
    : selectedTab === 'UGC'
      ? 'UGC items, accessories, or wearables'
      : 'Selling or partnering on a Roblox';

  $: linkLabel = selectedTab === 'Careers' ? 'Portfolio / resume link' : 'Group link';
  $: linkPlaceholder = selectedTab === 'Careers' ? 'https://your-portfolio.com' : 'https://www-roblox.com/groups/...';
  $: priceLabel = selectedTab === 'Careers' ? 'Salary expectation' : 'Asking price';
  $: pricePlaceholder = selectedTab === 'Careers' ? `${selectedCurrencyData.symbol} 3,000 / month` : `${selectedCurrencyData.symbol} 10,000`;
  $: messagePlaceholder = selectedTab === 'Careers'
    ? 'Tell us about your skills, experience, portfolio, and what role you want...'
    : 'Tell us a bit about your game, audience, and goals...';
</script>

<section id="work-with-us" class="work-form-section" aria-labelledby="work-form-title">
  <div class="work-form-lighting" aria-hidden="true">
    <svg class="work-footer-light" viewBox="-265 585.549 1970 1011.291" fill="none" preserveAspectRatio="none">
      <g filter="url(#work_light_blur_main)" opacity="0.82" style="mix-blend-mode:screen">
        <path d="M-265 585.549C-84.3875 708.484 180.521 915.542 737.335 1014.35C1087.87 949.711 1338.2 833.864 1704.3 612.243V1596.84C1523.69 1473.91 1258.78 1266.84 701.961 1168.03C351.424 1232.68 101.097 1348.53 -265 1570.15V585.549Z" fill="#7300ff" />
      </g>
      <g filter="url(#work_light_blur_mid)" opacity="0.72" style="mix-blend-mode:screen">
        <path d="M-265 697.663C-169.03 762.986 21.8951 864.014 273.708 946.925C543.527 1035.76 835.01 1035.02 1108.62 958.637C1315.08 900.999 1527.24 821.29 1705 713.68V1477.12C1607.33 1410.64 1383.32 1307.17 1106.95 1223.46C835.083 1141.11 543.595 1137.83 272.493 1222.67C90.0909 1279.75 -93.8502 1357.5 -265 1461.1V697.663Z" fill="#af8bf9" />
      </g>
      <g filter="url(#work_light_blur_edge_left)" opacity="0.96" style="mix-blend-mode:screen">
        <path d="M642.588 1084.72C213.352 1074.05 -141.319 904.095 -265 820.455V1338.31C29.6992 1161.07 462.85 1095.4 642.588 1084.72Z" fill="#e8e4ff" />
      </g>
      <g filter="url(#work_light_blur_edge_right)" opacity="0.96" style="mix-blend-mode:screen">
        <path d="M797.412 1074.05C1226.65 1084.72 1581.32 1254.67 1705 1338.31L1705 820.454C1410.3 997.701 977.15 1063.37 797.412 1074.05Z" fill="#e8e4ff" />
      </g>
      <g filter="url(#work_light_blur_edge_core_left)" opacity="0.46" style="mix-blend-mode:screen">
        <path d="M642.588 1084.72C213.352 1074.05 -141.319 904.095 -265 820.455V1338.31C29.6992 1161.07 462.85 1095.4 642.588 1084.72Z" fill="#e8e4ff" />
      </g>
      <g filter="url(#work_light_blur_edge_core_right)" opacity="0.46" style="mix-blend-mode:screen">
        <path d="M797.412 1074.05C1226.65 1084.72 1581.32 1254.67 1705 1338.31L1705 820.454C1410.3 997.701 977.15 1063.37 797.412 1074.05Z" fill="#e8e4ff" />
      </g>
      <defs>
        <filter id="work_light_blur_main" x="-850.549" y="-0.000183105" width="3140.4" height="2182.39" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="330" result="effect1_foregroundBlur" />
        </filter>
        <filter id="work_light_blur_mid" x="-512.883" y="449.78" width="2465.77" height="1275.22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="175" result="effect1_foregroundBlur" />
        </filter>
        <filter id="work_light_blur_edge_left" x="-362.592" y="722.863" width="1102.77" height="713.042" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="72" result="effect1_foregroundBlur" />
        </filter>
        <filter id="work_light_blur_edge_right" x="699.82" y="722.863" width="1102.77" height="713.042" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="72" result="effect1_foregroundBlur" />
        </filter>
        <filter id="work_light_blur_edge_core_left" x="-328.592" y="756.863" width="1034.77" height="645.042" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="38" result="effect1_foregroundBlur" />
        </filter>
        <filter id="work_light_blur_edge_core_right" x="733.82" y="756.863" width="1034.77" height="645.042" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="38" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  </div>
  <div class="work-form-heading">
    <div class="section-kicker" aria-label="Work with us">
      <span class="corner corner-tl"></span>
      <span class="corner corner-tr"></span>
      <strong>Work with us</strong>
      <span class="corner corner-bl"></span>
      <span class="corner corner-br"></span>
    </div>

    <h2 id="work-form-title">Want to work with Airo?</h2>
    <p>Tell us what you’re building, selling, or applying for.<br class="desktop-break" /> We’ll review it and reach out if there’s a strong fit.</p>
  </div>

  <form class="work-form-card" aria-label="Work with us enquiry form">
    <div class="tabs-block">
      <span class="field-label">What are you applying for ?</span>
      <div class="work-tabs" role="tablist" aria-label="Application type">
        {#each tabs as tab}
          <button
            type="button"
            class:selected={selectedTab === tab}
            role="tab"
            aria-selected={selectedTab === tab}
            onclick={() => selectedTab = tab}
          >
            {tab}
          </button>
        {/each}
      </div>
      <small>{helperText}</small>
    </div>

    <div class="form-grid two-col">
      <div class="field-group">
        <label for="work-full-name"><span></span>Full name</label>
        <input id="work-full-name" type="text" placeholder="Jane Doe" />
      </div>

      <div class="field-group">
        <label for="work-discord"><span></span>Discord username</label>
        <input id="work-discord" type="text" placeholder="Discord username" />
      </div>

      <div class="field-group">
        <label for="work-roblox"><span></span>Roblox username</label>
        <input id="work-roblox" type="text" placeholder="Roblox username" />
      </div>

      <div class="field-group">
        <label for="work-group-link"><span></span>{linkLabel}</label>
        <input id="work-group-link" type="url" placeholder={linkPlaceholder} />
      </div>
    </div>

    {#if selectedTab === 'Careers'}
      <div class="field-group role-field">
        <label for="work-job-role"><span></span>Job role</label>
        <div class="role-select">
          <select id="work-job-role" aria-label="Job role" bind:value={selectedJobRole}>
            <option value="" disabled>Choose job role</option>
            {#each jobRoles as role}
              <option value={role}>{role}</option>
            {/each}
          </select>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
        </div>
      </div>
    {/if}

    <div class="field-group price-field">
      <label for="work-asking-price"><span></span>{priceLabel}</label>
      <div class="price-row">
        <div class="currency-select">
          <span class="currency-icon" aria-hidden="true">{selectedCurrencyData.symbol}</span>
          <select aria-label="Currency" bind:value={selectedCurrency}>
            {#each currencies as currency}
              <option value={currency.code}>{currency.code}</option>
            {/each}
          </select>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
        </div>
        <input id="work-asking-price" type="text" placeholder={pricePlaceholder} />
      </div>
    </div>

    <div class="field-group message-field">
      <label for="work-message"><span></span>Why are you contacting us ?</label>
      <textarea id="work-message" placeholder={messagePlaceholder}></textarea>
    </div>

    <div class="consent-list">
      <label class="check-row">
        <input type="checkbox" />
        <span class="box"></span>
        <span>By submitting your enquiry, you agree to our <a href="/legal">Privacy Policy</a> &amp; <a href="/legal">Terms &amp; Conditions</a>.</span>
      </label>

      <label class="check-row">
        <input type="checkbox" />
        <span class="box"></span>
        <span>I am over the age of 13.</span>
      </label>
    </div>

    <div class="form-submit-row">
      <p>We typically respond within 2–3 business days.</p>
      <button type="submit" class="submit-btn">
        <span>Submit inquiry</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10M17 7 7 17" /></svg>
      </button>
    </div>
  </form>
</section>

<style>
  .work-form-section {
    position: relative;
    z-index: 5;
    width: min(820px, calc(100vw - 56px));
    margin: clamp(30px, 4.2vw, 54px) auto clamp(76px, 7.2vw, 112px);
    color: #fff;
    scroll-margin-top: 118px;
  }

  .work-form-lighting {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: clamp(190px, 18vw, 252px);
    width: min(1970px, 136vw);
    aspect-ratio: 1970 / 1011.291;
    transform: translateX(-50%);
    overflow: hidden;
    pointer-events: none;
    mix-blend-mode: screen;
    filter: blur(6px);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.18) 9%, #000 25%, #000 75%, rgba(0,0,0,.18) 91%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.18) 9%, #000 25%, #000 75%, rgba(0,0,0,.18) 91%, transparent 100%);
  }

  .work-footer-light {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
    opacity: .92;
  }

  .work-form-heading,
  .work-form-card {
    position: relative;
    z-index: 2;
  }

  .work-form-heading {
    width: min(760px, 100%);
    text-align: center;
    margin: 0 auto clamp(28px, 3.9vw, 50px);
  }

  .section-kicker {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-width: 0;
    height: 42px;
    padding-left: 24px;
    padding-right: 24px;
    margin-bottom: clamp(15px, 1.8vw, 22px);
    color: #fff;
    font-size: clamp(16.5px, 1.38vw, 20.9px);
    line-height: 42px;
    font-weight: 600;
    letter-spacing: .035em;
    white-space: nowrap;
  }

  .section-kicker .corner {
    position: absolute;
    width: 10px;
    height: 10px;
    border-color: rgba(255,255,255,.9);
    border-width: 2px;
  }

  .corner-tl { left: 0; top: 4px; border-left: 2px solid; border-top: 2px solid; }
  .corner-tr { right: 0; top: 4px; border-right: 2px solid; border-top: 2px solid; }
  .corner-bl { left: 0; bottom: 4px; border-left: 2px solid; border-bottom: 2px solid; }
  .corner-br { right: 0; bottom: 4px; border-right: 2px solid; border-bottom: 2px solid; }

  .section-kicker strong {
    font: inherit;
  }

  .work-form-heading h2 {
    margin: 0;
    font-size: clamp(40px, 4.65vw, 64px);
    line-height: 1.12;
    letter-spacing: -.018em;
    font-weight: 600;
    text-shadow: 0 0 42px rgba(255,255,255,.2);
  }

  .work-form-heading p {
    width: min(690px, 100%);
    margin: clamp(16px, 1.8vw, 24px) auto 0;
    color: rgba(255,255,255,.7);
    font-size: clamp(14px, 1.34vw, 18.5px);
    line-height: 1.58;
    font-weight: 400;
    letter-spacing: 0;
  }

  .work-form-card {
    width: 100%;
    padding: clamp(30px, 3.3vw, 42px) clamp(26px, 3.7vw, 46px) clamp(28px, 3.3vw, 40px);
    border-radius: clamp(34px, 4.4vw, 58px);
    background:
      linear-gradient(180deg, rgba(255,255,255,.032), rgba(255,255,255,.014)),
      rgba(19, 16, 21, .35);
    border: 1px solid rgba(202, 158, 255, .22);
    box-shadow:
      inset 0 0 0 1px rgba(202,158,255,.08),
      inset 0 -1px 0 rgba(255,255,255,.06),
      0 20px 92px rgba(115,0,255,.16);
    backdrop-filter: blur(2px);
    overflow: hidden;
  }


  .work-form-card > * {
    position: relative;
    z-index: 1;
  }

  .tabs-block > .field-label,
  .field-group > label {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0 0 13px;
    color: #fff;
    font-size: clamp(13px, 1.05vw, 15.5px);
    line-height: 1.2;
    font-weight: 400;
    letter-spacing: -.035em;
  }

  .field-group > label span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #7300ff;
    flex: 0 0 auto;
  }

  .work-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    width: 100%;
    height: clamp(44px, 3.8vw, 54px);
    padding: 5px;
    border-radius: 169px;
    background: rgba(255,255,255,.055);
    border: 0;
    outline: none;
    box-shadow: none;
  }

  .work-tabs:hover,
  .work-tabs:active,
  .work-tabs:focus-within {
    background: rgba(255,255,255,.055);
    border: 0;
    outline: none;
    box-shadow: none;
  }

  .work-tabs button {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 165px;
    background: transparent;
    color: #9C9C9C;
    font: inherit;
    font-size: clamp(13px, 1.08vw, 16px);
    font-weight: 400;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    appearance: none;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    transition: color .25s ease, font-weight .25s ease;
  }

  .work-tabs button:hover,
  .work-tabs button:active,
  .work-tabs button:focus,
  .work-tabs button:focus-visible {
    background: transparent;
    border: 0;
    outline: none;
    box-shadow: none;
    filter: none;
  }

  .work-tabs button.selected,
  .work-tabs button.selected:hover,
  .work-tabs button.selected:active,
  .work-tabs button.selected:focus,
  .work-tabs button.selected:focus-visible {
    color: #fff;
    font-weight: 600;
    background: #7300ff;
    border: 0;
    outline: none;
    box-shadow: none;
    filter: none;
  }

  .tabs-block small {
    display: block;
    margin: 8px 0 clamp(18px, 2.4vw, 30px);
    color: rgba(255,255,255,.8);
    font-size: clamp(11px, .95vw, 14px);
    line-height: 1.55;
    font-weight: 400;
    letter-spacing: -.03em;
  }

  .form-grid.two-col {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(24px, 3.6vw, 42px);
    row-gap: clamp(18px, 2.35vw, 27px);
  }

  .field-group input,
  .field-group textarea,
  .currency-select,
  .role-select {
    width: 100%;
    border: 1px solid rgba(237,237,237,.62);
    border-radius: 219px;
    background:
      linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.03)),
      rgba(26,26,26,.72);
    color: #fff;
    font-family: inherit;
    font-size: clamp(11px, .95vw, 13.5px);
    font-weight: 400;
    outline: none;
    box-shadow: inset 0 0 34px rgba(202,158,255,.08);
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease, font-weight .2s ease;
  }

  .field-group input,
  .currency-select,
  .role-select {
    height: clamp(44px, 3.7vw, 52px);
    padding: 0 clamp(17px, 2.1vw, 26px);
  }

  .field-group input::placeholder,
  .field-group textarea::placeholder {
    color: rgba(255,255,255,.5);
  }

  .field-group input:focus,
  .field-group textarea:focus,
  .field-group input:focus-visible,
  .field-group textarea:focus-visible {
    outline: none;
    border-color: rgba(237,237,237,.62);
    background:
      linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.03)),
      rgba(26,26,26,.72);
    box-shadow: inset 0 0 34px rgba(202,158,255,.08);
    font-weight: 600;
  }

  .currency-select:focus-within,
  .role-select:focus-within {
    border-color: rgba(237,237,237,.62);
    background:
      linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.03)),
      rgba(26,26,26,.72);
    box-shadow: inset 0 0 34px rgba(202,158,255,.08);
  }

  .role-field,
  .price-field {
    margin-top: clamp(18px, 2.4vw, 28px);
  }

  .price-row {
    display: grid;
    grid-template-columns: minmax(110px, 176px) 1fr;
    gap: clamp(16px, 1.9vw, 24px);
  }

  .currency-select {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 12px;
    padding-inline: 18px;
  }

  .currency-select .currency-icon {
    width: 18px;
    text-align: center;
    font-size: clamp(15px, 1.18vw, 18px);
    line-height: 1;
    font-weight: 600;
    color: #fff;
  }

  .currency-select select {
    width: 100%;
    min-width: 0;
    grid-column: 2 / 4;
    grid-row: 1;
    padding-left: 12px;
    padding-right: 24px;
    border: 0;
    border-left: 1px solid rgba(47,30,47,.95);
    background: transparent;
    color: #fff;
    font: inherit;
    font-size: clamp(15px, 1.32vw, 19px);
    line-height: 1;
    font-weight: 600;
    outline: none;
    appearance: none;
    cursor: pointer;
  }

  .currency-select option {
    color: #111;
  }

  .currency-select svg {
    grid-column: 3;
    grid-row: 1;
    justify-self: end;
    pointer-events: none;
    width: 16px;
    height: 16px;
    fill: none;
    stroke: rgba(255,255,255,.78);
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .role-select {
    position: relative;
    display: flex;
    align-items: center;
  }

  .role-select select {
    width: 100%;
    min-width: 0;
    padding-right: 28px;
    border: 0;
    background: transparent;
    color: #fff;
    font: inherit;
    font-size: clamp(11px, .95vw, 13.5px);
    line-height: 1;
    font-weight: 400;
    outline: none;
    appearance: none;
    cursor: pointer;
  }

  .role-select select:invalid {
    color: rgba(255,255,255,.5);
  }

  .role-select option {
    color: #111;
  }

  .role-select svg {
    position: absolute;
    right: clamp(17px, 2.1vw, 26px);
    pointer-events: none;
    width: 16px;
    height: 16px;
    fill: none;
    stroke: rgba(255,255,255,.78);
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .message-field {
    margin-top: clamp(18px, 2.4vw, 28px);
  }

  .field-group textarea {
    height: clamp(140px, 13.4vw, 184px);
    padding: clamp(15px, 1.6vw, 22px) clamp(17px, 2.1vw, 26px);
    border-radius: clamp(22px, 2.6vw, 34px);
    resize: vertical;
  }

  .consent-list {
    display: grid;
    gap: 12px;
    margin-top: clamp(24px, 3.2vw, 38px);
  }

  .check-row {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #fff;
    font-size: clamp(11px, 1vw, 14.5px);
    line-height: 1.55;
    letter-spacing: -.035em;
  }

  .check-row input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .check-row .box {
    position: relative;
    width: 22px;
    height: 22px;
    flex: 0 0 auto;
    border-radius: 7px;
    background: #060506;
    border: 1px solid #5B5165;
  }

  .check-row input:focus + .box,
  .check-row input:focus-visible + .box {
    outline: none;
    box-shadow: none;
  }

  .check-row input:checked + .box {
    background: #7300ff;
    border-color: #7300ff;
    box-shadow: none;
  }

  .check-row input:checked + .box::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 3px;
    width: 7px;
    height: 12px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .check-row a {
    color: #7300ff;
    font-weight: 600;
  }

  .form-submit-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-top: clamp(28px, 3.7vw, 44px);
  }

  .form-submit-row p {
    margin: 0;
    color: rgba(255,255,255,.5);
    font-size: clamp(11px, .86vw, 12.5px);
    line-height: 2;
    font-weight: 500;
    letter-spacing: -.035em;
  }

  .submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
    width: clamp(166px, 13.8vw, 196px);
    height: clamp(42px, 3.35vw, 50px);
    border: 5px solid #7300ff;
    border-radius: 999px;
    background: #7300ff;
    color: #fff;
    font-family: inherit;
    font-size: clamp(12px, 1.08vw, 15.5px);
    line-height: 1;
    font-weight: 600;
    cursor: pointer;
    box-shadow: none;
    transition: transform .22s ease, box-shadow .22s ease;
  }

  .submit-btn svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: none;
  }

  @media (max-width: 900px) {
    .work-form-section {
      width: min(570px, calc(100vw - 34px));
      margin-top: 46px;
      margin-bottom: 78px;
      scroll-margin-top: 96px;
    }

    .work-form-lighting {
      top: 230px;
      width: 158vw;
    }

    .work-form-card {
      padding: 32px 24px 34px;
      border-radius: 38px;
    }

    .form-grid.two-col {
      grid-template-columns: 1fr;
    }

    .price-row {
      grid-template-columns: minmax(134px, 142px) minmax(0, 1fr);
      gap: 8px;
    }

    .price-row > input {
      min-width: 0;
    }

    .currency-select {
      width: 100%;
      min-width: 0;
      padding-inline: 11px;
      gap: 6px;
    }

    .form-submit-row {
      align-items: stretch;
      flex-direction: column;
      margin-top: 38px;
    }

    .submit-btn {
      width: 100%;
    }
  }

  @media (max-width: 560px) {
    .work-form-section {
      width: calc(100vw - 28px);
      margin-top: 50px;
      margin-bottom: 56px;
      scroll-margin-top: 86px;
    }

    .work-form-lighting {
      top: 245px;
      width: 190vw;
      opacity: .9;
    }

    .desktop-break {
      display: none;
    }

    .section-kicker {
      height: 42px;
      margin-bottom: 15px;
      font-size: 15px;
      line-height: 42px;
    }

    .work-form-heading {
      margin-bottom: 28px;
    }

    .work-form-heading h2 {
      font-size: clamp(24px, 6.9vw, 38px);
      line-height: 1.08;
      letter-spacing: -.035em;
      white-space: nowrap;
    }

    .work-form-heading p {
      font-size: clamp(14px, 3.65vw, 18px);
      line-height: 1.43;
      font-weight: 400;
      color: rgba(255,255,255,.7);
    }

    .work-form-card {
      padding: 30px 18px 28px;
      border-radius: 32px;
    }

    .tabs-block > .field-label,
    .field-group > label {
      margin-bottom: 12px;
      font-size: 13px;
    }

    .field-group > label span {
      width: 6px;
      height: 6px;
    }

    .work-tabs {
      height: 46px;
      padding: 4px;
    }

    .work-tabs button {
      font-size: 12px;
    }

    .tabs-block small {
      margin: 8px 0 24px;
      font-size: 11px;
    }

    .form-grid.two-col {
      row-gap: 22px;
    }

    .field-group input,
    .currency-select,
    .role-select {
      height: 48px;
      padding-inline: 16px;
      font-size: 12px;
    }

    .role-field,
    .price-field,
    .message-field {
      margin-top: 24px;
    }

    .currency-select {
      gap: 6px;
      padding-inline: 10px;
    }

    .currency-select .currency-icon {
      width: 16px;
      font-size: 14px;
    }

    .currency-select select {
      padding-left: 8px;
      padding-right: 18px;
      font-size: 14px;
    }

    .role-select select {
      font-size: 12px;
    }


    .field-group textarea {
      height: 164px;
      padding: 14px 16px;
      border-radius: 20px;
      font-size: 12px;
    }

    .consent-list {
      gap: 14px;
      margin-top: 28px;
    }

    .check-row {
      align-items: flex-start;
      gap: 10px;
      font-size: 11px;
      line-height: 1.55;
    }

    .check-row .box {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      margin-top: 1px;
    }

    .form-submit-row {
      gap: 18px;
      margin-top: 32px;
    }

    .form-submit-row p {
      font-size: 11px;
      line-height: 1.5;
    }

    .submit-btn {
      height: 48px;
      border-width: 4px;
      font-size: 13px;
    }
  }

  @media (max-width: 380px) {
    .price-row {
      grid-template-columns: minmax(126px, 132px) minmax(0, 1fr);
      gap: 8px;
    }

    .currency-select {
      padding-inline: 9px;
    }

    .currency-select select {
      padding-left: 7px;
      padding-right: 16px;
      font-size: 13px;
    }
  }

</style>