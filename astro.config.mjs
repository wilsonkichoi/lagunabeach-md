// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import remarkWikilinks from './plugins/remark-wikilinks.mjs';
import {
  ENABLED_LANGUAGE_CODES,
  DEFAULT_LANGUAGE,
} from './src/config/languages.mjs';
import { existsSync, readFileSync } from 'node:fs';

// Per-URL sitemap <lastmod> from git-derived dates
let contentDates = {};
try {
  contentDates =
    JSON.parse(readFileSync('./src/data/content-dates.json', 'utf-8')).dates ||
    {};
} catch {
  // not yet generated
}

export default defineConfig({
  site: 'https://lagunabeach.md',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        try {
          const lm =
            contentDates[decodeURIComponent(new URL(item.url).pathname)];
          if (lm) item.lastmod = lm;
          else delete item.lastmod;
        } catch {
          delete item.lastmod;
        }
        return item;
      },
    }),
  ],
  i18n: {
    defaultLocale: DEFAULT_LANGUAGE.code,
    locales: [...ENABLED_LANGUAGE_CODES],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    concurrency: 4,
    inlineStylesheets: 'auto',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
      langs: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'astro',
        'bash',
        'sh',
        'md',
        'json',
        'yaml',
        'html',
        'css',
        'python',
        'go',
        'rust',
        'sql',
        'diff',
        'plaintext',
      ],
    },
    remarkPlugins: [remarkWikilinks],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: '_blank', rel: ['noopener', 'noreferrer'] },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      target: 'es2022',
      minify: 'esbuild',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 10000,
    },
    esbuild: {
      target: 'es2022',
    },
    optimizeDeps: { force: false },
  },
});
