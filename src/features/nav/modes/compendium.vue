<template>
  <div>
    <v-btn text color="white" tile to="/gm">Encounter Toolkit</v-btn>
    <v-divider vertical dark class="ml-2 mr-2" />
    <v-btn text color="white" tile to="/pilot_management">Pilot Roster</v-btn>
    <v-divider vertical dark class="ml-2 mr-2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'compendium-nav-mode',
})
</script>
