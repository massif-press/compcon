<template>
  <v-row no-gutters align="start">
    <v-col
      v-if="$vuetify.display.mdAndUp"
      style="width: 12vw; min-width: 200px; position: fixed"
      class="pt-2"
    >
      <slot name="alt" />
      <v-list
        density="compact"
        class="side-fixed"
        :style="popup ? `top: 65px; padding-bottom: 65px;` : ''"
      >
        <slot name="sidebar" />
      </v-list>
    </v-col>
    <v-col
      :style="$vuetify.display.mdAndUp ? 'margin-left: 12vw' : ''"
      :class="$vuetify.display.mdAndUp ? 'pl-7 mr-7' : ''"
    >
      <v-container class="pt-0">
        <slot />
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'CCSidebarView',
  props: {
    popup: {
      type: Boolean,
      required: false,
    },
  },
};
</script>

<style scoped>
.side-fixed {
  height: calc(100vh - 70px);
  overflow-y: scroll;
}
</style>
