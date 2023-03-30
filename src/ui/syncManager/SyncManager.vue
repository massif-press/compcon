<template>
  <v-card>
    <!-- <v-toolbar density="compact" color="primary" class="text-white"
      >Sync Manager</v-toolbar
    > -->
    <v-card-text>
      <v-row density="compact" justify="end">
        <v-col cols="auto">
          <v-btn @click="fetch()" color="primary" small class="mb-3">
            <v-icon start>mdi-reload</v-icon>
            Refresh Table
          </v-btn>
        </v-col>
      </v-row>

      <v-expansion-panels>
        <v-expansion-panel v-for="k in cloudItemTypes">
          <v-expansion-panel-header>
            <span>
              <v-chip
                dark
                color="primary"
                variant="outlined"
                x-small
                class="mt-n1 mr-2"
              >
                <b>{{ itemsByType(k).length.toString().padStart(3, '0') }}</b>
              </v-chip>
              <span class="heading h3">{{ k }}</span>
            </span>
            <v-spacer />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <v-simple-table class="text-center">
                <thead>
                  <th width="10%">
                    <v-btn
                      v-if="!selectedItems.length"
                      x-small
                      variant="outlined"
                      @click="selectAll(k)"
                    >
                      Select All
                    </v-btn>
                    <v-btn
                      v-else
                      x-small
                      variant="outlined"
                      @click="deselectAll(k)"
                      >Deselect All</v-btn
                    >
                  </th>
                  <th>Name</th>
                  <th>Last Local Update</th>
                  <th>Last Cloud Update</th>
                  <th>Status</th>
                  <th>Options</th>
                </thead>
                <tbody>
                  <tr v-for="item in itemsByType(k)">
                    <td><v-simple-checkbox v-model="item.selected" /></td>
                    <td class="text-left">
                      {{ callsign(item) }}
                      {{ item.name }}
                    </td>
                    <td v-if="item.remote || isAtLatest(item)" colspan="2">
                      <v-row no-gutters align="center">
                        <v-col><v-divider /></v-col>
                        <v-col cols="auto" class="px-2">
                          <b
                            v-if="item.remote"
                            class="text-primary text--darken-1"
                            >Remote</b
                          >
                          <b v-else class="text-success text--darken-1"
                            >Synced</b
                          >
                        </v-col>
                        <v-col><v-divider /></v-col>
                      </v-row>
                    </td>
                    <td v-else-if="!isAtLatest(item)">
                      <span
                        v-if="item.lastModifiedLocal"
                        :class="
                          item.latest === 'local'
                            ? 'font-weight-bold'
                            : 'text--disabled'
                        "
                      >
                        {{ item.lastModifiedLocal.split('GMT')[0] }}
                      </span>
                      <span v-else-if="item.missingContent"
                        ><i class="text--disabled">ERR</i></span
                      >
                      <span v-else class="text--disabled"><i>No Data</i></span>
                    </td>
                    <td v-if="!isAtLatest(item)">
                      <span
                        v-if="item.lastModifiedCloud"
                        :class="
                          item.latest === 'cloud'
                            ? 'font-weight-bold'
                            : 'text--disabled'
                        "
                      >
                        {{ item.lastModifiedCloud.split('GMT')[0] }}
                      </span>
                      <span v-else class="text--disabled"><i>No Data</i></span>
                    </td>
                    <td>
                      <cc-tooltip
                        inline
                        v-if="item.remote"
                        title="Remote Resource"
                        :content="`The instance of this item is linked to data in another user's account. Local changes will not persist, and this item will be updated to the latest version of the data published to the author's cloud account.`"
                      >
                        <v-icon color="primary">mdi-cloud-braces</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-if="item.deleted"
                        title="Marked for Deletion"
                        :content="`This item has been marked for deletion. It can be restored at any time using the 'Restore' option, or deleted permanently using the 'Delete Permanently' option. If no action is taken, this item will automatically be deleted after ${item.delete_time}`"
                      >
                        <v-icon color="error">mdi-delete-alert</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-if="item.missingContent"
                        title="Missing Required LCP"
                        content="This item requires one or more Lancer Content Packages not currently installed and/or activated"
                      >
                        <v-icon color="error">mdi-folder-off</v-icon>
                      </cc-tooltip>
                      <span v-if="!item.remote && !item.missingContent">
                        <cc-tooltip
                          inline
                          v-if="isAtLatest(item)"
                          title="Item Synced"
                          :content="`The latest version of this item is stored both locally and in your cloud account. This item was last modifed at: ${item.lastModifiedLocal}`"
                        >
                          <v-icon color="success darken-1"
                            >mdi-check-bold</v-icon
                          >
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
                      </span>
                    </td>
                    <td>
                      <sync-item-menu
                        v-if="!item.remote"
                        :item="item"
                        @sync="syncSingle(item)"
                        @delete="flagDelete(item)"
                        @delete-forever="deleteForever(item)"
                        @undelete="undelete(item)"
                        @overwite-local="
                          overwriteSingle(item, 'cloud', 'local')
                        "
                        @overwite-cloud="
                          overwriteSingle(item, 'local', 'cloud')
                        "
                      />
                      <cc-tooltip
                        v-else
                        inline
                        content="Sync local data to latest remote data"
                      >
                        <v-btn icon @click="remoteUpdate(item)">
                          <v-icon color="primary">mdi-cloud-sync</v-icon>
                        </v-btn>
                      </cc-tooltip>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="light-panel">
                  <th class="py-2">{{ selectedItems.length }} Selected</th>
                  <th class="py-2"></th>
                  <th class="py-2">
                    <cc-tooltip
                      inline
                      content="Overwrites the local data of the selected items with the versions stored in the cloud."
                    >
                      <v-btn
                        small
                        color="primary"
                        :disabled="!selectedItems.length"
                        @click="overwriteSelected('cloud', 'local')"
                      >
                        Overwrite Local
                      </v-btn>
                    </cc-tooltip>
                  </th>
                  <th class="py-2">
                    <cc-tooltip
                      inline
                      content="Removes the cloud data for the selected items and replaces them with copies of the current local data."
                    >
                      <v-btn
                        small
                        color="primary"
                        :disabled="!selectedItems.length"
                        @click="overwriteSelected('local', 'cloud')"
                      >
                        Overwrite Cloud
                      </v-btn>
                    </cc-tooltip>
                  </th>
                  <th class="py-2"></th>
                  <th class="py-2">
                    <cc-tooltip
                      inline
                      content="Syncs all selected items to the most recently updated data."
                    >
                      <v-btn
                        small
                        color="primary"
                        :disabled="!selectedItems.length"
                        @click="syncSelected()"
                      >
                        Sync to Latest
                      </v-btn>
                    </cc-tooltip>
                  </th>
                </tfoot>
              </v-simple-table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-row justify="center" align="center">
        <v-col cols="8">
          <cc-tooltip
            title="Sync Data"
            content="COMP/CON will compare local and cloud data, updating all items (including remote resources) to the latest version found. All items that have been marked for deletion for longer than 30 days will be permanently removed."
          >
            <v-btn @click="syncAll()" color="primary" block x-large>
              <v-icon large class="mr-2">mdi-cloud-sync</v-icon>
              Smart Sync All
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import SyncItemMenu from './SyncItemMenu.vue';
import {
  ListCloudItems,
  ProcessItemsList,
  SyncItem,
  DeleteForever,
  GetLocalItem,
  Overwrite,
  FlagCloudDelete,
  FlagCloudRestore,
  AutoSyncAll,
  AutoSyncRemotes,
  RemoteSyncItem,
} from '@/cloud/item_sync';
import { ICloudSyncable } from '@/classes/components';
import { Pilot } from '@/classes/pilot/Pilot';
import sleep from '@/util/sleep';
import { SaveAllLocalUpdates } from '@/io/BulkData';

