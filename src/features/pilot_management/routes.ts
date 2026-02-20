const Main = () => import('./index.vue')

const Roster = () => import('./Roster/index.vue')
const Print = () => import('./Print/index.vue')
const Level = () => import('./Level/index.vue')

const Sheet = () => import('./PilotSheet/index.vue')
const MechSheet = () => import('./PilotSheet/sections/mech/index.vue')

const New = () => import('./New/index.vue')

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
]

export default routes
