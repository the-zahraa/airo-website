import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

function getSiteUrl() {
  const rawUrl =
    process.env.VITE_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:5173';

  const urlWithProtocol = /^https?:\/\//.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

  return urlWithProtocol.replace(/\/+$/, '');
}

function airoSocialPreviewUrl() {
  const siteUrl = getSiteUrl();

  return {
    name: 'airo-social-preview-url',
    transformIndexHtml(html) {
      return html.replace(/%AIRO_SITE_URL%/g, siteUrl);
    }
  };
}

export default defineConfig({
  plugins: [svelte(), airoSocialPreviewUrl()]
});
