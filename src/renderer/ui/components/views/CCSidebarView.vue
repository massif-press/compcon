<template>
  <v-container fluid>
    <v-navigation-drawer
      permanent
      fixed
      color="transparent"
      class="mr-3"
      :style="`top: ${$vuetify.application.top}px; padding-bottom: ${$vuetify.application.top}px;`"
    >
      <v-list nav dense>
        <slot name="sidebar"></slot>
      </v-list>
    </v-navigation-drawer>
    <v-layout row>
      <v-flex offset-xs2 class="pl-7 mr-7">
        <slot></slot>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-sidebar-view',
})
</script>
