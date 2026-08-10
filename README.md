# Astro Demo

An Astro static demo designed for deployment to GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The site is configured for the repository URL:

`https://andywu1998.github.io/astro_demo/`

## Private assistant page

The `/private/` page reuses the personal assistant data envelope and decrypts it
in the browser with the passphrase. The encrypted JSON is public, but the
passphrase is never stored in this repository.

To refresh the encrypted data from the personal assistant workspace:

```bash
npm run sync:private
```
