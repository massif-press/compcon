const Main = () => import('./index.vue')

const Compendium = () => import('./Views/Compendium/index.vue')
const SearchResults = () => import('./Views/SearchResults.vue')
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
      title: 'compendium.titles.compendium',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.compendium' },
  },
  {
    path: 'compendium/search',
    component: SearchResults,
    meta: { title: 'compendium.titles.search' },
  },
  {
    path: 'compendium/licenses',
    component: Licenses,
    searchData: {
      title: 'compendium.titles.licenses',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.licenses' },
  },
  {
    path: 'compendium/manufacturers',
    component: Manufacturers,
    searchData: {
      title: 'compendium.titles.manufacturers',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.manufacturers' },
  },
  {
    path: 'compendium/frames',
    component: Frames,
    searchData: {
      title: 'compendium.titles.frames',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.frames' },
  },
  {
    path: 'compendium/weapons',
    component: Weapons,
    searchData: {
      title: 'compendium.titles.mechWeapons',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.mechWeapons' },
  },
  {
    path: 'compendium/systems',
    component: Systems,
    searchData: {
      title: 'compendium.titles.mechSystems',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.mechSystems' },
  },
  {
    path: 'compendium/pilot_gear',
    component: PilotGear,
    searchData: {
      title: 'common.pilotGear',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'common.pilotGear' },
  },
  {
    path: 'compendium/skills',
    component: Skills,
    searchData: {
      title: 'compendium.titles.skillTriggers',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.skillTriggers' },
  },
  {
    path: 'compendium/npc_classes',
    component: NpcClasses,
    searchData: {
      title: 'compendium.titles.npcClasses',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.npcClasses' },
  },
  {
    path: 'compendium/npc_features',
    component: NpcFeatures,
    searchData: {
      title: 'compendium.titles.npcFeatures',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.npcFeatures' },
  },
  {
    path: 'compendium/npc_templates',
    component: NpcTemplates,
    searchData: {
      title: 'compendium.titles.npcTemplates',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.npcTemplates' },
  },
  {
    path: 'compendium/eidolon_layers',
    component: EidolonLayers,
    searchData: {
      title: 'compendium.titles.eidolonLayers',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.eidolonLayers' },
  },
  {
    path: 'compendium/statuses',
    component: Statuses,
    searchData: {
      title: 'compendium.titles.statusesConditions',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.statusesConditions' },
  },
  {
    path: 'compendium/tags',
    component: Tags,
    searchData: {
      title: 'compendium.titles.equipmentTags',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.equipmentTags' },
  },
  {
    path: 'compendium/reference',
    component: Reference,
    meta: { title: 'compendium.titles.reference' },
  },
  {
    path: 'compendium/corebonuses',
    component: CoreBonuses,
    searchData: {
      title: 'compendium.titles.coreBonuses',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.coreBonuses' },
  },
  {
    path: 'compendium/talents',
    component: Talents,
    searchData: {
      title: 'common.pilotTalents',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'common.pilotTalents' },
  },
  {
    path: 'compendium/backgrounds',
    component: Backgrounds,
    searchData: {
      title: 'compendium.titles.pilotBackgrounds',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.pilotBackgrounds' },
  },
  {
    path: 'compendium/glossary',
    component: Glossary,
    searchData: {
      title: 'compendium.titles.glossary',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.glossary' },
  },
  {
    path: 'compendium/reserves',
    component: Reserves,
    searchData: {
      title: 'compendium.titles.reserves',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.reserves' },
  },
  {
    path: 'compendium/downtime',
    component: DowntimeActions,
    searchData: {
      title: 'compendium.titles.downtimeActions',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.downtimeactions' },
  },
  {
    path: 'compendium/bonds',
    component: Bonds,
    searchData: {
      title: 'compendium.titles.bonds',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.bonds' },
  },
  {
    path: 'compendium/environments',
    component: Environments,
    searchData: {
      title: 'compendium.titles.environments',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.environments' },
  },
  {
    path: 'compendium/sitreps',
    component: Sitreps,
    searchData: {
      title: 'compendium.titles.sitreps',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.titles.sitreps' },
  },
  {
    path: 'compendium/tables',
    component: Tables,
    meta: { title: 'compendium.titles.tables' },
  },
  {
    path: 'compendium/lists',
    component: Lists,
    meta: { title: 'compendium.titles.lists' },
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
      title: 'compendium.titles.referenceBasics',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.titles.referenceBasics' },
  },
  {
    path: 'reference/compcon',
    name: 'srd_compcon',
    component: Compcon,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.titles.referenceCompCon',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.titles.referenceCompCon' },
  },
  {
    path: 'reference/pilots',
    name: 'srd_pilots',
    component: Pilots,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.titles.referencePilots',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.titles.referencePilots' },
  },
  {
    path: 'reference/mechs',
    name: 'srd_mechs',
    component: Mechs,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.titles.referenceMechs',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.titles.referenceMechs' },
  },
  {
    path: 'reference/combat',
    name: 'srd_combat',
    component: Combat,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.titles.referenceCombat',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.titles.referenceCombat' },
  },
  {
    path: 'reference/narrative',
    name: 'srd_narrative_play',
    component: Narrative,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.titles.referenceNarrativePlay',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.titles.referenceNarrativePlay' },
  },
  {
    path: 'reference/errata',
    name: 'srd_errata',
    component: Errata,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.titles.referenceErrata',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.titles.referenceErrata' },
  },
  {
    path: 'reference/glossary',
    name: 'srd_glossary',
    component: Glossary,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.titles.referenceGlossary',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.titles.referenceGlossary' },
  },
  {
    path: 'reference/reference',
    name: 'srd_reference',
    component: ReferenceIndex,
    props: route => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/search',
    redirect: (to) => ({ path: '/srd/compendium/search', query: to.query }),
  },
  {
    path: 'campaign/:id',
    name: 'campaign_view',
    component: CampaignViewer,
    props: true,
  },
]

export default routes
