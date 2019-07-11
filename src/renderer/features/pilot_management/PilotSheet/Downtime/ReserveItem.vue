<template>
  <v-card class="ma-2" height="235px">
    <v-toolbar dark flat dense :color="color">
      <v-toolbar-title class="minor-title">{{reserve.Name}}</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="effect-text pa-2 ma-0">
      <span v-html="reserve.Description" />
      <v-btn
        block
        outline
        absolute
        bottom
        style="bottom: 10px; width:95%"
        :color="color"
        @click="clicked"
      >
        <v-icon left>add</v-icon>Add Reserve
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'reserve-item',
  props: {
    reserve: Object,
    color: String,
  },
  methods: {
    clicked() {
      this.$emit('click')
    },
  },
})
</script>
