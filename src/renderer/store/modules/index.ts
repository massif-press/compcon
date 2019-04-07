// /**
//  * The file enables `@/store/index.js` to import all vuex modules
//  * in a one-shot manner. There should not be any reason to edit this file.
//  */

// // const files = require.context('.', false, /\.js$/)
// // const modules = {}

// // files.keys().forEach(key => {
// //   if (key === './index.ts') return
// //   modules[key.replace(/(\.\/|\.ts)/g, '')] = files(key).default
// // })

import compendium from './compendium'
import configs from './configs'
import datastore from './datastore'
import pilots from './pilots'
import print from './print'

export default {
  compendium,
  configs,
  datastore,
  pilots,
  print,
}
