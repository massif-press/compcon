<template>
  <v-container>
    <div class="heading h2"> Character Sheets</div>
    <active-mode-sort-bar :sort="sort"
      :asc="asc"
      :items="activeSheets"
      :archived-items="archived"
      :columns="sheetOrganizerColumns"
      noun="sheet"
      title="Character Sheets"
      @update:sort="sort = $event"
      @update:asc="asc = $event"
      @archive="organizeArchive"
      @restore="organizeRestore"
      @delete="organizeDelete" />

    <sheet-item v-for="sheet in activeSheets"
      :key="sheet.ID"
      :sheet="sheet"
      @launch="launch(sheet)"
      @archive="sheet.Archive()"
      @export="exportSheet(sheet)"
      @delete="sheet.SaveController.Delete()" />

    <v-divider class="my-5" />
    <v-row dense>
      <v-col>
        <cc-button prepend-icon="mdi-plus"
          block
          color="primary"
          to="/active-mode/new-sheet"
          class="mb-2">
          New Character Sheet
        </cc-button>
      </v-col>
      <v-col cols="12"
        md="auto">
        <cc-button prepend-icon="mdi-file-import"
          block
          :size="mobile ? 'x-small' : ''"
          color="primary"
          class="mb-2"
          @click="importSelect()">
          Import
        </cc-button>
      </v-col>
    </v-row>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          Archived Sheets ({{ archived.length }})
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="mb-4"
            style="max-width: 400px;">
            <cc-text-field v-model="search"
              icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              clearable
              class="mb-4" />
          </div>
          <div v-if="archived.length === 0"
            class="text-center text-cc-overline text-disabled">
            <i>No archived sheets found{{ search ? ` including "${search}"` : '' }}.</i>
          </div>
          <v-row v-for="e in archived"
            :key="e.ID"
            class="text-cc-overline bg-background my-1"
            align="center">
            <v-col cols="auto"
              style="height: 100%">
              {{ e.Name }}
              <br>
              <v-card v-if="e.Combatant.actor.CombatController.IsDead"
                class="px-1 bg-error text-center">
                KIA
              </v-card>
              <v-card v-else
                class="px-1 bg-success text-center">
                ACTIVE
              </v-card>
            </v-col>
            <v-col cols="auto">
              <div>
                <span class="text-disabled mr-1">CREATED</span>
                <b>{{ new Date(e.Created).toLocaleDateString() }}</b>
              </div>
              <div>
                <span class="text-disabled mr-1">ARCHIVED</span>
                <b>{{ new Date(e.Updated).toLocaleDateString() }}</b>
              </div>
            </v-col>
            <v-col class="text-center">
              <cc-dialog :close-on-click="false"
                :title="`${e.Name} - LOGS AND TELEMETRY`">
                <template #activator="{ open }">
                  <cc-button size="small"
                    @click="open()"
                    color="primary"
                    disabled
                    block
                    tooltip="Review the combat log and battlefield telemetry from this sheet and optionally save it to your pilot's history.">Save
                    Pilot History</cc-button>
                  <div class="text-cc-overline text-disabled">Feature in development (v3.1)</div>
                </template>
                <v-card flat
                  tile>
                  <v-card-text>
                    <v-alert density="compact"
                      class="text-caption mt-2 mb-4"
                      flat
                      tile
                      color="panel"
                      border=start
                      border-color="red">This feature is still in development. Additional
                      data and export options will be available in future builds.
                    </v-alert>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-title class="heading">
                          encounter #
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="bg-background">
                          <code class="text-left "
                            style="white-space: pre-wrap; word-break: break-word;">
                        <v-row dense>
                          <v-col>
                            <div class="text-disabled mb-1">BATTLEFIELD TELEMETRY</div>
                            <div class="text-disabled mb-1">---------------------</div>
                            <!-- {{ formatTelemetry(a.telemetry) }} -->
                          </v-col>
                          <v-col style="max-height: 800px; overflow-y: scroll;">
                            <div class="text-disabled mb-1">COMBAT LOGS</div>
                            <div class="text-disabled mb-1">---------------------</div>
                            <div class="mb-2">
                              <!-- {{ formatLogEntry(log) }} -->
                            </div>
                          </v-col>
                        </v-row>
                      </code>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                  <v-card-actions>
                    <cc-button color="primary">
                      Export as JSON
                    </cc-button>
                  </v-card-actions>
                </v-card>
              </cc-dialog>
            </v-col>

            <v-col cols="auto"
              class="ml-auto">
              <v-menu max-width="350">
                <template #activator="{ props }">

                  <v-btn icon
                    flat
                    tile
                    v-bind="props"
                    variant="text">
                    <v-icon icon="mdi-delete" />
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <b>Delete this archive?</b>
                    <br>
                    <p class="text-caption text--text mb-2">
                      This will flag the archive for deletion. It will no longer appear in this
                      list,
                      but will be permanently deleted based on your retention options in the Options
                      Menu.
                    </p>
                    <cc-button size="small"
                      block
                      color="primary"
                      @click="e.SaveController.Delete()">
                      Delete
                    </cc-button>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>


  </v-container>
