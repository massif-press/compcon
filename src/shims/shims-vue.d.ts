declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare module 'modules'

declare module 'vuetify'
declare module 'gist-client'
declare module 'imgur'
declare module 'vuedraggable'
declare module 'tiptap-vuetify'
declare module 'vue-html-secure'

declare module '*.txt' {
  const content: string
  export default content
}
declare module '*.json' {
  const value: any
  export default value
}

declare module '*.svg' {
  const content: any
  export default content
}

declare module '@massif/lancer-data' {
  const backgrounds: any
  const skills: any
  const core_bonuses: any
  const glossary: any
  const frames: any
  const info: any
  const manufacturers: any
  const mods: any
  const pilot_gear: any
  const tables: any
  const statuses: any
  const systems: any
  const tags: any
  const talents: any
  const weapons: any
  const rules: any
  const actions: any
  const reserves: any
  const npc_classes: any
  const npc_templates: any
  const npc_features: any
  const environments: any
  const sitreps: any
}

// declare module 'vue/types/vue' {
//   interface Vue {
//     $appVersion: string
//     $lancerVersion: string
//     $notify: (text: string, type?: string, onClick?: () => void) => void
//   }
// }

declare module 'promisify-file-reader'
declare module 'file-saver'
declare module 'uuid/v4'
