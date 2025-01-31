<template>
  <v-row dense justify="space-between">
    <v-col cols="auto">
      <v-btn-toggle v-model="itemTypeFilter" multiple density="compact" style="height: 20px">
        <v-btn
          v-for="itemType in syncableItemTypes"
          size="small"
          :key="itemType.value"
          v-model="itemTypeFilter"
          :value="itemType.value"
          color="primary">
          {{ itemType.title }}
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
  <v-data-table
    density="compact"
    :mobile="mobile"
    :headers="<any>dataHeaders"
    :items="shownItems"
    item-key="name"
    :loading="loading"
    :items-per-page="50">
    <template #item.Name="{ item }">
      <cc-missing-content-hover :item="item" />
      {{ item.Name }}
    </template>
    <template #item.ItemType="{ item }">
      <span v-if="item.ItemType === 'Campaign'">Campaign Data</span>
      <span v-else v-text="item.ItemType" />
    </template>
    <template #item.lastSync="{ item }">
      <span v-if="item.CloudController.Metadata?.Updated">
        {{ new Date(item.CloudController.Metadata.Updated).toLocaleString() }}
      </span>
      <i v-else class="text-disabled">No Data</i>
    </template>
    <template #item.localLastModified="{ item }">
      <span v-if="item.SaveController?.LastModified">
        {{ new Date(item.SaveController.LastModified).toLocaleString() }}
      </span>
      <i v-else class="text-disabled">No Data</i>
    </template>
    <template #item.cloudLastModified="{ item }">
      <span v-if="item.CloudController.Metadata?.ItemModified">
        {{ new Date(item.CloudController.Metadata?.ItemModified).toLocaleString() }}
      </span>
      <i v-else class="text-disabled">No Data</i>
    </template>
    <template #item.syncStatus="{ item }">
      <span v-if="item.CloudController.Metadata.Deleted">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon start color="error" v-bind="props" icon="mdi-delete-clock" />
          </template>
          <div class="text-center">This item has been marked as deleted.</div>
        </v-tooltip>
      </span>
      <span v-else-if="item.CloudController.SyncStatus === 'Synced'">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="success" icon="mdi-cloud-check-variant-outline" />
          </template>
          <div class="text-center">
            Synced
            <br />
            <i class="text-caption">This item is up to date with the cloud. No action is needed.</i>
          </div>
        </v-tooltip>
      </span>
      <span v-if="item.CloudController.SyncStatus === 'LocalNewer'">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="warning" icon="mdi-cloud-download" />
          </template>
          <div class="text-center">
            Cloud Out of Date
            <br />
            <i class="text-caption">
              This item has been modified locally since the last cloud sync.
            </i>
          </div>
        </v-tooltip>
      </span>
      <span v-if="item.CloudController.SyncStatus === 'CloudNewer'">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="warning" icon="mdi-cloud-upload" />
          </template>
          <div class="text-center">
            Local Out of Date
            <br />
            <i class="text-caption">
              This item has new changes in the cloud that have not been downloaded.
            </i>
          </div>
        </v-tooltip>
      </span>
      <span v-else-if="item.CloudController.SyncStatus === 'LocalOnly'">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="warning">mdi-desktop-classic</v-icon>
          </template>
          <div class="text-center">
            Local Only
            <br />
            <i class="text-caption">
              This item has not been uploaded to the cloud and is only stored on this device.
            </i>
          </div>
        </v-tooltip>
      </span>
      <span v-else-if="item.CloudController.SyncStatus === 'CloudOnly'">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="warning">mdi-cloud-outline</v-icon>
          </template>
          <div class="text-center">
            Cloud Only
            <br />
            <i class="text-caption">
              This item is stored in your cloud account but has not been downloaded to this device.
            </i>
          </div>
        </v-tooltip>
      </span>
    </template>
    <template #item.code="{ item }">
      <span v-if="item.ItemType === 'Campaign'">
        <v-tooltip max-width="400px" location="top">
          <template #activator="{ props }">
            <v-icon icon="mdi-information-outline" class="fade-select" v-bind="props" />
          </template>
          <div class="text-center">
            This is an editable campaign you have created in the GM Campaign Editor. This data can
            be synced to the cloud for safekeeping and sharing with other devices, but are not
            sharable via the Share Code system.
          </div>
        </v-tooltip>
      </span>
      <span v-else-if="item.CloudController?.Metadata?.Code?.length > 0">
        {{
          `${item.CloudController.Metadata.Code.slice(0, 4)}-${item.CloudController.Metadata.Code.slice(4, 8)}-${item.CloudController.Metadata.Code.slice(8, 12)}`
        }}
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              color="accent"
              size="small"
              icon="mdi-content-copy"
              class="fade-select"
              @click="copy(item.CloudController.Metadata.Code)" />
          </template>
          <div class="text-center">Copy Share Code</div>
        </v-tooltip>
      </span>
    </template>
    <template #item.actions="{ item }">
      <div v-if="item.CloudController.Metadata.Deleted">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-btn
              size="small"
              color="accent"
              icon
              variant="text"
              v-bind="props"
              @click="restoreItem(item)">
              <v-icon size="x-large">mdi-restore</v-icon>
            </v-btn>
          </template>
          <div class="text-center">
            Restore
            <br />
            <i class="text-caption">
              Restore this item. This item will no longer be marked as deleted and will sync to this
              and other devices.
            </i>
          </div>
        </v-tooltip>
        <v-dialog max-width="600px">
          <template #activator="{ props }">
            <v-btn
              size="x-small"
              color="error"
              class="mx-1"
              flat
              icon
              v-bind="skipDeleteWarningPerm ? '' : props"
              @click="skipDeleteWarningPerm ? deleteItemPermanent(item) : ''">
              <v-tooltip max-width="300px" location="top">
                <template #activator="{ props }">
                  <v-icon size="24" v-bind="props">mdi-delete-forever</v-icon>
                </template>
                <div class="text-center">Delete Immediately</div>
              </v-tooltip>
            </v-btn>
          </template>
          <template #default="{ isActive }">
            <v-card>
              <v-toolbar flat color="error">
                <v-toolbar-title>
                  <span class="heading h3">Delete Immediately</span>
                </v-toolbar-title>
                <v-spacer />
                <v-btn icon @click="isActive.value = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                Deleting this item will remove it from cloud storage. This will not modify any local
                copies of this item.
                <v-checkbox
                  v-model="skipDeleteWarningPerm"
                  label="Do not show this warning again"
                  hide-details />
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
                <v-spacer />
                <v-btn
                  @click="!!deleteItemPermanent(item) ? (isActive.value = false) : ''"
                  variant="elevated"
                  color="error"
                  :loading="loading">
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
      <div v-else>
        <v-tooltip v-if="showDiffTool(item)" max-width="300px" location="top">
          <template #activator="{ props }">
            <v-btn
              size="small"
              color="accent"
              variant="text"
              icon
              v-bind="props"
              @click="openDiffViewer(item)">
              <v-icon>mdi-file-compare</v-icon>
            </v-btn>
          </template>
          <div class="text-center">
            Open Diff Viewer
            <br />
            <i class="text-caption">
              Open the diff viewer to view and resolve differences between local and cloud data.
            </i>
          </div>
        </v-tooltip>

        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              size="small"
              color="accent"
              icon
              variant="text"
              :disabled="cloudStorageFull"
              v-bind="props">
              <v-tooltip max-width="300px" location="top">
                <template #activator="{ props }">
                  <v-icon size="x-large" v-bind="props">mdi-cloud-braces</v-icon>
                </template>
                <div class="text-center">Manual Controls</div>
              </v-tooltip>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              title="Sync"
              subtitle="Sync this item to the cloud, following the your resolution setting."
              @click="sync(item)" />
            <v-list-item
              title="Force Sync"
              subtitle="Sync this item to the latest version, ignoring settings and conflicts."
              @click="forceSync(item)" />
            <v-list-item
              title="Force update Cloud to Local"
              subtitle="Overwrite cloud data with local data."
              :disabled="!item.SaveController"
              @click="forceSyncLocal(item)" />
            <v-list-item
              title="Force update Local to Cloud"
              subtitle="Overwrite local data with cloud data."
              :disabled="!item.CloudController?.Metadata?.Updated"
              @click="forceSyncCloud(item)" />
          </v-list>
        </v-menu>

        <v-dialog max-width="600px">
          <template #activator="{ props }">
            <v-tooltip
              v-if="item.CloudController.SyncStatus === 'LocalOnly'"
              max-width="300px"
              location="top">
              <template #activator="{ props }">
                <v-btn
                  size="small"
                  color="warning"
                  icon
                  variant="text"
                  v-bind="props"
                  @click="item.SaveController.Delete()">
                  <v-icon size="x-large">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
              <div class="text-center">Delete Local Data</div>
              <div class="text-center text-caption">
                <i>
                  This marks this item as deleted locally, and will be removed from this table and
                  will not be synced. Deleted item recovery options can be found in user settings.
                </i>
              </div>
            </v-tooltip>
            <v-btn
              v-else
              size="small"
              color="accent"
              icon
              variant="text"
              v-bind="skipDeleteWarning ? '' : props"
              @click="skipDeleteWarning ? deleteItem(item) : ''">
              <v-tooltip max-width="300px" location="top">
                <template #activator="{ props }">
                  <v-icon size="x-large" v-bind="props">mdi-delete-outline</v-icon>
                </template>

                <div class="text-center">Delete Cloud Data</div>
              </v-tooltip>
            </v-btn>
          </template>
          <template #default="{ isActive }">
            <v-card>
              <v-toolbar flat color="error">
                <v-toolbar-title>
                  <span class="heading h3">Delete Cloud Item</span>
                </v-toolbar-title>
                <v-spacer />
                <v-btn icon @click="isActive.value = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                Deleting this item will mark it as deleted in the cloud. It will not delete this
                item locally, but will prevent it from syncing to the cloud or to other devices.
                Deleted items can be recovered via the "Deleted Items" tab. Recoverable items still
                count towards your storage limit.
                <v-checkbox
                  v-model="skipDeleteWarning"
                  label="Do not show this warning again"
                  hide-details />
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
                <v-spacer />
                <v-btn
                  @click="!!deleteItem(item) ? (isActive.value = false) : ''"
                  variant="elevated"
                  color="error"
                  :loading="loading">
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
    </template>
  </v-data-table>
  <v-dialog v-model="diffDialog" fullscreen>
    <diff-viewer
      ref="diffViewer"
      :local="localDiff"
      :cloud="cloudDiff"
      :loading="diffLoading"
      @take-local="takeDiff('local')"
      @take-cloud="takeDiff('cloud')"
      @close="diffDialog = false" />
  </v-dialog>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import DiffViewer from './diffViewer.vue';
