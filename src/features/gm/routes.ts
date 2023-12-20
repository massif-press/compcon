import Main from './index.vue';

import Home from './landing.vue';

import GmMassPrintable from './_components/GMMassPrintable.vue';
import GmPrint from './_components/PrintWrapper.vue';

import Campaigns from './campaigns/index.vue';
import CampaignEditor from './campaigns/editor.vue';
import CampaignOverviewPage from './campaigns/pages/overview.vue';
import CampaignSectionPage from './campaigns/pages/section.vue';

import NpcRoster from './npc_roster/index.vue';

import NarrativeIndex from './narrative/index.vue';

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
      // {
      //   path: 'campaigns/edit',
      //   name: 'gm-campaigns',
      //   component: CampaignEditor,
      //   children: [
      //     {
      //       path: 'overview',
      //       name: 'campaign-edit-overview',
      //       component: CampaignOverviewPage,
      //       props: true,
      //     },
      //     {
      //       path: 'section/',
      //       name: 'campaign-edit-section',
      //       component: CampaignSectionPage,
      //       props: true,
      //     },
      //   ],
      // },
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
        path: '/gm/print/:type/:id',
        name: 'gm-print',
        component: GmPrint,
        props: true,
      },
      {
        path: 'mass-print/:type/:ids',
        name: 'gm-mass-print',
        component: GmMassPrintable,
        props: true,
      },
    ],
  },
];

export default routes;
