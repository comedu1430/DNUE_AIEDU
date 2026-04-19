# DNUE AI Education Homepage

This repository is for the Daegu National University of Education Graduate School of AI Education website.

## Project Scope

- Main website: Vite + React in `src/`.
- Static assets: `public/`.
- Notion CMS sync scripts: `scripts/`.
- GitHub Pages deployment: `.github/workflows/deploy-pages.yml`.

## Common Commands

```bash
npm run dev
npm run build
npm run notion:sync
npm run notion:seed
```

## Notion CMS

Managed in Notion:

- PhD student CV data
- Publications

The GitHub Pages workflow syncs Notion content before building the site.

## Important Boundaries

- Robot-related code is not part of this repository anymore.
- Robot work has been separated into `/Users/almond/Documents/Robot_Agent_Web`.
- Do not add `robot-agent-frontend`, `robot-agent-backend`, `microbit-agent`, `servo-bridge.mjs`, or `servo-helper.py` back into this project.

## How To Tell Codex In A New Thread

For DNUE homepage work:

```text
이번 작업은 DNUE 홈페이지 저장소에서 해줘.
경로는 /Users/almond/Documents/Playground 이야.
AGENTS.md를 먼저 읽고 진행해줘.
```

For robot-related work:

```text
이번 작업은 로봇 웹페이지 저장소에서 해줘.
경로는 /Users/almond/Documents/Robot_Agent_Web 이야.
AGENTS.md를 먼저 읽고 진행해줘.
```
