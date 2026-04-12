# COMP/CON

[![Netlify Status](https://api.netlify.com/api/v1/badges/8c8ba126-8074-4a99-98f9-9b0529107214/deploy-status)](https://app.netlify.com/projects/compcon/deploys)
![Discord](https://img.shields.io/discord/426286410496999425)

![GitHub last commit](https://img.shields.io/github/last-commit/massif-press%2Fcompcon/master)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/massif-press/compcon)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-closed/massif-press/compcon)

COMP/CON is the official digital companion for the [LANCER](https://massif-press.itch.io/lancer-core-book) tabletop role playing game. It provides a full suite of tools for players and game masters, from building and managing pilots and mechs to running combat encounters and campaigns.

[**Launch App**](https://compcon.app) · [**Report a Bug**](https://github.com/massif-press/compcon/issues) · [**Join the Discord**](https://discord.gg/rwcpzsU) · [**Contributing Guide**](CONTRIBUTING.md)

---

## Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Framework        | Vue 3                   |
| Language         | TypeScript              |
| Build Tool       | Vite                    |
| UI Library       | Vuetify 3               |
| State Management | Pinia                   |
| Routing          | Vue Router 4            |
| Local Storage    | localforage (IndexedDB) |
| Cloud / Auth     | AWS / AWS Cognito       |
| Game Data        | @massif/lancer-data     |
| PWA              | vite-plugin-pwa         |

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

```
compcon/
├── src/
│   ├── classes/          # Domain model - Pilot, Mech, NPC, Encounter, Campaign
│   │   ├── pilot/        # Pilot class and controller hierarchy
│   │   ├── mech/         # Mech, loadout, and frame management
│   │   ├── npc/          # Unit, Doodad, Eidolon definitions
│   │   ├── encounter/    # Encounter and active combat state
│   │   └── campaign/     # Campaign, narratives, and world data
│   ├── features/         # Feature modules (views, routes, stores)
│   │   ├── pilot_management/
│   │   ├── gm/
│   │   ├── compendium/
│   │   ├── active_mode/
│   │   └── nav/
│   ├── ui/               # Shared component library (CC* prefix)
│   ├── io/               # Data persistence, storage, cloud APIs
│   ├── user/             # Auth, cloud sync, achievements
│   ├── router.ts
│   ├── stores.ts
│   └── main.ts
├── public/               # Static assets
├── ARCHITECTURE.md       # Technical architecture reference
├── CONTRIBUTING.md       # Contribution guide
└── CODE_OF_CONDUCT.md
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed breakdown of the domain model, controller pattern, state management, cloud sync, and UI conventions.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request - it covers branching conventions, commit format, code standards, and what kinds of PRs are in scope.

For larger features or architectural changes, open a discussion first before writing code.

- All commits must be signed (SSH Ed25519 or GPG)
- Follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, etc.)
- No new dependencies without maintainer discussion

**Contact:** `compcon@massifpress.com` / Discord: Beeftime

---

## License

COMP/CON is free software released under the [GNU General Public License v3.0](LICENSE). You are free to run, study, modify, and distribute it - derivative works must also be licensed under the GPLv3.

---

_LANCER is published by [Massif Press](https://massif-press.itch.io/)._
