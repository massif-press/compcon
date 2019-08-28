<template>
  <div style="height: 95vh">
    <v-container style="height: 100%">
      <v-row align-center justify="center"fill-height>
        <v-col>
          <slot name="contents"></slot>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'empty-view',
})
</script>
