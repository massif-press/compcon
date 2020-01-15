import Vue from 'vue'
import Router from 'vue-router'
import encounterRoutes from './features/encounters/routes'
import { Capacitor } from '@capacitor/core'

Vue.use(Router)

export default new Router({
  // TODO: put in a check for dev here so it doesn't break HMR
  // mode: Capacitor.platform === 'web' ? 'history' : 'hash',
  scrollBehavior() {
    return { x: 0, y: 0 }
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
    {
      path: '/pilot_management',
      component: () =>
        import(/* webpackChunkName: "pilotManagement" */ '@/features/pilot_management/index.vue'),
      children: [
        {
          path: '',
          name: 'pilot_roster',
          component: () =>
            import(
              /* webpackChunkName: "pilotManagement" */ '@/features/pilot_management/Roster/index.vue'
            ),
        },
        {
          path: '/print/:pilotID/:mechID',
          component: () =>
            import(
              /* webpackChunkName: "pilotManagement" */ '@/features/pilot_management/Print/index.vue'
            ),
          props: true,
        },
        {
          path: '/pilot/:pilotID',
          name: 'pilot-sheet',
          component: () =>
            import(
              /* webpackChunkName: "pilotManagement" */ '@/features/pilot_management/PilotSheet/index.vue'
            ),
          props: true,
          children: [
            {
              name: 'pilot_sheet',
              path: '',
              redirect: 'sheet/1',
            },
            {
              name: 'mech_hangar',
              path: '',
              redirect: 'sheet/3',
            },
            {
              path: 'sheet/:tab',
              component: () =>
                import(
                  /* webpackChunkName: "pilotManagement" */ '@/features/pilot_management/PilotSheet/layouts/index.vue'
                ),
              props: true,
            },
            {
              path: 'mech/:mechID',
              component: () =>
                import(
                  /* webpackChunkName: "pilotManagement" */ '@/features/pilot_management/PilotSheet/sections/mech/index.vue'
                ),
              props: true,
            },
          ],
        },
        {
          path: '/active/:pilotID',
          props: true,
          component: () =>
            import(
              /* webpackChunkName: "pilotManagement" */ '@/features/pilot_management/ActiveSheet/index.vue'
            ),
        },
        {
          path: 'level/:pilotID',
          name: 'level-up',
          props: true,
          component: () =>
            import(
              /* webpackChunkName: "pilotManagement" */ '@/features/pilot_management/Level/index.vue'
            ),
        },
        {
          path: '/new',
          component: () =>
            import(
              /* webpackChunkName: "pilotManagement" */ '@/features/pilot_management/New/index.vue'
            ),
        },
        {
          path: '/compendium',
          component: require('@/features/compendium/index').default,
          children: [
            {
              path: '',
              component: require('@/features/compendium/Views/Home').default,
            },
            {
              path: '/compendium/search',
              component: require('@/features/compendium/Views/SearchResults').default,
            },
            {
              path: '/licenses',
              component: require('@/features/compendium/Views/Licenses').default,
            },
            {
              path: '/manufacturers',
              component: require('@/features/compendium/Views/Manufacturers').default,
            },
            {
              path: '/frames',
              component: require('@/features/compendium/Views/Frames').default,
            },
            {
              path: '/weapons',
              component: require('@/features/compendium/Views/Weapons').default,
            },
            {
              path: '/systems',
              component: require('@/features/compendium/Views/Systems').default,
            },
            {
              path: '/pilot_gear',
              component: require('@/features/compendium/Views/PilotGear').default,
            },
            {
              path: '/skills',
              component: require('@/features/compendium/Views/Skills').default,
            },
            {
              path: '/statuses',
              component: require('@/features/compendium/Views/Statuses').default,
            },
            {
              path: '/tags',
              component: require('@/features/compendium/Views/Tags').default,
            },
            {
              path: '/reference',
              component: require('@/features/compendium/Views/Reference').default,
            },
            {
              path: '/corebonuses',
              component: require('@/features/compendium/Views/CoreBonuses').default,
            },
            {
              path: '/talents',
              component: require('@/features/compendium/Views/Talents').default,
            },
            {
              path: '/backgrounds',
              component: require('@/features/compendium/Views/Backgrounds').default,
            },
            {
              path: '/actions',
              component: require('@/features/compendium/Views/ActionEconomy').default,
            },
            {
              path: '/glossary',
              component: require('@/features/compendium/Views/Glossary').default,
            },
            {
              path: '/reserves',
              component: require('@/features/compendium/Views/Reserves').default,
            },
          ],
        },
      ],
    },
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
