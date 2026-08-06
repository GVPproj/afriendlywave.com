// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Dev is exposed over the tailnet via `tailscale serve --https=4322`, which
  // proxies to IPv4 loopback and forwards the ts.net Host header.
  // 4322 instead of the default 4321, which another local project uses.
  server: { host: '127.0.0.1', port: 4322 },

  prefetch: {
    prefetchAll: true,
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      // Only accept tailnet hostnames — avoids disabling host checks
      // entirely, which would open the dev server to DNS rebinding.
      // strictPort: the tailscale proxy targets 4322, so failing loudly beats
      // silently falling back to another port.
      allowedHosts: ['.ts.net'],
      strictPort: true,
    },
  },
});