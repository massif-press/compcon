<template>
  <v-container fluid style="overflow: hidden">
    <v-row>
      <v-col cols="3" class="pr-4">
        <v-row>
          <v-col class="text-center">
            <span class="minor-title">{{ title }}</span>
            <v-divider class="ma-2 ml-4 mr-4" />
          </v-col>
        </v-row>
        <slot name="left-column"></slot>
      </v-col>
      <v-col cols="9" style="height: 90vh; overflow-y: scroll">
        <slot name="right-column"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'selector',
  props: {
    title: String,
  },
})
</script>
