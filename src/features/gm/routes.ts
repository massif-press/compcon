import Main from './index.vue';

import Home from './landing.vue';

import GmMassPrintable from './_components/GMMassPrintable.vue';
import GmPrint from './_components/PrintWrapper.vue';

import Campaigns from './campaigns/index.vue';
import CampaignEditor from './campaigns/editor.vue';
import CampaignOverviewPage from './campaigns/pages/overview.vue';
import CampaignSectionPage from './campaigns/pages/section.vue';

import NPCs from './npcs/index.vue';
import Eidolons from './eidolons/index.vue';
import Encounters from './encounters/index.vue';
import Characters from './characters/index.vue';
import CharacterEditor from './characters/editor.vue';
import Locations from './locations/index.vue';
import LocationsEditor from './locations/editor.vue';
import Factions from './factions/index.vue';
import FactionsEditor from './factions/editor.vue';
import Runner from './runner/index.vue';

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
        component: NPCs,
      },
      {
        path: 'eidolons',
        name: 'gm-eidolons',
        component: Eidolons,
      },
      {
        path: 'encounters',
        name: 'gm-encounters',
        component: Encounters,
      },
      {
        path: 'characters',
        name: 'gm-characters',
        component: Characters,
      },
      {
        path: 'characters/edit/:id',
        name: 'gm-character-edit',
        component: CharacterEditor,
        props: true,
      },
      {
        path: 'locations',
        name: 'gm-locations',
        component: Locations,
      },
      {
        path: 'locations/edit/:id',
        name: 'gm-location-edit',
        component: LocationsEditor,
        props: true,
      },
      {
        path: 'factions',
        name: 'gm-faction',
        component: Factions,
      },
      {
        path: 'factions/edit/:id',
        name: 'gm-factions-edit',
        component: FactionsEditor,
        props: true,
      },
      {
        path: 'runner',
        name: 'gm-runner',
        component: Runner,
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
