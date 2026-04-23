<template>
  <div v-show="allFolders.length">
    <fieldset class="pb-2 px-3"
      style="position: relative">
      <legend class="text-caption text-left ml-2 px-2">COLLECTION FOLDER
        <folder-menu v-if="allFolders && allFolders.length > 0"
          :item="item.FolderController"
          :all-folders="allFolders" />
      </legend>
      <v-chip size="small"
        label
        prepend-icon="mdi-folder-outline"
        :class="!item.FolderController.Folder ? 'fade-select' : ''">
        {{ item.FolderController.Folder || 'No Folder' }}
      </v-chip>

    </fieldset>
  </div>
</template>

<script lang="ts">
import { EncounterStore, NarrativeStore } from '@/stores';
import { NpcStore } from '../../store/npc_store';
import FolderMenu from '../../_views/_components/FolderMenu.vue';
import { uniq } from 'lodash-es';

export default {
  name: 'GmFolderEditor',
  components: {
    FolderMenu,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    stagedName: '',
    menu: false,
  }),
  computed: {
    allFolders() {
      return uniq([...NpcStore().getFolders, ...EncounterStore().getFolders, ...NarrativeStore().getFolders]);
    },
  },
  created() {
    this.stagedName = this.item.FolderController.Folder;
  },
  methods: {
    set() {
      this.item.FolderController.Folder = this.stagedName;
      this.stagedName = '';
      this.menu = false;
    },
  },
};
</script>
