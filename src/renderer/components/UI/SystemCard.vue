<template>
    <v-card flat :color="tableItem ? '' : '#373737'">
      <v-card-text class="pb-0 pt-0">
        <div class="pt-2">
          <em v-if="!itemData.license">{{itemData.source}}<br></em>
          <em v-else>{{itemData.source}} {{itemData.license}}, RANK <span v-for="n in itemData.license_level" :key="n">I</span><br></em>
        </div>
        <p v-if="itemData.description" v-html="itemData.description" class="fluff-text" />
        <p class="effect-text font-weight-bold">{{itemData.type}} ({{itemData.sp}} SP)</p>
        <p v-if="itemData.effect" v-html="itemData.effect" class="pl-2 effect-text"/>
        <v-layout class="pb-2">
          <item-tag v-for="t in itemData.tags" :key="t.id" :tag-obj="t"/>
        </v-layout>
      </v-card-text>
    </v-card>
</template>

<script lang="ts">
  import Vue from 'vue'
  import ItemTag from './ItemTag.vue'

  export default Vue.extend({
    name: 'system-card',
    props: {
      itemData: Object,
      tableItem: Boolean
    },
    components: { ItemTag }
  })
</script>
