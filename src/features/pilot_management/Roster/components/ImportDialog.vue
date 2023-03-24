<template>
  <v-tabs fixed-tabs slider-color="secondary">
    <v-tab ripple class="heading h3">Import from File</v-tab>
    <v-tab ripple class="heading h3" :disabled="!isAuthed">
      <span>
        <div>Import from Share Code</div>
        <div
          v-if="!isAuthed"
          class="overline"
          v-text="`Requires COMP/CON cloud account`"
        />
      </span>
    </v-tab>
    <v-tab-item>
      <file-import />
    </v-tab-item>
    <v-tab-item>
      <share-import />
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import FileImport from './add_panels/FileImport.vue';
import ShareImport from './add_panels/ShareImport.vue';

import { UserStore } from '@/store';

export default {
  name: 'import-dialog',
  components: { FileImport, ShareImport },
  computed: {
    isAuthed() {
      return this.getModule(UserStore).IsLoggedIn;
    },
  },
};
</script>
