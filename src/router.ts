import { createRouter, createWebHashHistory } from 'vue-router';
// import encounterRoutes from './features/encounters/routes'
import gmRoutes from './features/gm/routes';
import pilotRoutes from './features/pilot_management/routes';
import compendiumRoutes from './features/compendium/routes';
import activeModeRoutes from './features/active_mode/routes';

import MainMenu from './features/main_menu/index.vue';
import UITest from './features/ui_test/index.vue';

import { NavStore, store } from './store';
import updateChecker from './util/UpdateChecker';

const router = createRouter({
  history: createWebHashHistory(),
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

// router.beforeEach((to, from, next) => {
//   if (to.path.includes('/compendium'))
//     store.dispatch('nav/setNavMode', 'compendium');
//   else if (
//     to.path.includes('/pilot') ||
//     to.path.includes('/active') ||
//     to.path.includes('/new')
//   )
//     store.dispatch('nav/setNavMode', 'pilot');
//   else if (to.path.includes('/gm'))
//     store.dispatch('nav/setNavMode', 'encounter');
//   else store.dispatch('nav/setNavMode', '');

//   next();
// });

// router.afterEach(() => {
//   updateChecker.checkUpdates();
// });

export default router;
