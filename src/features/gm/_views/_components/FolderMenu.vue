<template>
  <div style="position: absolute; top: 0; left: 0; z-index: 1">
    <v-menu width="250px" :close-on-content-click="false">
      <template #activator="{ props }">
        <v-btn size="25" icon color="primary" class="fade-select" v-bind="props">
          <v-icon size="20" icon="mdi-folder-edit" />
        </v-btn>
      </template>
      <v-card>
        <v-toolbar density="compact"><v-toolbar-title>Set Folder</v-toolbar-title></v-toolbar>
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
  </div>
</template>

<script lang="ts">
export default {
  name: 'folder-menu',
  props: {
    item: { type: Object, required: true },
    allFolders: { type: Array, required: true },
  },
  data: () => ({
    stagedName: '',
    menu: false,
  }),

  methods: {
    set() {
      this.item.Folder = this.stagedName;
      this.stagedName = '';
      this.menu = false;
    },
  },
};
</script>
