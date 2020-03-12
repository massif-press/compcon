import Main from './index.vue'

import Roster from './Roster/index.vue'
import Print from './Print/index.vue'
import Active from './ActiveSheet/index.vue'
import Level from './Level/index.vue'

import Sheet from './PilotSheet/index.vue'
import Layout from './PilotSheet/layouts/index.vue'
import MechSheet from './PilotSheet/sections/mech/index.vue'

import New from './New/index.vue'

import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
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
        path: '/pilot/:pilotID',
        component: Sheet,
        props: true,
        children: [
          {
            name: 'pilot_sheet',
            path: '',
            redirect: 'sheet/1',
          },
          {
            name: 'mech_hangar',
            path: '',
            redirect: 'sheet/3',
          },
          {
            path: 'sheet/:tab',
            component: Layout,
            props: true,
          },
          {
            path: 'mech/:mechID',
            component: MechSheet,
            props: true,
          },
        ],
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
        path: '/new',
        component: New,
      },
    ],
  },
]

export default routes