</template>

<script lang="ts">
import { PilotSheetStore } from '@/stores';
import SheetItem from './_components/SheetItem.vue';
import PilotSheet from '@/features/pilot_management/store/PilotSheet';
import { useMobile } from '@/composables/useMobile';
import ActiveModeSortBar from '@/features/active_mode/_components/ActiveModeSortBar.vue';

const sheetOrganizerColumns = [
  { key: 'Name', title: 'Name', sortable: true, value: (s: any) => s.Name },
  { key: 'Pilot', title: 'Pilot', value: (s: any) => s.Pilot.Callsign },
  { key: 'Created', title: 'Created', sortable: true, value: (s: any) => new Date(s.Created).toLocaleDateString() },
  { key: 'Updated', title: 'Updated', sortable: true, value: (s: any) => new Date(s.Updated).toLocaleDateString() },
];

export default {
  setup() {
    return useMobile()
  },
  name: 'SheetManager',
  components: {
    SheetItem,
    ActiveModeSortBar,
  },
  data: () => ({
    sort: 'Updated',
    asc: true,
    search: '',
    sheetOrganizerColumns,
  }),
  computed: {
    activeSheets() {
      let sheets = PilotSheetStore().PilotSheets.filter(x => !x.Archived && !x.SaveController.IsDeleted);

      switch (this.sort) {
        case 'Name':
          if (this.asc) sheets = sheets.sort((a, b) => a.Name.localeCompare(b.Name));
          else
            sheets = sheets.sort((a, b) => b.Name.localeCompare(a.Name));
          break;
        case 'Created':
          if (this.asc) sheets = sheets.sort((a, b) => a.Created - b.Created);
          else
            sheets = sheets.sort((a, b) => b.Created - a.Created);
          break;
        case 'Updated':
          if (this.asc) sheets = sheets.sort((a, b) => a.Updated - b.Updated);
          else
            sheets = sheets.sort((a, b) => b.Updated - a.Updated);
          break;
      }
      return sheets;
    },
    archived() {
      let archives = PilotSheetStore().PilotSheets.filter(x => x.Archived && !x.SaveController.IsDeleted);

      if (this.search) {
        const searchLower = this.search.toLowerCase();
        archives = archives.filter(x => x.Name.toLowerCase().includes(searchLower));
      }

      return archives.sort((a, b) => b.Updated - a.Updated);
    },

  },
  methods: {
    launch(sheet) {
      PilotSheetStore().SetActiveSheet(sheet.ID);
      this.$router.push(`pilot-runner/${sheet.ID}`);
    },
    exportSheet(sheet) {
      const out = JSON.stringify(PilotSheet.Serialize(sheet), null, 2);

      const blob = new Blob([out], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sheet.Name}_sheet.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    organizeArchive(ids: string[]) {
      const targets = this.activeSheets.filter((s: any) => ids.includes(s.ID));
      targets.forEach((s: any) => s.Archive());
    },
    async organizeDelete(ids: string[]) {
      const targets = this.activeSheets.filter((s: any) => ids.includes(s.ID));
      for (const s of targets) await PilotSheetStore().RemovePilotSheet(s);
    },
    organizeRestore(ids: string[]) {
      const targets = this.archived.filter((s: any) => ids.includes(s.ID));
      targets.forEach((s: any) => s.Unarchive());
    },
    importSelect() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = JSON.parse(event.target?.result as string);
            const sheet = PilotSheet.Deserialize(json);
            PilotSheetStore().PilotSheets.push(sheet);
            PilotSheetStore().SetActiveSheet(sheet.ID);
            this.$router.push(`pilot-runner/${sheet.ID}`);
          } catch (error) {
            alert('Failed to import sheet: Invalid file format.');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    }
  },
};
</script>
