<template>
  <v-flex :shrink="shrink">
    <span v-if="caption" class="caption" v-html="caption" />
    <v-rating dense readonly v-model="model" :small="small" :large="large" :x-large="xLarge" 
    :length="items.reduce((a,b) => a + b, 0)" 
    :empty-icon="icons ? icons[0] : 'brightness_7'" 
    :full-icon="icons && icons[1] ? icons[1] : 'brightness_1'" />
  </v-flex>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'pip-bar',
    props: {
      model: Number,
      shrink: Boolean,
      small: Boolean,
      large: Boolean,
      xLarge: Boolean,
      items: Array,
      icons: Array,
      caption: String
    }
  })
</script>