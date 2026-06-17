# COMP/CON

[![Netlify Status](https://api.netlify.com/api/v1/badges/8c8ba126-8074-4a99-98f9-9b0529107214/deploy-status)](https://app.netlify.com/projects/compcon/deploys)
![Discord](https://img.shields.io/discord/426286410496999425)

[![Translation status](https://hosted.weblate.org/widget/compcon/open-graph.png)](https://hosted.weblate.org/engage/compcon/)
Localization tooling and hosting has been generously provided by [Weblate](https://weblate.org)'s under their Libre plan.

![GitHub last commit](https://img.shields.io/github/last-commit/massif-press%2Fcompcon/master)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/massif-press/compcon)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-closed/massif-press/compcon)

COMP/CON is the official digital companion for the [LANCER](https://massif-press.itch.io/lancer-core-book) tabletop role playing game. It provides a full suite of tools for players and game masters, from building and managing pilots and mechs to running combat encounters and campaigns.

[**Launch App**](https://compcon.app) · [**Report a Bug**](https://github.com/massif-press/compcon/issues) · [**Join the Discord**](https://discord.gg/rwcpzsU) · [**Contributing Guide**](CONTRIBUTING.md)

---

## Getting Started

### Prerequisites

- Node.js `>= 24`
- Yarn `>= 4`
- Git with commit signing configured (SSH or GPG - enforced by pre-commit hook)

### Install

```bash
git clone https://github.com/massif-press/compcon.git
cd compcon
yarn install
```

### Run

```bash
yarn dev
```

The dev server is at `http://localhost:5173`. Service workers are disabled in development. To test PWA behavior:

```bash
yarn build && yarn preview
```

### Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `yarn dev`           | Start development server                 |
| `yarn build`         | Type-check and build for production      |
| `yarn build-nocheck` | Build without TypeScript validation      |
| `yarn preview`       | Preview the production build locally     |
| `yarn lint`          | Run ESLint with auto-fix                 |
| `yarn lint:check`    | Check linting without modifying files    |
| `yarn format`        | Format code with Prettier                |
| `yarn format:check`  | Check formatting without modifying files |
| `yarn typecheck`     | Run `vue-tsc` without emitting output    |

---

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed breakdown of the domain model, controller pattern, state management, cloud sync, and UI conventions.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request - it covers branching conventions, commit format, code standards, and what kinds of PRs are in scope.

---

## License

COMP/CON is free software released under the [GNU General Public License v3.0](LICENSE). You are free to run, study, modify, and distribute it - derivative works must also be licensed under the GPLv3.

---

_LANCER is published by [Massif Press](https://massif-press.itch.io/)._
