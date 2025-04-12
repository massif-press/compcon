<template>
  <div>
    <v-btn icon :size="size" variant="plain" @click.native.stop>
      <v-icon icon="mdi-cog" color="white" size="large" />
      <v-menu v-model="menu" activator="parent">
        <v-card tile border>
          <v-toolbar density="compact" color="primary" height="46">
            <div v-if="!dense" class="heading h3 py-0 px-2">Pilot Options</div>
          </v-toolbar>
          <v-list :lines="mobile ? 'one' : 'two'" subheader color="panel" density="compact" slim>
            <v-list-item
              title="Print"
              prepend-icon="mdi-printer"
              subtitle="Print tabletop-ready character and mech sheets"
              @click="$router.push(`/print/${pilot.ID}`)" />
            <cc-modal title="Statblock Generator" icon="mdi-code-block-tags">
              <template #activator="{ open }">
                <v-list-item
                  prepend-icon="mdi-file-document-outline"
                  title="Generate Statblock"
                  subtitle="Get a plaintext representation of this character's build"
                  @click.stop="open" />
              </template>
              <statblock-dialog :pilot="pilot" />
            </cc-modal>
            <v-list-item
              v-if="!pilot.IsRemote"
              prepend-icon="mdi-export-variant"
              title="Export Pilot"
              subtitle="Export this pilot as a JSON file"
              @click="exportPilot()" />

            <cc-dialog
              v-if="pilot.IsRemote"
              :close-on-click="false"
              title="convert remote pilot"
              icon="cc:pilot">
              <template #activator="{ open }">
                <v-list-item
                  prepend-icon="mdi-content-copy"
                  title="Convert to Local"
                  subtitle="Convert this Pilot to an editable local data instance."
                  @click.stop="open" />
              </template>
              <template #default="{ close }">
                <cc-confirmation
                  content="Converting this pilot to local data will allow local editing but remove its
                    remote link to the author's cloud account, and prevent any further updates from
                    being received. To re-enable remote syncing, you will have to re-import this
                    pilot via its share code."
                  cancellable
                  @confirm="convert()"
                  @cancel="close" />
              </template>
            </cc-dialog>

            <cc-modal v-else title="Clone Pilot" icon="mdi-dna">
              <template #activator="{ open }">
                <v-list-item
                  prepend-icon="mdi-dna"
                  title="Clone"
                  subtitle="Duplicate or Flash Clone this character"
                  @click.stop="open" />
              </template>
              <clone-dialog :pilot="pilot" />
            </cc-modal>

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

            <v-divider v-if="!pilot.IsRemote" />
            <cc-dialog :close-on-click="false" title="confirm pilot deletion" icon="cc:pilot">
              <template #activator="{ open }">
                <v-list-item
                  v-if="!pilot.IsRemote"
                  title="Delete Pilot"
                  subtitle="Remove this pilot from the roster"
                  @click.stop="open">
                  <template #prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                </v-list-item>
              </template>
              <template #default="{ close }">
                <cc-confirmation
                  :content="`Lancer, please confirm deletion of Pilot Registration Information for:<br/>
          <span class='text-accent'>
            ${pilot.Callsign} (${pilot.Name}, LL${pilot.Level})
          </span>`"
                  cancellable
                  @confirm="
                    delete_pilot(close);
                    close;
                  "
                  @cancel="close" />
              </template>
            </cc-dialog>
          </v-list>
        </v-card>
      </v-menu>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { saveFile } from '@/io/Data';
import { Pilot } from '@/class';
import { UserStore } from '@/stores';
import { CloudController } from '@/classes/components';
import CloneDialog from './CloneDialog.vue';
import StatblockDialog from './StatblockDialog.vue';
import ShareDialog from './ShareDialog.vue';
import logger from '@/user/logger';

// import { RemoteSyncItem } from '@/cloud/item_sync';

export default {
  name: 'edit-menu',
  components: {
    StatblockDialog,
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
    size: {
      type: String,
      default: 'small',
    },
  },
  data: () => ({
    loading: false,
    deleteDialog: false,
    menu: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    delete_pilot(close?: Function) {
      this.menu = false;
      this.pilot.SaveController.Delete();
      if (close) close();
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
        logger.error(`Pilot export failed: ${error}`, this);
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
    async convert() {
      this.loading = true;
      UserStore().deleteRemoteItem(this.pilot.SaveController.RemoteCode);
      this.pilot.CloudController.GenerateMetadata();
      this.pilot.SaveController.ClearRemote();
      await UserStore().refreshDbData();
      this.loading = false;
      this.$emit('close');
    },
  },
};
</script>
