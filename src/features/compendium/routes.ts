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
      title: 'common.compendium',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'common.compendium' },
  },
  {
    path: 'compendium/search',
    component: SearchResults,
    meta: { title: 'common.search' },
  },
  {
    path: 'compendium/licenses',
    component: Licenses,
    searchData: {
      title: 'common.licenses',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'common.licenses' },
  },
  {
    path: 'compendium/manufacturers',
    component: Manufacturers,
    searchData: {
      title: 'compendium.categories.manufacturers',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.manufacturers' },
  },
  {
    path: 'compendium/frames',
    component: Frames,
    searchData: {
      title: 'compendium.categories.frames',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.frames' },
  },
  {
    path: 'compendium/weapons',
    component: Weapons,
    searchData: {
      title: 'compendium.categories.mechWeapons',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.mechWeapons' },
  },
  {
    path: 'compendium/systems',
    component: Systems,
    searchData: {
      title: 'common.mechSystems',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'common.mechSystems' },
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
      title: 'common.skillTriggers',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'common.skillTriggers' },
  },
  {
    path: 'compendium/npc_classes',
    component: NpcClasses,
    searchData: {
      title: 'compendium.categories.npcClasses',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.npcClasses' },
  },
  {
    path: 'compendium/npc_features',
    component: NpcFeatures,
    searchData: {
      title: 'compendium.categories.npcFeatures',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.npcFeatures' },
  },
  {
    path: 'compendium/npc_templates',
    component: NpcTemplates,
    searchData: {
      title: 'compendium.categories.npcTemplates',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.npcTemplates' },
  },
  {
    path: 'compendium/eidolon_layers',
    component: EidolonLayers,
    searchData: {
      title: 'compendium.shared.eidolonLayers',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.shared.eidolonLayers' },
  },
  {
    path: 'compendium/statuses',
    component: Statuses,
    searchData: {
      title: 'compendium.categories.statusesConditions',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.statusesConditions' },
  },
  {
    path: 'compendium/tags',
    component: Tags,
    searchData: {
      title: 'compendium.categories.equipmentTags',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.equipmentTags' },
  },
  {
    path: 'compendium/reference',
    component: Reference,
    meta: { title: 'compendium.shared.reference' },
  },
  {
    path: 'compendium/corebonuses',
    component: CoreBonuses,
    searchData: {
      title: 'common.coreBonuses',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'common.coreBonuses' },
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
      title: 'compendium.shared.pilotBackgrounds',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.shared.pilotBackgrounds' },
  },
  {
    path: 'compendium/glossary',
    component: Glossary,
    searchData: {
      title: 'compendium.reference.glossary',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.reference.glossary' },
  },
  {
    path: 'compendium/reserves',
    component: Reserves,
    searchData: {
      title: 'common.reserves',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'common.reserves' },
  },
  {
    path: 'compendium/downtime',
    component: DowntimeActions,
    searchData: {
      title: 'compendium.categories.downtimeActions',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.downtimeActions' },
  },
  {
    path: 'compendium/bonds',
    component: Bonds,
    searchData: {
      title: 'common.bonds',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'common.bonds' },
  },
  {
    path: 'compendium/environments',
    component: Environments,
    searchData: {
      title: 'compendium.categories.environments',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.environments' },
  },
  {
    path: 'compendium/sitreps',
    component: Sitreps,
    searchData: {
      title: 'compendium.categories.sitreps',
      icon: 'mdi-book-variant',
    },
    meta: { title: 'compendium.categories.sitreps' },
  },
  {
    path: 'compendium/tables',
    component: Tables,
    meta: { title: 'common.tables' },
  },
  {
    path: 'compendium/lists',
    component: Lists,
    meta: { title: 'compendium.shared.lists' },
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
      title: 'compendium.routes.referenceBasics',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.routes.referenceBasics' },
  },
  {
    path: 'reference/compcon',
    name: 'srd_compcon',
    component: Compcon,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.routes.referenceCompCon',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.routes.referenceCompCon' },
  },
  {
    path: 'reference/pilots',
    name: 'srd_pilots',
    component: Pilots,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.shared.referencePilots',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.shared.referencePilots' },
  },
  {
    path: 'reference/mechs',
    name: 'srd_mechs',
    component: Mechs,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.shared.referenceMechs',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.shared.referenceMechs' },
  },
  {
    path: 'reference/combat',
    name: 'srd_combat',
    component: Combat,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.shared.referenceCombat',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.shared.referenceCombat' },
  },
  {
    path: 'reference/narrative',
    name: 'srd_narrative_play',
    component: Narrative,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.shared.referenceNarrativePlay',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.shared.referenceNarrativePlay' },
  },
  {
    path: 'reference/errata',
    name: 'srd_errata',
    component: Errata,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.shared.referenceErrata',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.shared.referenceErrata' },
  },
  {
    path: 'reference/glossary',
    name: 'srd_glossary',
    component: Glossary,
    props: route => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'compendium.shared.referenceGlossary',
      icon: 'mdi-book-open-variant-outline',
    },
    meta: { title: 'compendium.shared.referenceGlossary' },
  },
  {
    path: 'reference/reference',
    name: 'srd_reference',
    component: ReferenceIndex,
    props: route => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/search',
    redirect: to => ({ path: '/srd/compendium/search', query: to.query }),
  },
  {
    path: 'campaign/:id',
    name: 'campaign_view',
    component: CampaignViewer,
    props: true,
  },
]

export default routes
