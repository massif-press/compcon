# COMP/CON Architecture

## Table of Contents

- [Tech Stack](#tech-stack)
- [Top Level Source Layout](#top-level-source-layout)
- [Feature Modules (`src/features/`)](#feature-modules-srcfeatures)
- [State Management (Pinia)](#state-management-pinia)
- [Domain Class Hierarchy (`src/classes/`)](#domain-class-hierarchy-srcclasses)
- [Controller Pattern](#controller-pattern)
- [Data / Persistence Layer (`src/io/`)](#data--persistence-layer-srcio)
- [UI Component System (`src/ui/`)](#ui-component-system-srcui)
- [Provide/Inject Contexts](#provideinject-contexts)
- [Composables](#composables)
- [Achievement System (`src/user/achievements/`)](#achievement-system-srcuserachievements)
- [Routing](#routing)
- [Build, CI, and Type Safety](#build-ci-and-type-safety)
- [Conventions](#conventions)

## Tech Stack

| Layer           | Technology                 |
| --------------- | -------------------------- |
| Framework       | Vue 3.5 + TypeScript 5.9   |
| Build           | Vite 6.4                   |
| UI Library      | Vuetify 3.12               |
| State           | Pinia 3.0                  |
| Routing         | Vue Router 4.6             |
| Storage         | localforage (IndexedDB)    |
| Auth / Cloud    | AWS Amplify 6 / Cognito    |
| Game Data       | @massif/lancer-data        |
| LCP Parsing     | JSZip                      |
| Rich Text       | Quill via @vueup/vue-quill |
| Error Reporting | Sentry (opt-in)            |
| Markdown        | Marked + DOMPurify         |
| Expression Eval | expr-eval                  |

---

## Top Level Source Layout

```ts
src
├── classes // Domain model (Pilot, Mech, NPC, Encounter)
├── features // Feature modules (routing, views, stores per feature)
├── ui // Shared component library
├── io // Persistence, import/export, LCP parsing, cloud APIs
├── user // Auth, cloud sync, achievements
├── stores.ts // Central store registry (re-exports all Pinia stores)
├── router.ts // Vue Router config (hash mode, feature route registration)
└── main.ts // App entry point, Amplify init, Vue app bootstrap
```

---

## Feature Modules (`src/features/`)

Each feature is a self-contained module with its own views, routes, and Pinia store.

| Feature            | Path                  | Responsibility                                                                                |
| ------------------ | --------------------- | --------------------------------------------------------------------------------------------- |
| `pilot_management` | `/pilot_management`   | Pilot creation wizard, roster, character sheet, mech builder, print layouts                   |
| `gm`               | `/gm`                 | NPC roster (Units/Doodads/Eidolons), encounter builder, campaign editor, narrative collection |
| `compendium`       | `/compendium`, `/srd` | Game content browser, SRD reference pages, LCP pack management                                |
| `active_mode`      | `/active-mode`        | Combat runner (PC active sheet + GM encounter panel)                                          |
| `nav`              | `/nav`                | Global search, settings, options, credits, extra content                                      |
| `main_menu`        | `/`                   | Landing page, login/signup, recent items, share code import                                   |

---

## State Management (Pinia)

All stores are registered and re-exported from `src/stores.ts`.

### NavStore (defined in stores.ts)

- Navigation state: SRD tab, language
- Global search index (`IndexItem[]`) built from all other stores + route metadata
- Search history (persisted to localStorage)
- `CreateIndex()` aggregates index entries from all stores
- `addToIndex()` push new items (e.g. after LCP load)

### CompendiumStore

- Loaded content packs (`ContentPack[]`)
- Typed getters for every item kind (Frames, MechWeapons, Talents, NpcClasses, etc.)
- Merges `@massif/lancer-data` base content with installed LCPs
- `itemIndexes` getter for global search

### PilotStore

- All pilots, pilot groups, active pilot sheet state
- CRUD actions (create, load, delete, duplicate)
- `pilotIndexes`, `mechIndexes` for global search

### NpcStore

- Units, Doodads, Eidolons + folder hierarchy
- `unitIndexes`, `doodadIndexes`, `eidolonIndexes`
- Domain-specific EncounterStore / NarrativeStore / CampaignStore

### UserStore (`src/user/store/`)

- Cognito auth state (tokens, profile)
- Cloud sync queue + auto-sync
- Settings/preferences
- Achievements state

---

## Domain Class Hierarchy (`src/classes/`)

### Pilot

```ts
Pilot
├── SaveController
├── CloudController
├── PortraitController
├── BrewController
├── LicenseController
├── SkillsController
├── TalentsController
├── CoreBonusController
├── ReservesController
├── MechSkillsController
├── BondController
├── PilotLoadoutController
└── Mechs: Mech[]
```

### Mech

```md
Mech
├── Frame (reference to CompendiumItem)
└── MechLoadoutController
├── Mounts[]
│ ├── WeaponSlots[]
│ │ └── MechWeapon
│ │ └── WeaponMod[]
│ └── MechSystems[]
└── Loadout state
```

### NPC

```md
Npc (abstract)
├── Unit NpcClass + tier + NpcFeature[]
├── Doodad
└── Eidolon/EidolonLayer[]
```

---

## Controller Pattern

Controllers are composed into domain objects. Each controller is instantiated in the parent's constructor and serialized independently.

```ts
// Serialization delegates to controllers
Pilot.Serialize() → {
  save: SaveController.Serialize(),
  cloud: CloudController.Serialize(),
  licenses: LicenseController.Serialize(),
  // ...
}

// Deserialization reconstructs each controller
static Deserialize(data) {
  LicenseController.Deserialize(parent, data)
  // ...
}
```

---

## Data / Persistence Layer (`src/io/`)

### Storage

localforage (IndexedDB) with named stores:

| Store                | Contents                        |
| -------------------- | ------------------------------- |
| `pilots`             | Serialized pilot save data      |
| `pilot_groups`       | Pilot group/folder structure    |
| `pilot_sheets`       | Active mode pilot state         |
| `content`            | Installed LCP metadata          |
| `encounters`         | Encounter templates             |
| `active_encounters`  | Running encounter state         |
| `encounter_archives` | Completed encounter data        |
| `npcs`               | All NPC types                   |
| `narrative`          | Characters, Factions, Locations |
| `campaigns`          | Campaign data                   |
| `settings`           | App preferences                 |

### LCP (Lancer Content Pack) Flow

1. User uploads `.lcp` file (renamed zero-depth zip archive)
2. `ContentPackParser` decompresses with JSZip, validates `lcp_manifest.json`, reads typed JSON files
3. `ContentPack` class hydrates raw JSON into typed class instances
4. `CompendiumStore` merges new pack into active content, all getters update reactively
5. `NavStore.addToIndex()` receives new items for global search

### Startup Sequence (`src/io/Startup.ts`)

1. `Storage.Initialize()`
2. `UserStore.loadUser()` (auth from Cognito/localStorage)
3. `CompendiumStore.refreshExtraContent()` (load installed LCPs)
4. Parallel: load Pilots, NPCs, Encounters, Campaigns, Narratives
5. `NavStore.CreateIndex()`
6. If authenticated: AutoSync, AutoBackup, Patreon check, LCP subscriptions

### Save Flow

1. Vue component mutates reactive state on a domain object
2. `SaveController.save()` is called (debounced ~1500ms)
3. `Pilot.Serialize()` produces a plain JS object (JSON safe)
4. `Storage.SetItem('pilots', data)` writes to IndexedDB
5. If cloud-enabled, `UserStore` queues for sync

---

## UI Component System (`src/ui/`)

`src/ui/` is a reusable component library. Most components are registered globally in
`src/ui/globals.ts` and prefixed `CC` (used in templates via kebab tags without local imports);
others are imported directly where used.

Components under `src/ui/` must not import feature stores. This is enforced by a `no-restricted-imports`
rule in `eslint.config.mjs` that forbids both `@/stores` and direct feature-store barrels (`@/features/*/store`)
anywhere under `src/ui/`. A ui component gets the data it needs in one of two ways:

- **Props:** for leaf components whose callers are feature components, the caller passes the
  derived, typed value down.
- **Inject:** for globally-registered or deeply-nested components, where threading props through
  every usage site is infeasible. See Provide/Inject Contexts below.

> Note for isolated mounts: because some ui components `inject` and throw if the provider is
> absent, any standalone mount must supply the injection keys. Under the normal single-mount
> SPA this is always satisfied by `App.vue`.

### Categories

| Category     | Examples                                                          |
| ------------ | ----------------------------------------------------------------- |
| Buttons      | `CCCheckbox`, `CCBtn`                                             |
| Cards        | `CCItemCard`, `CCItemChip`, `CCDenseCard`, frame/NPC/talent cards |
| Panels       | `CCLoadoutPanel`, `CCCoreSystemPanel`, `CCMechLoadout`            |
| Modals       | `CCDialog`, `CCModal`, `CCSoloDialog`, `CCSoloModal`              |
| Inputs       | `CCSelect`, `CCTickbar`                                           |
| Chips        | `EffectApplicator`, damage/tag/synergy chips                      |
| Items        | `CCOrgItem`, `CCReserveItem`, `CCTraitItem`, `CCPilotLicenseItem` |
| Headings     | `CCTitle`                                                         |
| Talent       | `CCTalentEmblem`, `CCTalentFull`, `CCTalentRankView`              |
| Notification | `CCNotify` (toast system)                                         |

### Design Principles

- UI components only, logic stays in controllers/stores
- Slot based composition preferred over prop drilling
- Vuetify (v-card, v-dialog, v-menu, etc) as structural base
- `src/ui/` never imports feature stores (see Store isolation above)

---

## Provide/Inject Contexts

There are two app-level provide/inject seams. Both exist so that `src/ui/` and the deep
encounter subtree can read shared state without store reach-in or multi-level prop drilling.
Injected values are reactive: providers expose `computed` or getter-backed values, so the
getter runs inside each consumer's reactive scope.

### UI data providers (`src/ui/providers.ts`)

Decouples the ui library from the stores. Declares two typed interfaces and their injectors:

- `CompendiumDataProvider` / `useCompendiumData()`: statuses, frames, NPC classes, content
  packs, item lookups, reference links.
- `UserDataProvider` / `useUserData()`: the user profile, login state, cloud images and
  storage, `downloadLcp`, `refreshDbData`.

`App.vue` (the single `createApp` root) provides the store-backed implementations once. The
interfaces are typed against `@/classes` domain types (allowed), never against `@/stores`.

### Encounter runner context (`src/features/.../EncounterPanels/encounterContext.ts`)

A subtree-scoped context for active mode. Each top-level actor panel
(Mech/Unit/Pc/Pilot/Eidolon/Doodad/Deployable/Placeholder) `provide`s an
`EncounterRunnerContext` (`owner: Ref<CombatantData>`, `encounterInstance: Ref<EncounterInstance>`)
via `useEncounterContext()`. The loadout, action, and attack-button tree injects these
instead of receiving them through 4 or more levels of pass-through props. Components rendered
directly by the runner pages (outside any panel) keep explicit props.

## Composables

Component logic is decomposed into composables (`useX.ts`) rather than larger single-file
components, following single-responsibility. Examples from the compendium browser and account
data viewer: `useCompendiumFacets` (multi-axis grouping and facet index), `useCompendiumViewState`
(per-view UI state persistence), `useItemTransfer` and `useItemDeleteLifecycle` (cloud
transfer and delete orchestration). Responsive breakpoints use Vuetify's `useDisplay()`
directly.

---

## Achievement System (`src/user/achievements/`)

- `achievementsDict.json` achievement definitions (encrypted in prod)
- `eventParameterMap.json` maps game events to achievement checks
- `AchievementEventSystem` event emitter used throughout domain classes
- `AchievementManager` singleton. Listens to events, tracks unlock state, syncs to cloud
- Pattern: `AchievementEventSystem.emit('event_name', value)` manager checks thresholds, unlocks if met

---

## Routing

Hash mode SPA routing (`#/path`).

Each feature exports its own route definitions, `router.ts` composes them.

Routes that should appear in global search declare a `searchData` meta property:

```ts
{
  path: 'my-page',
  component: MyPage,
  searchData: { title: 'My Page Title', icon: 'mdi-icon' }
}
```

`NavStore.CreateIndex()` picks these up automatically.

---

## Build, CI, and Type Safety

- **Build:** `npm run build` runs `vue-tsc --noEmit` then `vite build`. `vite build` (also
  `build-nocheck`) compiles via esbuild and is independent of the `vue-tsc` result.
- **CI:** `.github/workflows/ci.yml` runs on push/PR to `master` and `dev`. The hard gate is
  `build-nocheck`. Type-check, lint, `npm audit`, and a bundle size report do not fail the build yet.
- **Type safety:** `tsconfig` has `strict: true` but `noImplicitAny: false`. There is a
  continuing effort to type domain props and remove `any`/`object`.

---

## Conventions

### No logic in Vue components

Controllers and stores own business logic

### Controller composition

Never inherit domain behavior, always compose controllers

### Serialize/Deserialize symmetry

Every class that persists implements both, controllers serialize independently

### Brew tracking

Every compendium item carries `BrewController` to detect missing LCPs

### LCP extensibility

All content lookups go through `CompendiumStore` getters, never direct imports

### Debounced saves

`SaveController` throttles writes, never write directly to Storage from components

### Achievement events

Emit at the point of state change in the controller, not in the UI

### Store isolation

`src/ui/` never imports feature stores, it receives data via props or the typed providers
in `src/ui/providers.ts` (enforced by a lint rule)

### Subtree context over prop drilling

For a cohesive subtree (for example the encounter panels), provide a typed context with a
Symbol key rather than threading the same props through many levels

### Logging

Use the central logger (`@/user/logger`) with context, never raw `console.*` in runtime
code; surface user-facing failures through the notification system, never swallow errors
silently
