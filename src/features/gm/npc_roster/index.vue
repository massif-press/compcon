<template>
  <div style="position: absolute; top: 0; right: 0; left: 0; height: 50px" class="bg-primary" />
  <v-tabs v-model="tab" grow density="compact" class="pt-1" mandatory bg-color="primary">
    <v-tab selected-class="bg-accent">
      <span class="heading" style="letter-spacing: 6px">NPCs</span>
    </v-tab>
    <v-tab selected-class="bg-accent">
      <span class="heading" style="letter-spacing: 6px">Doodads</span>
    </v-tab>
    <v-tab selected-class="bg-accent">
      <span class="heading" style="letter-spacing: 6px">Eidolons</span>
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item>
      <npc-index :id="id" :view="view" />
    </v-window-item>
    <v-window-item>
      <doodad-index :id="id" :view="view" />
    </v-window-item>
    <v-window-item>
      <eidolon-index :id="id" :view="view" />
    </v-window-item>
  </v-window>

  <v-footer app style="border-top: 1px solid rgb(var(--v-theme-panel))">
    <v-btn size="small" variant="tonal" color="accent" @click="switchView">
      <v-icon start :icon="view === 'collection' ? 'mdi-view-agenda' : 'mdi-format-list-group'" />
      View: {{ view }}
    </v-btn>
    <v-spacer />
    <v-btn
      size="small"
      variant="tonal"
      color="accent"
      class="mx-4"
      @click="($refs as any).import.show()">
      <v-icon start icon="mdi-download" />
      Import
    </v-btn>
    <cc-solo-dialog ref="import" icon="mdi-download-multiple" no-confirm large title="Import">
      <importer @complete="($refs as any).import.hide()" />
    </cc-solo-dialog>
    <v-btn
      size="small"
      variant="tonal"
      color="accent"
      class="mx-4"
      @click="($refs as any).organize.show()">
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
import { UserStore } from '@/stores';

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
    view: 'collection',
  }),
  watch: {
    view(val) {
      if (!val) return;
      UserStore().User.SetView('GmViewMode', val);
    },
  },
  created() {
    if (this.type) {
      this.tab = ['npc', 'doodad', 'eidolon'].indexOf(this.type);
    }

    const user = UserStore().User;
    if (!user || !user.View) return;
    this.view = user.View('GmViewMode', 'collection');
  },
  methods: {
    switchView() {
      this.view = this.view === 'split' ? 'collection' : 'split';
    },
  },
};
</script>
