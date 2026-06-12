<template>
  <v-card flat
    border
    tile
    class="my-4">
    <v-toolbar density="compact"
      color="panel">
      <v-toolbar-title>
        <cc-heading is-title
          text="Remote Backups"
          tooltip="This tool will capture a snapshot of your local COMP/CON data and store it in a cloud
              archive. You can use this to restore your COMP/CON data to a previous state. This
              feature is only available to Patreon supporters." />
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip v-if="hasArchiveAccess"
        max-width="300px"
        location="top">
        <template #activator="{ props }">
          <v-btn size="small"
            icon
            v-bind="props"
            @click="refresh">
            <v-icon size="x-large">mdi-refresh</v-icon>
          </v-btn>
        </template>
        <div class="text-center">
          {{ $t("mainMenu.cloudData.reloadData") }}
          <br />
          {{ $t("mainMenu.ui.doesNotSync") }}
        </div>
      </v-tooltip>
    </v-toolbar>
    <v-card-text v-if="!hasArchiveAccess">
      <cc-alert color="text"
        icon="mdi-information-outline"
        variant="outlined"
        title="You do not have access to remote backups.">
        <i18n-t keypath="mainMenu.archive.patreonOnly" tag="span" scope="global">
          <template #link><a href="https://www.patreon.com/compcon" target="_blank">{{ $t("mainMenu.archive.subscribing") }}</a></template>
        </i18n-t>
      </cc-alert>
    </v-card-text>
    <div v-else>
      <v-data-table :items="archives"
        :headers="headers"
        :loading="loading"
        density="compact">
        <template #item.created="{ item }">
          {{ new Date(item.created).toLocaleString() }}
        </template>
        <template #item.size="{ item }">
          <span v-if="item.size > 1024 * 1024 + 1">
            {{ (item.size / 1024 / 1024).toFixed(2) }} {{ $t("mainMenu.unit.mb") }}
          </span>
          <span v-else>{{ (item.size / 1024).toFixed(2) }} {{ $t("mainMenu.unit.kb") }}</span>
        </template>

        <template #item.preserve="{ item }">
          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-checkbox v-model="item.preserve"
                density="compact"
                hide-details
                v-bind="props"
                @click="setPreserve(item)" />
            </template>
            <div class="text-center"
              v-text="!item.preserve
                ? $t('mainMenu.archive.preventPrune')
                : $t('mainMenu.archive.removeProtection')
                " />
          </v-tooltip>
        </template>

        <template #item.actions="{ item }">
          <v-dialog max-width="600px">
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                v-bind="props">
                <v-tooltip max-width="300px"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon size="x-large"
                      v-bind="props">mdi-undo-variant</v-icon>
                  </template>
                  <div class="text-center">{{ $t("mainMenu.archive.revertTooltip") }}</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="primary">
                  <v-toolbar-title>
                    <span class="heading h3">{{ $t("mainMenu.archive.revertTitle") }}</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  {{ $t("mainMenu.archive.revertWarning1") }}
                  <br />
                  <br />
                  {{ $t("mainMenu.archive.revertWarning2") }}
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">{{ $t("common.cancel") }}</v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="accent"
                    :loading="loading"
                    @click="revertCC(item)">
                    {{ $t("mainMenu.archive.loadArchive") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-btn size="small"
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
            <div class="text-center">{{ $t("mainMenu.ui.downloadCopy") }}</div>
          </v-tooltip>

          <v-dialog max-width="600px">
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                v-bind="props">
                <v-tooltip max-width="300px"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon size="x-large"
                      v-bind="props">mdi-delete-outline</v-icon>
                  </template>
                  <div class="text-center">{{ $t("mainMenu.archive.deleteArchive") }}</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="error">
                  <v-toolbar-title>
                    <span class="heading h3">{{ $t("mainMenu.archive.deleteArchive") }}</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  {{ $t("mainMenu.archive.deleteConfirm") }}
                  <v-checkbox v-model="skipDeleteWarning"
                    label="Do not show this warning again"
                    hide-details />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">{{ $t("common.cancel") }}</v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="error"
                    :loading="loading"
                    @click="deleteArchive(item)">
                    {{ $t("common.delete") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
      </v-data-table>
      <cc-button block
        color="primary"
        prepend-icon="mdi-cloud-upload"
        class="mx-3 mb-3"
        :disabled="working || cloudStorageFull"
        :loading="working"
        @click="createNew()">
        {{ $t("mainMenu.archive.createBackup") }}
        <template v-if="cloudStorageFull"
          #subtitle>
          {{ $t("mainMenu.archive.cloudFullArchive") }}
        </template>
        <template #options>
          <v-card tile
            border
            max-width="600px">
            <v-toolbar density="compact"
              color="primary"
              tile>
              <div class="heading h3 px-2">{{ $t("mainMenu.archive.archiveSettings") }}</div>
            </v-toolbar>
            <v-card-text>
              <div class="text-caption mb-4">
                {{ $t("mainMenu.archive.settingsDesc1") }}
              </div>

              <cc-select v-model="settings.autoBackupFrequency"
                label="Auto Backup Frequency"
                :items="backupFrequency"
                :loading="updateLoading" />

              <v-divider class="my-4" />

              <div class="text-caption mb-4">
                {{ $t("mainMenu.archive.settingsDesc2") }}
              </div>

              <div></div>
              <cc-select v-model="settings.autoBackupLimit"
                label="Item Limit"
                :loading="updateLoading"
                :items="pruneOptions"
                :details="pruneOptions.find((o) => o.value === pruneSetting)?.subtitle" />

              <div class="mt-4">{{ $t("mainMenu.archive.storageLimit") }}</div>
              <v-slider v-model="settings.autoBackupPrunePct"
                :max="99"
                :min="1"
                step="1"
                thumb-label
                color="accent"
                hide-details />
              <div class="text-caption text-right mt-n2"
                v-text="`Delete old archives if cloud archives take up more than ${settings.autoBackupPrunePct}% of your total cloud storage limit`
                  " />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn :loading="loading"
                :disabled="!prunableItemCount"
                @click="prune">
                <span v-if="prunableItemCount">{{ $t("mainMenu.archive.pruneItems", { count: prunableItemCount }, prunableItemCount) }}</span>
                <span v-else>{{ $t("mainMenu.archive.nothingToPrune") }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </cc-button>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
const t = i18n.global.t
import { computed, ref, watch } from 'vue'
import { notify } from '@/util/notify'
import { useDisplay } from 'vuetify'
import { PostCloudArchive } from '@/classes/components/cloud/CloudArchive';
import { cloudDelete, downloadFromS3, updateItem } from '@/io/apis/account';
import { importAll } from '@/io/BulkData';
import { UserStore } from '@/stores';

const _display = useDisplay()

const loading = ref(false)
const updateLoading = ref(false)
const working = ref(false)
const headers = ref([
      { title: 'Created', key: 'created' },
      { title: 'Source', key: 'source' },
      { title: 'Size', key: 'size' },
      { title: 'Preserve', key: 'preserve' },
      { title: '', key: 'actions', sortable: false, width: '155px' },
    ])
const pruneSetting = ref(30)
const pruneOptions = ref([
      { title: 'Keep All', subtitle: 'Do not automatically delete any archives.', value: -1 },
      { title: 'Last 30', subtitle: 'Keep the 30 newest archives.', value: 30 },
      { title: 'Last 10', subtitle: 'Keep the 10 newest archives.', value: 10 },
      { title: 'Last 5', subtitle: 'Keep the 5 newest archives.', value: 5 },
      {
        title: 'Most Recent Only',
        subtitle: 'Keep only the most recent archive.',
        value: 1,
      },
    ])
const backupFrequency = ref([
      { title: 'Off', value: 'none' },
      { title: 'On App Start', value: 'appstart' },
      { title: 'Daily', value: 'daily' },
      { title: 'Weekly', value: 'weekly' },
      { title: 'Monthly', value: 'monthly' },
    ])
const prunePct = ref(50)

const mobile = computed(() => {
      return _display.mdAndDown.value;
    })
const hasArchiveAccess = computed(() => {
      return UserStore().User.PatreonTierValue > 0;
    })
const archives = computed(() => {
      return UserStore().CloudArchives;
    })
const settings = computed(() => {
      return UserStore().UserMetadata.SyncSettings;
    })
const prunableItemCount = computed(() => {
      return UserStore().PrunableBackups.length;
    })
const cloudStorageFull = computed(() => {
      return UserStore().CloudStorageFull;
    })
const skipDeleteWarning = computed({
  get: () => UserStore().User.View('skipDeleteWarning_archive', false),
  set: (val) => {UserStore().User.SetView('skipDeleteWarning_archive', val);},
})

async function createNew() {
      working.value = true;
      const cooldownTime = 10 * 60 * 1000; // 10 minutes

      const cooldown = Number(sessionStorage.getItem('cloud-archive-cooldown')) || 0;

      if (cooldown + cooldownTime > Date.now()) {
        notify({
          title: t('notify.account.cloudArchiveTitle'),
          text: t('notify.account.cloudArchiveCooldownText', { seconds: Math.ceil((cooldown + cooldownTime - Date.now()) / 1000) }),
          data: { icon: 'mdi-clock', type: 'error' },
        });
        working.value = false;
        return;
      }

      sessionStorage.setItem('cloud-archive-cooldown', Date.now().toString());

      await PostCloudArchive('Manual');
      working.value = false;

      await refresh();
    }
async function refresh() {
      loading.value = true;

      await UserStore().refreshDbData();
      loading.value = false;
    }
async function deleteArchive(item) {
      loading.value = true;
      await cloudDelete(item.user_id, item.sortkey, item.uri);
      await refresh();
      loading.value = false;
    }
async function downloadArchive(item) {
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
    }
async function revertCC(item) {
      loading.value = true;
      const data = await downloadFromS3(item.uri);

      await importAll(data, true);

      loading.value = false;
    }
async function prune() {
      loading.value = true;
      await UserStore().PruneBackups();
      await refresh();
      loading.value = false;
    }
async function setPreserve(item) {
      loading.value = true;
      item.preserve = !item.preserve;
      await updateItem(item);
      loading.value = false;
    }
async function updateUserMetadata() {
      updateLoading.value = true;
      await UserStore().setUserMetadata();
      updateLoading.value = false;
    }
</script>
