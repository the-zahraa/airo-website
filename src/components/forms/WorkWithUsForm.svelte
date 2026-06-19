<script>
  import './styles/WorkWithUsForm.css';
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

<section id="work-with-us" class="work-form-section work-with-us-form" aria-labelledby="work-form-title">
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
      <span class="field-label">What are you applying for?</span>
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
      <label for="work-message"><span></span>Why are you contacting us?</label>
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
