# Pangeabuy website

A self-contained, responsive static website for Pangeabuy, a product of Kumpali Private Limited.

## Run locally

From this directory:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. No install or build is required. Deploy this directory to a static host.

## Contents

- `index.html`: complete homepage and SEO metadata.
- `styles.css`: logo-derived teal design tokens, responsive layouts and reduced-motion support.
- `script.js`: FAQs, accessible mobile navigation, illustrative category filters and information dialogs.
- `assets/`: original supplied logo, Stromule logo and local SVG illustrations.

The official Pangeabuy logo is copied unchanged from `../logo/logo.png`. The logo's sampled teal family ranges from approximately #006868 to #008888; the primary colour is #008888. Product and storefront illustrations are conceptual artwork, not real inventory or merchant photography.

## Integration and launch

Live search, location, onboarding, checkout and merchant data are intentionally not simulated. The access dialogs explicitly describe this site's limits. No forms or data collection endpoints are present.

Replace the launch/access and merchant dialog content with verified destinations when available. Publish approved privacy/terms/contact destinations before offering the live platform. Configure canonical URL, absolute social image URL and structured-data URL when the production domain is confirmed. The current Open Graph image uses a relative path for portability.

The Stromule link points to the sibling `../stromule_website/index.html`; replace it with the verified deployed URL when hosting this directory independently. Manrope loads from Google Fonts, with local system font fallbacks. Everything else runs from local assets without dependencies.
