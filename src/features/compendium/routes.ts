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
        path: '/licenses',
        component: Licenses,
      },
      {
        path: '/manufacturers',
        component: Manufacturers,
      },
      {
        path: '/frames',
        component: Frames,
      },
      {
        path: '/weapons',
        component: Weapons,
      },
      {
        path: '/systems',
        component: Systems,
      },
      {
        path: '/pilot_gear',
        component: PilotGear,
      },
      {
        path: '/skills',
        component: Skills,
      },
      {
        path: '/npc_classes',
        component: NpcClasses,
      },
      {
        path: '/npc_features',
        component: NpcFeatures,
      },
      {
        path: '/npc_templates',
        component: NpcTemplates,
      },
      {
        path: '/statuses',
        component: Statuses,
      },
      {
        path: '/tags',
        component: Tags,
      },
      {
        path: '/reference',
        component: Reference,
      },
      {
        path: '/corebonuses',
        component: CoreBonuses,
      },
      {
        path: '/talents',
        component: Talents,
      },
      {
        path: '/backgrounds',
        component: Backgrounds,
      },
      {
        path: '/actions',
        component: ActionEconomy,
      },
      {
        path: '/glossary',
        component: Glossary,
      },
      {
        path: '/reserves',
        component: Reserves,
      },
    ],
  },
]

export default routes
