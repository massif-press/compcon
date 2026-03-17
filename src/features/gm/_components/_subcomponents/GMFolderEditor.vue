<template>
  <div v-show="allFolders.length">
    <fieldset class="pb-2 px-3"
      style="position: relative">
      <legend class="text-caption text-left ml-2 px-2">COLLECTION FOLDER</legend>
      <v-menu width="250px"
        :close-on-content-click="false"
        :disabled="readonly">
        <template #activator="{ props }">
          <v-chip size="small"
            label
            prepend-icon="mdi-folder-outline"
            :class="!item.FolderController.Folder ? 'fade-select' : ''"
            v-bind="props">
            {{ item.FolderController.Folder || 'No Folder' }}
          </v-chip>
        </template>
        <v-card>
          <v-card-text>
            <v-combobox v-model="stagedName"
              :items="allFolders"
              label="Folder"
              outlined
              dense
              clearable
              hide-details />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn text
              @click="menu = false">Cancel</v-btn>
            <v-spacer />
            <v-btn text
              color="accent"
              @click="set">Set</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { EncounterStore, NarrativeStore } from '@/stores';
import { NpcStore } from '../../store/npc_store';

export default {
  name: 'GmFolderEditor',
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
      return [...NpcStore().getFolders, EncounterStore().getFolders, ...NarrativeStore().getFolders];
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
