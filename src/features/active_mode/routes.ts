const EncounterManager = () => import('./gm/EncounterManager.vue')
const NewEncounter = () => import('./gm/NewEncounter.vue')
const TableConfiguration = () => import('./gm/TableConfiguration.vue')
const TableManager = () => import('./gm/TableManager.vue')
const Main = () => import('./index.vue')

const Home = () => import('./landing.vue')

const CreateSheet = () => import('./pc/NewSheet.vue')
const SheetManager = () => import('./pc/SheetManager.vue')
const EncounterTelemetry = () => import('./gm/EncounterTelemetry.vue')
const GMEncounterRunner = () => import('./runner/gm/GMEncounterRunner.vue')
const PilotLogbooks = () =>
  import('@/features/pilot_management/_components/logbook/PilotLogbookView.vue')
const JoinTable = () => import('./runner/pilot/JoinTable.vue')
const PilotRunner = () => import('./runner/pilot/PilotRunner.vue')

const routes = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        name: 'active-menu',
        component: Home,
      },
      {
        path: 'new-sheet',
        name: 'active-new-sheet',
        component: CreateSheet,
      },
      {
        path: 'sheet-manager',
        name: 'active-sheet-manager',
        component: SheetManager,
      },
      {
        path: 'pilot-runner/:id?',
        name: 'active-pilot-runner',
        component: PilotRunner,
        props: true,
      },
      {
        path: 'join-table',
        name: 'player-join-table',
        component: JoinTable,
      },
      {
        path: 'new-encounter',
        name: 'active-new-encounter',
        component: NewEncounter,
      },
      {
        path: 'manage-encounters',
        name: 'active-manage-encounters',
        component: EncounterManager,
      },
      {
        path: 'new-table',
        name: 'active-new-table',
        component: TableConfiguration,
      },
      {
        path: 'manage-tables',
        name: 'active-manage-tables',
        component: TableManager,
      },
      {
        path: 'logbooks/:presetPilot?',
        name: 'active-pilot-logbooks',
        component: PilotLogbooks,
        props: true,
        meta: { title: 'pm.logbook.title' },
      },
      {
        path: 'encounter-telemetry',
        name: 'active-encounter-telemetry',
        component: EncounterTelemetry,
        meta: { title: 'active.gmTelemetry.title' },
      },
      {
        path: 'gm-encounter-runner/:id?',
        name: 'active-gm-encounter-runner',
        component: GMEncounterRunner,
        props: true,
      },
    ],
  },
]

export default routes
