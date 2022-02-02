<template>
  <v-card>
    <!-- <v-toolbar dense color="primary" class="white--text"
      >Sync Manager</v-toolbar
    > -->
    <v-card-text>
      <v-row justify="center" align="center">
        <v-col cols="8">
          <cc-tooltip
            title="Sync Data"
            content="COMP/CON will compare local and cloud data, updating all items to the latest version found. All items that have been marked for deletion for longer than 30 days will be permanently removed."
          >
            <v-btn @click="fetch()" color="primary" block x-large>
              <v-icon large class="mr-2">mdi-cloud-sync</v-icon>
              Sync Data
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>

      <v-data-table :items="items" :headers="headers" group-by="itemType" disable-pagination />
      <v-row dense justify="end">
        <v-col cols="auto">
          <v-btn @click="fetch()" color="primary" small>
            <v-icon left>mdi-reload</v-icon>
            Refresh Table
          </v-btn>
        </v-col>
      </v-row>

      <v-row align="center" justify="space-around">
        <v-col>
          <cc-tooltip
            content="Update any outdated local data with newer data currently stored in your cloud account. All items that have been marked for deletion for longer than 30 days will be permanently removed."
          >
            <v-btn large block color="accent" :loading="loading">
              <v-icon left>mdi-cloud-upload-outline</v-icon>
              Update Local Data
            </v-btn>
          </cc-tooltip>
          <cc-tooltip
            content="<b>Replace</b> all local data with the content of your cloud account. This will
        <b>permanently overwrite</b> all of your local data."
          >
            <v-btn small block outlined color="error" :loading="loading" class="my-1">
              <v-icon left>mdi-cloud-upload-outline</v-icon>
              Overwrite Local Data
            </v-btn>
          </cc-tooltip>
        </v-col>

        <v-col>
          <cc-tooltip
            content="Save only the latest locally created and updated data to the cloud.
        Cloud data that does not exist locally will not be deleted.  All items that have been marked for deletion for longer than 30 days will be permanently removed."
          >
            <v-btn large block color="accent" :loading="loading">
              <v-icon left>mdi-cloud-upload-outline</v-icon>
              Update Cloud Data
            </v-btn>
          </cc-tooltip>
          <cc-tooltip
            content="<b>Replace</b> all cloud data with your current local data. This will
        <b>permanently overwrite</b> all of your cloud data."
          >
            <v-btn small block outlined color="error" :loading="loading" class="my-1">
              <v-icon left>mdi-cloud-upload-outline</v-icon>
              Overwrite Cloud Data
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { ListCloudItems, ProcessItemsList } from '@/cloud/sync'

export default Vue.extend({
  name: 'sync-manager',
  data: () => ({
    overwriteCloud: false,
    overwriteLocal: false,
    confirmOverwriteCloud: false,
    confirmOverwriteLocal: false,
    items: [],
    headers: [
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Last Local Update', value: 'lastModifiedLocal', align: 'center' },
      { text: 'Last Cloud Update', value: 'lastModifiedCloud', align: 'center' },
      { text: 'Status', value: '', align: 'center' },
      { text: 'Update', value: '', align: 'center' },
    ],
  }),
  methods: {
    fetch() {
      ListCloudItems().then(res => (this.items = ProcessItemsList(res)))
    },
    updateAll() {},
    updateItem() {},
    overwriteLocal() {},
    overwriteCloud() {},
  },
})
</script>
