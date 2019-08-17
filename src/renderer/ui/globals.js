import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context('./components', true, /[\w-]+\.vue$/)

requireComponent.keys().forEach(location => {
  const componentConfig = requireComponent(location)
  const fileName = location.match(/[\w-]+\.vue$/)[0]
  if (fileName.substring(0, 1) !== '_') {
    const componentName = upperFirst(camelCase(fileName.replace(/\.\w+$/, '')))
    Vue.component(componentName, componentConfig.default || componentConfig)
  }
})
