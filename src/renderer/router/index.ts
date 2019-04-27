import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
    },
    {
      path: '/roster',
      name: 'roster',
      component: require('@/components/Roster/index').default,
      children: [
        {
          path: '',
          component: require('@/components/Roster/RosterView/index').default,
        },
        {
          path: '/pilot',
          component: require('@/components/Roster/PilotSheet/index').default,
        },
        {
          path: '/hangar',
          component: require('@/components/Roster/HangarView/index').default,
        },
        {
          path: '/config',
          component: require('@/components/Roster/ConfigSheet/index').default,
        },
        {
          path: '/new',
          component: require('@/components/Roster/PilotSheet/New/index').default,
        },
        {
          path: '/level',
          component: require('@/components/Roster/PilotSheet/Level/index').default,
        },
        {
          path: '/compendium',
          component: require('@/components/Compendium/index').default,
          children: [
            {
              path: '',
              component: require('@/components/Compendium/Views/Home').default,
            },
            {
              path: '/compendium/search',
              component: require('@/components/Compendium/Views/SearchResults').default,
            },
            {
              path: '/compendium/item/:type/:id',
              component: require('@/components/Compendium/Views/CompendiumItem').default,
            },
            {
              path: '/licenses',
              component: require('@/components/Compendium/Views/Licenses').default,
            },
            {
              path: '/manufacturers',
              component: require('@/components/Compendium/Views/Manufacturers').default,
            },
            {
              path: '/frames',
              component: require('@/components/Compendium/Views/Frames').default,
            },
            {
              path: '/weapons',
              component: require('@/components/Compendium/Views/Weapons').default,
            },
            {
              path: '/systems',
              component: require('@/components/Compendium/Views/Systems').default,
            },
            {
              path: '/pilot_gear',
              component: require('@/components/Compendium/Views/PilotGear').default,
            },
            {
              path: '/statuses',
              component: require('@/components/Compendium/Views/Statuses').default,
            },
            {
              path: '/tags',
              component: require('@/components/Compendium/Views/Tags').default,
            },
          ],
        },
      ],
    },
    {
      path: '/print-pilot',
      component: require('@/components/Roster/PilotSheet/Print/PrintView').default,
    },
    {
      path: '/print-config',
      component: require('@/components/Roster/ConfigSheet/Print/PrintView').default,
    },
    {
      path: '/mods',
      name: 'mod-editor',
      component: require('@/components/Roster/index').default,
    },
    {
      path: '/gm',
      name: 'gm-tools',
      component: require('@/components/Roster/index').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
