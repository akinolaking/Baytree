# BayTree Engineering & Construction

Production-ready static website for BayTree Engineering & Construction.

## Stack
- HTML (multi-page site)
- Tailwind CSS v3 (compiled from `assets/css/input.css`)
- Vanilla JavaScript (`assets/js/main.js`, minified to `assets/js/main.min.js`)

## Pages
- `index.html`
- `services.html`
- `projects.html`
- `about.html`
- `contact.html`

Legacy file:
- `index (2).html` is retained only as an archive variant and is set to `noindex`.

## Local development
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

Build outputs:
- `assets/css/main.css` (minified)
- `assets/js/main.min.js` (minified)

## Run locally (static server)
```bash
npm run start
```

## SEO/Social setup
Implemented across primary pages:
- `title`, `description`, `robots`, `canonical`
- Open Graph tags (`og:type`, `og:url`, `og:title`, `og:description`, `og:image`)
- Twitter card tags (`twitter:card`, `twitter:image`)
- Favicon: `assets/images/BT_Strata_Icon_Forest.png`
- OG image: `assets/images/og-image.png`

## Key paths
- Source styles: `assets/css/input.css`
- Built styles: `assets/css/main.css`
- Source JS: `assets/js/main.js`
- Built JS: `assets/js/main.min.js`
- Shared assets: `assets/images/`

## Remaining work (non-P0)
- Convert/optimize imagery to WebP where appropriate
- Responsive QA across all breakpoints
- Cross-browser QA (Chrome, Safari, Firefox, Edge)
- Full WCAG AA accessibility audit
- Add logo SVG exports and final project photography set

## License
Proprietary - BayTree Engineering & Construction Limited © 2026
