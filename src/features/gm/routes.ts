import Main from './index.vue';

import Home from './landing.vue';

import GmPrint from './npc_roster/print/index.vue';
import NarrativePrint from './narrative/print/index.vue';
import EncounterPrint from './encounters/print/index.vue';

import Campaigns from './campaigns/index.vue';
import CampaignEditor from './campaigns/editor.vue';

import NpcRoster from './npc_roster/index.vue';

import NarrativeIndex from './narrative/index.vue';
import NarrativeGraph from './narrative/graph.vue';

import Encounters from './encounters/index.vue';

const routes = [
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
        path: 'campaigns',
        name: 'gm-campaigns',
        component: Campaigns,
      },
      {
        path: 'campaigns/edit/:id',
        name: 'gm-campaign-editor',
        component: CampaignEditor,
        props: true,
      },
      {
        path: 'npcs',
        name: 'gm-npcs',
        component: NpcRoster,
      },
      {
        path: 'encounters',
        name: 'gm-encounters',
        component: Encounters,
      },
      {
        path: 'narrative',
        name: 'gm-narrative',
        component: NarrativeIndex,
      },
      {
        path: 'narrative/graph',
        name: 'gm-narrative-graph',
        component: NarrativeGraph,
      },

      {
        path: '/gm/print/:ids',
        name: 'gm-print',
        component: GmPrint,
        props: true,
      },
      {
        path: '/gm/print/narrative/:ids',
        name: 'gm-narrative-print',
        component: NarrativePrint,
        props: true,
      },
      {
        path: '/gm/print/encounter/:id',
        name: 'gm-encounter-print',
        component: EncounterPrint,
        props: true,
      },
    ],
  },
];

export default routes;
