<template>
  <v-card-text>
    <v-row align="center"
      justify="center">
      <v-col cols="6">
        <v-file-input v-model="fileValue"
          accept="text/json"
          variant="outlined"
          label="Select Encounter File"
          prepend-icon="mdi-paperclip"
          density="compact"
          @change="stageImport"
          @click:clear="reset" />
      </v-col>
    </v-row>

    <v-alert v-if="notEncounterFile"
      type="error"
      variant="tonal"
      class="mx-4 mb-3">
      The selected file does not contain encounter data.
    </v-alert>

    <v-container v-if="stagedItems.length">
      <div class="text-caption">STAGED ENCOUNTERS</div>
      <v-table>
        <thead class="heading">
          <tr>
            <th width="1px">
              <v-btn icon
                flat
                size="small"
                @click="
                  selected.length
                    ? (selected = [])
                    : (selected = stagedItems.map((x: any) => x.id))
                  ">
                <v-icon size="x-large"
                  :icon="selected.length === stagedItems.length
                    ? 'mdi-checkbox-outline'
                    : selected.length > 0
                      ? 'mdi-minus-box-outline'
                      : 'mdi-checkbox-blank-outline'
                    " />
              </v-btn>
            </th>
            <th>Name</th>
            <th>Sitrep</th>
            <th class="text-center">Combatants</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stagedItems"
            :key="item.id">
            <td>
              <v-checkbox v-model="selected"
                :value="item.id"
                multiple
                hide-details />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.sitrepName }}</td>
            <td class="text-center">{{ item.combatantCount }}</td>
            <td class="text-center">
              <v-tooltip location="top"
                max-width="300px">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    :icon="item.status === 'ok' ? 'mdi-check' : 'mdi-alert'"
                    :color="item.status === 'ok' ? 'success' : 'warning'" />
                </template>
                <span v-if="item.status === 'ok'">Encounter is ready for import</span>
                <span v-else-if="item.status === 'missing_content'">
                  This encounter references NPCs that have not been imported yet. It will be saved
                  to the v2 Imports collection in the Content Manager and can be imported once the
                  required NPCs are available.
                </span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <cc-alert v-if="missingContent.length"
        class="mx-12 mt-4"
        icon="mdi-alert"
        title="Missing NPCs">
        <p>
          Some encounters reference NPCs that have not been imported yet. These encounters will be
          saved to the v2 Imports collection in the Content Manager and can be imported once the
          required NPCs are available.
        </p>
        <v-card-text>
          <p class="heading h4 text-accent">
            Missing NPCs:
          </p>
          <p v-html-safe="missingContent"
            class="effect-text text-center bg-background pa-1 ma-1" />
        </v-card-text>
      </cc-alert>

      <v-row justify="end"
        class="mt-2 mr-4">
        <v-col cols="auto">
          <v-btn variant="tonal"
            color="accent"
            prepend-icon="mdi-plus"
            :disabled="!selected.length"
            @click="importFile">
            Import ({{ selected.length }} Encounter{{ selected.length !== 1 ? 's' : '' }})
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card-text>
</template>

<script lang="ts">
import { ImportData } from '@/io/Data';
import { EncounterStore } from '@/stores';
import { v4 as uuid } from 'uuid';
import { Encounter } from '@/classes/encounter/Encounter';
import {
  isV2Encounter,
  getV2EncounterMissingNpcs,
  preprocessEncounterImport,
} from '@/io/V2Importer';
import { ImportEncounter } from '@/io/Importer';

export default {
  name: 'EncounterImporter',
  emits: ['complete'],
  data: () => ({
    selected: [] as string[],
    fileValue: null,
    stagedData: [] as any[],
    stagedItems: [] as any[],
    notEncounterFile: false,
  }),
  computed: {
    missingContent() {
      const missing = new Set<string>();
      this.stagedItems.forEach((item) => {
        if (item.status === 'missing_content') {
          (item.missingInfo as string[]).forEach((m) => missing.add(m));
        }
      });
      return Array.from(missing).join('<br>');
    },
  },
  methods: {
    reset() {
      this.fileValue = null;
      this.stagedData = [];
      this.stagedItems = [];
      this.selected = [];
      this.notEncounterFile = false;
    },
    async stageImport(file) {
      if (!file) return;
      this.notEncounterFile = false;

      const data = await ImportData<any>(file.target.files[0]);

      if (isV2Encounter(data)) {
        const encounters = Array.isArray(data) ? data : [data];

        this.stagedData = encounters;
        this.stagedItems = encounters.map((enc) => {
          const missingNpcs = getV2EncounterMissingNpcs(enc);
          return {
            id: enc.id,
            name: (enc.name || 'Unnamed Encounter') + ' (v2)',
            sitrepName: enc.sitrep.name || '—',
            combatantCount: (enc.npcs?.length || 0) + (enc.reinforcements?.length || 0),
            status: missingNpcs.length === 0 ? 'ok' : 'missing_content',
            missingInfo: missingNpcs.map((id) => `NPC: ${id}`),
          };
        });
      } else {
        let content;
        if (data.type && data.type.includes('collection')) {
          content = data.data;
        } else {
          content = [data];
        }

        const encounters = content.filter(
          (x) => x.itemType?.toLowerCase() === 'encounter'
        );

        this.stagedData = encounters;
        this.stagedItems = encounters.map((item) => ({
          id: item.id,
          name: item.name || 'Unnamed Encounter',
          sitrepName: item.sitrep?.name || '—',
          combatantCount: item.combatants?.length ?? 0,
          status: 'ok',
          missingInfo: [],
        }));
      }

      if (!this.stagedItems.length) {
        this.notEncounterFile = true;
        return;
      }

      this.selected = this.stagedItems.map((x) => x.id);
    },
    async importFile() {
      const staged = this.stagedData.filter((x) => this.selected.includes(x.id));

      let backedUp = 0;

      for (const item of staged) {
        try {
          if (isV2Encounter(item)) {
            const result = await preprocessEncounterImport(item);
            if (result.action === 'import' && result.transformed) {
              const encs = Array.isArray(result.transformed)
                ? result.transformed
                : [result.transformed];
              for (const enc of encs) await ImportEncounter(enc);
            } else if (result.action === 'backup') {
              backedUp++;
            }
          } else {
            item.id = uuid();
            EncounterStore().AddEncounter(Encounter.Deserialize(item));
          }
        } catch (error) {
          console.error(error);
          this.$notify({
            title: 'Import Error',
            text: `Unable to import encounter: ${error}`,
            data: { icon: 'cc:compendium', color: 'error' },
          });
        }
      }

      if (backedUp > 0) {
        this.$notify({
          title: 'v2 Import Backup',
          text: `${backedUp} item(s) saved to pending v2 imports in the Content Manager/`,
          data: { icon: 'mdi-information-box-outline', color: 'info' },
        });
      }

      this.reset();
      this.$emit('complete');
    },
  },
};
</script>
