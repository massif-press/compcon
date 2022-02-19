<template>
  <v-card>
    <!-- <v-toolbar dense color="primary" class="white--text"
      >Sync Manager</v-toolbar
    > -->
    <v-card-text>
      <v-row dense justify="end">
        <v-col cols="auto">
          <v-btn @click="fetch()" color="primary" small>
            <v-icon left>mdi-reload</v-icon>
            Refresh Table
          </v-btn>
        </v-col>
      </v-row>

      <v-expansion-panels>
        <v-expansion-panel v-for="k in cloudItemTypes" :key="k">
          <v-expansion-panel-header>{{ k }} ({{ itemsByType(k).length }})</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <v-simple-table class="text-center">
                <thead>
                  <th width="10%">
                    <v-btn v-if="!selectedItems.length" x-small outlined @click="selectAll(k)">
                      Select All
                    </v-btn>
                    <v-btn v-else x-small outlined @click="deselectAll(k)">Deselect All</v-btn>
                  </th>
                  <th>Name</th>
                  <th>Last Local Update</th>
                  <th>Last Cloud Update</th>
                  <th>Status</th>
                  <th>Options</th>
                </thead>
                <tbody>
                  <tr v-for="item in itemsByType(k)" :key="`item_${item.id}`">
                    <td><v-simple-checkbox v-model="item.selected" /></td>
                    <td class="text-left">{{ item.name }}</td>
                    <td v-if="isAtLatest(item)" colspan="2">
                      <v-row no-gutters align="center">
                        <v-col><v-divider /></v-col>
                        <v-col cols="auto" class="px-2">
                          <b class="success--text text--darken-1">Synced</b>
                        </v-col>
                        <v-col><v-divider /></v-col>
                      </v-row>
                    </td>
                    <td v-if="!isAtLatest(item)">
                      <span
                        v-if="item.lastModifiedLocal"
                        :class="item.latest === 'local' ? 'font-weight-bold' : 'text--disabled'"
                      >
                        {{ item.lastModifiedLocal.split('GMT')[0] }}
                      </span>
                    </td>
                    <td v-if="!isAtLatest(item)">
                      <span
                        v-if="item.lastModifiedCloud"
                        :class="item.latest === 'cloud' ? 'font-weight-bold' : 'text--disabled'"
                      >
                        {{ item.lastModifiedCloud.split('GMT')[0] }}
                      </span>
                    </td>
                    <td>
                      <cc-tooltip
                        inline
                        v-if="item.deleted"
                        title="Marked for Deletion"
                        :content="`This item has been marked for deletion. It can be undeleted at any time using the 'Undelete' option, or deleted permanently using the 'Delete Permanently' option. If no action is taken, this item will automatically be deleted after ${item.delete_time}`"
                      >
                        <v-icon color="error">mdi-delete-alert</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-if="isAtLatest(item)"
                        title="Item Syned"
                        :content="`The latest version of this item is stored both locally and in your cloud account. This item was last modifed at: ${item.lastModifiedLocal}`"
                      >
                        <v-icon color="success darken-1">mdi-check-bold</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-else-if="item.latest === 'local'"
                        title="Local Changes Detected"
                        :content="`No cloud data found, or the local version of this item is the latest. This item was last modifed at: ${
                          item.lastModifiedLocal || '???'
                        }. Syncing now will overwrite this item's cloud data with the local version.`"
                      >
                        <v-icon color="panel">mdi-check</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-else
                        title="Cloud Changes Detected"
                        :content="`No local data found, or the cloud version of this item is the latest. This item was last modifed at: ${
                          item.lastModifiedCloud || '???'
                        }. Syncing now will overwrite this item's local data with the version stored in the cloud.`"
                      >
                        <v-icon color="panel">mdi-check</v-icon>
                      </cc-tooltip>
                    </td>
                    <td>
                      <cc-tooltip inline content="Sync to Latest">
                        <v-btn icon color="accent" @click="syncSingle(item)">
                          <v-icon>mdi-sync</v-icon>
                        </v-btn>
                      </cc-tooltip>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="light-panel">
                  <th class="py-2">{{ selectedItems.length }} Selected</th>
                  <th class="py-2"></th>
                  <th class="py-2">
                    <v-btn small color="primary" :disabled="!selectedItems.length">
                      Overwrite Selected (Cloud)
                    </v-btn>
                  </th>
                  <th class="py-2">
                    <v-btn small color="primary" :disabled="!selectedItems.length">
                      Overwrite Selected (Local)
                    </v-btn>
                  </th>
                  <th class="py-2"></th>
                  <th class="py-2">
                    <v-btn small color="primary" :disabled="!selectedItems.length">
                      Sync to Latest
                    </v-btn>
                  </th>
                </tfoot>
              </v-simple-table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- 
      <v-data-table
        :items="items"
        :headers="headers"
        group-by="itemType"
        disable-pagination
        hide-default-footer
      ></v-data-table> -->

      <v-row justify="center" align="center">
        <v-col cols="8">
          <cc-tooltip
            title="Sync Data"
            content="COMP/CON will compare local and cloud data, updating all items to the latest version found. All items that have been marked for deletion for longer than 30 days will be permanently removed."
          >
            <v-btn @click="fetch()" color="primary" block x-large>
              <v-icon large class="mr-2">mdi-cloud-sync</v-icon>
              Sync All Data
            </v-btn>
          </cc-tooltip>
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
import { ListCloudItems, ProcessItemsList, SyncItem } from '@/cloud/sync'

export default Vue.extend({
  name: 'sync-manager',
  data: () => ({
    loading: false,
    overwriteCloud: false,
    overwriteLocal: false,
    confirmOverwriteCloud: false,
    confirmOverwriteLocal: false,
    items: [],
    cloudItemTypes: ['Active Mission', 'Mission', 'Encounter', 'NPC', 'Pilot'],
  }),
  async mounted() {
    this.fetch()
  },
  computed: {
    selectedItems() {
      return this.items.filter(x => x.selected)
    },
  },
  methods: {
    selectAll(type) {
      this.itemsByType(type).forEach(i => {
        this.$set(i, 'selected', true)
      })
    },
    deselectAll(type) {
      this.itemsByType(type).forEach(i => {
        this.$set(i, 'selected', false)
      })
    },
    itemsByType(type) {
      return this.items.filter(x => x.itemType === type)
    },
    isAtLatest(item) {
      return (
        item.lastModifiedCloud &&
        item.lastModifiedLocal &&
        item.lastModifiedCloud === item.lastModifiedLocal
      )
    },
    fetch() {
      this.loading = true
      ListCloudItems()
        .then(res => (this.items = ProcessItemsList(res)))
        .finally(() => (this.loading = false))
    },
    async syncSingle(item) {
      SyncItem(item)
        .then(() => this.$notify('Sync successful', 'success'))
        .catch(() =>
          this.$notify(
            'An error occured while syncing. You may be missing one or more required LCPs.',
            'error'
          )
        )
    },
    updateAll() {},
    updateItem() {},
    overwriteLocalItems() {},
    overwriteCloudItems() {},
  },
})
</script>
