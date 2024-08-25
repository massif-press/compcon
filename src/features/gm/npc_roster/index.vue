<template>
  <div style="position: absolute; top: 0; right: 0; left: 0; height: 50px" class="bg-primary" />
  <v-tabs v-model="tab" grow density="compact" mandatory height="50px" bg-color="primary">
    <v-tab><span class="heading" style="letter-spacing: 6px">NPCs</span></v-tab>
    <v-tab><span class="heading" style="letter-spacing: 6px">Doodads</span></v-tab>
    <v-tab><span class="heading" style="letter-spacing: 6px">Eidolons</span></v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item>
      <npc-index :id="id" />
    </v-window-item>
    <v-window-item>
      <doodad-index :id="id" />
    </v-window-item>
    <v-window-item>
      <eidolon-index :id="id" />
    </v-window-item>
  </v-window>

  <v-footer app>
    <v-spacer />
    <v-btn variant="tonal" color="accent" class="mx-4" @click="($refs as any).import.show()">
      <v-icon start icon="mdi-download" />
      Import
    </v-btn>
    <cc-solo-dialog ref="import" icon="mdi-download-multiple" no-confirm large title="Import">
      <importer @complete="($refs as any).import.hide()" />
    </cc-solo-dialog>
    <v-btn variant="tonal" color="accent" class="mx-4" @click="($refs as any).organize.show()">
      <v-icon start icon="mdi-queue-first-in-last-out" />
      Organize
    </v-btn>
    <cc-solo-dialog
      ref="organize"
      icon="mdi-queue-first-in-last-out"
      no-confirm
      large
      title="Organize">
      <organizer type="npc" />
    </cc-solo-dialog>
  </v-footer>
</template>

<script lang="ts">
import NpcIndex from './npcs/index.vue';
import DoodadIndex from './doodads/index.vue';
import EidolonIndex from './eidolons/index.vue';
import Organizer from '../_components/Organizer.vue';
import Importer from '../_components/Importer.vue';

export default {
  name: 'npc-roster',
  components: { NpcIndex, DoodadIndex, EidolonIndex, Organizer, Importer },
  props: {
    type: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    tab: 0,
  }),
  created() {
    if (this.type) {
      this.tab = ['npc', 'doodad', 'eidolon'].indexOf(this.type);
    }
  },
};
</script>
