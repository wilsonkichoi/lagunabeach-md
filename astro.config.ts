import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import placeConfig from './place.config';

// Minimal scaffold config (task 0.2). The real config — sitemap, markdown
// wiki-link / external-link plugins, build tuning — lands with the pages that
// need it in Phase 1+. `site` is derived from place.config so nothing here is
// place-specific.
export default defineConfig({
  site: `https://${placeConfig.place.domain}`,
  vite: {
    plugins: [tailwindcss()],
  },
});
