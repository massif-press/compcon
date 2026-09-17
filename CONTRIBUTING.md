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
  - [Lancer Rules Testing](#lancer-rules-testing)
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

### Adding a test for a domain class

1. Create `Foo.spec.ts` next to `Foo.ts`.
2. Build inputs with a factory from `src/__tests__/factories`.
3. If the class has `Serialize`/`Deserialize`, add a round-trip from `src/__tests__/roundtrip.ts` first.
4. A bug fix requires one test that fails without the fix. This is mandatory and bugfix PRs without these tests will not be accepted.

### Adding a test for a component

Component specs belong in the `component` project, which loads Vuetify, i18n, and the global component registry for you. Mount the component and query it the way a user or a screen reader would: `w.get('[role="checkbox"]')`, not a CSS class. If the behavior is in a composable, test the composable directly.

### Conventions

- `.spec.ts` only, never `.test.ts`.
- Colocated next to the file under test. Only `src/__tests__/` holds shared setup, fixtures, and factories.
- Two Vitest projects: `domain` (Pinia setup only) and `component` (Vuetify, i18n, global component registry). Domain tests **must not** import UI.

### Lancer Rules Testing

** Rules testing is currently only implemented for Active Mode. **

Every Lancer combat rule the app implements has an id like `T-ACTION-brace-01`, a short statement, and at least one test named after it. Builds fail if a rule loses its test or a test names a rule that does not exist.

```bash
npx vitest run src/__tests__/rules/   # the rule suite only
npx vitest run                        # everything
npx vue-tsc --noEmit                  # types
```

---

### Tested Rules Table

**[`src/__tests__/rules/LANCER-RULES.md`](src/__tests__/rules/LANCER-RULES.md)**

This document contains every implemented rule, by category, with its canonical statement, classification, and the spec file that covers it. Also lists where in the codebase the file is located.

That file is generated and CI-enforced. After adding or renaming a rule:

```bash
yarn rules:table
yarn rules:check
```

Then re-commit.

Do not edit it by hand. `scripts/gen-rules-table.mjs` reads `src/tests/lancer-rules.json` and the test names themselves, so it also fails the build if a rule has no test at all.

---

### Adding a Rule

#### Naming

Rule names take the form

```
T-CATEGORY-name-number
```

The `T-` prefix marks a testable rule (this is to make potential future expansion of this system easier to manage)

`CATEGORY` is selected from the list below, and is used to reference what spec file holds the test(s). Always UPPERCASE.

`name` is the name of the rule, unique per category. Always lowercase.

`number` is used for testing variants of the same rule, but must be included in all cases. Starts at 01.

Test statements must begin with the id and a colon, then say what is asserted:

```ts
it('T-ACTION-brace-01: bracing grants resistance to the triggering attack', () => {
  // ...
})
```

The build process enforces this. A test in `src/__tests__/rules/` without a rule-id prefix fails `coverage.spec.ts`, as does an id that no rule declares.

The title and statement should be written about the game, not about the code. `bracing grants resistance to the triggering attack` instead of `ApplyBraceEffects sets BraceGranted`.

#### Categories

| Category | Covers                                  | Spec file             |
| -------- | --------------------------------------- | --------------------- |
| `TURN`   | turn order, rounds, end-of-turn timing  | `actions`, `statuses` |
| `ACTION` | the action pool, and every named action | `actions`             |
| `ATTACK` | attack rolls, accuracy and difficulty   | `damage`              |
| `DMG`    | damage calculation, application, types  | `damage`              |
| `RANGE`  | range, threat, area patterns            | `actors`              |
| `HEAT`   | heat, heat cap, the danger zone         | `damage`              |
| `STRESS` | the overheat chart                      | `structure`           |
| `STRUCT` | the structure chart                     | `structure`           |
| `REPAIR` | repairs, rest, full repair              | `actions`, `actors`   |
| `STATUS` | statuses and conditions                 | `statuses`            |
| `TAG`    | equipment tags                          | `tags`, `actions`     |
| `STAT`   | statistics and their derivation         | `actors`              |
| `ACTOR`  | pilots, mounting, unlicensed mechs      | `actors`              |
| `NPC`    | anything NPCs do differently            | `actors`              |
| `MOVE`   | movement and cover                      | `actions`             |

A rule about a status that an action applies is `STATUS` if it is about the status's ongoing effect, `ACTION` if it is about taking the action. HIDE is `T-ACTION-hide-01`; being HIDDEN is `T-STATUS-hidden-01`.

A rule that is \*only different for NPCs\*\* is `NPC`. A rule that applies to everyone including NPCs is not.

#### Classification

`AUTO` if the app can automate or enforce the whole rule.

`ASSIST` if part of it needs a user. In practice, this is anything requiring position, line of sight, or GM adjudication.

An `ASSIST` rule must state what part of the rule is automated and what part is player- or GM-managed. Use `**App:**` and `**User:**` to render the markdown correctly.

```
**App:** charge the full action and clear ENGAGED. **User:** moves the character.
```

#### Procedure

1. **Find the rule in a source and quote it.** Errata per [[https://lancer-faq.netlify.app/]] should take precedence over the core book.
2. **Add the statement** to `src/__tests__/rules/lancer-rules.json`.
3. **Write the test** in the spec file its category maps to.
4. **Run it and watch it fail.**
5. **Implement it** in `src/classes/components/combat/`.
6. **Watch the test pass.**
7. **Regenerate and check**

Skipping `yarn rules:table` fails CI even if everything else is right.

#### Writing the Test

Helpers are in `src/__tests__/rules/_helpers.ts` and contain the entire testing toolkit:

- `mech()`, `pilot()`, `npc()` build actors
- `cur`/`max`/`set`/`setMax` read and write stats
- `rolls(n)` and `rollSeq(...)` set dice rolls

Nothing else should be needed. If a test wants more scaffolding than this, it's probably asserting the mechanism instead of the Lancer rule. If you can confirm missing scaffolding, open a ticket for discussion.

Additionally, most rules have a case where they must _not_ fire and should also be tested. eg. `StandUp` while IMMOBILIZED, HIDE while ENGAGED, an activation with no actions left.

##### Example Test

```ts
it('T-STATUS-prone-01: standing up costs the standard move', () => {
  cc().AddStatus('prone')

  expect(cc().StandUp()).toBe(true)

  expect(cc().HasStatus('prone')).toBe(false)
  expect(cc().CanActivate('move')).toBe(false)
})
```

#### Interaction Rules

A second, smaller set of ids uses the `T-INT-` prefix and covers cases where two rules meet - a chart status expiring across a round boundary, overcharge heat triggering an overheat check in the same step, a stunned mech losing an already-granted overcharge. Each declares which canonical rules it composes, and C/C checks that those exist.

These must be hand authored. Add an interaction rule when a bug could only appear at the interaction between two rules that are each individually correct.

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

## Commit Types

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
