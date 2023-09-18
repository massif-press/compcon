<template>
  <v-file-input
    v-model="fileValue"
    accept="text/json"
    variant="outlined"
    label="Import from File"
    prepend-icon="mdi-paperclip"
    density="compact"
    hide-details
    @change="stageImport"
    @click:clear="reset"
  />
  <v-row v-if="stagedPilots.length" justify="end">
    <v-col cols="auto">
      <v-checkbox
        v-model="importPilots"
        color="accent"
        :label="`Import Pilots (${stagedPilots.length})`"
        density="compact"
        hide-details
      />
    </v-col>
  </v-row>
  <v-card v-if="stagedPilots.length && missingContent.length">
    <v-card-text class="text-center">
      <p class="heading h4 text-accent">
        One or more imported Pilots require the following content packs that are not currently
        installed/active, or have mismatching versions:
      </p>
      <p class="effect-text text-center" v-html="missingContent" />
      <p class="text-text">
        These Pilots cannot be imported until the missing content packs are installed and activated,
        or the content pack versions are synchronized.
      </p>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn text color="primary" @click="reset">Abort Import</v-btn>
    </v-card-actions>
  </v-card>
  <div class="mt-2">
    <p v-if="alreadyPresent" class="text-center" v-text="alreadyPresent" />
    <v-slide-x-reverse-transition>
      <v-row v-if="stagedData" align="center" justify="center">
        <v-col cols="auto">
          <v-btn
            color="accent"
            prepend-icon="cc:accuracy"
            :disabled="missingContent.length > 0"
            @click="importFile()"
          >
            Import {{ (stagedData as any).name }}
            <span v-if="stagedPilots.length && importPilots">
              &nbsp;and {{ stagedPilots.length }} Pilot{{
                stagedPilots.length > 1 ? 's' : ''
              }}</span
            >
          </v-btn>
        </v-col>
      </v-row>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
import { Pilot, PilotGroup } from '@/class';
import { ImportData } from '@/io/Data';

import { CompendiumStore, PilotStore } from '@/stores';
import { PilotData } from '@/interface';

import _ from 'lodash';

export default {
  name: 'file-import',
  data: () => ({
    // fileValue is just used to clear the file input
    fileValue: null,
    oldBrewsWarning: false,
    missingContent: '',
    stagedData: null as any,
    stagedPilots: [] as PilotData[],
    importPilots: true,
    alreadyPresent: '',
  }),
  emits: ['toggle-import', 'done'],
  methods: {
    reset() {
      this.fileValue = null;
      this.oldBrewsWarning = false;
      this.missingContent = '';
      this.stagedData = null;
      this.stagedPilots = [];
      this.importPilots = true;
      this.alreadyPresent = '';
      this.$emit('toggle-import', false);
    },
    async stageImport(file) {
      if (!file) return;
      this.$emit('toggle-import', true);
      const groupExportData = await ImportData<any>(file.target.files[0]);

      groupExportData.groupData.pilots = [];

      if (this.importPilots && groupExportData.pilotData.length) {
        groupExportData.pilotData.forEach((pilotData) => {
          if (!pilotData.brews) pilotData.brews = [];

          const installedPacks = CompendiumStore()
            .ContentPacks.filter((x) => x.Active)
            .map((x) => x.ID);
          let missing = [] as string[];
          pilotData.brews.forEach((b) => {
            if (!installedPacks.includes(b.LcpId)) {
              if (!missing.includes(`${b.LcpName} @ ${b.LcpVersion}`))
                missing.push(`${b.LcpName} @ ${b.LcpVersion}`);
            }
          });

          if (missing.length) this.missingContent = missing.join('<br />');
        });
      }

      const exists = PilotStore().PilotGroups.find(
        (x) => x.Name === groupExportData.groupData.name
      );

      console.log(exists);

      if (exists && !exists.SaveController.IsDeleted) {
        this.alreadyPresent =
          'A pilot group with this name already exists in the roster. Importing will create a unique copy of this group.';
        const num = PilotStore().PilotGroups.filter(
          (x) => x.Name === groupExportData.groupData.name
        ).length;
        groupExportData.groupData.name += ` (${num})`;
      }

      this.stagedData = groupExportData.groupData;
      this.stagedPilots = this.importPilots ? groupExportData.pilotData : [];
    },
    importFile() {
      let newID = '';
      try {
        const importGroup = PilotGroup.Deserialize(this.stagedData);
        newID = importGroup.RenewID();
        PilotStore().AddGroup(importGroup);
        this.$notify({
          title: 'Import Successful',
          text: `${importGroup.Name} successfully added.`,
          data: { icon: 'mdi-account-multiple' },
        });
      } catch (error) {
        this.$notify({
          title: 'Import Error',
          text: `Unable to import pilot group: ${error}`,
          data: { icon: 'mdi-account-multiple', color: 'error' },
        });
      }

      this.stagedPilots.forEach((stagedPilot) => {
        try {
          const importPilot = Pilot.Deserialize(stagedPilot as PilotData);
          importPilot.CloudController.reset();
          importPilot.RenewID();
          if (PilotStore().Pilots.some((x) => x.Name === importPilot.Name)) {
            const num = PilotStore().Pilots.filter((x) => x.Name === importPilot.Name).length;
            importPilot.Name += ` (${num})`;
          }
          PilotStore().AddPilot(importPilot, newID);
          this.reset();
          this.$notify({
            title: 'Import Successful',
            text: `${importPilot.Name} // ${importPilot.Callsign} successfully added to roster.`,
            data: { icon: 'cc:pilot' },
          });
        } catch (error) {
          this.$notify({
            title: 'Import Error',
            text: `Unable to import Pilot: ${error}`,
            data: { icon: 'cc:pilot', color: 'error' },
          });
        }
      });

      this.reset();
      this.$emit('done');
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
