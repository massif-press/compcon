<template>
  <v-container fluid>
    <v-row>
      <v-col :cols="cols" style="position: fixed">
        <slot name="alt" />
        <v-list
          dense
          class="side-fixed"
          :style="popup ? `top: 65px; padding-bottom: 65px;` : `top: 125px; padding-bottom: 65px;`"
        >
          <slot name="sidebar" />
        </v-list>
      </v-col>
      <v-col :offset="cols" class="pl-7 mr-7">
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
    cols: {
      type: [Number, String],
      required: false,
      default: '2',
    },
  },
})
</script>

<style scoped>
.side-fixed {
  height: calc(100vh - 70px);
  overflow-y: scroll;
}
</style>
