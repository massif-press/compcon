<template>
  <v-card flat>
    <v-card-title v-if="!popup">
      <strong class="title">{{itemData.name}}</strong>
    </v-card-title>
    <v-card-text :class="{'pb-0 pt-0' : popup}">
      <!-- Weapon -->
      <div v-if="itemData.data_type === 'weapon'">
        <p v-html="'Weapon'" class="pa-0 ma-0 mb-2 title"/>
        <p v-if="itemData.description" class="fluff-text" v-html="itemData.description" />
        <p class="pa-0 ma-0 mb-2 title">{{itemData.mount}} {{itemData.type}}</p>
        <p v-if="itemData.sp" v-html="`${itemData.sp} SP`" class="pa-0 ma-0 mb-2 title" />
        <damage-element :dmg="itemData.damage" />
        <range-element :range="itemData.range" />
        <p v-if="itemData.effect" v-html="itemData.effect" class="effect-text" />
      </div>
      <!-- System -->
      <div v-else-if="itemData.data_type === 'system' || itemData.data_type === 'mod'">
        <p v-if="itemData.type" v-html="itemData.type" class="pa-0 ma-0 mb-2 title"/>
        <p v-if="itemData.description" class="fluff-text" v-html="itemData.description" />
        <p v-if="itemData.sp" v-html="`${itemData.sp} SP`" class="pa-0 ma-0 mb-2 title"/>
        <p v-if="itemData.effect" v-html="`${itemData.effect}`" class="effect-text"/>
      </div>
      <!-- Frame -->
      <div v-else>
        <b class="ml-3">{{itemData.source}} {{itemData.mechtype}} Frame</b>
        <frame-statblock :frame="itemData" />
      </div>
      <v-layout>
        <item-tag v-for="t in itemData.tags" :key="t.id" :tag-obj="t"/>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue'
  import RangeElement from './RangeElement.vue'
  import DamageElement from './DamageElement.vue'
  import FrameStatblock from './FrameStatblock.vue'
  import ItemTag from './ItemTag.vue'

  export default Vue.extend({
    name: 'item-card',
    props: {
      itemData: Object,
      popup: Boolean
    },
    components: { DamageElement, RangeElement, FrameStatblock, ItemTag },
    computed: {
      pilot: function () {
        return this.$store.getters['getPilot']
      }
    }
  })
</script>
