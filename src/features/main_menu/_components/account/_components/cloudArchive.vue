<template>
  <v-card flat border tile class="my-4">
    <v-toolbar density="compact" color="panel">
      <v-toolbar-title>
        <cc-heading
          title
          text="Remote Backups"
          tooltip="This tool will capture a snapshot of your local COMP/CON data and store it in a cloud
              archive. You can use this to restore your COMP/CON data to a previous state. This
              feature is only available to Patreon supporters." />
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip v-if="hasArchiveAccess" max-width="300px" location="top">
        <template #activator="{ props }">
          <v-btn size="small" icon v-bind="props" @click="refresh">
            <v-icon size="x-large">mdi-refresh</v-icon>
          </v-btn>
        </template>
        <div class="text-center">
          Reload Data
          <br />
          (This does not sync)
        </div>
      </v-tooltip>
    </v-toolbar>
    <v-card-text v-if="!hasArchiveAccess">
      <cc-alert
        color="secondary"
        icon="mdi-information-outline"
        prominent
        title="You do not have access to remote backups.">
        Due to the server costs associated the creation and storage of backup data, this feature is
        only available to Patreon subscribers. If you would like access to automated cloud backups,
        please consider
        <a href="https://www.patreon.com/compcon" target="_blank">subscribing</a>
        to support the development of COMP/CON and gain access to additional features.
      </cc-alert>
    </v-card-text>
    <div v-else>
      <v-data-table :items="archives" :headers="headers" :loading="loading" density="compact">
        <template #item.created="{ item }">
          {{ new Date(item.created).toLocaleString() }}
        </template>
        <template #item.size="{ item }">
          <span v-if="item.size > 1024 * 1024 + 1">
            {{ (item.size / 1024 / 1024).toFixed(2) }} MB
          </span>
          <span v-else>{{ (item.size / 1024).toFixed(2) }} KB</span>
        </template>

        <template #item.preserve="{ item }">
          <v-tooltip max-width="300px" location="top">
            <template #activator="{ props }">
              <v-checkbox
                v-model="item.preserve"
                density="compact"
                hide-details
                v-bind="props"
                @click="setPreserve(item)" />
            </template>
            <div
              class="text-center"
              v-text="
                !item.preserve
                  ? 'Prevent this item from being automatically pruned. Preserved archives will still count towards size and space limitations.'
                  : 'Remove auto-delete protections on this item'
              " />
          </v-tooltip>
        </template>

        <template #item.actions="{ item }">
          <v-dialog max-width="600px">
            <template #activator="{ props }">
              <v-btn size="small" color="accent" icon variant="text" v-bind="props">
                <v-tooltip max-width="300px" location="top">
                  <template #activator="{ props }">
                    <v-icon size="x-large" v-bind="props">mdi-undo-variant</v-icon>
                  </template>
                  <div class="text-center">Revert COMP/CON to this backup</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat color="primary">
                  <v-toolbar-title>
                    <span class="heading h3">Revert COMP/CON</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  This will replace your current COMP/CON data with the data from this archive. This
                  action cannot be automatically undone, so it is strongly recommended that you
                  create a new archive before proceeding.
                  <br />
                  <br />
                  This tool only affects your local data. It will not affect any data stored in the
                  cloud.
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
                  <v-spacer />
                  <v-btn
                    @click="revertCC(item)"
                    variant="elevated"
                    color="accent"
                    :loading="loading">
                    Load Archive
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <v-tooltip max-width="300px" location="top">
            <template #activator="{ props }">
              <v-btn
                size="small"
                color="accent"
                icon
                variant="text"
                :loading="item.downloading"
                :disabled="item.downloading"
                v-bind="props"
                @click="downloadArchive(item)">
                <v-icon size="x-large">mdi-download</v-icon>
              </v-btn>
            </template>
            <div class="text-center">Download Copy</div>
          </v-tooltip>

          <v-dialog max-width="600px">
            <template #activator="{ props }">
              <v-btn size="small" color="accent" icon variant="text" v-bind="props">
                <v-tooltip max-width="300px" location="top">
                  <template #activator="{ props }">
                    <v-icon size="x-large" v-bind="props">mdi-delete-outline</v-icon>
                  </template>
                  <div class="text-center">Delete Archive</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat color="error">
                  <v-toolbar-title>
                    <span class="heading h3">Delete Archive</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  Are you sure you want to delete this archive? This action cannot be undone.
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
                    @click="deleteArchive(item)"
                    variant="elevated"
                    color="error"
                    :loading="loading">
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
      </v-data-table>
      <cc-button
        block
        color="primary"
        prepend-icon="mdi-cloud-upload"
        class="mx-3 mb-3"
        :disabled="working || cloudStorageFull"
        :loading="working"
        @click="createNew()">
        Create New Backup
        <template #subtitle v-if="cloudStorageFull">
          Cloud storage is full! Unable to create new archives.
        </template>
        <template #options>
          <v-card tile border max-width="600px">
            <v-toolbar density="compact" color="primary" tile>
              <div class="heading h3 px-2">Archive Settings</div>
            </v-toolbar>
            <v-card-text>
              <div class="text-caption mb-4">
                COMP/CON can create and save a backup of your data at the selected interval. These
                archives can be used to roll back your data to a previous state.
              </div>

              <cc-select
                v-model="settings.autoBackupFrequency"
                label="Auto Backup Frequency"
                :items="backupFrequency"
                :loading="updateLoading" />

              <v-divider class="my-4" />

              <div class="text-caption mb-4">
                COMP/CON will automatically delete old archives to save space. This process runs
                whenever a new archive is created, or can be manually triggered by clicking the
                Prune Items button below.
              </div>

              <div></div>
              <cc-select
                v-model="settings.autoBackupLimit"
                label="Item Limit"
                :loading="updateLoading"
                :items="pruneOptions"
                :details="pruneOptions.find((o) => o.value === pruneSetting)?.subtitle" />

              <div class="mt-4">Storage Limit</div>
              <v-slider
                v-model="settings.autoBackupPrunePct"
                :max="100"
                :min="1"
                step="1"
                thumb-label
                color="accent"
                hide-details />
              <div
                class="text-caption text-right mt-n2"
                v-text="
                  `Delete old archives if cloud archives take up more than ${prunePct}% of your total cloud storage limit`
                " />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn @click="prune" :loading="loading" :disabled="!prunableItemCount">
                <span v-if="prunableItemCount">Prune {{ prunableItemCount }} Items</span>
                <span v-else>Nothing to Prune</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </cc-button>
    </div>
  </v-card>
