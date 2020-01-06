import Main from './index.vue'

import Home from './landing.vue'

import NpcRoster from './npc/index.vue'
import NpcCard from './npc/NpcCard.vue'
import NewNpc from './npc/new/index.vue'

import EncounterBuilder from './encounter/index.vue'
import EncounterCard from './encounter/components/EncounterCard.vue'

import Mission from './mission/index.vue'
import MissionLanding from './mission/landing.vue'
import MissionBuilder from './mission/builder/index.vue'
import MissionCard from './mission/builder/MissionCard.vue'
import MissionRunner from './mission/runner/index.vue'

import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        name: 'gm-toolkit-home',
        component: Home,
      },
      {
        path: '/gm/npc-roster',
        name: 'npc-roster',
        component: NpcRoster,
        children: [
          {
            path: ':id',
            name: 'npc',
            component: NpcCard,
            props: true,
          },
        ],
      },
      {
        path: '/gm/new-npc',
        name: 'new-npc',
        component: NewNpc,
      },
      {
        path: '/gm/encounter-builder',
        name: 'encounter-builder',
        component: EncounterBuilder,
        children: [
          {
            path: ':id',
            name: 'encounter',
            component: EncounterCard,
            props: true,
          },
        ],
      },
      {
        path: '/gm/mission',
        name: 'mission',
        component: Mission,
        children: [
          {
            path: '',
            component: MissionLanding,
          },
          {
            path: 'builder',
            name: 'mission-builder',
            component: MissionBuilder,
            children: [
              {
                path: ':id',
                name: 'edit-mission',
                component: MissionCard,
                props: true,
              },
            ],
          },
          {
            path: 'runner',
            name: 'mission-runner',
            component: MissionRunner,
            children: [
              {
                path: ':id',
                name: 'active-mission',
                component: EncounterCard,
                props: true,
              },
            ],
          },
        ],
      },
    ],
  },
]

export default routes
