<template>
  <v-container fluid class="mt-7">
    <pilot-header />
    <router-view></router-view>
    <v-spacer style="min-height: 80px" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotHeader from './components/PilotHeader.vue'

export default Vue.extend({
  name: 'pilot-sheet',
  components: { PilotHeader },
})
</script>