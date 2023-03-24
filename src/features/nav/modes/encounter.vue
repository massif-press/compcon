<template>
  <div>
    <router-link to="/gm/npc-roster">
      <v-btn text color="white" tile>NPC Roster</v-btn>
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
    <router-link to="/gm/encounter-builder">
      <v-btn text color="white" tile>Encounters</v-btn>
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
    <router-link to="/gm/mission/builder">
      <v-btn v-if="$vuetify.display.lgAndUp" text color="white" tile
        >Mission Builder</v-btn
      >
    </router-link>
    <router-link to="/gm/mission/selector">
      <v-btn v-if="$vuetify.display.lgAndUp" text color="white" tile
        >Mission Runner</v-btn
      >
    </router-link>
    <router-link to="/gm/mission">
      <v-btn v-if="!$vuetify.display.lgAndUp" text color="white" tile
        >Missions</v-btn
      >
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'encounter-nav-mode',
};
</script>
