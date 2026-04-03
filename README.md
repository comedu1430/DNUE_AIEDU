# Graduate School Of AI Education Site

Static React + Vite site for the Daegu National University of Education Graduate School of AI Education.

## Run locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

### One-time GitHub setup

1. Push this project to a GitHub repository.
2. Open the repository on GitHub.
3. Go to `Settings -> Pages`.
4. Under `Build and deployment`, choose `GitHub Actions`.
5. Push to the `main` branch.

After that, every push to `main` will build and deploy the site automatically.

## Editing content

Right now the site content lives in `src/App.jsx`.

If you want non-developers to update text more easily later, the next recommended step is:

1. Move menus and page text into `src/content/site.json`
2. Render the site from that JSON
3. Let editors update only the content file on GitHub

## Build check

```bash
npm run build
```
