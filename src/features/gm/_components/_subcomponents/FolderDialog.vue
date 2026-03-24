<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>Set Folder</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-combobox v-model="folderName"
          :items="folders"
          label="Folder"
          clearable
          hide-details
          :menu-props="{ retainFocus: false }" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn variant="text" color="accent" @click="confirm">Set</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'FolderDialog',
  props: {
    folders: { type: Array, default: () => [] },
  },
  emits: ['confirm'],
  data: () => ({
    dialog: false,
    folderName: '',
  }),
  methods: {
    open() {
      this.folderName = '';
      this.dialog = true;
    },
    confirm() {
      this.$emit('confirm', this.folderName);
      this.dialog = false;
    },
  },
};
</script>
