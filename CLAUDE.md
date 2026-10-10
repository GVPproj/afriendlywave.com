# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

afriendlywave.com is an Astro 7 static site with Tailwind CSS 4 styling. It's a minimal landing page with a Mixcloud audio player embed.

## Commands

```bash
pnpm dev       # Start dev server at localhost:4321
pnpm build     # Build production site to ./dist/
pnpm preview   # Preview production build
```

## Architecture

- **Framework**: Astro 7 with TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 via Vite plugin
- **Package Manager**: pnpm

### Source Structure

```
src/
├── pages/index.astro          # Entry point, uses Layout + Home
├── layouts/Layout.astro       # Root HTML template with global styles
├── components/
│   ├── Home.astro             # Main page content
│   └── elements/
│       ├── Header.astro       # Logo and nav link
│       └── MixcloudPlayer.astro  # Fixed-bottom Mixcloud iframe
├── styles/global.css          # Tailwind imports + CSS custom properties
└── assets/                    # SVG assets (logo, background)
```

### Theme Variables

Defined in `src/styles/global.css`. Use semantic colour tokens:
- `surface`: page and header backgrounds
- `ink`: text and borders (use opacity modifiers for muted variants)
- `accent`: links, logos, and buttons
- `highlight`: hover, focus, and emphasis
- `on-accent`: text on accent buttons

Custom font: Panchi Mono (loaded from `/public/fonts/`).
