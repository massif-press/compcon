<template>
  <v-container :class="!mobile && 'px-12'">
    <v-card-text v-if="size.usage && size.quota"
      class="flavor-text">
      <v-progress-linear :model-value="((size.usage / size.quota) * 100).toFixed(3)"
        height="20"
        class="mb-5"
        tile
        color="primary">
        <v-chip small
          tile
          variant="elevated"
          color="primary-lighten-5"
          style="opacity: 0.5">
          {{ ((size.usage / size.quota) * 100).toFixed(3) }}%
        </v-chip>
      </v-progress-linear>

      <p class="px-2">
        COMP/CON is currently using {{ bytesToSize(size.usage) }} of {{ bytesToSize(size.quota) }},
        or
        <b class="text-accent">{{ ((size.usage / size.quota) * 100).toFixed(3) }}%</b>
        of your available storage. This includes space reserved by COMP/CON for app management.
      </p>

      <div class="mb-4">
        <cc-heading is-title
          text="Storage Settings" />
        <cc-heading is-title
          small
          text="Storage Thresholds" />
        <v-range-slider v-model="storageRange"
          thumb-label
          hide-details
          strict
          tile
          type="number"
          track-fill-color="secondary"
          color="primary"
          @end="updateUserStorage" />
        <div class="text-caption text-right text-stark">
          COMP/CON will display a warning message when {{ storageRange[0].toFixed(2) }}% of
          available system storage (
          <b class="text-accent">{{ bytesToSize((storageRange[0] / 100) * size.quota) }}</b>
          ) has been used
        </div>
        <div class="text-caption text-right text-stark">
          COMP/CON will prevent the creation of new data after {{ storageRange[1].toFixed(2) }}% of
          available system storage (
          <b class="text-accent">{{ bytesToSize((storageRange[1] / 100) * size.quota) }}</b>
          ) has been used
        </div>
      </div>

      <div class="mb-8">
        <cc-heading is-title
          small
          text="Auto-delete" />

        <cc-select v-model="deleteDays"
          :items="deleteDaySelections"
          hide-details
          density="compact"
          @update:modelValue="updateDeleteDays()" />
        <div class="text-caption text-right text-stark">
          <span v-if="!deleteDays">
            COMP/CON will <b class="text-accent">never</b> automatically delete data marked for
            deletion.
          </span>
          <span v-else>
            COMP/CON will permanently delete data after it has been marked as deleted for at least
            <b class="text-accent">{{ deleteDays }} days.</b>
            This will not affect items not already marked for deletion.
          </span>
        </div>
      </div>
    </v-card-text>
    <v-card-text v-else
      class="flavor-text">
      COMP/CON is unable to access device storage. This may be due to a browser setting or
      extension. COMP/CON will fall back to using local storage, which is limited to 5MB. This may
      result in COMP/CON being unable to save data. Please check your browser settings, or allow
      COMP/CON to access "Persistent Storage" if prompted. If you are using a browser extension that
      blocks storage access, please disable it for COMP/CON. If neither of these options work,
      please consider downloading COMP/CON as a PWA.
    </v-card-text>

    <v-divider class="my-4" />

    <cc-heading is-title
      text="Deleted Items (local data only)" />
    <v-card-text>
      <deleted-items />
    </v-card-text>

    <v-divider class="my-4" />

    <cc-heading is-title
      text="User Data" />
    <user-data-viewer />

    <v-dialog v-model="deleteDialog"
      width="80%">
      <template #activator="{ props }">
        <div class="text-center">
          <cc-button size="large"
            variant="outlined"
            color="error"
            class="my-6"
            append-icon="mdi-alert-outline"
            prepend-icon="mdi-alert-outline"
            v-bind="props">
            Clear All Data
          </cc-button>
        </div>
      </template>
      <v-card flat
        tile>
        <v-card-text>
          <v-alert prominent
            dark
            color="error"
            icon="mdi-alert-circle"
            border="bottom"
            class="my-3">
            <span class="heading h2">WARNING // WARNING // WARNING</span>
          </v-alert>
          <p class="text-center heading h2 text-text">
            This will delete
            <b class="text-accent">ALL</b>
            local COMP/CON data.
            <br />
            This
            <b class="text-accent">cannot</b>
            be undone.
            <br />
            <br />
            <b class="text-accent">Are you sure you want to continue?</b>
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="secondary"
            variant="text"
            large
            @click="deleteDialog = false">
            Dismiss
          </v-btn>
          <v-spacer />
          <v-btn color="error"
            variant="text"
            @click="deleteAll">
            <v-icon start
              size="x-large"
              icon="mdi-alert-outline" />
            Delete All User Data
            <v-icon end
              size="x-large"
              icon="mdi-alert-outline" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { clearAllData } from '@/io/BulkData';
import DeletedItems from './components/DeletedItems.vue';
import UserDataViewer from './components/UserDataViewer.vue';
import { GetLength } from '@/io/Storage';
import logger from '@/user/logger';
import { UserStore } from '@/stores';

export default {
  name: 'options-storage',
  components: { DeletedItems, UserDataViewer },
  data: () => ({
    importDialog: false,
    fileValue: null,
    deleteDialog: false,
    storageRange: [0, 0],
    deleteDays: 0,
    size: {} as StorageEstimate,
    data: {
      pilots: { title: 'Pilots', length: 0 },
      npcs: { title: 'NPCs', length: 0 },
      encounters: { title: 'Encounters', length: 0 },
      campaigns: { title: 'Campaigns', length: 0 },
      characters: { title: 'Characters', length: 0 },
      locations: { title: 'Locations', length: 0 },
      factions: { title: 'Factions', length: 0 },
      content: { title: 'LCPs', length: 0 },
      images: { title: 'Local Images', length: 0 },
    },
    deleteDaySelections: [
      { title: 'Never', value: 0 },
      { title: '1 Week', value: 7 },
      { title: '2 Weeks', value: 14 },
      { title: '1 Month', value: 30 },
      { title: '3 Months', value: 90 },
      { title: '6 Months', value: 180 },
      { title: '1 Year', value: 365 },
    ],
  }),
  async created() {
    this.storageRange[0] = this.user.StorageWarning;
    this.storageRange[1] = this.user.StorageMax;
    this.deleteDays = this.user.AutoDeleteDays;

    const est = await navigator.storage.estimate();

    this.size = est;

    for (const db of Object.keys(this.data)) {
      const len = await this.GetLength(db);
      if (len) {
        this.data[db].length = len;
      }
    }

    if (!est.usage || !est.quota) {
      logger.info(`navigator storage estimate: ${est.usage} / ${est.quota}`, this);
    } else
      logger.info(
        `navigator storage estimate: ${this.bytesToSize(est.usage)} / ${this.bytesToSize(est.quota)}`,
        this
      );
  },
  computed: {
    user() {
      return UserStore().User;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  methods: {
    bytesToSize(bytes: number) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Bytes';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      if (i === 0) return `${bytes} ${sizes[i]})`;
      return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
    },
    async deleteAll() {
      await clearAllData();
      this.deleteDialog = false;
    },
    async GetLength(db: string): Promise<any> {
      const len = await GetLength(db);
      if (len) return len;
    },
    updateUserStorage() {
      this.user.StorageWarning = this.storageRange[0];
      this.user.StorageMax = this.storageRange[1];
    },
    updateDeleteDays() {
      this.user.AutoDeleteDays = this.deleteDays;
    },
  },
};
</script>
