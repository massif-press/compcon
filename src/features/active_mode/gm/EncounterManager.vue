<template>
  <v-container>
    <div class="heading h2">Local Active Encounters</div>

    <div class="my-1">
      <v-tooltip location="top"
        open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="panel"
            flat
            tile
            size="small"
            @click="setSort('Updated')">
            <v-icon icon="mdi-clock-outline"
              size="20"
              color="accent" />
            <v-icon v-if="sort === 'Updated'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1" />
          </v-btn>
        </template>
        <span>Sort by Recent</span>
      </v-tooltip>

      <v-tooltip location="top"
        open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="panel"
            flat
            tile
            size="small"
            @click="setSort('Name')">
            <v-icon icon="mdi-format-text-variant"
              size="24"
              color="accent" />
            <v-icon v-if="sort === 'Name'"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1"
              color="accent" />
          </v-btn>
        </template>
        <span>Sort by Name</span>
      </v-tooltip>

      <v-tooltip location="top"
        open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="panel"
            flat
            tile
            size="small"
            @click="setSort('Created')">
            <v-icon icon="mdi-calendar"
              size="21"
              color="accent" />
            <v-icon v-if="sort === 'Created'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1" />
          </v-btn>
        </template>
        <span>Sort by created timestamp</span>
      </v-tooltip>
    </div>

    <!-- <cc-alert>
      <v-icon icon="mdi-information-outline"
        class="mr-2" />
      These encounters will only be accessible on this device. Pilot data can be loaded from remote
      sources, but will not push any updates to their owners. For cloud-based and simultaneous
      multiplayer, create a
      <a>Table</a>
      instead.
    </cc-alert> -->
    <div v-for="e in encounters"
      style="position: relative"
      class="li-top-element my-2"
      @click="launch(e)">
      <div class="light"
        style="position: absolute; top: 0; left: -15px; bottom: 0; width: 10px" />
      <v-row no-gutters
        class="lighten-select"
        :class="mobile ? 'mb-2' : 'mb-4'">
        <v-col cols="auto"
          style="border: rgb(var(--v-theme-primary)) 3px double">
          <!-- <v-img v-if="e.Encounter.Map" :src="e.Encounter.Map" cover min-height="100%" /> -->
          <v-img v-if="e.Encounter.Portrait"
            :src="e.Encounter.Portrait"
            height="100%"
            width="120px"
            cover />
        </v-col>
        <v-col style="position: relative">
          <v-toolbar density="compact"
            class="cToolbar"
            :height="mobile ? '40' : '46'">
            <v-row no-gutters
              align="center"
              class="px-2">
              <v-col cols="auto"
                class="heading text-white">
                {{ e.Encounter.Name }}
                <cc-slashes class="mx-3" />
                <span class="text-disabled mr-1">ROUND</span>
                <b>{{ e.Round }}</b>
              </v-col>
              <v-col cols="auto"
                class="mr-n2 ml-auto">
                <v-menu>
                  <template #activator="{ props }">
                    <v-icon v-bind="props"
                      start
                      color="white"
                      @click.stop
                      icon="mdi-cog"
                      size="small"
                      class="fade-select" />
                  </template>
                  <v-card>
                    <v-list>
                      <v-list-item prepend-icon="mdi-delete"
                        color="error"
                        @click="RemoveEncounter(e)">
                        <v-list-item-title>Delete Encounter</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
          </v-toolbar>

          <div class="text-cc-overline">
            <v-row class="detail-row px-2"
              no-gutters>
              <v-col cols="auto"
                class="pb-0 my-1">
                <div>
                  <span class="text-disabled mr-1">
                    CREATED
                    <cc-slashes />
                  </span>
                  <b>{{ new Date(e.SaveController.Created).toLocaleDateString() }}</b>
                </div>
                <div v-if="e.SaveController.LastModified">
                  <span class="text-disabled mr-1">
                    LAST UPDATE
                    <cc-slashes />
                  </span>
                  <b>{{ new Date(e.SaveController.LastModified).toLocaleDateString() }}</b>
                </div>
              </v-col>
              <v-col class="mb-0 pb-0 mt-1">
                <div>
                  <span class="text-disabled mr-1">
                    ENVIRONMENT
                    <cc-slashes />
                  </span>
                  <b>{{ e.Encounter.Environment.Name }}</b>
                </div>

                <div>
                  <span class="text-disabled mr-1">
                    SITREP
                    <cc-slashes />
                  </span>
                  <b>{{ e.Encounter.Sitrep.Name }}</b>
                </div>
              </v-col>

              <v-col cols="12"
                class="mt-1 py-0">
                <div v-for="side in ['ally', 'enemy', 'neutral']"
                  class="mb-2">
                  <v-chip v-for="item in e.Combatants.filter(c => c.side === side)"
                    :prepend-icon="side === 'ally' ? 'cc:pilot' : side === 'enemy' ? 'cc:mech' : 'mdi-cube-outline'"
                    :color="side === 'ally' ? 'info' : side === 'enemy' ? 'error' : 'background'"
                    tile
                    variant="elevated"
                    size="x-small"
                    :key="item.actor.ID"
                    class="mr-1 mb-1 elevation-0">
                    {{ item.actor.CombatController.CombatName }}
                    <span v-if="(item.actor as any).PlayerName">&nbsp;({{ (item.actor as
                      any).PlayerName
                    }})</span>
                  </v-chip>
                </div>
                <br />
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </div>
    <cc-button block
      prepend-icon="mdi-plus"
      color="primary"
      :to="'new-encounter'">
      Create New Encounter
    </cc-button>
    <br />

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          Archived Encounters ({{ archived.length }})
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
            <i>No archived encounters found{{ search ? ` including "${search}"` : '' }}.</i>
          </div>
          <v-row v-for="e in archived"
            class="text-cc-overline bg-background my-1"
            align="center">
            <v-col cols="auto"
              style="height: 100%">
              {{ e.Name }}
              <br>
              <v-card class="px-1 bg-primary text-center">
                {{
                  e.Result
                }}
              </v-card>
            </v-col>
            <v-col cols="auto">
              {{ e.Round }} Rounds
              <div>
                <span class="text-disabled mr-1">CREATED</span>
                <b>{{ new Date(e.Start).toLocaleDateString() }}</b>
              </div>
              <div>
                <span class="text-disabled mr-1">ARCHIVED</span>
                <b>{{ new Date(e.End).toLocaleDateString() }}</b>
              </div>
            </v-col>
            <v-col cols="auto">
              <cc-dialog :close-on-click="false"
                :title="`${e.Name} - After Action Report`">
                <template #activator="{ open }">
                  <cc-button size="small"
                    @click="open()"
                    color="primary">After-Action Report</cc-button>
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
                      border-color="red">This feature is still in development. After-action
                      reports will be expanded in future builds.
                    </v-alert>
                    <div class="pa-2 bg-background">
                      <code class="text-left"
                        style="white-space: pre-wrap; word-break: break-word;">
                    {{ reportText(e) }}
                  </code>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <cc-button color="primary"
                      @click="copyText(reportText(e))">
                      Copy Report
                    </cc-button>
                    <cc-button color="primary"
                      @click="exportJson(e, 'report')">
                      Export as JSON
                    </cc-button>
                  </v-card-actions>
                </v-card>
              </cc-dialog>
            </v-col>
            <v-col cols="auto">
              <cc-dialog :close-on-click="false"
                :title="`${e.Name} - LOGS AND TELEMETRY`">
                <template #activator="{ open }">
                  <cc-button size="small"
                    @click="open()"
                    color="primary">Logs & Telemetry</cc-button>
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
                      <v-expansion-panel v-for="(a, index) in e.History"
                        :key="`log-${index}`">
                        <v-expansion-panel-title class="heading">
                          {{ a.combatantName }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="bg-background">
                          <code class="text-left "
                            style="white-space: pre-wrap; word-break: break-word;">
                        <v-row dense>
                          <v-col>
                            <div class="text-disabled mb-1">BATTLEFIELD TELEMETRY</div>
                            <div class="text-disabled mb-1">---------------------</div>
                            {{ formatTelemetry(a.telemetry) }}
                          </v-col>
                          <v-col style="max-height: 800px; overflow-y: scroll;">
                            <div class="text-disabled mb-1">COMBAT LOGS</div>
                            <div class="text-disabled mb-1">---------------------</div>
                            <div v-for="(log, logIndex) in a.log" :key="`log-entry-${logIndex}`"
                              class="mb-2">
                              {{ formatLogEntry(log) }}
                            </div>
                          </v-col>
                        </v-row>
                      </code>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                  <v-card-actions>
                    <cc-button color="primary"
                      @click="exportJson(e, 'logs')">
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
                    <v-icon icon="mdi-archive-plus" />
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <b>Re-instance this encounter?</b>
                    <br>
                    <p class="text-caption text--text mb-2">
                      This will create a new active encounter with the same initial configuration as
                      the
                      archived one, starting from round 1.
                    </p>
                    <cc-button size="small"
                      block
                      color="primary"
                      @click="unarchive(e as EncounterArchive)">
                      Create New Instance
                    </cc-button>
                  </v-card-text>
                </v-card>
              </v-menu>
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
                      @click="deleteEncounter(e)">
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
import { CombatLog } from '@/classes/components/combat/CombatLog';
import { ActionSummary } from '@/classes/components/feature/active_effects/EffectActionSummary';
import { Encounter } from '@/classes/encounter/Encounter';
import { EncounterArchive } from '@/classes/encounter/EncounterArchive';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { EncounterStore } from '@/stores';

export default {
  name: 'EncounterManager',
  data: () => ({
    search: '',
    sort: '',
    asc: true,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    encounters() {
      if (this.sort) {
        let sorted = [...EncounterStore().ActiveEncounters].filter(
          (e) => !e.SaveController.IsDeleted
        );
        sorted.sort((a, b) => {
          let aValue, bValue;
          switch (this.sort) {
            case 'Name':
              aValue = a.Name.toLowerCase();
              bValue = b.Name.toLowerCase();
              break;
            case 'Created':
              aValue = new Date(a.SaveController.Created).getTime();
              bValue = new Date(b.SaveController.Created).getTime();
              break;
            case 'Updated':
              aValue = new Date(a.SaveController.LastModified || a.SaveController.Created).getTime();
              bValue = new Date(b.SaveController.LastModified || b.SaveController.Created).getTime();
              break;
            default:
              return 0;
          }
          if (aValue < bValue) return this.asc ? -1 : 1;
          if (aValue > bValue) return this.asc ? 1 : -1;
          return 0;
        });
        return sorted;
      } else {
        return EncounterStore().ActiveEncounters.filter(
          (e) => !e.SaveController.IsDeleted
        );
      }
    },
    archived() {
      let arr = EncounterStore().ArchivedEncounters.filter((e) => !e.SaveController.IsDeleted);
      if (this.search && this.search.trim() !== '') {
        arr = arr.filter((e) =>
          e.Name.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      return arr;
    },
    deleted() {
      return EncounterStore().ActiveEncounters.filter((e) => e.SaveController.IsDeleted);
    },
  },
  methods: {
    setSort(field) {
      if (this.sort === field) {
        this.asc = !this.asc;
      } else {
        this.sort = field;
        this.asc = true;
      }
    },
    async launch(encounter) {
      await EncounterStore().AssignActiveEncounter(encounter);
      this.$router.push(`gm-encounter-runner/${encounter.ID}`);
    },
    deleteEncounter(encounter) {
      encounter.SaveController.Delete();
    },
    async RemoveEncounter(encounter) {
      await EncounterStore().RemoveEncounterInstance(encounter);
    },
    async unarchive(archive: EncounterArchive) {
      const e = new Encounter(archive.EncounterData);
      await EncounterStore().AddEncounterInstance(new EncounterInstance(undefined, e));
    },
    reportText(archive) {
      let str = `      ${archive.Name}: ${archive.Result}\n`;
      str += `------------------------------------------------\n`;
      const report = JSON.parse(archive.AfterActionReport);
      report.forEach(e => {
        str += `${e.name}: ${e.pilotStatus || ''}${e.mechStatus ? ` // ${e.mechStatus}` : ''}${e.status || ''}\n`;
      });

      return str;
    },
    copyText(text) {
      navigator.clipboard.writeText(text);
    },
    exportJson(archive, type: 'logs' | 'report') {
      const data = {
        name: archive.Name,
        result: archive.Result,
        details: type === 'report' ? JSON.parse(archive.AfterActionReport) : archive.History,
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${archive.Name}_${type === 'report' ? 'report' : 'logs'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    formatTelemetry(t) {
      return CombatLog.FormatTelemetry(t, true, 40);
    },
    formatLogEntry(log) {
      let out = `Round ${log.round} (${new Date(log.timestamp).toLocaleTimeString()})\n`;
      if (log.action)
        out += new ActionSummary(log.action).Summarize(log.action.initiatorID || '')
      else if (log.event)
        out += log.event;
      return out;
    }
  },
};
</script>

<style scoped>
.detail-row {
  background-color: rgb(var(--v-theme-light-panel));
  border-bottom: 1px rgb(var(--v-theme-primary)) solid;
  border-right: 1px rgb(var(--v-theme-primary)) solid;
  border-left: 1px rgb(var(--v-theme-primary)) solid;
  margin-left: -13px;
  min-height: 108px;
}

.detail-row-mobile {
  background-color: rgb(var(--v-theme-light-panel));
  border-bottom: 1px rgb(var(--v-theme-primary)) solid;
  border-right: 1px rgb(var(--v-theme-primary)) solid;
  border-left: 1px rgb(var(--v-theme-primary)) solid;
  margin-left: -1px;
  min-height: 57px;
}

.cToolbar {
  background-color: rgb(var(--v-theme-primary));
}

.cToolbar-missing {
  background: repeating-linear-gradient(45deg,
      rgb(var(--v-theme-error-darken-2)),
      rgb(var(--v-theme-error-darken-2)) 10px,
      rgb(var(--v-theme-error-darken-3)) 10px,
      rgb(var(--v-theme-error-darken-3)) 20px);
}

.light {
  transition: background-color 0.2s ease-in-out;
  background-color: rgb(var(--v-theme-primary));
}

.li-top-element:hover .light {
  background-color: rgb(var(--v-theme-success));
}
</style>
