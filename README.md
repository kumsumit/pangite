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

Replace the launch/access and merchant dialog content with verified destinations when available. Publish approved privacy/terms/contact destinations before offering the live platform.

## GitHub Pages at pangeabuy.com

Repository: https://github.com/kumsumit/pangite

The repository root is the publishable website. The included GitHub Actions workflow deploys pushes to `main`. In repository Settings → Pages, choose **GitHub Actions** as the build source, then set the custom domain to `pangeabuy.com`.

At your DNS provider, add these A records for the apex (`@`):

- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

Optionally add `www` as a CNAME to `kumsumit.github.io` (not the repository URL). Preserve unrelated email and verification records. Remove only conflicting website records. After DNS validation and certificate provisioning, enable **Enforce HTTPS** in Pages settings.

`CNAME`, canonical metadata, social metadata, robots.txt and sitemap.xml are configured for https://pangeabuy.com/. The Stromule link points to https://stromule.com/. Manrope loads from Google Fonts with system fallbacks; all other assets are local.
