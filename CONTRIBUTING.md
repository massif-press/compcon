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
- [Testing](#testing)
- [Coding Standards](#coding-standards)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)

---

## Code of Conduct

This project follows the [Contributor Covenant v1.4](CODE_OF_CONDUCT.md).

---

## What We're Looking For

- **Bug fixes** especially regressions, data-loss issues, and edge cases in the pilot/mech/NPC/encounter systems
- **Feature work** tied to open issues or discussed in advance in the [Massif Press discussion board](https://github.com/orgs/massif-press/discussions)
- **UI/UX improvements** especially accessibility and mobile usability
- **Documentation** repo wiki contributions

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

Before submitting a PR you are expected to verify:

- `yarn test` passes (see [Testing](#testing))
- The specific behavior you changed or added works as intended
- Adjacent functionality is still intact
- No new typescript errors (`yarn typecheck`)
- No new lint errors (`yarn lint:check`)
- The build succeeds (`yarn build`)

If your change touches the UI, include screenshots in your PR.

---

## Testing

`yarn test` (watch) or `yarn test:run` (once). `yarn test:coverage` adds the coverage report.

### Finding something to test

`yarn test:ledger --missing` lists every module that has a `Serialize`/`Deserialize` pair or exported functions and no colocated spec, grouped by directory. Drop `--missing` for the full picture with totals. That list, not a coverage percentage, is what "covered" means here.

### Adding a test for a domain class

1. Create `Foo.spec.ts` next to `Foo.ts`.
2. Build inputs with a factory from `src/__tests__/factories`.
3. If the class has `Serialize`/`Deserialize`, add a round-trip from `src/__tests__/roundtrip.ts` first. That one line is often the whole test file.
   - `assertDataRoundTrip(arb, Serialize, Deserialize)` for a leaf type. The arbitrary generates the **data interface** (`IRangeData`), not the class, so the constructor's coercions are part of what gets tested. `src/classes/Range.spec.ts` is the model.
   - `assertFixtureRoundTrip(data, Serialize, Deserialize)` for an aggregate root (`Pilot`, `Unit`, `Encounter`), where writing a generator that produces a valid object costs more than it catches.
4. `yarn test Foo` to run just that file in watch mode.
5. A bug fix requires one test that fails without the fix. This is mandatory and bugfix PRs without these tests will not be accepted.

### Adding a test for a component

Component specs live in the `component` project, which loads Vuetify, i18n, and the global component registry for you. Mount the component and query it the way a user or a screen reader would: `w.get('[role="checkbox"]')`, not a CSS class. `src/ui/components/buttons/CCCheckbox.spec.ts` is the model. If the behavior lives in a composable, test the composable directly instead: `src/ui/components/inputs/tickbar/useTickbar.spec.ts`.

### Conventions

- `.spec.ts` only, never `.test.ts`.
- Colocated next to the file under test. Only `src/__tests__/` holds shared setup, fixtures, and factories.
- Two Vitest projects: `domain` (Pinia setup only) and `component` (Vuetify, i18n, global component registry). Domain tests **must not** import UI.

### Mutation testing

`yarn test:mutation` runs StrykerJS over the files that have a spec, reporting how many of its injected bugs the tests actually catch. A passing test that asserts nothing scores zero here. It is slow (tens of seconds per file), so it is **never** part of a PR gate: it runs nightly and on demand, and the report lands as a workflow artifact. Target is 75-85%.

Worth running locally on one file after writing a spec: `yarn test:mutation:file src/classes/Foo.ts`.

---

## Coding Standards

- All new code must be typescript. Try to avoid `any`. The linter is set at warn, and in the future will be updated to an error.
- **New components use the Composition API** (`<script setup lang="ts">`). Do not introduce new Options API components.
- Existing Options API components may be migrated to Composition API as part of related feature work, but not as standalone PRs.
- **Do not add new `dependencies` or `devDependencies` without first discussing it**

### Formatting

Configured in `.prettierrc` and `eslint.config.mjs`

Run `yarn format && yarn lint` before committing if you want to avoid unexpected changes.

---

### Commit Types

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
- If this PR fixes a bug, it must include a test that fails against the target branch.

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
