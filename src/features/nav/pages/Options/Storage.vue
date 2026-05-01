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
        {{ st.storageUsagePrefix }} {{ bytesToSize(size.usage) }} of {{ bytesToSize(size.quota) }},
        or
        <b class="text-accent">{{ ((size.usage / size.quota || 1) * 100).toFixed(3) }}%</b>
        {{ st.storageUsageSuffix }}
      </p>

      <div class="mb-4">
        <cc-heading is-title
          :text="st.storageSettings" />
        <cc-heading is-title
          small
          :text="st.storageThresholds" />
        <v-range-slider v-model="storageRange"
          thumb-label
          hide-details
          strict
          tile
          type="number"
          track-fill-color="secondary"
          color="primary"
          @end="updateUserStorage" />
        <v-row dense
          class="mt-2">
          <v-col cols="auto">
            <v-btn-toggle v-model="thresholdType"
              flat
              tile
              density="compact">
              <v-btn value="pct"
                :color="thresholdType === 'pct' ? 'primary' : 'panel'"
                size="x-small">
                <v-icon size="large"
                  icon="mdi-percent" />
              </v-btn>
              <v-btn value="abs"
                :color="thresholdType === 'abs' ? 'primary' : 'panel'"
                size="x-small">
                <v-icon size="large"
                  icon="mdi-database" />
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col v-if="thresholdType === 'pct'">
            <v-text-field v-model.number="storageRange[0]"
              :label="st.warningThresholdPct"
              type="number"
              min="0"
              :max="storageRange[1]"
              variant="outlined"
              tile
              hide-details
              density="compact"
              @change="updateUserStorage" />
          </v-col>
          <v-col v-else>
            <v-text-field v-model.number="warnMb"
              :label="st.warningThresholdMb"
              type="number"
              min="0"
              :max="maxMb"
              variant="outlined"
              tile
              hide-details
              density="compact" />
          </v-col>
          <v-col v-if="thresholdType === 'pct'">
            <v-text-field v-model.number="storageRange[1]"
              :label="st.maxThresholdPct"
              type="number"
              :min="storageRange[0]"
              max="100"
              variant="outlined"
              tile
              hide-details
              density="compact"
              @change="updateUserStorage" />
          </v-col>
          <v-col v-else>
            <v-text-field v-model.number="maxMb"
              :label="st.maxThresholdMb"
              type="number"
              :min="warnMb"
              variant="outlined"
              tile
              hide-details
              density="compact" />
          </v-col>
        </v-row>
        <div class="text-caption text-right text-stark">
          {{ st.warningDescription }} {{ storageRange[0].toFixed(2) }}{{ st.ofAvailableStorage }}
          <b class="text-accent">{{ bytesToSize((storageRange[0] / 100) * size.quota) }}</b>
          {{ st.hasBeenUsed }}
        </div>
        <div class="text-caption text-right text-stark">
          {{ st.maxDescription }} {{ storageRange[1].toFixed(2) }}{{ st.ofAvailableStorage }}
          <b class="text-accent">{{ bytesToSize((storageRange[1] / 100) * size.quota) }}</b>
          {{ st.hasBeenUsed }}
        </div>
      </div>

      <div class="mb-8">
        <cc-heading is-title
          small
          :text="st.autoDelete" />

        <cc-select v-model="deleteDays"
          :items="deleteDaySelections"
          hide-details
          density="compact"
          @update:model-value="updateDeleteDays()" />
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
      {{ st.noStorageAccess }}
    </v-card-text>

    <v-divider class="my-4" />

    <cc-heading is-title
      :text="st.deletedItems" />
    <v-card-text>
      <deleted-items />
    </v-card-text>

    <v-divider class="my-4" />

    <cc-heading is-title
      :text="st.userData" />
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
            {{ st.clearAllData }}
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
            <span class="heading h2">{{ st.deleteWarningBanner }}</span>
          </v-alert>
          <p class="text-center heading h2 text-text">
            This will delete
            <b class="text-accent">{{ st.deleteAllConfirm }}</b>
            {{ st.deleteLocalData }}
            <br />
            This
            <b class="text-accent">{{ st.cannotBeUndone }}</b>
            <br />
            <br />
            <b class="text-accent">{{ st.areYouSure }}</b>
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
            {{ st.deleteAllUserData }}
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
import DeletedItems from './components/DeletedItems.vue';
import UserDataViewer from './components/UserDataViewer.vue';
import { ClearAllData, GetLength, GetTotalStorageSize } from '@/io/Storage';
import logger from '@/user/logger';
import { UserStore } from '@/stores';
import { NAV_STRINGS } from '@/features/nav/strings';

export default {
  name: 'OptionsStorage',
  components: { DeletedItems, UserDataViewer },
  setup() {
    return { st: NAV_STRINGS.storage }
  },
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
    thresholdType: 'pct',
  }),
  computed: {
    user() {
      return UserStore().User;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    warnMb: {
      get() {
        if (!this.size.quota) return 0;
        return Number(((this.storageRange[0] / 100) * this.size.quota / (1024 * 1024)).toFixed(1));
      },
      set(val: number) {
        if (!this.size.quota) return;
        const pct = (Number(val) * 1024 * 1024 / this.size.quota) * 100;
        this.storageRange[0] = Math.max(0, Math.min(pct, this.storageRange[1]));
        this.updateUserStorage();
      },
    },
    maxMb: {
      get() {
        if (!this.size.quota) return 0;
        return Number(((this.storageRange[1] / 100) * this.size.quota / (1024 * 1024)).toFixed(1));
      },
      set(val: number) {
        if (!this.size.quota) return;
        const pct = (Number(val) * 1024 * 1024 / this.size.quota) * 100;
        this.storageRange[1] = Math.max(this.storageRange[0], Math.min(pct, 100));
        this.updateUserStorage();
      },
    },
  },
  watch: {
    thresholdType(val: string) {
      if (val === 'pct') {
        this.storageRange[0] = Math.round(this.storageRange[0] * 100) / 100;
        this.storageRange[1] = Math.round(this.storageRange[1] * 100) / 100;
      }
    },
  },
  async created() {
    this.storageRange[0] = this.user.StorageWarning;
    this.storageRange[1] = this.user.StorageMax;
    this.deleteDays = this.user.AutoDeleteDays;

    const est = await navigator.storage.estimate();
    const actualUsage = await GetTotalStorageSize();

    this.size = { usage: actualUsage, quota: est.quota };

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
  methods: {
    bytesToSize(bytes: number) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Bytes';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      if (i === 0) return `${bytes} ${sizes[i]})`;
      return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
    },
    async deleteAll() {
      await ClearAllData();
      this.deleteDialog = false;
      window.location.reload();
    },
    async GetLength(db: string): Promise<any> {
      const len = await GetLength(db);
      if (len) return len;
    },
    updateUserStorage() {
      const warn = Number(this.storageRange[0]);
      if (isNaN(warn)) return;
      const max = Number(this.storageRange[1]);
      if (isNaN(max)) return;
      if (!warn || warn < 0) this.storageRange[0] = 1;
      if (max > 100) this.storageRange[1] = 100;
      if (warn > max) this.storageRange[0] = max;

      if (this.thresholdType === 'pct') {
        this.storageRange[0] = Math.round(this.storageRange[0] * 100) / 100;
        this.storageRange[1] = Math.round(this.storageRange[1] * 100) / 100;
      }

      this.user.StorageWarning = this.storageRange[0];
      this.user.StorageMax = this.storageRange[1];
    },
    updateDeleteDays() {
      this.user.AutoDeleteDays = this.deleteDays;
    },
  },
};
</script>
