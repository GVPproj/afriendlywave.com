## TODOS

The Mixcloud API is fetched at build time in
  ShowGrid.astro (the fetch is in the frontmatter), so the show data becomes static HTML.

  If you want new shows to appear automatically, you have a few options:

  1. Client-side fetch - Move the API call to a <script> tag so it fetches on every page load
  2. SSR mode - Enable Astro server-side rendering so pages render on each request
  3. Scheduled rebuilds - Set up your hosting (Cloudflare, Netlify, Vercel) to rebuild
  daily/hourly
