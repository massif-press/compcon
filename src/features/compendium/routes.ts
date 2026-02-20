const Main = () => import('./index.vue')

const Compendium = () => import('./Views/Compendium/index.vue')
const CompendiumSearch = () => import('./Views/Compendium/SearchResults.vue')
const Licenses = () => import('./Views/Compendium/Licenses.vue')
const Manufacturers = () => import('./Views/Compendium/Manufacturers.vue')
const Frames = () => import('./Views/Compendium/Frames.vue')
const Weapons = () => import('./Views/Compendium/Weapons.vue')
const Systems = () => import('./Views/Compendium/Systems.vue')
const PilotGear = () => import('./Views/Compendium/PilotGear.vue')
const Skills = () => import('./Views/Compendium/Skills.vue')
const NpcClasses = () => import('./Views/Compendium/NpcClasses.vue')
const NpcFeatures = () => import('./Views/Compendium/NpcFeatures.vue')
const NpcTemplates = () => import('./Views/Compendium/NpcTemplates.vue')
const Statuses = () => import('./Views/Compendium/Statuses.vue')
const Tags = () => import('./Views/Compendium/Tags.vue')
const CoreBonuses = () => import('./Views/Compendium/CoreBonuses.vue')
const Talents = () => import('./Views/Compendium/Talents.vue')
const Backgrounds = () => import('./Views/Compendium/Backgrounds.vue')
const Reserves = () => import('./Views/Compendium/Reserves.vue')
const DowntimeActions = () => import('./Views/Compendium/DowntimeActions.vue')
const Bonds = () => import('./Views/Compendium/Bonds.vue')
const Environments = () => import('./Views/Compendium/Environments.vue')
const Sitreps = () => import('./Views/Compendium/Sitreps.vue')
const Tables = () => import('./Views/Compendium/Tables.vue')

const Reference = () => import('./Views/Reference/index.vue')
const ReferenceSearch = () => import('./Views/Reference/SearchResults.vue')
const Basics = () => import('./Views/Reference/Basics.vue')
const Compcon = () => import('./Views/Reference/Compcon.vue')
const ReferenceIndex = () => import('./Views/Reference/Reference.vue')
const Pilots = () => import('./Views/Reference/Pilots.vue')
const Mechs = () => import('./Views/Reference/Mechs.vue')
const Combat = () => import('./Views/Reference/Combat.vue')
const Narrative = () => import('./Views/Reference/Narrative.vue')
const Errata = () => import('./Views/Reference/Errata.vue')
const Glossary = () => import('./Views/Reference/Glossary.vue')
const EidolonLayers = () => import('./Views/Compendium/EidolonLayers.vue')
// import ActionEconomy from './Views/Reference/ActionEconomy.vue';

const CampaignViewer = () => import('./Views/CampaignLibrary/CampaignViewer.vue')
const Lists = () => import('./Views/Compendium/Lists.vue')

