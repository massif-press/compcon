<template>
  <v-container>
    <div style="max-height: 525px; overflow-y: scroll">
      <h3 class="heading text-accent">Storage</h3>
      <v-card-text v-if="size.usage && size.quota" class="flavor-text">
        <v-progress-linear
          :model-value="((size.usage / size.quota) * 100).toFixed(3)"
          height="20"
          class="mb-5"
          rounded
          color="primary"
        >
          <v-chip small variant="elevated" color="primary-lighten-5" style="opacity: 0.5"
            >{{ ((size.usage / size.quota) * 100).toFixed(3) }}%</v-chip
          >
        </v-progress-linear>

        <p class="px-2">
          COMP/CON is currently using {{ bytesToSize(size.usage) }} of
          {{ bytesToSize(size.quota) }}, or
          <b class="text-accent">{{ ((size.usage / size.quota) * 100).toFixed(3) }}%</b>
          of your available storage. This includes space reserved by COMP/CON for app management.
        </p>
        <v-table class="text-left mt-4" density="compact">
          <thead>
            <th v-for="item in data" v-text="item.title" />
            <th />
          </thead>
          <tbody>
            <tr>
              <td v-for="item in data">{{ item.length }} items</td>
            </tr>
          </tbody>
        </v-table>

        <v-dialog v-model="deleteDialog" width="80%">
          <template #activator="{ props }">
            <div class="text-right">
              <v-btn size="small" variant="outlined" color="error" class="mt-3" v-bind="props">
                <v-icon start size="x-large" icon="mdi-alert-outline" />
                Clear All Data
                <v-icon end size="x-large" icon="mdi-alert-outline" />
              </v-btn>
            </div>
          </template>
          <v-card flat tile>
            <v-card-text>
              <v-alert
                prominent
                dark
                color="error"
                icon="mdi-alert-circle"
                border="bottom"
                class="my-3"
              >
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
              <v-btn color="secondary" text large @click="deleteDialog = false">Dismiss</v-btn>
              <v-spacer />
              <v-btn color="error" text @click="deleteAll">
                <v-icon start size="x-large" icon="mdi-alert-outline" />
                Delete All User Data
                <v-icon end size="x-large" icon="mdi-alert-outline" />
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
      <v-card-text v-else class="flavor-text">
        COMP/CON is unable to access device storage. This may be due to a browser setting or
        extension. COMP/CON will fall back to using local storage, which is limited to 5MB. This may
        result in COMP/CON being unable to save data. Please check your browser settings, or allow
        COMP/CON to access "Persistent Storage" if prompted. If you are using a browser extension
        that blocks storage access, please disable it for COMP/CON. If neither of these options
        work, please consider downloading COMP/CON as a PWA.
      </v-card-text>
      <v-divider class="my-4" />

      <h3 class="heading text-accent">Deleted Items (local data only)</h3>
      <v-card-text>
        <deleted-items />
      </v-card-text>

      <v-divider class="my-4" />

      <h3 class="heading text-accent">User Data</h3>
      <v-card-text>
        <user-data-viewer />
      </v-card-text>
    </div>
  </v-container>
</template>

<script lang="ts">
import { clearAllData } from '@/io/BulkData';
import DeletedItems from './components/DeletedItems.vue';
import UserDataViewer from './components/UserDataViewer.vue';
import { GetLength } from '@/io/Storage';
import logger from '@/user/logger';

export default {
  name: 'options-storage',
  components: { DeletedItems, UserDataViewer },
  data: () => ({
    importDialog: false,
    fileValue: null,
    deleteDialog: false,
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
  }),
  async mounted() {
    const est = await navigator.storage.estimate();

    for (const db of Object.keys(this.data)) {
      const len = await this.GetLength(db);
      if (len) {
        this.data[db].length = len;
      }
    }

    if (!est.usage || !est.quota) {
      logger.log('unable to request storage estimate', 'warning', est);
    } else
      logger.log(
        `navigator storage estimate: ${((est.usage / est.quota) * 100).toFixed(5)}% `,
        'info',
        est
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
      await clearAllData(false);
      this.deleteDialog = false;
    },
    async GetLength(db: string): Promise<any> {
      const len = await GetLength(db);
      if (len) return len;
    },
  },
};
</script>
