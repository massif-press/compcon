<template>
  <div style="height: 95vh">
    <v-container style="height: 100%">
      <v-layout align-center justify-center row fill-height>
        <v-flex>
          <slot name="contents"></slot>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'empty-view'
  })
</script>
