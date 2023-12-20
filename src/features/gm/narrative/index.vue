<template>
  <!-- TODO: eidolon check -->
  <div style="position: absolute; top: 0; right: 0; left: 0; height: 50px" class="bg-primary" />
  <v-tabs v-model="tab" grow density="compact" mandatory height="50px" bg-color="primary">
    <v-tab><span class="heading" style="letter-spacing: 6px">Characters</span> </v-tab>
    <v-tab><span class="heading" style="letter-spacing: 6px">Locations</span> </v-tab>
    <v-tab><span class="heading" style="letter-spacing: 6px">Factions</span> </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item>
      <character-index />
    </v-window-item>
    <v-window-item>
      <location-index />
    </v-window-item>
    <v-window-item>
      <faction-index />
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import CharacterIndex from './characters/index.vue';
import LocationIndex from './locations/index.vue';
import FactionIndex from './factions/index.vue';

export default {
  name: 'npc-roster',
  components: {
    CharacterIndex,
    LocationIndex,
    FactionIndex,
  },
  data: () => ({
    tab: 0,
  }),
};
</script>
