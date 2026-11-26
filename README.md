# Renovators

React application built with Vite and standard CSS.

## Development

```sh
npm install
npm run dev
```

Run `npm run build` to create a production build.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` builds and deploys the site
when changes are pushed to `main` or `master`. In the repository settings,
select **Settings → Pages → Build and deployment → GitHub Actions**. Vite
automatically uses the repository subpath for project Pages and `/` for a
`username.github.io` site. You can also run the workflow manually from the
Actions tab.

## Source structure

- `src/components/` - reusable React components
- `src/config/` - application configuration
- `src/assets/` - static assets
- `src/styles/` - modular stylesheets, imported in `src/main.jsx`

Update company details in `src/config/builderConfig.js`; the header, hero,
footer, and page title use this configuration.
The footer's service areas, section labels, quick links, and estimate CTA are
also configured there.

Editable pricing data lives in `src/config/pricingConfig.js` and is exposed as
`builderConfig.pricing`. It includes the GBP pricing matrix, project size bounds
and defaults, timeline formula and spread, and price range spread.
Review these assumptions against current project costs before using them as
customer quotes.

The portfolio entries are clearly marked demo samples and use original local
SVG illustrations; replace them with verified project details and photos
before publishing as completed work.

Set `leadSubmission.endpoint` in `src/config/builderConfig.js` to a JSON webhook
URL before accepting consultation requests. The optional `accessKey` is sent
with the JSON payload for services such as Web3Forms. The form shows an
explicit configuration error while the endpoint is empty; it does not store or
send submissions elsewhere.

## Theme

The four core color values are `--color-primary`, `--color-accent`,
`--color-surface`, and `--color-background` in `src/styles/variables.css`.
Update those values to rebrand the UI; derived shades, typography, radius, and
spacing tokens are defined alongside them.
