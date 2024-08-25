import Main from './index.vue';

import Compendium from './Views/Compendium/index.vue';
import CompendiumSearch from './Views/Compendium/SearchResults.vue';
import Licenses from './Views/Compendium/Licenses.vue';
import Manufacturers from './Views/Compendium/Manufacturers.vue';
import Frames from './Views/Compendium/Frames.vue';
import Weapons from './Views/Compendium/Weapons.vue';
import Systems from './Views/Compendium/Systems.vue';
import PilotGear from './Views/Compendium/PilotGear.vue';
import Skills from './Views/Compendium/Skills.vue';
import NpcClasses from './Views/Compendium/NpcClasses.vue';
import NpcFeatures from './Views/Compendium/NpcFeatures.vue';
import NpcTemplates from './Views/Compendium/NpcTemplates.vue';
import Statuses from './Views/Compendium/Statuses.vue';
import Tags from './Views/Compendium/Tags.vue';
import CoreBonuses from './Views/Compendium/CoreBonuses.vue';
import Talents from './Views/Compendium/Talents.vue';
import Backgrounds from './Views/Compendium/Backgrounds.vue';
import Reserves from './Views/Compendium/Reserves.vue';
import Bonds from './Views/Compendium/Bonds.vue';
import Environments from './Views/Compendium/Environments.vue';
import Sitreps from './Views/Compendium/Sitreps.vue';
import Tables from './Views/Compendium/Tables.vue';

import Reference from './Views/Reference/index.vue';
import ReferenceSearch from './Views/Reference/SearchResults.vue';
import Basics from './Views/Reference/Basics.vue';
import Compcon from './Views/Reference/Compcon.vue';
import ReferenceIndex from './Views/Reference/Reference.vue';
import Pilots from './Views/Reference/Pilots.vue';
import Mechs from './Views/Reference/Mechs.vue';
import Combat from './Views/Reference/Combat.vue';
import Narrative from './Views/Reference/Narrative.vue';
import Errata from './Views/Reference/Errata.vue';
import Glossary from './Views/Reference/Glossary.vue';
import EidolonLayers from './Views/Compendium/EidolonLayers.vue';
// import ActionEconomy from './Views/Reference/ActionEconomy.vue';

import CampaignViewer from './Views/CampaignLibrary/CampaignViewer.vue';

const routes = [
  {
    path: '',
    component: Main,
    searchData: {
      title: 'Compendium',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/search',
    component: CompendiumSearch,
  },
  {
    path: 'compendium/licenses',
    component: Licenses,
    searchData: {
      title: 'Licenses',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/manufacturers',
    component: Manufacturers,
    searchData: {
      title: 'Manufacturers',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/frames',
    component: Frames,
    searchData: {
      title: 'Frames',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/weapons',
    component: Weapons,
    searchData: {
      title: 'Mech Weapons',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/systems',
    component: Systems,
    searchData: {
      title: 'Mech Systems',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/pilot_gear',
    component: PilotGear,
    searchData: {
      title: 'Pilot Gear',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/skills',
    component: Skills,
    searchData: {
      title: 'Skill Triggers',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/npc_classes',
    component: NpcClasses,
    searchData: {
      title: 'NPC Classes',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/npc_features',
    component: NpcFeatures,
    searchData: {
      title: 'NPC Features',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/npc_templates',
    component: NpcTemplates,
    searchData: {
      title: 'NPC Templates',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/eidolon_layers',
    component: EidolonLayers,
    searchData: {
      title: 'Eidolon Layers',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/statuses',
    component: Statuses,
    searchData: {
      title: 'Statuses & Conditions',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/tags',
    component: Tags,
    searchData: {
      title: 'Equipment Tags',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/reference',
    component: Reference,
  },
  {
    path: 'compendium/corebonuses',
    component: CoreBonuses,
    searchData: {
      title: 'Core Bonuses',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/talents',
    component: Talents,
    searchData: {
      title: 'Pilot Talents',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/backgrounds',
    component: Backgrounds,
    searchData: {
      title: 'Pilot Backgrounds',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/glossary',
    component: Glossary,
    searchData: {
      title: 'Glossary',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/reserves',
    component: Reserves,
    searchData: {
      title: 'Reserves',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/bonds',
    component: Bonds,
    searchData: {
      title: 'Bonds',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/environments',
    component: Environments,
    searchData: {
      title: 'Environments',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/sitreps',
    component: Sitreps,
    searchData: {
      title: 'Sitreps',
      icon: 'mdi-book-variant',
    },
  },
  {
    path: 'compendium/tables',
    component: Tables,
  },
  {
    path: 'reference',
    component: Reference,
    props: (route) => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/basics',
    name: 'srd_basics',
    component: Basics,
    props: (route) => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Basics',
      icon: 'mdi-book-open-variant-outline',
    },
  },
  {
    path: 'reference/compcon',
    name: 'srd_compcon',
    component: Compcon,
    props: (route) => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: COMP/CON',
      icon: 'mdi-book-open-variant-outline',
    },
  },
  {
    path: 'reference/pilots',
    name: 'srd_pilots',
    component: Pilots,
    props: (route) => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Pilots',
      icon: 'mdi-book-open-variant-outline',
    },
  },
  {
    path: 'reference/mechs',
    name: 'srd_mechs',
    component: Mechs,
    props: (route) => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Mechs',
      icon: 'mdi-book-open-variant-outline',
    },
  },
  {
    path: 'reference/combat',
    name: 'srd_combat',
    component: Combat,
    props: (route) => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Combat',
      icon: 'mdi-book-open-variant-outline',
    },
  },
  {
    path: 'reference/narrative',
    name: 'srd_narrative_play',
    component: Narrative,
    props: (route) => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Narrative Play',
      icon: 'mdi-book-open-variant-outline',
    },
  },
  {
    path: 'reference/errata',
    name: 'srd_errata',
    component: Errata,
    props: (route) => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Errata',
      icon: 'mdi-book-open-variant-outline',
    },
  },
  {
    path: 'reference/glossary',
    name: 'srd_glossary',
    component: Glossary,
    props: (route) => ({ preScroll: route.query.preScroll }),
    searchData: {
      title: 'Reference: Glossary',
      icon: 'mdi-book-open-variant-outline',
    },
  },
  {
    path: 'reference/reference',
    name: 'srd_reference',
    component: ReferenceIndex,
    props: (route) => ({ preScroll: route.query.preScroll }),
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
];

export default routes;
