/* eslint-disable */
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue-mousetrap'

declare module 'gist-client'

declare module 'imgur'

declare module 'vuedraggable'

declare module "*.txt" {
  const content: string;
  export default content;
}

declare module 'lancer-data' {
  const backgrounds: any
  const skills: any
  const core_bonuses: any
  const glossary: any
  const frames: any
  const info: any
  const manufacturers: any
  const mods: any
  const pilot_gear: any
  const quirks: any
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
  // const npc_generic_systems: any
  // const npc_systems: any
  // const npc_template_systems: any
}
