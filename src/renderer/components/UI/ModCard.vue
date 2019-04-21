<template>
  <div class="ma-1">
    <v-card flat color="blue-grey darken-3" class="ma-2">
      <v-card-text class="title text-xs-center pb-1 pt-2">
        <span :class="missing ? 'grey--text' : ''" v-html="missing ? '// MISSING MOD DATA // ' : modData.name" />
        <br>
        <span class="caption">WEAPON MODIFICATION</span>
      </v-card-text>
      <v-card-text v-if="!missing" class="pb-0 pt-0">
        <em>{{modData.source}} {{modData.license}}, RANK <span v-for="n in modData.license_level" :key="n">I</span><br></em>
        <p v-if="modData.description" v-html="modData.description" class="fluff-text" />
        <p v-if="modData.effect" v-html="modData.effect" class="pl-2 effect-text"/>
        <v-layout class="mt-2">
          <item-tag v-for="(t, index) in modData.tags" :key="t.id + index" :tag-obj="t"/>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import ItemTag from './ItemTag.vue'
  
  export default Vue.extend({
    name: 'mod-card',
    props: {
      modData: Object,
      missing: Boolean
    },
    components: { ItemTag }
  })
</script>