import { CloudController, DbItemMetadata } from '@/classes/components/cloud/CloudController';
import { cloudDelete, downloadFromS3 } from '@/io/apis/account';

export default {
  name: 'cloud-item-data-tab',
  components: {
    DiffViewer,
  },
  props: {
    search: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    tab: 'Data',
    diffLoading: false,
    diffDialog: false,
    deleteLoading: false,
    diffItem: {},
    localDiff: {},
    cloudDiff: {},
    dataHeaders: [
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'ItemType' },
      {
        title: 'Last Sync',
        key: 'lastSync',
        align: 'center',
        sortRaw: (a, b) =>
          a.CloudController.Metadata?.Updated - b.CloudController.Metadata?.Updated,
      },
      {
        title: 'Last Modified (Cloud)',
        key: 'cloudLastModified',
        align: 'center',
        sortRaw: (a, b) =>
          a.CloudController.Metadata?.ItemModified - b.CloudController.Metadata?.ItemModified,
      },
      {
        title: 'Last Modified (Local)',
        key: 'localLastModified',
        value: 'SaveController.LastModified',
        align: 'center',
      },
      {
        title: 'Sync Status',
        key: 'syncStatus',
        align: 'center',
        sortRaw: (a, b) => {
          const order = ['Synced', 'LocalNewer', 'CloudNewer', 'LocalOnly', 'CloudOnly'];
          return (
            order.indexOf(a.CloudController.SyncStatus) -
            order.indexOf(b.CloudController.SyncStatus)
          );
        },
      },
      {
        title: 'Share Code',
        key: 'code',
        align: 'center',
        width: '175px',
        sortable: false,
      },
      { title: '', key: 'actions', width: '155px', align: 'end' },
    ],
    itemTypeFilter: ['pilot', 'npc', 'collectionItem', 'encounter', 'campaign'],
    syncableItemTypes: [
      { title: 'Pilot', value: 'pilot' },
      { title: 'NPC', value: 'npc' },
      { title: 'Narrative Element', value: 'collectionItem' },
      { title: 'Encounter', value: 'encounter' },
      { title: 'Campaign', value: 'campaign' },
    ],
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    allSyncableItems() {
      return UserStore().AllSyncableItems;
    },
    cloudOnlyItems() {
      return UserStore().CloudOnlyItems;
    },
    cloudStorageFull() {
      return UserStore().CloudStorageFull;
    },
    shownItems() {
      const typeFilter = [...this.itemTypeFilter];
      if (typeFilter.includes('collectionItem'))
        typeFilter.push(...['character', 'location', 'faction']);
      if (typeFilter.includes('npc')) typeFilter.push(...['unit', 'doodad', 'eidolon']);

      return this.allSyncableItems.filter((item) => {
        if (typeFilter.length && !typeFilter.includes(item.ItemType.toLowerCase())) return false;
        // if (this.statusFilter.length && !this.statusFilter.includes(item.syncStatus)) return false;
        if (this.search && !item.Name.toLowerCase().includes(this.search.toLowerCase()))
          return false;
        return true;
      });
    },
    skipDeleteWarning: {
      get() {
        return UserStore().User.View('skipDeleteWarning_item', false);
      },
      set(val) {
        UserStore().User.SetView('skipDeleteWarning_item', val);
      },
    },
    skipDeleteWarningPerm: {
      get() {
        return UserStore().User.View('skipDeleteWarningPerm_item', false);
      },
      set(val) {
        UserStore().User.SetView('skipDeleteWarningPerm_item', val);
      },
    },
  },
  created() {
    this.itemTypeFilter = UserStore().User.View('cloudItemFilters', [
      'pilot',
      'npc',
      'collectionItem',
      'encounter',
      'campaign',
    ]);
  },
  watch: {
    itemTypeFilter(val) {
      if (!val) return;
      UserStore().User.SetView('cloudItemFilters', val);
    },
  },
  emits: ['refresh'],
  methods: {
    async sync(item) {
      try {
        await CloudController.AutoSync(item);
        this.$notify({
          title: `Sync Complete`,
          text: `${item.ItemType} ${item.Name} synced.`,
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        });
      } catch (err) {
        this.$notify({
          title: `Sync Failed`,
          text: `Failed to sync ${item.ItemType} ${item.Name}. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
    },
    async forceSync(item) {
      const status = item.CloudController.SyncStatus;
      if (status === 'LocalNewer' || status === 'LocalOnly') this.forceSyncLocal(item);
      else if (status === 'CloudNewer' || status === 'CloudOnly') this.forceSyncCloud(item);
    },
    async forceSyncLocal(item) {
      try {
        await CloudController.SyncToLocal(item);
        this.$notify({
          title: `Upload Complete`,
          text: `${item.ItemType} ${item.Name} synced.`,
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        });
      } catch (err) {
        console.error(err);
        this.$notify({
          title: `Sync Failed`,
          text: `Failed to sync ${item.ItemType} ${item.Name}. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
    },
    async forceSyncCloud(item) {
      try {
        await CloudController.SyncToCloud(item);
        this.$emit('refresh');
        this.$notify({
          title: `Sync Complete`,
          text: `${item.ItemType} ${item.Name} synced.`,
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        });
      } catch (err) {
        console.error(err);
        this.$notify({
          title: `Sync Failed`,
          text: `Failed to sync ${item.ItemType} ${item.Name}. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
    },
    showDiffTool(item) {
      const statuses = ['LocalNewer', 'CloudNewer'];
      return statuses.includes(item.CloudController.SyncStatus);
    },
    async openDiffViewer(item) {
      this.diffItem = item;
      this.localDiff = item.Serialize();
      this.cloudDiff = (await item.IsCloudOnly)
        ? await downloadFromS3(item.raw.uri)
        : await item.CloudController.Download();
      this.diffDialog = true;
    },
    async takeDiff(diff: 'local' | 'cloud') {
      this.diffLoading = true;
      if (diff === 'local') this.forceSyncLocal(this.diffItem);
      else this.forceSyncCloud(this.diffItem);

      this.diffItem = {};
      this.localDiff = {};
      this.cloudDiff = {};
      this.diffDialog = false;
      this.diffLoading = false;
    },
    async deleteItem(item) {
      this.deleteLoading = true;
      try {
        await CloudController.MarkCloudDeleted(item.CloudController.Metadata);
        console.log('delete', item);
        this.$notify({
          title: `Item Deleted`,
          text: `Marked ${item.ItemType} ${item.Name} as deleted.`,
          data: { icon: 'mdi-delete', color: 'success' },
        });
        this.deleteLoading = false;
        return true;
      } catch (err) {
        console.error(err);
        this.$notify({
          title: `Delete Failed`,
          text: `Unable to communicate with server. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
      this.deleteLoading = false;
    },
    async restoreItem(item) {
      this.deleteLoading = true;
      try {
        await CloudController.Undelete(item.CloudController.Metadata);
        this.$notify({
          title: `Item Restored`,
          text: `Restored ${item.ItemType} ${item.Name}.`,
          data: { icon: 'mdi-delete', color: 'success' },
        });
        this.deleteLoading = false;
        return true;
      } catch (err) {
        console.error(err);
        this.$notify({
          title: `Restore Failed`,
          text: `Unable to communicate with server. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
      this.deleteLoading = false;
    },
    async deleteItemPermanent(item) {
      this.deleteLoading = true;
      try {
        const { user_id, sortkey, uri } = item.CloudController.Metadata.Serialize();
        await cloudDelete(user_id, sortkey, uri);
        if (item.SaveController)
          item.CloudController.Metadata = CloudController.GenerateMetadata(item.CloudController);
        this.$emit('refresh');
        this.$notify({
          title: `Item Deleted Permanently`,
          text: `Removed ${item.ItemType} ${item.Name}.`,
          data: { icon: 'mdi-delete', color: 'success' },
        });
        this.deleteLoading = false;
        return true;
      } catch (err) {
        console.error(err);
        this.$notify({
          title: `Deletion Failed`,
          text: `Unable to communicate with server. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
      this.deleteLoading = false;
    },
    copy(text: string) {
      navigator.clipboard.writeText(text);
      this.$notify({
        title: 'Copied',
        text: 'Share code copied to clipboard.',
        data: { icon: 'mdi-content-copy', color: 'success' },
      });
    },
  },
};
</script>

<style>
.v-data-table-header__content {
  font-weight: bold !important;
}
</style>
