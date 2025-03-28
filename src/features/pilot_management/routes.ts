import Main from './index.vue';

import Roster from './Roster/index.vue';
import Print from './Print/index.vue';
import Level from './Level/index.vue';

import Sheet from './PilotSheet/index.vue';
import MechSheet from './PilotSheet/sections/mech/index.vue';

import New from './New/index.vue';

const routes = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        name: 'pilot_roster',
        component: Roster,
        meta: { title: 'Pilot Roster' },
      },
      {
        path: '/print/:presetPilot/:presetMech?',
        component: Print,
        props: true,
      },
      {
        name: 'pilot_sheet_redirect',
        path: '/pilot/:pilotID',
        component: Sheet,
        props: true,
        meta: { title: 'Pilot' },
      },
      {
        path: '/pilot/:pilotID/mech/:mechID',
        name: 'mech-sheet',
        component: MechSheet,
        props: true,
        meta: { title: 'Mech' },
      },

      {
        path: 'level/:pilotID',
        name: 'level-up',
        props: true,
        component: Level,
        meta: { title: 'Level Up' },
      },
      {
        path: '/new/:groupID',
        name: 'new',
        props: true,
        component: New,
        meta: { title: 'New Pilot Wizard' },
      },
    ],
  },
];

export default routes;
