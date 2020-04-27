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
import MissionSelector from './mission/runner/index.vue'
import MissionBriefing from './mission/runner/Briefing.vue'
import MissionRunner from './mission/runner/Active.vue'
import MissionDebriefing from './mission/runner/Debriefing.vue'

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
        component: Mission,
        children: [
          {
            path: '',
            name: 'mission',
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
            path: 'selector',
            name: 'mission-selector',
            component: MissionSelector,
          },
          {
            path: 'briefing/:id',
            name: 'mission-briefing',
            props: true,
            component: MissionBriefing,
          },
          {
            path: 'runner/:id',
            name: 'mission-runner',
            props: true,
            component: MissionRunner,
          },
          {
            path: 'debriefing/:id',
            name: 'mission-debriefing',
            props: true,
            component: MissionDebriefing,
          },
        ],
      },
    ],
  },
]

export default routes
