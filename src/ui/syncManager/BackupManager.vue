<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col>
          <v-menu top offset-y>
            <template #activator="{ props }">
              <v-btn block color="accent" v-bind="props">
                <v-icon start>mdi-database</v-icon>
                Create Backup
              </v-btn>
            </template>
            <v-card max-width="30vw">
              <v-card-text class="text-center text-stark">
                This tool will save a snapshot of all local user data and LCP content, including
                data marked for deletion. It produces a .compcon file that can be loaded from the
                "Load Backup" interface.
                <v-divider class="my-3" />
                <v-btn block color="accent" @click="dataExport()">Generate Backup</v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu v-model="loadBackupDialog" top offset-y :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn block color="accent" v-bind="props">
                <v-icon start>mdi-database-refresh</v-icon>
                Load Backup
              </v-btn>
            </template>
            <v-card max-width="30vw">
              <v-card-text class="text-center text-stark">
                This tool uses a .compcon file produced by the "Create Backup" option. It will
                replace
                <b>all</b>
                local data.
                <v-divider class="my-3" />
                <v-file-input
                  v-model="fileValue"
                  accept=".compcon"
                  variant="outlined"
                  density="compact"
                  hide-details
                  autofocus
                  placeholder="Select COMP/CON Bulk Export File"
                  prepend-icon="mdi-paperclip"
                />
                <v-divider class="my-3" />
                <v-btn
                  v-model="importConfirm"
                  block
                  :color="importConfirm ? 'secondary' : 'accent'"
                  :disabled="!fileValue"
                  @click="importConfirm = true"
                >
                  Confirm
                </v-btn>
                <v-btn
                  block
                  small
                  color="secondary"
                  class="my-2"
                  @click="importfile"
                  :disabled="!importConfirm"
                >
                  Overwrite Local Data
                </v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu v-model="deleteLocal" top offset-y :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn block color="error darken-1" v-bind="props">
                <v-icon start>mdi-delete</v-icon>
                Delete All Local Data
              </v-btn>
            </template>
            <v-card max-width="30vw">
              <v-card-text class="text-center text-stark">
                This action will delete
                <b>all</b>
                local COMP/CON data. Cloud data will not be affected.
                <v-divider class="my-3" />
                <v-btn
                  v-model="deleteLocalConfirm"
                  block
                  :color="deleteLocalConfirm ? 'secondary' : 'accent'"
                  @click="deleteLocalConfirm = true"
                >
                  Confirm
                </v-btn>
                <v-btn
                  block
                  small
                  color="error"
                  class="my-2"
                  :disabled="!deleteLocalConfirm"
                  @click="deleteAll(false)"
                >
                  Delete All Local Data
                </v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
        <v-col v-if="username && username.length">
          <v-menu v-model="deleteCloud" top offset-y :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn block color="error darken-1" v-bind="props">
                <v-icon start>mdi-cloud-alert</v-icon>
                Delete All Cloud Data
              </v-btn>
            </template>
            <v-card max-width="30vw">
              <v-card-text class="text-center text-stark">
                This action will delete
                <b>all</b>
                COMP/CON data stored in the cloud under the current user ({{ username }}). Local
                data will not be affected.
                <v-divider class="my-3" />
                <v-btn
                  v-model="deleteCloudConfirm"
                  block
                  :color="deleteCloudConfirm ? 'secondary' : 'accent'"
                  @click="deleteCloudConfirm = true"
                >
                  Confirm
                </v-btn>
                <v-btn
                  block
                  small
                  color="error"
                  class="my-2"
                  :disabled="!deleteCloudConfirm"
                  @click="deleteAll(true)"
                >
                  Delete All Cloud Data
                </v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { exportAll, importAll, clearAllData } from '@/io/BulkData';
import { saveFile } from '@/io/Data';

export default {
  name: 'backup-manager',
  props: {
    username: { type: String, required: true },
  },
  data: () => ({
    fileValue: null,
    loadBackupDialog: false,
    importConfirm: false,
    deleteLocal: false,
    deleteLocalConfirm: false,
    deleteCloud: false,
    deleteCloudConfirm: false,
  }),
  methods: {
    async dataExport() {
      const result = await exportAll();
      await saveFile(
        `CC_${new Date().toISOString().slice(0, 10)}.compcon`,
        JSON.stringify(result),
        'Save COMP/CON Archive'
      );
    },
    async importfile() {
      importAll(this.fileValue)
        .then(() => this.$notify('Data import successful', 'confirmation'))
        .catch((err) => this.$notify(`ERROR: Unable to import: ${err}`, 'error'))
        .finally(() => {
          this.fileValue = null;
          this.loadBackupDialog = false;
          this.importConfirm = false;
          this.$emit('change');
        });
    },
    async deleteAll(cloud) {
      clearAllData(cloud)
        .then(() => this.$notify('Data deleted', 'confirmation'))
        .catch((err) => this.$notify(`ERROR: Unable to import: ${err}`, 'error'))
        .finally(() => {
          this.deleteCloud = false;
          this.deleteCloudConfirm = false;
          this.deleteLocal = false;
          this.deleteLocalConfirm = false;
          if (cloud) this.$emit('del-cloud');
          else this.$emit('del-local');
          this.$emit('change');
        });
    },
  },
};
</script>
