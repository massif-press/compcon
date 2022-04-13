<template>
  <v-card>
    <!-- <v-toolbar dense color="primary" class="white--text"
      >Sync Manager</v-toolbar
    > -->
    <v-card-text>
      <v-row dense justify="end">
        <v-col cols="auto">
          <v-btn @click="fetch()" color="primary" small class="mb-3">
            <v-icon left>mdi-reload</v-icon>
            Refresh
          </v-btn>
        </v-col>
      </v-row>

      <v-expansion-panels v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span>
              <v-chip dark color="primary" outlined x-small class="mt-n1 mr-2">
                <b>{{ items.length.toString().padStart(3, '0') }}</b>
              </v-chip>
              <span class="heading h3">LCPs</span>
            </span>
            <v-spacer />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <v-simple-table class="text-center">
                <thead>
                  <th>LCP</th>
                  <th>Local Version</th>
                  <th>Cloud Version</th>
                  <th>Status</th>
                  <th>Options</th>
                </thead>
                <tbody>
                  <tr v-for="item in items" :key="`item_${item.data.ID}`">
                    <td class="text-left">
                      <div class="heading h4">{{ item.data.Name }}</div>
                      <div class="caption">by {{ item.data.Author }}</div>
                    </td>
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
                        v-if="item.localVersion"
                        :class="item.latest === 'local' ? 'font-weight-bold' : 'text--disabled'"
                      >
                        {{ item.localVersion }}
                      </span>
                      <span v-else class="text--disabled"><i>No Data</i></span>
                    </td>
                    <td v-if="!isAtLatest(item)">
                      <span
                        v-if="item.cloudVersion"
                        :class="item.latest === 'cloud' ? 'font-weight-bold' : 'text--disabled'"
                      >
                        {{ item.cloudVersion }}
                      </span>
                      <span v-else class="text--disabled"><i>No Data</i></span>
                    </td>
                    <td>
                      <cc-tooltip
                        inline
                        v-if="isAtLatest(item)"
                        title="Item Synced"
                        :content="`The same version of this content pack is stored both locally and in your cloud account.`"
                      >
                        <v-icon color="success darken-1">mdi-check-bold</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-else-if="item.latest === 'local'"
                        title="Local Changes Detected"
                        :content="`No cloud data found, or the local version of this content pack is the latest. Syncing will overwrite this content pack's cloud data with the local version.`"
                      >
                        <v-icon color="panel">mdi-check</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-else
                        title="Cloud Changes Detected"
                        :content="`No local data found, or the cloud version of this content pack is the latest. Syncing will overwrite this content pack's local data with the version stored in the cloud.`"
                      >
                        <v-icon color="panel">mdi-check</v-icon>
                      </cc-tooltip>
                      <div v-if="item.localVersion" class="d-inline">
                        <cc-tooltip
                          v-if="item.data.Active"
                          inline
                          title="LCP Active"
                          :content="`This package is installed and active`"
                        >
                          <v-icon color="success">mdi-power</v-icon>
                        </cc-tooltip>
                        <cc-tooltip
                          v-else
                          inline
                          title="LCP Not Active"
                          :content="`This package is not active. Any user data that requires this content pack will not load.`"
                        >
                          <v-icon color="panel">mdi-power</v-icon>
                        </cc-tooltip>
                      </div>
                    </td>
                    <td>
                      <cc-tooltip inline content="Permanently Delete">
                        <v-btn icon color="error" @click="deleteItem(item)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </cc-tooltip>
                    </td>
                  </tr>
                </tbody>
                <tfoot v-show="items.length" class="light-panel">
                  <tr>
                    <td colspan="4" />
                    <td>
                      <cc-tooltip
                        title="Sync All"
                        content="Syncs all local and cloud LCP data to the latest version found. Due to the nature of how LCP data is stored, items cannot be synced individually."
                      >
                        <v-btn small color="accent" @click="syncAll">Sync All</v-btn>
                      </cc-tooltip>
                    </td>
                  </tr>
                </tfoot>
              </v-simple-table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <v-alert prominent icon="mdi-alert" outlined color="error">
        The following items have missing content pack requirements. These items may not load, or may
        cause the app to malfunction
        <v-row dense>
          <v-col>item name</v-col>
          <v-col>required pack at version</v-col>
          <v-col><v-btn>attempt recovery</v-btn></v-col>
          <v-col @click="delall()"><v-btn>delete item</v-btn></v-col>
        </v-row>
      </v-alert> -->
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import SyncItemMenu from './SyncItemMenu.vue'
import { GetItemsList, SyncLCPs, DeleteLCP, DeleteAllLocal, DeleteAllCloud } from '@/cloud/lcp_sync'

export default Vue.extend({
  name: 'sync-manager',
  components: { SyncItemMenu },
  data: () => ({
    panel: 0,
    loading: false,
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
    selectAll() {
      this.items.forEach(i => {
        this.$set(i, 'selected', true)
      })
    },
    deselectAll() {
      this.items.forEach(i => {
        this.$set(i, 'selected', false)
      })
    },
    itemsByType(type) {
      return this.items.filter(x => x.itemType === type)
    },
    isAtLatest(item) {
      return item.localVersion === item.cloudVersion
    },
    async fetch() {
      this.loading = true
      this.items = await GetItemsList()
      this.loading = false
    },
    syncAll(hideAlert) {
      this.loading = true
      SyncLCPs()
        .then(() => this.fetch())
        .then(() => {
          if (!hideAlert) this.$notify(`Synced ${this.items.length} items successfully`, 'success')
        })
        .catch(() => {
          if (!hideAlert) this.$notify('An error occured while syncing.', 'error')
        })
    },
    deleteItem(item) {
      this.loading = true
      DeleteLCP(item)
        .then(() => this.fetch())
        .then(() => this.$notify(`Delete successful`, 'success'))
        .catch(() => this.$notify('An error occured while deleting.', 'error'))
    },
    deleteAllLocal() {
      DeleteAllLocal()
        .then(() => this.fetch())
        .then(() => this.$notify(`Delete successful`, 'success'))
        .catch(() => this.$notify('An error occured while deleting.', 'error'))
    },
    deleteAllCloud() {
      DeleteAllCloud()
        .then(() => this.fetch())
        .then(() => this.$notify(`Delete successful`, 'success'))
        .catch(() => this.$notify('An error occured while deleting.', 'error'))
    },
  },
})
</script>
