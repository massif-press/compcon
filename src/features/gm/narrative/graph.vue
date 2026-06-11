<template>
  <v-container>{{ $t('gm.narrative.todo') }}</v-container>

  <v-footer app>
    <v-btn variant="tonal" color="accent" class="mx-4" to="/gm/narrative">
      <v-icon start icon="mdi-view-list" />
      {{ $t('gm.narrative.viewCollections') }}
    </v-btn>
    <v-spacer />
    <v-btn variant="tonal" color="accent" class="mx-4" @click="($refs as any).import.show()">
      <v-icon start icon="mdi-download" />
      {{ $t('common.import') }}
    </v-btn>
    <cc-dialog ref="import" icon="mdi-download-multiple" no-confirm large title="Import">
      <importer @complete="($refs as any).import.hide()" />
    </cc-dialog>
    <v-btn variant="tonal" color="accent" class="mx-4">
      <v-icon start icon="mdi-printer" />
      {{ $t('common.print') }}
    </v-btn>
  </v-footer>
</template>

<script setup lang="ts">
import Importer from '../_components/NpcImporter.vue';

defineOptions({ name: 'narrative-graph' })
</script>
