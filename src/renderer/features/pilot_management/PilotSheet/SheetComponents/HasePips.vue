<template>
  <v-flex>
    <span class="text-uppercase">{{title}}</span> <span class="grey--text">({{attr || 0}})</span>
    <v-rating v-model="attr" hover x-large length=6 readonly dense empty-icon="mdi-hexagon-outline" full-icon="mdi-hexagon-slice-6"/>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name:'hase-pips',
  props: {
    title: String,
    attribute: String
  },
  computed: {
    attr(): number {
      return this.$store.getters['getPilot'].mechSkills[this.attribute]
    }
  }
})
</script>
