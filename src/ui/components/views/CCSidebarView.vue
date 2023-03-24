<template>
  <v-container fluid class="mt-n3">
    <v-row dense no-gutters>
      <v-col
        v-if="$vuetify.display.mdAndUp"
        style="width: 12vw; position: fixed"
        class="pt-2"
      >
        <slot name="alt" />
        <v-list
          dense
          class="side-fixed"
          :style="
            popup
              ? `top: 65px; padding-bottom: 65px;`
              : `top: 125px; padding-bottom: 65px;`
          "
        >
          <slot name="sidebar" />
        </v-list>
      </v-col>
      <v-col
        :style="$vuetify.display.mdAndUp ? 'margin-left: 12vw' : ''"
        :class="$vuetify.display.mdAndUp ? 'pl-7 mr-7' : ''"
      >
        <slot />
      </v-col>
    </v-row>
  </v-container>
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
