<template>
  <!-- TODO: eidolon check -->
  <div style="position: absolute; top: 0; right: 0; left: 0; height: 50px" class="bg-primary" />
  <v-tabs v-model="tab" grow density="compact" mandatory height="50px" bg-color="primary">
    <v-tab><span class="heading" style="letter-spacing: 6px">NPCs</span> </v-tab>
    <v-tab><span class="heading" style="letter-spacing: 6px">Doodads</span> </v-tab>
    <v-tab><span class="heading" style="letter-spacing: 6px">Eidolons</span> </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item>
      <npc-index />
    </v-window-item>
    <v-window-item>
      <doodad-index />
    </v-window-item>
    <v-window-item>
      <eidolon-index />
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import NpcIndex from './npcs/index.vue';
import DoodadIndex from './doodads/index.vue';
import EidolonIndex from './eidolons/index.vue';

export default {
  name: 'npc-roster',
  components: { NpcIndex, DoodadIndex, EidolonIndex },
  data: () => ({
    tab: 0,
  }),
};
</script>
