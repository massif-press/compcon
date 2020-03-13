import Vue from 'vue'
import Router from 'vue-router'
import encounterRoutes from './features/encounters/routes'
import pilotRoutes from './features/pilot_management/routes'
import compendiumRoutes from './features/compendium/routes'

import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, NavStore, store } from '@/store'

// import { Capacitor } from '@capacitor/core'

Vue.use(Router)

const setNavMode = (to, from, next) => {
  const p = to.path
  const ns = getModule(NavStore, store)

  if (p.includes('/compendium')) ns.setNavMode('compendium')
  else if (p.includes('/pilot_management')) ns.setNavMode('pilot')
  else if (p.includes('/gm')) ns.setNavMode('encounter')
  else ns.setNavMode('')

  ns.initDarkMode()

  next()
}

export default new Router({
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
      beforeEnter: setNavMode,
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
      beforeEnter: setNavMode,
      path: route.path = '/compendium/' + route.path,
    })),
    ...pilotRoutes.map(route => ({
      ...route,
      beforeEnter: setNavMode,
      path: route.path = '/pilot_management/' + route.path,
    })),
    ...encounterRoutes.map(route => ({
      ...route,
      beforeEnter: setNavMode,
      path: route.path = '/gm/' + route.path,
    })),
    {
      path: '*',
      redirect: '/',
    },
  ],
})
