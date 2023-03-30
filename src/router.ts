import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
// import encounterRoutes from './features/encounters/routes'
import gmRoutes from './features/gm/routes';
import pilotRoutes from './features/pilot_management/routes';
import compendiumRoutes from './features/compendium/routes';
import activeModeRoutes from './features/active_mode/routes';

import MainMenu from './features/main_menu/index.vue';
import UITest from './features/ui_test/index.vue';

import updateChecker from './util/UpdateChecker';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main-menu',
      component: MainMenu,
    },
    {
      path: '/ui-test',
      name: 'ui-test',
      component: UITest,
    },
    ...compendiumRoutes.map((route) => ({
      ...route,
      path: (route.path = '/compendium/' + route.path),
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

router.afterEach(() => {
  updateChecker.checkUpdates();
});

export default router;
