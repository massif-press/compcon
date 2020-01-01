import Main from './index.vue'

import Home from './landing.vue'

import NpcRoster from './npc/index.vue'
import NpcCard from './npc/NpcCard.vue'
import NewNpc from './npc/new/index.vue'

import EncounterBuilder from './encounter/index.vue'
import EncounterCard from './encounter/components/EncounterCard.vue'

import Mission from './mission/index.vue'
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
        path: '/gm/mission-runner',
        name: 'mission-runner',
        component: Mission,
        // children: [
        //   {
        //     path: '',
        //     name: 'encounter-runner-list',
        //     component: Mission,
        //   },
        //   {
        //     path: '/encounter-runner/new',
        //     name: 'encounter-runner-new',
        //     component: EncounterRunnerNew,
        //   },
        //   {
        //     path: '/encounter-runner/:id',
        //     name: 'encounter-runner',
        //     component: EncounterRunner,
        //     props: route => ({
        //       preEnc: (store.state as any).encounterRunner.activeEncounters.find(
        //         (e: any) => e.id === route.params.id
        //       ),
        //     }),
        //   },
        // ],
      },
    ],
  },
]

export default routes
