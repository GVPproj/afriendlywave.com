// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Bind all interfaces so tailnet devices can reach the dev server
  // (default is loopback-only). Host-header checks relaxed below.
  server: { host: true },

  prefetch: {
    prefetchAll: true,
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      // Only accept tailnet hostnames — avoids disabling host checks
      // entirely, which would open the dev server to DNS rebinding.
      allowedHosts: ['.ts.net'],
    },
  },
});