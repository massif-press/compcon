<template>
  <div>
    <router-link to="/gm">
      <v-btn text color="white" tile>Encounter Toolkit</v-btn>
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
    <router-link to="/pilot_management">
      <v-btn text color="white" tile>Pilot Roster</v-btn>
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'compendium-nav-mode',
})
</script>
