<template>
  <v-container>
    <v-file-input
      v-model="fileValue"
      accept="text/json"
      variant="outlined"
      label="Select Pilot Data File"
      prepend-icon="mdi-paperclip"
      @change="stageImport"
      @click:clear="reset"
    />
    <v-card v-if="missingContent.length">
      <p v-if="oldBrewsWarning" class="heading h3 text-accent">
        WARNING: The imported Pilot was created using an older version of
        COMP/CON. Lancer Content Pack analysis may not be comprehensive and
        there is a chance COMP/CON will be unable to correctly load this data.
        Export the original file in the latest version of COMP/CON to guarantee
        LCP validation.
      </p>
      <v-card-text class="text-center">
        <p class="heading h4 text-accent">
          The imported Pilot requires the following content packs that are not
          currently installed/active, or have mismatching versions:
        </p>
        <p class="effect-text text-center" v-html="missingContent" />
        <p class="text-text">
          This Pilot cannot be imported until the missing content packs are
          installed and activated, or the content pack versions are
          synchronized.
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="reset">Abort Import</v-btn>
      </v-card-actions>
    </v-card>
    <div class="mt-2">
      <p v-if="alreadyPresent" class="text-accent text-center">
        A Pilot with this ID already exists in the roster. Importing will create
        a unique copy of this pilot.
      </p>
      <v-slide-x-reverse-transition>
        <v-row v-if="stagedData" align="center" justify="center">
          <v-col cols="auto">
            <v-btn
              large
              color="secondary"
              :disabled="missingContent.length > 0"
              @click="importFile()"
            >
              <v-icon large left>cc:accuracy</v-icon>
              Import {{ stagedData.callsign }} ({{ stagedData.name }})
            </v-btn>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import { importData } from '@/io/Data';

import { CompendiumStore, PilotStore } from '@/stores';
import { PilotData } from '@/interface';

export default {
  name: 'file-import',
  data: () => ({
    // fileValue is just used to clear the file input
    fileValue: null,
    oldBrewsWarning: false,
    missingContent: '',
    stagedData: null,
    alreadyPresent: false,
  }),
  methods: {
    reset() {
      this.fileValue = null;
      this.oldBrewsWarning = false;
      this.missingContent = '';
      this.stagedData = null;
      this.alreadyPresent = false;
    },
    async stageImport(file) {
      if (!file) return;
      const pilotData = await importData<PilotData>(file);
      if (!pilotData.brews) pilotData.brews = [];
      // catch old style brews
      if (pilotData.brews.length && !pilotData.brews[0].LcpId) {
        this.oldBrewsWarning = true;

        const installedPacks = CompendiumStore()
          .ContentPacks.filter((x) => x.Active)
          .map((x) => `${x.Name} @ ${x.Version}`);
        const missingPacks = _.pullAll(pilotData.brews, installedPacks);
        if (missingPacks.length)
          this.missingContent = missingPacks.join('<br />');
      } else {
        const installedPacks = CompendiumStore()
          .ContentPacks.filter((x) => x.Active)
          .map((x) => x.ID);
        let missing = [];
        pilotData.brews.forEach((b) => {
          if (!installedPacks.includes(b.LcpId)) {
            missing.push(`${b.LcpName} @ ${b.LcpVersion}`);
          }
        });
        if (missing.length) this.missingContent = missing.join('<br />');
      }
      if (
        PilotStore()
          .Pilots.map((x) => x.ID)
          .includes(pilotData.id)
      ) {
        this.alreadyPresent = true;
        pilotData.name += '※';
        pilotData.callsign += '※';
      }
      this.stagedData = pilotData;
    },
    importFile() {
      try {
        const importPilot = Pilot.Deserialize(this.stagedData);
        importPilot.GroupController.reset();
        importPilot.CloudController.reset();
        importPilot.RenewID();
        this.$store.dispatch('addPilot', importPilot);
        this.reset();
        this.$emit('done');
        this.$notify('Pilot successfully imported', 'success');
      } catch (error) {
        this.$notify(
          'An error occured during the import attempt. Please check the console log.',
          'error'
        );
      }
    },
    cancelImport() {
      this.reset();
    },
  },
};
</script>

<style scoped>
#panel {
  border: 5px double rgb(var(--v-theme-panel-border)) !important;
  border-radius: 2px !important;
}
</style>
