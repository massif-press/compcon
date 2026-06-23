import { createRouter, createWebHistory } from 'vue-router'
import gmRoutes from './features/gm/routes'
import pilotRoutes from './features/pilot_management/routes'
import compendiumRoutes from './features/compendium/routes'
import activeModeRoutes from './features/active_mode/routes'
import MainMenu from './features/main_menu/index.vue'
const UITest = () => import('./features/ui_test/old.vue')
const UITestv3 = () => import('./features/ui_test/index.vue')

const ItemLink = () => import('./features/main_menu/itemLink.vue')
const PilotLink = () => import('./features/pilot_management/link/index.vue')

const Redirect = () => import('./features/main_menu/_components/oauth/Redirect.vue')

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
      path: '/link/pilot/:sharecode/:style?/:mechId?',
      name: 'pilot_link',
      component: PilotLink,
      props: true,
    },
    {
      path: '/ui-test',
      name: 'ui-test',
      component: UITest,
      meta: { title: 'UI Test' },
    },
    {
      path: '/ui-test-new',
      name: 'ui-test-new',
      component: UITestv3,
      meta: { title: 'v3 UI Test' },
    },
    {
      path: '/oauth/callback',
      name: 'OAuthCallback',
      component: Redirect,
    },
    ...compendiumRoutes.map(route => ({
      ...route,
      path: '/srd/' + route.path,
    })),
    ...pilotRoutes.map(route => ({
      ...route,
      path: '/pilot_management/' + route.path,
    })),
    ...activeModeRoutes.map(route => ({
      ...route,
      path: '/active-mode/' + route.path,
    })),
    ...gmRoutes.map(route => ({
      ...route,
      path: '/gm/' + route.path,
    })),
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    if (to.name && String(to.name).startsWith('srd_')) return false
    return { top: 0 }
  },
})

router.afterEach(to => {
  if (!to.meta?.title) {
    document.title = 'COMP/CON'
    return
  }
  if (typeof to.meta.title === 'function') document.title = `CC - ${to.meta.title(to)}`
  else document.title = `C/C - ${to.meta.title}`
})

export default router
