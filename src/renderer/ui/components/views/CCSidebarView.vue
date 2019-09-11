<template>
  <v-container fluid>
    <v-navigation-drawer
      permanent
      fixed
      color="transparent"
      class="mr-3"
      :style="popup
        ? `top: 65px; padding-bottom: 65px;`
        : `top: ${$vuetify.application.top}px; padding-bottom: ${$vuetify.application.top}px;`"
    >
      <v-list nav dense>
        <slot name="sidebar" />
      </v-list>
    </v-navigation-drawer>
    <v-row>
      <v-col offset="2" class="pl-7 mr-7">
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-sidebar-view',
  props: {
    popup: {
      type: Boolean,
      required: false,
    },
  },
})
</script>
