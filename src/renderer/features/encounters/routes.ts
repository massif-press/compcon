// import { store } from '@/store'

// import NPC from '../../classes/npc/Npc'
// import EncounterBase from './logic/EncounterBase'

import Main from './index.vue'

import Home from './landing.vue'

import NpcRoster from './npc/index.vue'
import NewNpc from './npc/new/index.vue'
// import NpcList from './views/NpcDesigner/NpcsList.vue'
// import NpcDisplay from './views/NpcDesigner/NpcDisplay.vue'
// import NpcBuilder from './views/NpcDesigner/NpcBuilder.vue'
// import NpcClassPicker from './views/NpcDesigner/NpcClassPicker.vue'

import EncounterBuilder from './encounter/index.vue'
// import EncountersList from './views/EncounterBuilder/EncountersList.vue'
// import EncounterBuilder from './views/EncounterBuilder/EncounterBuilder.vue'

// import EncounterRunnerIndex from './views/EncounterRunner/EncounterRunnerIndex.vue'
import Mission from './mission/index.vue'
// import EncounterRunnerNew from './views/EncounterRunner/EncounterRunnerNew.vue'
// import EncounterRunner from './views/EncounterRunner/EncounterRunner.vue'
import { RouteConfig } from 'vue-router'

// function getNPC(id: string): NPC {
//   return (store.state as any).npcDesigner.npcs.find((n: NPC) => n.ID === id)
// }

const routes: RouteConfig[] = [
  {
    path: '/',
    component: Main,
    children: [
      {
        path: '',
        name: 'gm-toolkit-home',
        component: Home,
      },
      {
        path: '/npc-roster',
        component: NpcRoster,
        // children: [
        //   {
        //     path: '',
        //     name: 'npc-list',
        //     component: NpcsList,
        //   },
        //   {
        //     path: '/npc/:id',
        //     name: 'npc',
        //     component: NpcDisplay,
        //     props: route => ({
        //       npc: getNPC(route.params.id),
        //     }),
        //   },
        //   {
        //     path: '/npc-designer/new',
        //     name: 'npc-new',
        //     component: NpcClassPicker,
        //   },
        //   {
        //     path: '/npc-designer/edit/:id',
        //     name: 'npc-edit',
        //     component: NpcBuilder,
        //     props: route => ({
        //       preNpc: getNPC(route.params.id),
        //     }),
        //   },
        // ],
      },
      {
        path: '/new-npc',
        component: NewNpc,
        // children: [
        //   {
        //     path: '',
        //     name: 'npc-list',
        //     component: NpcsList,
        //   },
        //   {
        //     path: '/npc/:id',
        //     name: 'npc',
        //     component: NpcDisplay,
        //     props: route => ({
        //       npc: getNPC(route.params.id),
        //     }),
        //   },
        //   {
        //     path: '/npc-designer/new',
        //     name: 'npc-new',
        //     component: NpcClassPicker,
        //   },
        //   {
        //     path: '/npc-designer/edit/:id',
        //     name: 'npc-edit',
        //     component: NpcBuilder,
        //     props: route => ({
        //       preNpc: getNPC(route.params.id),
        //     }),
        //   },
        // ],
      },
      {
        path: '/encounter-builder',
        component: EncounterBuilder,
        //   children: [
        //     {
        //       path: '',
        //       name: 'encounter-builder',
        //       component: EncountersList,
        //     },
        //     {
        //       path: '/encounter-builder/new',
        //       beforeEnter: (to, from, next) => {
        //         const newEnc = new EncounterBase('Untitled Encounter')
        //         store.commit('encounterBuilder/add', newEnc)
        //         next('/encounter-builder/' + newEnc.id)
        //       },
        //     },
        //     {
        //       path: '/encounter-builder/:id',
        //       name: 'encounter-edit',
        //       component: EncounterBuilder,
        //       props: route => ({
        //         preEnc: (store.state as any).encounterBuilder.encounters.find(
        //           (e: any) => e.id === route.params.id
        //         ),
        //       }),
        //     },
        //   ],
      },
      {
        path: '/mission-runner',
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
