<template>
  <div
    style="position: absolute; top: 0; right: 0; left: 0; height: 50px"
    class="bg-primary"
  />
  <v-tabs
    v-model="tab"
    grow
    slider-color="secondary"
    :height="mobile ? '24px' : '28px'"
    density="compact"
    mandatory
    bg-color="primary"
  >
    <v-tab selected-class="bg-accent">
      <b>NPCs</b>
    </v-tab>
    <v-tab selected-class="bg-accent">
      <b>Doodads</b>
    </v-tab>
    <v-tab selected-class="bg-accent">
      <b>Eidolons</b>
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item>
      <npc-index
        :id="id"
        @open-import="importModal = true"
        @open-organizer="orgModal = true"
      />
    </v-window-item>
    <v-window-item>
      <doodad-index
        :id="id"
        @open-import="importModal = true"
        @open-organizer="orgModal = true"
      />
    </v-window-item>
    <v-window-item>
      <eidolon-index
        :id="id"
        @open-import="importModal = true"
        @open-organizer="orgModal = true"
      />
    </v-window-item>
  </v-window>

  <cc-solo-modal
    v-model="importModal"
    icon="mdi-download-multiple"
    title="Import"
    shrink
  >
    <importer @complete="importModal = false" />
  </cc-solo-modal>

  <cc-solo-modal
    v-model="orgModal"
    icon="mdi-queue-first-in-last-out"
    shrink
    title="Organize"
  >
    <organizer type="npc" />
  </cc-solo-modal>
</template>

<script lang="ts">
import NpcIndex from './npcs/index.vue';
import DoodadIndex from './doodads/index.vue';
import EidolonIndex from './eidolons/index.vue';
import Organizer from '../_components/Organizer.vue';
import Importer from '../_components/NpcImporter.vue';

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
    importModal: false,
    shareModal: false,
    orgModal: false,
  }),
  created() {
    if (this.type) {
      this.tab = ['npc', 'doodad', 'eidolon'].indexOf(this.type);
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
