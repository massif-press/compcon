<template>
  <div style="position: absolute; top: 0; right: 0; left: 0; height: 50px" class="bg-primary" />
  <v-tabs
    v-model="tab"
    grow
    slider-color="secondary"
    :height="mobile ? '24px' : '28px'"
    density="compact"
    mandatory
    bg-color="primary">
    <v-tab v-for="itemType in itemTypes" :key="itemType" selected-class="bg-accent">
      <b>{{ itemType }}s</b>
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item v-for="itemType in itemTypes">
      <narrative-collection
        :itemType="itemType"
        :id="id"
        @open-import="importModal = true"
        @open-organizer="orgModal = true" />
    </v-window-item>
  </v-window>

  <cc-solo-modal v-model="importModal" icon="mdi-download-multiple" title="Import" shrink>
    <importer @complete="($refs as any).import.hide()" />
  </cc-solo-modal>

  <cc-solo-modal v-model="orgModal" icon="mdi-queue-first-in-last-out" shrink title="Organize">
    <organizer type="npc" />
  </cc-solo-modal>
</template>

<script lang="ts">
import NarrativeCollection from './_components/narrativeCollection.vue';
import Organizer from '../_components/Organizer.vue';
import Importer from '../_components/NpcImporter.vue';
import ShareCodeDialog from '@/features/main_menu/_components/account/_components/data_viewer/shareCodeDialog.vue';

export default {
  name: 'narrative-roster',
  components: {
    NarrativeCollection,
    Organizer,
    Importer,
    ShareCodeDialog,
  },
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
    orgModal: false,
    itemTypes: ['Character', 'Location', 'Faction'],
    view: 'collection',
  }),
  created() {
    if (this.type) {
      this.tab = ['character', 'location', 'faction'].indexOf(this.type);
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
