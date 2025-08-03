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
          @click:clear="reset"
        />
      </v-col>
    </v-row>
    <v-container v-if="stagedData" flat tile>
      <v-card flat tile max-width="900px" class="mx-auto" border>
        <cc-alert
          v-if="!stagedData.itemType"
          icon="mdi-alert-circle-outline"
          title="v2 Data"
        >
          <p class="text-text">
            This appears to be Pilot data from an older COMP/CON release.
            COMP/CON will attempt to convert and import this data, but may not
            be able to convert all items and may not be able to furnish
            information about missing LCP requirements.
          </p>
        </cc-alert>
        <v-card-text>
          <div class="heading h2">
            {{ stagedData.name }}
            <cc-slashes />
            <span class="text-accent pl-2">{{ stagedData.callsign }}</span>
          </div>
          <div class="text-cc-overline mb-2">
            LICENSE LEVEL
            <span class="heading h3">{{ stagedData.level }}</span>
          </div>
          <div v-if="stagedData.mechs.length">
            <div class="text-cc-overline">HANGAR</div>
            <cc-chip
              v-for="mech in stagedData.mechs"
              :key="mech.id"
              class="mr-1 mb-1"
            >
              {{ mech.name }}
              <cc-slashes />
              {{ getFrame(mech.frame) }}
            </cc-chip>
          </div>
          <div v-if="stagedData.brews.length" class="text-cc-overline my-1">
            INCLUDES DATA FROM THE FOLLOWING CONTENT PACKS
            <div>
              <cc-chip
                v-for="brew in stagedData.brews"
                :key="brew.LcpId"
                class="ma-1"
              >
                {{ brew.LcpName }}
              </cc-chip>
            </div>
          </div>
          <div v-if="stagedData.save">
            <v-divider class="my-2" />
            <div class="text-cc-overline mb-2">
              Created {{ new Date(stagedData.save.created).toLocaleString() }}
              <cc-slashes />
              Last Modified
              {{ new Date(stagedData.save.lastModified).toLocaleString() }}
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-card
        v-if="missingContent.length"
        flat
        tile
        max-width="900px"
        class="mx-auto"
        border
      >
        <v-card-text class="text-center">
          <p class="heading h4 text-accent">
            This Pilot requires the following content packs that are not
            currently installed/active, or have mismatching versions:
          </p>
          <p class="effect-text text-center" v-html="missingContent" />
          <p class="text-text">
            This Pilot cannot be imported until the missing content packs are
            installed and activated, or the content pack versions are
            synchronized.
          </p>
        </v-card-text>
      </v-card>
    </v-container>

    <div class="mt-2">
      <div
        v-if="alreadyPresent"
        class="text-center mb-1 text-caption text-text"
        v-text="alreadyPresent"
      />
      <v-slide-x-reverse-transition>
        <cc-button
          v-if="stagedData"
          color="primary"
          block
          prepend-icon="mdi-plus"
          :disabled="missingContent.length > 0"
          @click="importFile()"
        >
          Import {{ (stagedData as any).callsign }} ({{
            (stagedData as any).name
          }})
        </cc-button>
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
      required: false,
    },
    skipRosterSave: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    // fileValue is just used to clear the file input
    fileValue: null,
    missingContent: '',
    stagedData: null as PilotData | null,
    alreadyPresent: '',
  }),
  watch: {
    stagedData(newVal) {
      if (!newVal) {
        this.reset();
      }
    },
  },
  methods: {
    reset() {
      this.fileValue = null;
      this.missingContent = '';
      this.stagedData = null;
      this.alreadyPresent = '';
    },
    getFrame(frame) {
      const frameData = CompendiumStore().Frames.find((x) => x.ID === frame);
      if (frameData) return frameData.Name;
      return `UNKNOWN FRAME (${frame})`;
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
        if (missingPacks.length)
          this.missingContent = missingPacks.join('<br />');
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
        const num = PilotStore().Pilots.filter(
          (x) => x.Name === pilotData.name
        ).length;
        pilotData.name += ` (${num})`;
      }
      this.stagedData = pilotData;
    },
    importFile() {
      try {
        const importPilot = Pilot.Deserialize(this.stagedData as PilotData);
        importPilot.RenewID();
        if (!this.skipRosterSave) {
          PilotStore().AddPilot(importPilot, this.groupId);
        } else {
          this.$emit('import-complete', importPilot);
          this.$emit('done');
          return;
        }
        this.reset();
        this.$notify({
          title: 'Import Successful',
          text: `${importPilot.Name} // ${importPilot.Callsign} successfully added to roster.`,
          data: { icon: 'cc:pilot' },
        });
        this.$emit('done');
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
