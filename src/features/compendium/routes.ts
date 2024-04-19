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
  },
  {
    path: 'compendium',
    component: Compendium,
  },
  {
    path: 'compendium/search',
    component: CompendiumSearch,
  },
  {
    path: 'compendium/licenses',
    component: Licenses,
  },
  {
    path: 'compendium/manufacturers',
    component: Manufacturers,
  },
  {
    path: 'compendium/frames',
    component: Frames,
  },
  {
    path: 'compendium/weapons',
    component: Weapons,
  },
  {
    path: 'compendium/systems',
    component: Systems,
  },
  {
    path: 'compendium/pilot_gear',
    component: PilotGear,
  },
  {
    path: 'compendium/skills',
    component: Skills,
  },
  {
    path: 'compendium/npc_classes',
    component: NpcClasses,
  },
  {
    path: 'compendium/npc_features',
    component: NpcFeatures,
  },
  {
    path: 'compendium/npc_templates',
    component: NpcTemplates,
  },
  {
    path: 'compendium/eidolon_layers',
    component: EidolonLayers,
  },
  {
    path: 'compendium/statuses',
    component: Statuses,
  },
  {
    path: 'compendium/tags',
    component: Tags,
  },
  {
    path: 'compendium/reference',
    component: Reference,
  },
  {
    path: 'compendium/corebonuses',
    component: CoreBonuses,
  },
  {
    path: 'compendium/talents',
    component: Talents,
  },
  {
    path: 'compendium/backgrounds',
    component: Backgrounds,
  },
  // {
  //   path: 'compendium/actions',
  //   component: ActionEconomy,
  // },
  {
    path: 'compendium/glossary',
    component: Glossary,
  },
  {
    path: 'compendium/reserves',
    component: Reserves,
  },
  {
    path: 'compendium/bonds',
    component: Bonds,
  },
  {
    path: 'compendium/environments',
    component: Environments,
  },
  {
    path: 'compendium/sitreps',
    component: Sitreps,
  },
  {
    path: 'compendium/tables',
    component: Tables,
  },
  {
    path: 'reference',
    component: Reference,
  },
  {
    path: 'reference/basics',
    name: 'srd_basics',
    component: Basics,
    props: (route) => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/compcon',
    name: 'srd_compcon',
    component: Compcon,
    props: (route) => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/pilots',
    name: 'srd_pilots',
    component: Pilots,
    props: (route) => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/mechs',
    name: 'srd_mechs',
    component: Mechs,
    props: (route) => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/combat',
    name: 'srd_combat',
    component: Combat,
    props: (route) => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/narrative',
    name: 'srd_narrative',
    component: Narrative,
    props: (route) => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/errata',
    name: 'srd_errata',
    component: Errata,
    props: (route) => ({ preScroll: route.query.preScroll }),
  },
  {
    path: 'reference/glossary',
    name: 'srd_glossary',
    component: Glossary,
    props: (route) => ({ preScroll: route.query.preScroll }),
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