</template>

<script lang="ts">
import { PostCloudArchive } from '@/classes/components/cloud/CloudArchive';
import { cloudDelete, downloadFromS3, updateItem } from '@/io/apis/account';
import { importAll } from '@/io/BulkData';
import { UserStore } from '@/stores';

export default {
  name: 'cloud-archive',
  data: () => ({
    loading: false,
    updateLoading: false,
    working: false,
    headers: [
      { title: 'Created', key: 'created' },
      { title: 'Source', key: 'source' },
      { title: 'Size', key: 'size' },
      { title: 'Preserve', key: 'preserve' },
      { title: '', key: 'actions', sortable: false, width: '155px' },
    ],
    pruneSetting: 30,
    pruneOptions: [
      { title: 'Keep All', subtitle: 'Do not automatically delete any archives.', value: -1 },
      { title: 'Last 30', subtitle: 'Keep the 30 newest archives.', value: 30 },
      { title: 'Last 10', subtitle: 'Keep the 10 newest archives.', value: 10 },
      { title: 'Last 5', subtitle: 'Keep the 5 newest archives.', value: 5 },
      {
        title: 'Most Recent Only',
        subtitle: 'Keep only the most recent archive.',
        value: 1,
      },
    ],
    backupFrequency: [
      { title: 'Off', value: 'none' },
      { title: 'On App Start', value: 'appstart' },
      { title: 'Daily', value: 'daily' },
      { title: 'Weekly', value: 'weekly' },
      { title: 'Monthly', value: 'monthly' },
    ],
    prunePct: 50,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    hasArchiveAccess() {
      return UserStore().User.PatreonTierValue > 0;
    },
    archives() {
      return UserStore().CloudArchives;
    },
    settings() {
      return UserStore().UserMetadata.SyncSettings;
    },
    prunableItemCount() {
      return UserStore().PrunableBackups.length;
    },
    cloudStorageFull() {
      return UserStore().CloudStorageFull;
    },
    skipDeleteWarning: {
      get() {
        return UserStore().User.View('skipDeleteWarning_archive', false);
      },
      set(val) {
        UserStore().User.SetView('skipDeleteWarning_archive', val);
      },
    },
  },
  watch: {
    'settings.autoBackupLimit': {
      async handler(val) {
        await this.updateUserMetadata();
      },
    },
    'settings.autoBackupFrequency': {
      async handler(val) {
        await this.updateUserMetadata();
      },
    },
  },

  methods: {
    async createNew() {
      this.working = true;
      const cooldownTime = 10 * 60 * 1000; // 10 minutes

      const cooldown = Number(sessionStorage.getItem('cloud-archive-cooldown')) || 0;

      if (cooldown + cooldownTime > Date.now()) {
        this.$notify({
          title: 'Cloud Archive',
          text: `You must wait ${Math.ceil(
            (cooldown + cooldownTime - Date.now()) / 1000
          )} seconds before creating a new archive.`,
          data: { icon: 'mdi-clock', type: 'error' },
        });
        this.working = false;
        return;
      }

      sessionStorage.setItem('cloud-archive-cooldown', Date.now().toString());

      await PostCloudArchive('Manual');
      this.working = false;

      await this.refresh();
    },
    async refresh() {
      this.loading = true;

      await UserStore().refreshDbData();
      this.loading = false;
    },
    async deleteArchive(item) {
      this.loading = true;
      await cloudDelete(item.user_id, item.sortkey, item.uri);
      await this.refresh();
      this.loading = false;
    },
    async downloadArchive(item) {
      item.downloading = true;
      const data = await downloadFromS3(item.uri);

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `archive_${item.created}.compcon`;
      a.click();
      window.URL.revokeObjectURL(url);

      item.downloading = false;
    },
    async revertCC(item) {
      this.loading = true;
      const data = await downloadFromS3(item.uri);

      await importAll(data);

      this.loading = false;
    },
    async prune() {
      this.loading = true;
      await UserStore().PruneBackups();
      await this.refresh();
      this.loading = false;
    },
    async setPreserve(item) {
      this.loading = true;
      item.preserve = !item.preserve;
      await updateItem(item);
      this.loading = false;
    },
    async updateUserMetadata() {
      this.updateLoading = true;
      await UserStore().setUserMetadata();
      this.updateLoading = false;
    },
  },
};
</script>
