// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true,
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      // `true` allows any host (fine for a private tailnet dev box).
      // Full MagicDNS name for reference: asahi-mini.tail40c3ca.ts.net
      allowedHosts: true,
    },
  },

  adapter: cloudflare({
    imageService: 'compile'
  })
});