import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context('./components', true, /[\w-]+\.vue$/)

// The preferred filename pattern for compcon-specific components is CCFileName.vue,
// which is then rendered into 'cc-file-name' as a component. Internal subcomponents
// should be arranged into folders and prefixed with a _, which will omit them from
// the collector below.

requireComponent.keys().forEach(location => {
  const componentConfig = requireComponent(location)
  const fileName = location.match(/[\w-]+\.vue$/)[0]
  if (fileName.substring(0, 1) !== '_') {
    const componentName = upperFirst(camelCase(fileName.replace(/\.\w+$/, '')))
    Vue.component(componentName, componentConfig.default || componentConfig)
  }
})
