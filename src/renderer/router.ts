import Vue from 'vue'
import Router from 'vue-router'

import gmToolkitRoutes from './features/gm_toolkit/routes'

Vue.use(Router)

export default new Router({
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
      component: require('@/features/pilot_management/index').default,
      children: [
        {
          path: '',
          name: 'pilot_roster',
          component: require('@/features/pilot_management/Roster/index').default,
        },
        {
          path: '/print/:pilotID/:mechID',
          component: require('@/features/pilot_management/Print/index').default,
          props: true,
        },
        {
          path: '/pilot',
          component: require('@/features/pilot_management/PilotSheet/index').default,
          children: [
            {
              name: 'pilot_sheet',
              path: '',
              redirect: '/sheet/1',
            },
            {
              name: 'mech_hangar',
              path: '',
              redirect: '/sheet/3',
            },
            {
              path: '/sheet/:tab',
              component: require('@/features/pilot_management/PilotSheet/layouts/index').default,
              props: true,
            },
            {
              path: '/mech/:pilotID/:mechID',
              component: require('@/features/pilot_management/PilotSheet/sections/mech/index')
                .default,
              props: true,
            },
          ],
        },
        {
          path: '/new',
          component: require('@/features/pilot_management/New/index').default,
        },
        {
          path: '/level',
          component: require('@/features/pilot_management/Level/index').default,
        },
        {
          path: '/active',
          component: require('@/features/pilot_management/ActiveSheet/index').default,
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
    // {
    //   path: '/print-pilot',
    //   component: require('@/features/pilot_management/PilotSheet/Print/PrintView').default,
    // },
    // {
    //   path: '/print-all',
    //   component: require('@/features/pilot_management/PilotSheet/Print/CombinedPrintView').default,
    // },
    // {
    //   path: '/print-config',
    //   component: require('@/features/pilot_management/ConfigSheet/Print/PrintView').default,
    // },
    ...gmToolkitRoutes.map(route => ({
      ...route,
      path: route.path.replace(/^\//, '/gm'),
    })),
    // {
    //   path: "/homebrew",
    //   name: "homebrew-editor",
    //   component: require("@/features/homebrew/index")
    //     .default
    // },
    // {
    //   path: "/gm",
    //   name: "gm-tools",
    //   component: require("@/features/gm/index")
    //     .default
    // },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
