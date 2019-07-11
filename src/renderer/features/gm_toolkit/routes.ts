import store from '@/store';

import NPC from './logic/NPC';
import EncounterBase from './logic/EncounterBase';

import Main from './Main.vue';

import Home from './views/Home.vue';
import UnderConstruction from './views/UnderConstruction.vue';

import NpcDesignerIndex from './views/NpcDesigner/NpcDesignerIndex.vue';
import NpcBuilder from './views/NpcDesigner/NpcBuilder.vue';
import NpcClassPicker from './views/NpcDesigner/NpcClassPicker.vue';
import NpcsList from './views/NpcDesigner/NpcsList.vue';
import NpcDisplay from './views/NpcDesigner/NpcDisplay.vue';

import EncounterBuilderIndex from './views/EncounterBuilder/EncounterBuilderIndex.vue';
import EncountersList from './views/EncounterBuilder/EncountersList.vue';
import EncounterBuilder from './views/EncounterBuilder/EncounterBuilder.vue';

import EncounterRunnerIndex from './views/EncounterRunner/EncounterRunnerIndex.vue';
import EncounterRunnerList from './views/EncounterRunner/EncounterRunnerList.vue';
import EncounterRunnerNew from './views/EncounterRunner/EncounterRunnerNew.vue';
import EncounterRunner from './views/EncounterRunner/EncounterRunner.vue';
import { RouteConfig } from 'vue-router';

function getNPC(id: string): NPC {
  return (store.state as any).npcDesigner.npcs.find((n: NPC) => n.id === id);
}

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'gm-toolkit',
    component: Main,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: '/npc-designer',
        component: NpcDesignerIndex,
        children: [
          {
            path: '',
            name: 'npc-list',
            component: NpcsList,
          },
          {
            path: '/npc/:id',
            name: 'npc',
            component: NpcDisplay,
            props: route => ({
              npc: getNPC(route.params.id),
            }),
          },
          {
            path: '/npc-designer/new',
            name: 'npc-new',
            component: NpcClassPicker,
          },
          {
            path: '/npc-designer/edit/:id',
            name: 'npc-edit',
            component: NpcBuilder,
            props: route => ({
              preNpc: getNPC(route.params.id),
            }),
          },
        ],
      },
      {
        path: '/encounter-builder',
        component: EncounterBuilderIndex,
        children: [
          {
            path: '',
            name: 'encounter-builder',
            component: EncountersList,
          },
          {
            path: '/encounter-builder/new',
            beforeEnter: (to, from, next) => {
              const newEnc = new EncounterBase('Untitled Encounter');
              store.commit('encounterBuilder/add', newEnc);
              next('/encounter-builder/' + newEnc.id);
            },
          },
          {
            path: '/encounter-builder/:id',
            name: 'encounter-edit',
            component: EncounterBuilder,
            props: route => ({
              preEnc: (store.state as any).encounterBuilder.encounters.find(
                (e: any) => e.id === route.params.id,
              ),
            }),
          },
        ],
      },
      {
        path: '/encounter-runner',
        component: EncounterRunnerIndex,
        children: [
          {
            path: '',
            name: 'encounter-runner-list',
            component: EncounterRunnerList,
          },
          {
            path: '/encounter-runner/new',
            name: 'encounter-runner-new',
            component: EncounterRunnerNew,
          },
          {
            path: '/encounter-runner/:id',
            name: 'encounter-runner',
            component: EncounterRunner,
            props: route => ({
              preEnc: (store.state as any).encounterRunner.activeEncounters.find(
                (e: any) => e.id === route.params.id,
              ),
            }),
          },
        ],
      },
      {
        path: '/about',
        name: 'about',
        component: UnderConstruction,
      },
    ]
  },
]

export default routes