export default {
  name: 'sync-manager',
  components: { SyncItemMenu },
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
    this.fetch();
  },
  computed: {
    selectedItems() {
      return this.items.filter((x) => x.selected);
    },
  },
  methods: {
    selectAll(type) {
      this.itemsByType(type).forEach((i) => {
        this.$set(i, 'selected', true);
      });
    },
    deselectAll(type) {
      this.itemsByType(type).forEach((i) => {
        this.$set(i, 'selected', false);
      });
    },
    itemsByType(type) {
      return this.items.filter((x) => x.itemType === type);
    },
    callsign(item) {
      if (item.itemType !== 'Pilot') return '';
      const p = GetLocalItem(item) as Pilot;
      if (p && p.Callsign) return `${p.Callsign} //`;
    },
    isAtLatest(item) {
      if (!item.lastModifiedCloud || !item.lastModifiedLocal) return false;
      const sDiff =
        Math.abs(
          new Date(item.lastModifiedCloud).valueOf() -
            new Date(item.lastModifiedLocal).valueOf()
        ) / 1000;
      return sDiff < 15;
    },
    async fetch() {
      this.loading = true;
      ListCloudItems()
        .then((res) => {
          this.items = ProcessItemsList(res);
        })
        .finally(() => (this.loading = false));
    },
    async syncSingle(item) {
      this.loading = true;
      SyncItem(item)
        .then(() => this.fetch())
        .then(() => this.$notify('Sync successful', 'success'))
        .catch(() =>
          this.$notify(
            'An error occured while syncing. You may be missing one or more required LCPs.',
            'error'
          )
        );
    },
    async syncSelected() {
      this.loading = true;
      Promise.all(this.selectedItems.map((item) => SyncItem(item, true)))
        .then(() => SaveAllLocalUpdates())
        .then(() => this.fetch())
        .then(() =>
          this.$notify(
            `Synced ${this.selectedItems.length} items successfully`,
            'success'
          )
        )
        .catch(() =>
          this.$notify(
            'An error occured while syncing. You may be missing one or more required LCPs.',
            'error'
          )
        );
    },
    async overwriteSingle(item, source, dest) {
      this.loading = true;
      Overwrite(item, source, dest)
        .then(() => this.fetch())
        .then(() => this.$notify('Overwrite successful', 'success'))
        .catch(() =>
          this.$notify('An error occured while overwriting.', 'error')
        );
    },
    async overwriteSelected(source, dest) {
      this.loading = true;
      Promise.all(
        this.selectedItems.map((item) => Overwrite(item, source, dest, true))
      )
        .then(() => SaveAllLocalUpdates())
        .then(() => this.fetch())
        .then(() =>
          this.$notify(
            `Replaced ${this.selectedItems.length} items successfully`,
            'success'
          )
        )
        .catch(() =>
          this.$notify('An error occured while overwriting.', 'error')
        );
    },
    async undelete(item) {
      const local = GetLocalItem(item) as ICloudSyncable;
      if (local) {
        local.SaveController.restore();
        this.fetch();
      } else FlagCloudRestore(item).then(() => this.fetch());
    },
    async flagDelete(item) {
      const local = GetLocalItem(item) as ICloudSyncable;
      if (local) {
        local.SaveController.delete();
        this.fetch();
      } else FlagCloudDelete(item).then(() => this.fetch());
    },
    deleteForever(item) {
      DeleteForever(item)
        .then(() => this.fetch())
        .then(() => this.$notify('Delete successful', 'success'))
        .catch(() =>
          this.$notify(
            'An error occured while attempting to delete this record.',
            'error'
          )
        );
    },
    syncAll(hideAlert?: boolean) {
      this.loading = true;
      AutoSyncAll()
        .then(() => AutoSyncRemotes())
        .then(() => sleep(500))
        .then(() => this.fetch())
        .then(() => {
          if (!hideAlert)
            this.$notify(
              `Synced ${this.items.length} items successfully`,
              'success'
            );
        })
        .catch(() => {
          if (!hideAlert)
            this.$notify('An error occured while syncing.', 'error');
        });
    },
    async remoteUpdate(item) {
      const local = GetLocalItem(item) as ICloudSyncable;
      try {
        RemoteSyncItem(local);
        this.$notify('Pilot synced to remote', 'success');
        this.fetch();
      } catch (error) {
        console.error(error);
        this.$notify(
          'An error occurred while attempting to download remote data',
          'error'
        );
      }
    },
  },
};
</script>
