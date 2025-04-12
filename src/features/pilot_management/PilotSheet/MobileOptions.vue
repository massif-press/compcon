<template>
  <v-container>
    <div class="heading h3 py-0 px-2">Pilot Options</div>
    <cc-button
      block
      size="large"
      color="panel"
      prepend-icon="mdi-printer"
      @click="$router.push(`/print/${pilot.ID}`)">
      Print
      <template #subtitle>
        <span class="text-cc-overline">Print tabletop-ready character and mech sheets</span>
      </template>
    </cc-button>

    <br />

    <cc-modal title="Statblock Generator" icon="mdi-code-block-tags">
      <template #activator="{ open }">
        <cc-button
          block
          size="large"
          color="panel"
          prepend-icon="mdi-file-document-outline"
          @click="open">
          Generate Statblock
          <template #subtitle>
            <span class="text-cc-overline">
              Get a plaintext representation of this character's build
            </span>
          </template>
        </cc-button>
      </template>
      <statblock-dialog :pilot="pilot" />
    </cc-modal>
    <br />

    <cc-button
      v-if="!pilot.IsRemote"
      block
      size="large"
      color="panel"
      prepend-icon="mdi-download"
      @click="exportPilot()">
      Export Pilot
      <template #subtitle>
        <span class="text-cc-overline">Export this pilot as a JSON file</span>
      </template>
    </cc-button>
    <br />

    <cc-dialog
      v-if="pilot.IsRemote"
      :close-on-click="false"
      title="convert remote pilot"
      icon="cc:pilot">
      <template #activator="{ open }">
        <cc-button block color="panel" prepend-icon="mdi-content-copy" @click="open">
          Convert to Local
          <template #subtitle>
            <span class="text-cc-overline">
              Convert this Pilot to an editable local data instance
            </span>
          </template>
        </cc-button>
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
        <cc-button size="large" block color="panel" prepend-icon="mdi-dna" @click="open">
          Clone
          <template #subtitle>
            <span class="text-cc-overline">Duplicate or Flash Clone this character</span>
          </template>
        </cc-button>
      </template>
      <clone-dialog :pilot="pilot" />
    </cc-modal>
    <br />

    <cc-button
      v-if="pilot.IsRemote"
      block
      size="large"
      color="panel"
      :loading="loading"
      :disabled="pilot.CloudController.SyncStatus === 'Synced'"
      prepend-icon="mdi-cloud-sync"
      @click="remoteUpdate()">
      Download Latest Data
      <template #subtitle>
        <span class="text-cc-overline">
          {{
            pilot.CloudController.SyncStatus === 'Synced'
              ? 'Pilot is up to date with remote data'
              : 'Download all remote changes to this pilot, overwriting local data.'
          }}
        </span>
      </template>
    </cc-button>
    <br />

    <cc-dialog :close-on-click="false" title="confirm pilot deletion" icon="cc:pilot">
      <template #activator="{ open }">
        <cc-button
          v-if="!pilot.IsRemote"
          block
          size="large"
          color="error"
          prepend-icon="mdi-delete"
          @click="open">
          Delete Pilot
          <template #subtitle>
            <span class="text-cc-overline">Remove this pilot from the roster</span>
          </template>
        </cc-button>
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
  </v-container>
</template>

<script lang="ts">
import { saveFile } from '@/io/Data';
import { Pilot } from '@/class';
import { UserStore } from '@/stores';
import { CloudController } from '@/classes/components';
import CloneDialog from './components/CloneDialog.vue';
import StatblockDialog from './components/StatblockDialog.vue';
import ShareDialog from './components/ShareDialog.vue';
import logger from '@/user/logger';

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
  },
  data: () => ({
    loading: false,
    deleteDialog: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    delete_pilot(close?: Function) {
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
