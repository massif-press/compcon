<template>
  <div>
    <v-btn icon size="small" variant="plain" @click.native.stop>
      <v-icon icon="mdi-cog" color="white" size="large" />
      <v-menu activator="parent">
        <v-card>
          <v-toolbar density="compact" color="primary">
            <div v-if="!dense" class="heading h2 text-white primary py-0 px-2">Pilot Options</div>
          </v-toolbar>
          <v-list two-line subheader color="panel">
            <v-list-item
              title="Print"
              prepend-icon="mdi-printer"
              subtitle="Print tabletop-ready character and mech sheets"
              @click="($refs.printDialog as any).show()"
            />
            <v-list-item
              prepend-icon="mdi-dna"
              title="Clone"
              subtitle="Duplicate or Flash Clone this character"
              @click="($refs.cloneDialog as any).show()"
            />
            <v-list-item
              prepend-icon="mdi-file-document-outline"
              title="Generate Statblock"
              subtitle="Get a plaintext representation of this character's build"
              @click="($refs.statblockDialog as any).show()"
            />
            <v-list-item
              v-if="pilot.CloudController.IsRemoteResource"
              :disabled="!isAuthed"
              :loading="loading"
              prepend-icon="mdi-cloud-sync"
              title="Download Latest Data"
              subtitle="Download all remote changes to this pilot, overwriting local data"
              @click="remoteUpdate()"
            />
            <v-list-item
              v-else
              :disabled="!isAuthed"
              prepend-icon="mdi-code-json"
              title="Get Share Code"
              subtitle="Generate a share code that other users can use to import and sync this character"
              @click="($refs.shareDialog as any).show()"
            />
            <v-list-item
              prepend-icon="mdi-export-variant"
              title="Export Pilot"
              subtitle="Export this pilot as a JSON file"
              @click="exportPilot()"
            />

            <v-divider />
            <v-list-item
              title="Delete Pilot"
              subtitle="Remove this pilot from the roster"
              @click="($refs.deleteDialog as any).show()"
            >
              <template #prepend>
                <v-icon color="error">mdi-delete</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-btn>

    <print-dialog ref="printDialog" :pilot="pilot" />
    <statblock-dialog ref="statblockDialog" :pilot="pilot" />
    <roll20-dialog ref="roll20Dialog" :pilot="pilot" />
    <delete-dialog ref="deleteDialog" :pilot="pilot" @delete="delete_pilot()" />
    <clone-dialog ref="cloneDialog" :pilot="pilot" />
    <cc-solo-dialog title="Share Code Management" ref="shareDialog" no-confirm>
      <share-dialog :pilot="pilot" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import { saveFile } from '@/io/Data';
import { Pilot } from '@/class';
import CloneDialog from './CloneDialog.vue';
import StatblockDialog from './StatblockDialog.vue';
import Roll20Dialog from './Roll20Dialog.vue';
import ShareDialog from './ShareDialog.vue';
import PrintDialog from './PrintDialog.vue';
import DeleteDialog from './DeletePilotDialog.vue';

import { UserStore } from '@/stores';
// import { RemoteSyncItem } from '@/cloud/item_sync';

export default {
  name: 'edit-menu',
  components: {
    StatblockDialog,
    Roll20Dialog,
    PrintDialog,
    DeleteDialog,
    CloneDialog,
    ShareDialog,
  },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
    light: {
      type: Boolean,
    },
    dense: {
      type: Boolean,
    },
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    isAuthed() {
      return UserStore().IsLoggedIn;
    },
  },
  methods: {
    delete_pilot() {
      this.pilot.SaveController.Delete();
      if (this.$route.path !== '/pilot_management') this.$router.push('/pilot_management');
    },
    exportPilot() {
      this.pilot.BrewController.SetBrewData();

      try {
        saveFile(
          this.pilot.Callsign.toUpperCase().replace(/\W/g, '') + '.json',
          Pilot.Serialize(this.pilot as Pilot),
          'Save Pilot'
        );
        this.$notify({
          title: 'Export Success',
          text: `Pilot data saved as "${this.pilot.Callsign.toUpperCase().replace(
            /\W/g,
            ''
          )}.json"`,
          data: { type: 'success', icon: 'mdi-check' },
        });
      } catch (error) {
        console.error(error);
        this.$notify({
          title: 'Export Error',
          text: 'COMP/CON was unable to export pilot data',
          data: { type: 'error', icon: 'mdi-alert' },
        });
      }
    },
    async remoteUpdate() {
      this.loading = true;
      try {
        // await RemoteSyncItem(this.pilot);

        this.$notify({
          title: 'Sync Success',
          text: 'Pilot synced to remote',
          data: { type: 'success', icon: 'mdi-check' },
        });
      } catch (error) {
        console.error(error);
        this.$notify({
          title: 'Sync Error',
          text: 'An error occurred while attempting to download remote data',
          data: { type: 'error', icon: 'mdi-alert' },
        });
      }
      this.loading = false;
    },
  },
};
</script>
