# Contributing to COMP/CON

Thank you for your interest in contributing to COMP/CON, the official digital toolset for the [LANCER TTRPG](https://massif-press.itch.io/corebook-pdf-free). This document covers everything you need to get started as a contributor.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What We're Looking For](#what-were-looking-for)
- [Before You Start](#before-you-start)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)

---

## Code of Conduct

This project follows the [Contributor Covenant v1.4](CODE_OF_CONDUCT.md).

---

## What We're Looking For

- **Bug fixes**: especially regressions, data-loss issues, and edge cases in the pilot/mech/NPC/encounter systems
- **Feature work**: tied to open issues or discussed in advance in the [Massif Press discussion board](https://github.com/orgs/massif-press/discussions)
- **UI/UX improvements**: especially accessibility and mobile usability
- **Documentation**: corrections and clarifications to ARCHITECTURE.md or inline code comments where logic is non-obvious

We are **not** currently looking for:

- **Localization** This will begin as part of a 3.1/3.2 feature push, please see the discussion board for further details
- Rewrites or large refactors not discussed with maintainers
- New dependencies

If you're unsure if something is in scope, create a discussion thread first.

---

## Before You Start

- Search [open issues](https://github.com/massif-press/compcon/issues) before starting.
- For anything beyond a targeted bug fix, create a discussion thread first.

---

## Setting Up Your Development Environment

### Prerequisites

- Node.js @ v.24+
- Yarn @ v.4+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/massif-press/compcon.git
cd compcon

# Install dependencies (this also installs Husky hooks via prepare)
yarn install
```

### Configure Commit Signing

**Commit signing is required.** The pre-commit hook will reject unsigned commits.

**SSH key (recommended):**

```bash
# Generate an Ed25519 key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Configure git to use SSH for signing
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

Add the key to your GitHub account under **Settings > SSH and GPG keys** as both an authentication key and a signing key.

**GPG key (alternative):**

```bash
# Generate a GPG key
gpg --full-generate-key

# Get the key ID
gpg --list-secret-keys --keyid-format=long

# Configure git
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true
```

### Running the App

```bash
# Start the dev server
yarn dev
```

The app will be available at `http://localhost:5173` by default.

Service workers are disabled in dev mode. To test PWA behavior, run `yarn build && yarn preview` instead.

---

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Development Workflow

### Branching

Branch from `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/my-feature-name
```

Use prefixes that match the change type:

| Prefix      | For                                        |
| ----------- | ------------------------------------------ |
| `feat/`     | New features                               |
| `fix/`      | Bug fixes                                  |
| `refactor/` | Code restructuring without behavior change |
| `docs/`     | Documentation                              |
| `chore/`    | Tooling, dependencies, config              |

### Pre-Commit Hooks

Husky runs automatically on every commit:

1. **lint-staged** — ESLint autofix and Prettier are applied
2. **Commit signature check** — rejects the commit if signing is not configured

Do not bypass hooks with `--no-verify` except in emergencies (e.g., fixup commits in an active rebase). If a hook blocks you unexpectedly, diagnose and fix the underlying issue.

### Testing Your Changes

There is no automated test suite at this time. Before submitting a PR you are expected to manually verify:

- The specific behavior you changed or added works as intended
- Adjacent functionality is still intact
- No new typescript errors (`yarn typecheck`)
- No new lint errors (`yarn lint:check`)
- The build succeeds (`yarn build`)

If your change touches the UI, include screenshots in your PR.

---

## Coding Standards

- All new code must be typescript. Try to avoid `any` — the linter is set at warn, and future work will upgrade this to an error.
- **New components use the Composition API** (`<script setup lang="ts">`). Do not introduce new Options API components.
- Existing Options API components may be migrated to Composition API as part of related feature work, but not as standalone PRs.
- **Do not add new `dependencies` or `devDependencies` without first discussing it**

### Formatting

Configured in `.prettierrc` and `eslint.config.mjs`

Run `yarn format && yarn lint` before committing if you want to avoid unexpected changes.

---

## Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

| Type       | Usage                                                   |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new user-facing feature                               |
| `fix`      | A bug fix                                               |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs`     | Documentation changes only                              |
| `chore`    | Maintenance, tooling, dependency updates                |
| `build`    | Changes to the build system or external dependencies    |
| `ci`       | Changes to CI/CD configuration                          |

---

## Submitting a Pull Request

- Push your branch to your fork or the upstream repo (if you have access).
- Open a PR against `dev` (or the branch specified in the active milestone).
- Fill out the PR template.
- Link the relevant issue using `Closes #<number>`.
- Add screenshots for UI changes.

## Reporting Bugs

Use the [Bug Report](https://github.com/massif-press/compcon/issues/new?template=bug_report.yml) issue template.

Include:

- COMP/CON version
- Browser and version
- Affected area (Pilot, Compendium, Encounter, NPC Builder, Active Mode, Content Packs, Cloud Sync)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or console errors if relevant

> **Data loss bugs are high priority.** If you've found a way to corrupt or lose pilot/encounter data, report it immediately and mention it in the title.

## Help

[Massif Press Discussion Board](https://github.com/orgs/massif-press/discussions)
[LANCER Discord](https://discord.gg/rwcpzsU)

---

_COMP/CON is released under the [GNU General Public License v3](LICENSE)._
