<template>
  <v-card-text>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-file-input
          v-model="fileValue"
          accept="text/json"
          variant="outlined"
          label="Select Pilot Data File"
          prepend-icon="mdi-paperclip"
          density="compact"
          @change="stageImport"
          @click:clear="reset" />
      </v-col>
    </v-row>
    <v-card v-if="missingContent.length">
      <v-card-text class="text-center">
        <p class="heading h4 text-accent">
          The imported Pilot requires the following content packs that are not currently
          installed/active, or have mismatching versions:
        </p>
        <p class="effect-text text-center" v-html="missingContent" />
        <p class="text-text">
          This Pilot cannot be imported until the missing content packs are installed and activated,
          or the content pack versions are synchronized.
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="primary" @click="reset">Abort Import</v-btn>
      </v-card-actions>
    </v-card>
    <div class="mt-2">
      <p v-if="alreadyPresent" class="text-center" v-text="alreadyPresent" />
      <v-slide-x-reverse-transition>
        <v-row v-if="stagedData" align="center" justify="center">
          <v-col cols="auto">
            <v-btn
              color="accent"
              prepend-icon="mdi-plus"
              :disabled="missingContent.length > 0"
              @click="importFile()">
              Import {{ (stagedData as any).callsign }} ({{ (stagedData as any).name }})
            </v-btn>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import { ImportData } from '@/io/Data';

import { CompendiumStore, PilotStore } from '@/stores';
import { PilotData } from '@/interface';

import _ from 'lodash';
import logger from '@/user/logger';

export default {
  name: 'file-import',
  props: {
    groupId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    // fileValue is just used to clear the file input
    fileValue: null,
    missingContent: '',
    stagedData: null as PilotData | null,
    alreadyPresent: '',
  }),
  methods: {
    reset() {
      this.fileValue = null;
      this.missingContent = '';
      this.stagedData = null;
      this.alreadyPresent = '';
    },
    async stageImport(file) {
      if (!file) return;
      const pilotData = await ImportData<PilotData>(file.target.files[0]);

      if (!pilotData.brews) pilotData.brews = [];
      // catch old style brews
      if (pilotData.brews.length && !pilotData.brews[0].LcpId) {
        const installedPacks = CompendiumStore()
          .ContentPacks.filter((x) => x.Active)
          .map((x) => `${x.Name} @ ${x.Version}`);
        const missingPacks = _.pullAll(pilotData.brews, installedPacks as any);
        if (missingPacks.length) this.missingContent = missingPacks.join('<br />');
      } else {
        const installedPacks = CompendiumStore()
          .ContentPacks.filter((x) => x.Active)
          .map((x) => x.ID);
        let missing = [] as string[];
        pilotData.brews.forEach((b) => {
          if (!installedPacks.includes(b.LcpId)) {
            missing.push(`${b.LcpName} @ ${b.LcpVersion}`);
          }
        });
        if (missing.length) this.missingContent = missing.join('<br />');
      }

      const exists = PilotStore().Pilots.find((x) => x.ID === pilotData.id);
      if (exists && !exists.SaveController.IsDeleted) {
        this.alreadyPresent =
          'A Pilot with this ID already exists in the roster. Importing will create a unique copy of this pilot.';
        const num = PilotStore().Pilots.filter((x) => x.Name === pilotData.name).length;
        pilotData.name += ` (${num})`;
      }
      this.stagedData = pilotData;
    },
    importFile() {
      try {
        const importPilot = Pilot.Deserialize(this.stagedData as PilotData);
        importPilot.RenewID();
        PilotStore().AddPilot(importPilot, this.groupId);
        this.reset();
        this.$emit('done');
        this.$notify({
          title: 'Import Successful',
          text: `${importPilot.Name} // ${importPilot.Callsign} successfully added to roster.`,
          data: { icon: 'cc:pilot' },
        });
      } catch (error) {
        logger.error(`Pilot import error: ${error}`);
        this.$notify({
          title: 'Import Error',
          text: `Unable to import Pilot: ${error}`,
          data: { icon: 'cc:pilot', color: 'error' },
        });
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
