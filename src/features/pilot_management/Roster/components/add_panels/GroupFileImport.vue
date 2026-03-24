<template>
  <v-card-text>
    <v-row align="center"
      justify="center">
      <v-col cols="6">
        <v-file-input v-model="fileValue"
          accept=".json, text/json"
          variant="outlined"
          label="Select Pilot Data File"
          prepend-icon="mdi-paperclip"
          density="compact"
          @change="stageImport"
          @click:clear="reset" />
      </v-col>
    </v-row>
    <v-container v-if="stagedPilots.length">

      <v-card flat
        tile
        color="primary"
        class="pa-1 heading h2 text-center">{{ stagedData.name }}</v-card>

      <v-card flat
        tile
        variant="outlined"
        color="panel"
        :disabled="!importPilots"
        class="pa-2">
        <v-row v-for="p in stagedPilots"
          :key="p.id"
          dense>
          <v-col cols="auto">
            <v-avatar size="100"
              flat
              tile>
              <v-img :src="p.img.portrait || p.img.cloud_portrait || '/img/pilot/nodata.png'" />
            </v-avatar>
          </v-col>
          <v-col class="text-text">
            <div class="heading h3">
              {{ p.name }}
              <cc-slashes />
              {{ p.callsign }}
            </div>
            <div class="text-caption">
              {{ p.background || 'Unknown Background' }}, LL {{ p.level }} <span v-if=p.player_name>
                ({{ p.player_name
                }})</span>
            </div>
            <cc-panel v-for="m in p.mechs"
              :key="m.id"
              density="compact"
              class="text-caption">
              <div>
                {{ m.name }} ({{ m.frameData.source }} {{ m.frameData.name }})
              </div>
            </cc-panel>
          </v-col>
        </v-row>
      </v-card>

      <v-row justify="end">
        <v-col cols="auto">
          <cc-checkbox v-model="importPilots"
            color="accent"
            :label="`Import Pilots (${stagedPilots.length})`"
            density="compact"
            hide-details />
        </v-col>
      </v-row>

      <div class="mt-2">
        <cc-alert v-if="alreadyPresent"
          color="warning"
          icon="mdi-alert"
          title="Group Already Exists"
          class="my-2">
          <p class="text-center"
            v-text="alreadyPresent" />
        </cc-alert>
        <v-slide-x-reverse-transition>
          <v-row v-if="stagedData"
            align="center"
            justify="center">
            <v-col cols="auto">
              <cc-button color="accent"
                block
                prepend-icon="mdi-plus"
                @click="importFile()">
                Import {{ (stagedData as any).name }}
                <span v-if="stagedPilots.length && importPilots">
                  &nbsp;and {{ stagedPilots.length }} Pilot{{
                    stagedPilots.length > 1 ? 's' : ''
                  }}</span>
              </cc-button>
            </v-col>
          </v-row>
        </v-slide-x-reverse-transition>
      </div>
    </v-container>
  </v-card-text>
</template>

<script lang="ts">
import { Pilot, PilotGroup } from '@/class';
import { ImportData } from '@/io/Data';

import { PilotStore } from '@/stores';
import { PilotData } from '@/interface';

import { logger } from '@sentry/vue';

export default {
  name: 'FileImport',
  emits: ['toggle-import', 'done'],
  data: () => ({
    // fileValue is just used to clear the file input
    fileValue: null,
    stagedData: null as any,
    stagedPilots: [] as PilotData[],
    importPilots: true,
    alreadyPresent: '',
  }),
  methods: {
    reset() {
      this.fileValue = null;
      this.stagedData = null;
      this.stagedPilots = [];
      this.importPilots = true;
      this.alreadyPresent = '';
      this.$emit('toggle-import', false);
    },
    async stageImport(file) {
      if (!file) return;
      this.$emit('toggle-import', true);
      let data;
      let pilotData;
      try {
        let importedData = await ImportData<any>(file.target.files[0]);
        importedData = JSON.parse(importedData);
        data = importedData.groupData;
        pilotData = importedData.pilotData;
      } catch (error) {
        this.$notify({
          title: 'Import Error',
          text: `Unable to read file: ${error}`,
          data: { icon: 'mdi-account-multiple', color: 'error' },
        });
        logger.error('File Import Error', { error, fileName: file.target.files[0].name });
        this.reset();
        return;
      }

      const exists = PilotStore().PilotGroups.find(
        (x) => x.Name === data.name
      );

      if (exists && !exists.SaveController.IsDeleted) {
        this.alreadyPresent =
          'A pilot group with this name already exists in the roster. Importing will create a unique copy of this group.';
        const num = PilotStore().PilotGroups.filter(
          (x) => x.Name === data.name
        ).length;
        data.name += ` (${num})`;
      }

      console.log(data)

      this.stagedData = data;
      this.stagedPilots = pilotData || [];
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
