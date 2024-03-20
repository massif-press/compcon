<template>
  <div v-show="allFolders.length">
    <fieldset class="rounded-s pb-2" style="position: relative">
      <legend class="text-caption text-left ml-2 px-2">COLLECTION FOLDER</legend>
      <v-menu width="250px" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-chip
            size="small"
            label
            prepend-icon="mdi-folder-outline"
            :class="!item.FolderController.Folder ? 'fade-select' : ''"
            v-bind="props">
            {{ item.FolderController.Folder || 'No Folder' }}
          </v-chip>
        </template>
        <v-card>
          <v-card-text>
            <v-combobox
              v-model="stagedName"
              :items="allFolders"
              label="Folder"
              outlined
              dense
              clearable
              hide-details />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn text @click="menu = false">Cancel</v-btn>
            <v-spacer />
            <v-btn text @click="set" color="accent">Set</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </fieldset>
  </div>
</template>

<script>
import { NpcStore } from '../../store/npc_store';

export default {
  name: 'gm-folder-editor',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    stagedName: '',
    menu: false,
  }),
  mounted() {
    this.stagedName = this.item.FolderController.Folder;
  },
  methods: {
    set() {
      this.item.FolderController.Folder = this.stagedName;
      this.stagedName = '';
      this.menu = false;
    },
  },
  computed: {
    allFolders() {
      return NpcStore().getFolders;
    },
  },
};
</script>
