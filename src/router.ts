import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
// import encounterRoutes from './features/encounters/routes'
import gmRoutes from './features/gm/routes';
import pilotRoutes from './features/pilot_management/routes';
import compendiumRoutes from './features/compendium/routes';
import activeModeRoutes from './features/active_mode/routes';

import MainMenu from './features/main_menu/index.vue';
import UITest from './features/ui_test/old.vue';
import UITestv3 from './features/ui_test/index.vue';
import ItemLink from './features/main_menu/itemLink.vue';

import Redirect from './features/main_menu/_components/oauth/Redirect.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main-menu',
      component: MainMenu,
    },
    {
      path: '/link/:pack/:type/:id',
      name: 'item_link',
      component: ItemLink,
      props: true,
    },
    {
      path: '/ui-test',
      name: 'ui-test',
      component: UITest,
    },
    {
      path: '/ui-test-new',
      name: 'ui-test-new',
      component: UITestv3,
    },
    {
      path: '/oauth/callback',
      name: 'OAuthCallback',
      component: Redirect,
    },
    ...compendiumRoutes.map((route) => ({
      ...route,
      path: (route.path = '/srd/' + route.path),
    })),
    ...pilotRoutes.map((route) => ({
      ...route,
      path: (route.path = '/pilot_management/' + route.path),
    })),
    ...activeModeRoutes.map((route) => ({
      ...route,
      path: (route.path = '/active-mode/' + route.path),
    })),
    ...gmRoutes.map((route) => ({
      ...route,
      path: (route.path = '/gm/' + route.path),
    })),
  ],
});

export default router;
