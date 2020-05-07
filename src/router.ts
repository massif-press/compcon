import Vue from 'vue'
import Router from 'vue-router'
import encounterRoutes from './features/encounters/routes'
import pilotRoutes from './features/pilot_management/routes'
import compendiumRoutes from './features/compendium/routes'

import { getModule } from 'vuex-module-decorators'
import { NavStore, store } from '@/store'

import updateChecker from '@/classes/utility/UpdateChecker'

// import { Capacitor } from '@capacitor/core'

Vue.use(Router)

const r = new Router({
  // TODO: put in a check for dev here so it doesn't break HMR
  // mode: Capacitor.platform === 'web' ? 'history' : 'hash',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'main-menu',
      component: require('@/features/main_menu/index').default,
    },
    {
      path: '/ui-test',
      name: 'ui-test',
      component: require('@/features/ui_test/index').default,
    },
    ...compendiumRoutes.map(route => ({
      ...route,
      path: route.path = '/compendium/' + route.path,
    })),
    ...pilotRoutes.map(route => ({
      ...route,
      path: route.path = '/pilot_management/' + route.path,
    })),
    ...encounterRoutes.map(route => ({
      ...route,
      path: route.path = '/gm/' + route.path,
    })),
    {
      path: '*',
      redirect: '/',
    },
  ],
})

r.beforeEach((to, from, next) => {
  const p = to.path
  const ns = getModule(NavStore, store)

  if (p.includes('/compendium')) ns.setNavMode('compendium')
  else if (p.includes('/pilot') || p.includes('/active') || p.includes('/new'))
    ns.setNavMode('pilot')
  else if (p.includes('/gm')) ns.setNavMode('encounter')
  else ns.setNavMode('')

  ns.initDarkMode()

  next()
})

r.afterEach(() => {
  updateChecker.checkUpdates()
})

export default r
