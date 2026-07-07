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
        meta: { title: 'common.pilotRoster' },
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
        meta: { title: 'pm.titles.pilot' },
      },
      {
        path: '/pilot/:pilotID/mech/:mechID',
        name: 'mech-sheet',
        component: MechSheet,
        props: true,
        meta: { title: 'common.mech' },
      },

      {
        path: 'level/:pilotID',
        name: 'level-up',
        props: true,
        component: Level,
        meta: { title: 'pm.titles.levelUp' },
      },
      {
        path: '/new/:groupID',
        name: 'new',
        props: true,
        component: New,
        meta: { title: 'pm.titles.newPilotWizard' },
      },
    ],
  },
]

export default routes
