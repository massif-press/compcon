<template>
  <v-container> todo </v-container>

  <v-footer app>
    <v-btn variant="tonal" color="accent" class="mx-4" to="/gm/narrative">
      <v-icon start icon="mdi-view-list" />
      View Collections
    </v-btn>
    <v-spacer />
    <v-btn variant="tonal" color="accent" class="mx-4" @click="($refs as any).import.show()">
      <v-icon start icon="mdi-download" />
      Import
    </v-btn>
    <cc-solo-dialog ref="import" icon="mdi-download-multiple" no-confirm large title="Import">
      <importer @complete="($refs as any).import.hide()" />
    </cc-solo-dialog>
    <v-btn variant="tonal" color="accent" class="mx-4"
      ><v-icon start icon="mdi-printer" />Print</v-btn
    >
  </v-footer>
</template>

<script lang="ts">
import Importer from '../_components/Importer.vue';

export default {
  name: 'narrative-graph',
  components: {
    Importer,
  },
};
</script>
