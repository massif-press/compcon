import EncounterManager from './gm/EncounterManager.vue';
import NewEncounter from './gm/NewEncounter.vue';
import TableConfiguration from './gm/TableConfiguration.vue';
import TableManager from './gm/TableManager.vue';
import Main from './index.vue';

import Home from './landing.vue';

import CreateSheet from './pc/NewSheet.vue';
import SheetManager from './pc/SheetManager.vue';
import GMEncounterRunner from './runner/gm/GMEncounterRunner.vue';
import JoinTable from './runner/pilot/JoinTable.vue';
import PilotRunner from './runner/pilot/PilotRunner.vue';

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
        path: 'pilot-runner',
        name: 'active-pilot-runner',
        component: PilotRunner,
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
        path: 'gm-encounter-runner/:id?',
        name: 'active-gm-encounter-runner',
        component: GMEncounterRunner,
        props: true,
      },
    ],
  },
];

export default routes;
