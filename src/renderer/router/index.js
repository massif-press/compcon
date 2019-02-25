import Vue from 'vue'
import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import Icon from 'vue-awesome/icons'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.component('b-icon', Icon)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/roster',
      name: 'roster',
      component: require('@/components/Roster/index').default,
      children: [
        {
          path: '',
          component: require('@/components/Roster/PilotSheet/index').default
        },
        {
          path: '/config',
          component: require('@/components/Roster/ConfigSheet/index').default
        },
        {
          path: '/new',
          component: require('@/components/Roster/PilotSheet/New/index').default
        },
        {
          path: '/level',
          component: require('@/components/Roster/PilotSheet/Level/index').default
        }
      ]
    },
    {
      path: '/mods',
      name: 'mod-editor',
      component: require('@/components/Roster/index').default
    },
    {
      path: '/gm',
      name: 'gm-tools',
      component: require('@/components/Roster/index').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