const routes = [
  {
    path: '',
    component: Main,
    props: true,
    searchData: {
      title: 'Compendium',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Compendium' },
  },
  {
    path: 'compendium/search',
    component: CompendiumSearch,
    meta: { title: 'Search' },
  },
  {
    path: 'compendium/licenses',
    component: Licenses,
    searchData: {
      title: 'Licenses',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Licenses' },
  },
  {
    path: 'compendium/manufacturers',
    component: Manufacturers,
    searchData: {
      title: 'Manufacturers',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Manufacturers' },
  },
  {
    path: 'compendium/frames',
    component: Frames,
    searchData: {
      title: 'Frames',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Frames' },
  },
  {
    path: 'compendium/weapons',
    component: Weapons,
    searchData: {
      title: 'Mech Weapons',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Mech Weapons' },
  },
  {
    path: 'compendium/systems',
    component: Systems,
    searchData: {
      title: 'Mech Systems',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Mech Systems' },
  },
  {
    path: 'compendium/pilot_gear',
    component: PilotGear,
    searchData: {
      title: 'Pilot Gear',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Pilot Gear' },
  },
  {
    path: 'compendium/skills',
    component: Skills,
    searchData: {
      title: 'Skill Triggers',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Skill Triggers' },
  },
  {
    path: 'compendium/npc_classes',
    component: NpcClasses,
    searchData: {
      title: 'NPC Classes',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'NPC Classes' },
  },
  {
    path: 'compendium/npc_features',
    component: NpcFeatures,
    searchData: {
      title: 'NPC Features',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'NPC Features' },
  },
  {
    path: 'compendium/npc_templates',
    component: NpcTemplates,
    searchData: {
      title: 'NPC Templates',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'NPC Templates' },
  },
  {
    path: 'compendium/eidolon_layers',
    component: EidolonLayers,
    searchData: {
      title: 'Eidolon Layers',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Eidolon Layers' },
  },
  {
    path: 'compendium/statuses',
    component: Statuses,
    searchData: {
      title: 'Statuses & Conditions',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Statuses & Conditions' },
  },
  {
    path: 'compendium/tags',
    component: Tags,
    searchData: {
      title: 'Equipment Tags',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Equipment Tags' },
  },
  {
    path: 'compendium/reference',
    component: Reference,
    meta: { title: 'Reference' },
  },
  {
    path: 'compendium/corebonuses',
    component: CoreBonuses,
    searchData: {
      title: 'Core Bonuses',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Core Bonuses' },
  },
  {
    path: 'compendium/talents',
    component: Talents,
    searchData: {
      title: 'Pilot Talents',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Pilot Talents' },
  },
  {
    path: 'compendium/backgrounds',
    component: Backgrounds,
    searchData: {
      title: 'Pilot Backgrounds',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Pilot Backgrounds' },
  },
  {
    path: 'compendium/glossary',
    component: Glossary,
    searchData: {
      title: 'Glossary',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Glossary' },
  },
  {
    path: 'compendium/reserves',
    component: Reserves,
    searchData: {
      title: 'Reserves',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Reserves' },
  },
  {
    path: 'compendium/downtime',
    component: DowntimeActions,
    searchData: {
      title: 'Downtime Actions',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'DowntimeActions' },
  },
  {
    path: 'compendium/bonds',
    component: Bonds,
    searchData: {
      title: 'Bonds',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Bonds' },
  },
  {
    path: 'compendium/environments',
    component: Environments,
    searchData: {
      title: 'Environments',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'Environments' },
  },
  {
    path: 'compendium/sitreps',
    component: Sitreps,
    searchData: {
      title: 'SITREPs',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'SITREPs' },
  },
  {
    path: 'compendium/tables',
    component: Tables,
    meta: { title: 'Tables' },
  },
  {
    path: 'compendium/lists',
    component: Lists,
    meta: { title: 'Lists' },
  },
  {
    path: 'reference',
    component: Reference,
    props: route => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/basics',
    name: 'srd_basics',
    component: Basics,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Basics',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'Reference: Basics' },
  },
  {
    path: 'reference/compcon',
    name: 'srd_compcon',
    component: Compcon,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: COMP/CON',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'Reference: COMP/CON' },
  },
  {
    path: 'reference/pilots',
    name: 'srd_pilots',
    component: Pilots,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Pilots',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'Reference: Pilots' },
  },
  {
    path: 'reference/mechs',
    name: 'srd_mechs',
    component: Mechs,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Mechs',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'Reference: Mechs' },
  },
  {
    path: 'reference/combat',
    name: 'srd_combat',
    component: Combat,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Combat',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'Reference: Combat' },
  },
  {
    path: 'reference/narrative',
    name: 'srd_narrative_play',
    component: Narrative,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Narrative Play',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'Reference: Narrative Play' },
  },
  {
    path: 'reference/errata',
    name: 'srd_errata',
    component: Errata,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Errata',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'Reference: Errata' },
  },
  {
    path: 'reference/glossary',
    name: 'srd_glossary',
    component: Glossary,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Glossary',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'Reference: Glossary' },
  },
  {
    path: 'reference/reference',
    name: 'srd_reference',
    component: ReferenceIndex,
    props: route => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/search',
    name: 'srd_search',
    component: ReferenceSearch,
  },
  {
    path: 'campaign/:id',
    name: 'campaign_view',
    component: CampaignViewer,
    props: true,
  },
]

export default routes
