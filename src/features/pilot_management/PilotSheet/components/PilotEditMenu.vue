<template>
  <div>
    <v-btn icon size="small" variant="plain" @click.native.stop>
      <v-icon icon="mdi-cog" color="white" size="large" />
      <v-menu activator="parent">
        <v-card>
          <v-toolbar density="compact" color="primary">
            <div v-if="!dense" class="heading h2 py-0 px-2">Pilot Options</div>
          </v-toolbar>
          <v-list two-line subheader color="panel">
            <v-list-item
              title="Print"
              prepend-icon="mdi-printer"
              subtitle="Print tabletop-ready character and mech sheets"
              @click="$router.push(`/print/${pilot.ID}`)" />
            <v-list-item
              prepend-icon="mdi-file-document-outline"
              title="Generate Statblock"
              subtitle="Get a plaintext representation of this character's build"
              @click="($refs.statblockDialog as any).show()" />
            <v-list-item
              v-if="!pilot.IsRemote"
              prepend-icon="mdi-export-variant"
              title="Export Pilot"
              subtitle="Export this pilot as a JSON file"
              @click="exportPilot()" />
            <v-list-item
              v-if="pilot.IsRemote"
              prepend-icon="mdi-content-copy"
              title="Convert to Local"
              subtitle="Convert this Pilot to an editable local data instance."
              @click="($refs.convertLocalDialog as any).show()" />
            <v-list-item
              v-else
              prepend-icon="mdi-dna"
              title="Clone"
              subtitle="Duplicate or Flash Clone this character"
              @click="($refs.cloneDialog as any).show()" />
            <v-list-item
              v-if="pilot.IsRemote"
              :loading="loading"
              :disabled="pilot.CloudController.SyncStatus === 'Synced'"
              prepend-icon="mdi-cloud-sync"
              title="Download Latest Data"
              :subtitle="
                pilot.CloudController.SyncStatus === 'Synced'
                  ? 'Pilot is up to date with remote data'
                  : 'Download all remote changes to this pilot, overwriting local data.'
              "
              @click="remoteUpdate()" />
            <v-list-item
              v-else
              prepend-icon="mdi-code-json"
              title="Get Share Code"
              subtitle="Get a share code that other users can use to import and sync this character"
              @click="($refs.shareDialog as any).show()" />

            <v-divider v-if="!pilot.IsRemote" />
            <v-list-item
              v-if="!pilot.IsRemote"
              title="Delete Pilot"
              subtitle="Remove this pilot from the roster"
              @click="($refs.deleteDialog as any).show()">
              <template #prepend>
                <v-icon color="error">mdi-delete</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-btn>

    <statblock-dialog ref="statblockDialog" :pilot="pilot" />
    <roll20-dialog ref="roll20Dialog" :pilot="pilot" />
    <delete-dialog ref="deleteDialog" :pilot="pilot" @delete="delete_pilot()" />
    <clone-dialog ref="cloneDialog" :pilot="pilot" />
    <cc-solo-dialog title="Share Code" ref="shareDialog" no-confirm>
      <share-dialog :pilot="pilot" />
    </cc-solo-dialog>
    <cc-solo-dialog
      title="Convert to Local "
      ref="convertLocalDialog"
      no-confirm
      @close="($refs as any).convertLocalDialog.hide()">
      <convert-dialog :pilot="pilot" />
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
import DeleteDialog from './DeletePilotDialog.vue';

import { UserStore } from '@/stores';
import ConvertDialog from './ConvertDialog.vue';
import { CloudController } from '@/classes/components';
// import { RemoteSyncItem } from '@/cloud/item_sync';

export default {
  name: 'edit-menu',
  components: {
    StatblockDialog,
    Roll20Dialog,
    DeleteDialog,
    CloneDialog,
    ShareDialog,
    ConvertDialog,
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
  methods: {
    delete_pilot() {
      this.pilot.SaveController.Delete();
      if (this.$route.path !== '/pilot_management') this.$router.push('/pilot_management');
    },
    exportPilot() {
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
      try {
        await CloudController.UpdateRemote(this.pilot);
        await UserStore().refreshDbData();
        this.$notify({
          title: `Sync Complete`,
          text: `Pilot ${this.pilot.Callsign} // ${this.pilot.Name} synced.`,
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        });
      } catch (err) {
        this.$notify({
          title: `Sync Failed`,
          text: `Failed to sync Pilot ${this.pilot.Callsign} // ${this.pilot.Name}. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
    },
  },
};
</script>
