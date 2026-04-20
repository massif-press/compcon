# COMP/CON Architecture

## Table of Contents

- [Tech Stack](#tech-stack)
- [Top Level Source Layout](#top-level-source-layout)
- [Feature Modules (`src/features/`)](#feature-modules-srcfeatures)
- [State Management (Pinia)](#state-management-pinia)
- [Domain Class Hierarchy (`src/classes/`)](#domain-class-hierarchy-srcclasses)
- [Controller Pattern](#controller-pattern)
- [Data / Persistence Layer (`src/io/`)](#data--persistence-layer-srcio)
- [Cloud Sync Architecture](#cloud-sync-architecture)
- [UI Component System (`src/ui/`)](#ui-component-system-srcui)
- [Achievement System (`src/user/achievements/`)](#achievement-system-srcuserachievements)
- [Routing](#routing)
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
├── classes/ // Domain model (Pilot, Mech, NPC, Encounter)
├── features/ // Feature modules (routing, views, stores per feature)
├── ui/ // Shared component library
├── io/ // Persistence, import/export, LCP parsing, cloud APIs
├── user/ // Auth, cloud sync, achievements
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
├── SaveController // dirty tracking, soft delete, timestamps
├── CloudController // sync metadata, S3 keys, conflict resolution
├── PortraitController // image selection
├── BrewController // LCP origin tracking, missing content detection
├── LicenseController // license unlock progression, achievement events
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

Controllers are composed into domain objects (not inherited) to handle cross-cutting concerns. Each controller is instantiated in the parent's constructor and serialized independently.

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
| `encounter_archives` | Historical snapshots            |
| `npcs`               | All NPC types                   |
| `narrative`          | Characters, Factions, Locations |
| `campaigns`          | Campaign definitions            |
| `images`             | User image blobs                |
| `settings`           | App preferences                 |

### LCP (Lancer Content Pack) Flow

1. User uploads `.lcp` file (zip archive)
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

## Cloud Sync Architecture

- Auth
  - AWS Cognito (email/password)
  - optional OAuth via Patreon/Itch
- Metadata
  - DynamoDB (item metadata, sort keys, sync flags, version field)
- Blobs
  - S3 with presigned URLs for upload/download
- Concurrency
  - Locking from version field
  - conflict resolution strategies: `newest` / `local` / `cloud`
- Sync
  - Debounced batch upserts
  - exponential backoff on error

---

## UI Component System (`src/ui/`)

All components are registered globally in `src/ui/globals.ts` and prefixed `CC`.

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

- Presentational components only, logic stays in controllers/stores
- Slot based composition preferred over prop drilling
- Vuetify (v-card, v-dialog, v-menu, etc) as structural base

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

## Conventions

- No logic in Vue components
  - controllers and stores own business logic
- Controller composition
  - never inherit domain behavior, always compose controllers
- Serialize/Deserialize symmetry
  - every class that persists implements both, controllers serialize independently
- Brew tracking
  - every compendium item carries `BrewController` to detect missing LCPs
- LCP extensibility
  - all content lookups go through `CompendiumStore` getters, never direct imports
- Debounced saves
  - `SaveController` throttles writes, never write directly to Storage from components
- Achievement events
  - emit at the point of state change in the controller, not in the UI
