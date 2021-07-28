import Main from './index.vue'

import Home from './Views/Home.vue'
import Search from './Views/SearchResults.vue'

import Licenses from './Views/Licenses.vue'
import Manufacturers from './Views/Manufacturers.vue'
import Frames from './Views/Frames.vue'
import Weapons from './Views/Weapons.vue'
import Systems from './Views/Systems.vue'
import PilotGear from './Views/PilotGear.vue'
import Skills from './Views/Skills.vue'
import NpcClasses from './Views/NpcClasses.vue'
import NpcFeatures from './Views/NpcFeatures.vue'
import NpcTemplates from './Views/NpcTemplates.vue'
import Statuses from './Views/Statuses.vue'
import Tags from './Views/Tags.vue'
import Reference from './Views/Reference.vue'
import CoreBonuses from './Views/CoreBonuses.vue'
import Talents from './Views/Talents.vue'
import Backgrounds from './Views/Backgrounds.vue'
import ActionEconomy from './Views/ActionEconomy.vue'
import Glossary from './Views/Glossary.vue'
import Reserves from './Views/Reserves.vue'

import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: '/compendium/search',
        component: Search,
      },
      {
        path: '/compendium/licenses',
        component: Licenses,
      },
      {
        path: '/compendium/manufacturers',
        component: Manufacturers,
      },
      {
        path: '/compendium/frames',
        component: Frames,
      },
      {
        path: '/compendium/weapons',
        component: Weapons,
      },
      {
        path: '/compendium/systems',
        component: Systems,
      },
      {
        path: '/compendium/pilot_gear',
        component: PilotGear,
      },
      {
        path: '/compendium/skills',
        component: Skills,
      },
      {
        path: '/compendium/npc_classes',
        component: NpcClasses,
      },
      {
        path: '/compendium/npc_features',
        component: NpcFeatures,
      },
      {
        path: '/compendium/npc_templates',
        component: NpcTemplates,
      },
      {
        path: '/compendium/statuses',
        component: Statuses,
      },
      {
        path: '/compendium/tags',
        component: Tags,
      },
      {
        path: '/compendium/reference',
        component: Reference,
      },
      {
        path: '/compendium/corebonuses',
        component: CoreBonuses,
      },
      {
        path: '/compendium/talents',
        component: Talents,
      },
      {
        path: '/compendium/backgrounds',
        component: Backgrounds,
      },
      {
        path: '/compendium/actions',
        component: ActionEconomy,
      },
      {
        path: '/compendium/glossary',
        component: Glossary,
      },
      {
        path: '/compendium/reserves',
        component: Reserves,
      },
    ],
  },
]

export default routes
