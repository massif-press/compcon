<template>
  <div style="position: absolute; top: 0; right: 0; left: 0; height: 50px" class="bg-primary" />
  <v-tabs v-model="tab" grow density="compact" mandatory height="50px" bg-color="primary">
    <v-tab v-for="itemType in itemTypes" :key="itemType">
      <span class="heading" style="letter-spacing: 6px">{{ itemType }}s</span>
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item v-for="itemType in itemTypes">
      <narrative-collection :itemType="itemType" />
    </v-window-item>
  </v-window>

  <v-footer app>
    <v-btn variant="tonal" color="accent" class="mx-4" to="/gm/narrative/graph">
      <v-icon start icon="mdi-graph" />
      View Graph
    </v-btn>
    <v-spacer />
    <v-btn variant="tonal" color="accent" class="mx-4" @click="($refs as any).import.show()">
      <v-icon start icon="mdi-download" />
      Import
    </v-btn>
    <cc-solo-dialog ref="import" icon="mdi-download-multiple" no-confirm large title="Import">
      <importer @complete="($refs as any).import.hide()" />
    </cc-solo-dialog>
    <v-btn variant="tonal" color="accent" class="mx-4" @click="($refs as any).organize.show()"
      ><v-icon start icon="mdi-queue-first-in-last-out" />Organize</v-btn
    >
    <cc-solo-dialog
      ref="organize"
      icon="mdi-queue-first-in-last-out"
      no-confirm
      large
      title="Organize">
      <organizer type="narrative" />
    </cc-solo-dialog>
  </v-footer>
</template>

<script lang="ts">
import NarrativeCollection from './_components/narrativeCollection.vue';
import Organizer from '../_components/Organizer.vue';
import Importer from '../_components/Importer.vue';

export default {
  name: 'narrative-roster',
  components: {
    NarrativeCollection,
    Organizer,
    Importer,
  },
  data: () => ({
    tab: 0,
    itemTypes: ['Character', 'Location', 'Faction'],
  }),
};
</script>
