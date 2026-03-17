<template>
  <v-card-text>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-file-input
          v-model="<any>fileValue"
          accept="text/json"
          variant="outlined"
          label="Select Encounter File"
          prepend-icon="mdi-paperclip"
          density="compact"
          @change="stageImport"
          @click:clear="reset" />
      </v-col>
    </v-row>

    <v-alert v-if="notEncounterFile" type="error" variant="tonal" class="mx-4 mb-3">
      The selected file does not contain encounter data.
    </v-alert>

    <v-container v-if="stagedItems.length">
      <div class="text-caption">STAGED ENCOUNTERS</div>
      <v-table>
        <thead class="heading">
          <tr>
            <th width="1px">
              <v-btn
                icon
                flat
                size="small"
                @click="
                  selected.length
                    ? (selected = [])
                    : (selected = stagedItems.map((x: any) => x.id))
                ">
                <v-icon
                  size="x-large"
                  :icon="
                    selected.length === stagedItems.length
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stagedItems" :key="item.id">
            <td>
              <v-checkbox v-model="selected" :value="item.id" multiple hide-details />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.sitrepName }}</td>
            <td class="text-center">{{ item.combatantCount }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-row justify="end" class="mt-2 mr-4">
        <v-col cols="auto">
          <v-btn
            variant="tonal"
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

      let content: any[] = [];
      if (data.type && data.type.includes('collection')) {
        content = data.data;
      } else {
        content = [data];
      }

      const encounters = content.filter(
        (x) => x.itemType?.toLowerCase() === 'encounter'
      );

      if (!encounters.length) {
        this.notEncounterFile = true;
        return;
      }

      this.stagedData = encounters;
      this.stagedItems = encounters.map((item) => ({
        id: item.id,
        name: item.name || 'Unnamed Encounter',
        sitrepName: item.sitrep?.name || '—',
        combatantCount: item.combatants?.length ?? 0,
      }));

      this.selected = this.stagedItems.map((x) => x.id);
    },
    importFile() {
      const staged = this.stagedData.filter((x) => this.selected.includes(x.id));

      staged.forEach((item) => {
        item.id = uuid();
        try {
          EncounterStore().AddEncounter(Encounter.Deserialize(item));
        } catch (error) {
          console.error(error);
          this.$notify({
            title: 'Import Error',
            text: `Unable to import encounter: ${error}`,
            data: { icon: 'cc:compendium', color: 'error' },
          });
        }
      });

      this.reset();
      this.$emit('complete');
    },
  },
};
</script>
