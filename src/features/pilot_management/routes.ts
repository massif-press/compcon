import Main from './index.vue';

import Roster from './Roster/index.vue';
import Print from './Print/index.vue';
import Active from './ActiveSheet/index.vue';
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
      },
      {
        path: '/print/:pilotID/:mechID',
        component: Print,
        props: true,
      },
      {
        name: 'pilot_sheet_redirect',
        path: '/pilot/:pilotID',
        component: Sheet,
        props: true,
      },
      {
        path: '/pilot/:pilotID/mech/:mechID',
        name: 'mech-sheet',
        component: MechSheet,
        props: true,
      },
      {
        path: '/active/:pilotID',
        props: true,
        component: Active,
      },
      {
        path: 'level/:pilotID',
        name: 'level-up',
        props: true,
        component: Level,
      },
      {
        path: '/new/:groupID',
        name: 'new',
        props: true,
        component: New,
      },
    ],
  },
];

export default routes;
