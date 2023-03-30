import Main from './index.vue';

import Home from './landing.vue';

import CreateSheet from './pc/create_sheet.vue';
import OpenSheet from './pc/open_sheet.vue';

import { RouteConfig } from 'vue-router';

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
        path: 'new-character-sheet',
        name: 'active-new-cs',
        component: CreateSheet,
      },
      {
        path: 'open-character-sheet',
        name: 'active-open-cs',
        component: OpenSheet,
      },
    ],
  },
];

export default routes;
