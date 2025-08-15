<template>
  <v-container :fluid="$vuetify.display.mdAndDown">
    <div class="heading h2">New Local Active Encounter</div>
    <v-row dense class="mt-4" align="center">
      <v-col cols="1" class="text-center">
        <v-icon icon="cc:encounter" :color="encounter ? 'success' : 'panel'" size="50" />
      </v-col>
      <v-col cols="11">
        <div class="text-cc-overline mb-1">
          <cc-slashes class="pr-1" />
          <span class="text-disabled">ENCOUNTER DATA</span>
        </div>
        <cc-panel>
          <v-slide-x-transition leave-absolute>
            <div v-if="!emptyEncounter">
              <cc-titled-divider
                v-if="!encounter"
                title="select encounter"
                color="accent"
                class="mb-1" />
              <v-row dense v-if="!encounter" align="center">
                <v-col cols="4">
                  <cc-text-field
                    v-model="search"
                    color="primary"
                    density="compact"
                    hide-details
                    icon="mdi-magnify"
                    clearable />
                </v-col>
                <v-col cols="auto">
                  <v-icon icon="mdi-folder" class="d-inline" />
                </v-col>
                <v-col cols="4">
                  <cc-select
                    v-model="folder"
                    :items="folders"
                    color="primary"
                    density="compact"
                    chip-variant="text"
                    hide-details />
                </v-col>
              </v-row>

              <div class="pa-1" style="max-height: 60vh; overflow-y: scroll; overflow-x: hidden">
                <v-row
                  v-for="(encounter, i) in encounters"
                  no-gutters
                  style="position: relative"
                  v-show="!selectedEncounter || selectedEncounter.ID === encounter.ID"
                  @click="selectedEncounter = encounter"
                  class="mb-1 pa-1"
                  :key="encounter.ID">
                  <v-slide-x-transition leave-absolute>
                    <v-col
                      cols="auto"
                      v-if="selectedEncounter && selectedEncounter.ID === encounter.ID">
                      <div class="mr-1 bg-success" style="width: 10px; height: 100%" />
                    </v-col>
                  </v-slide-x-transition>

                  <v-col class="py-1 mr-2">
                    <gm-encounter-list-item
                      :odd="i % 2 === 0"
                      :item="encounter"
                      :is-selected="selectedEncounter?.ID === encounter.ID" />
                  </v-col>

                  <v-slide-x-reverse-transition leave-absolute>
                    <v-col cols="auto" v-if="selectedEncounter" class="ml-n1">
                      <v-btn
                        color="primary"
                        flat
                        tile
                        stacked
                        height="100%"
                        icon="mdi-close"
                        size="large"
                        @click.stop="selectedEncounter = null" />
                    </v-col>
                  </v-slide-x-reverse-transition>
                </v-row>
              </div>
            </div>
          </v-slide-x-transition>

          <v-slide-x-transition leave-absolute>
            <cc-panel v-if="emptyEncounter">
              <cc-titled-divider title="New Encounter" color="accent" />

              <sitrep-editor :item="emptyEncounter" />

              <environment-editor :item="emptyEncounter" />
            </cc-panel>
          </v-slide-x-transition>

          <div v-if="encounter">
            <cc-alert class="my-1">
              <v-icon icon="mdi-information-outline" class="mr-2" />
              Additional NPCs can be added in the Encounter Runner after creation.
            </cc-alert>
          </div>

          <v-row dense justify="space-between" class="mt-2">
            <v-col cols="auto">
              <v-slide-x-transition>
                <cc-button
                  v-if="!!emptyEncounter"
                  size="small"
                  color="error"
                  prepend-icon="mdi-close"
                  @click="clearEmptyEncounter()">
                  Cancel
                </cc-button>
              </v-slide-x-transition>
            </v-col>

            <v-slide-x-reverse-transition>
              <v-col cols="auto" v-if="!selectedEncounter && !emptyEncounter">
                <cc-button
                  size="small"
                  color="primary"
                  prepend-icon="mdi-card-plus-outline"
                  @click="useEmptyEncounter()">
                  New Encounter
                </cc-button>
              </v-col>
            </v-slide-x-reverse-transition>
          </v-row>
        </cc-panel>
      </v-col>
    </v-row>

    <v-slide-y-transition>
      <v-row v-if="selectedEncounter || emptyEncounter">
        <v-col cols="1" class="text-center">
          <v-icon icon="cc:pilot" :color="pilots.length ? 'success' : 'panel'" size="50" />
        </v-col>
        <v-col>
          <div class="text-cc-overline mb-1">
            <cc-slashes class="pr-1" />
            <span class="text-disabled">Pilots</span>
          </div>
          <cc-panel>
            <cc-titled-divider v-if="!pilots.length" title="Add Pilots" color="accent" />
            <div>
              <v-row
                v-for="p in pilots"
                no-gutters
                class="mb-2 bg-background"
                style="border: 2px solid; border-color: rgb(var(--v-theme-primary))"
                :key="p.ID">
                <v-col cols="auto" class="bg-primary pr-1" style="padding: 2px">
                  <v-avatar flat tile size="64">
                    <cc-avatar
                      v-if="p.PortraitController.Avatar"
                      :avatar="p.PortraitController.Avatar"
                      size="64" />
                    <cc-img v-else-if="p.Portrait" :src="p.Portrait" height="64" width="64" />
                  </v-avatar>
                </v-col>
                <v-col class="ml-n1">
                  <cc-title>
                    &nbsp;
                    <span class="heading h3">
                      {{ p.Callsign }}
                      <span class="text-cc-overline text-disabled">
                        <cc-slashes />
                        {{ p.Name }}
                        <span v-if="p.Player">({{ p.Player }})</span>
                      </span>
                    </span>
                  </cc-title>
                  <v-row dense class="mx-4 pt-1">
                    <v-col cols="auto" class="text-center">
                      <div class="text-cc-overline">LL</div>
                      <v-divider />
                      <div class="heading">{{ p.Level }}</div>
                    </v-col>
                    <v-col v-if="p.ActiveMech" cols="auto" class="mx-4">
                      <div class="text-cc-overline">Active Mech</div>
                      <v-divider />
                      <div class="heading">
                        {{ p.ActiveMech?.Name }}
                        <span class="text-cc-overline text-disabled">
                          <cc-slashes />
                          {{ p.ActiveMech?.Frame.Source }}
                          {{ p.ActiveMech.Frame.Name }}
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    flat
                    tile
                    stacked
                    height="100%"
                    color="primary"
                    prepend-icon="mdi-close"
                    @click="removePilot(p)" />
                </v-col>
              </v-row>

              <v-row
                v-for="(p, i) in placeholders"
                no-gutters
                class="mb-2 bg-background"
                style="border: 2px solid; border-color: rgb(var(--v-theme-primary))"
                :key="p.ID">
                <v-col cols="auto" class="bg-primary pr-1" style="padding: 2px">
                  <v-avatar flat tile size="64">
                    <v-icon icon="cc:pilot" size="64" />
                  </v-avatar>
                </v-col>
                <v-col class="ml-n1">
                  <cc-title>
                    &nbsp;
                    <span class="heading h3">Pilot Placeholder #{{ i + 1 }}</span>
                  </cc-title>
                  <v-row dense class="pa-1 px-2">
                    <v-col>
                      <cc-text-field
                        color="panel"
                        placeholder="Pilot name or Callsign"
                        prepend-icon="cc:pilot"
                        v-model="p.Name" />
                    </v-col>
                    <v-col>
                      <cc-text-field
                        color="panel"
                        placeholder="Frame or Mech Name"
                        prepend-icon="cc:frame"
                        v-model="p.Mechname" />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    flat
                    tile
                    stacked
                    height="100%"
                    color="primary"
                    prepend-icon="mdi-close"
                    @click="placeholders.splice(i, 1)" />
                </v-col>
              </v-row>
            </div>
            <v-divider class="my-4" />
            <v-row dense>
              <v-col>
                <add-from-roster :encounter="encounter" :pilots="pilots" />
              </v-col>
              <v-col>
                <add-from-share :pilots="pilots" />
              </v-col>
              <v-col>
                <cc-modal title="Import" icon="mdi-import">
                  <template #activator="{ open }">
                    <cc-button
                      color="primary"
                      size="small"
                      block
                      tooltip="Import a pilot from JSON data"
                      prepend-icon="mdi-file-import-outline"
                      @click="open">
                      Add from File
                    </cc-button>
                  </template>
                  <template #default="{ close }">
                    <file-import
                      skip-roster-save
                      @import-complete="pilots.push($event)"
                      @done="close" />
                  </template>
                </cc-modal>
              </v-col>
              <v-col>
                <cc-button
                  size="small"
                  block
                  color="primary"
                  tooltip="Adds a pilot-type combatant placeholder without any pilot data. Useful if you want to track encounter stats but don't have or don't need pilot data."
                  prepend-icon="mdi-account-outline"
                  @click="addPlaceholder()">
                  add pilot placeholder
                </cc-button>
              </v-col>
            </v-row>
          </cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-row v-if="encounter">
        <v-col cols="1" class="text-center">
          <v-icon
            icon="mdi-checkbox-marked-circle-auto-outline"
            :color="encounter && (pilots.length || placeholders.length) ? 'success' : 'panel'"
            size="50" />
        </v-col>
        <v-col>
          <div class="text-cc-overline mb-1">
            <cc-slashes class="pr-1" />
            <span class="text-disabled">Overview</span>
          </div>
          <cc-panel>
            <div class="heading h2">{{ encounter.Name }}</div>
            <div class="text-cc-overline">
              <span class="text-disabled">
                ENVIRONMENT
                <cc-slashes />
              </span>
              {{ encounter.Environment.Name }} &mdash;
              <span class="text-disabled">
                SITREP
                <cc-slashes />
              </span>
              {{ encounter.Sitrep.Name }}
            </div>
            <v-row class="mt-1 mb-2">
              <v-col>
                <cc-panel color="panel" flat tile class="pb-4">
                  <div class="heading" h3>
                    <cc-slashes />
                    pilots
                  </div>
                  <v-divider class="mb-2" />
                  <v-row
                    v-for="(p, i) in pilots.concat(placeholders)"
                    :class="i % 2 === 0 ? 'bg-background' : 'bg-surface'"
                    flat
                    tile
                    dense
                    class="px-2"
                    :key="p.ID">
                    <v-col cols="auto" class="mr-1">
                      <cc-avatar
                        v-if="p.PortraitController && p.PortraitController.Avatar"
                        :avatar="p.PortraitController.Avatar"
                        size="48" />
                      <cc-img v-else-if="p.Portrait" :src="p.Portrait" height="48" width="48" />
                      <v-icon v-else size="48" icon="cc:pilot" class="text-primary" />
                    </v-col>
                    <v-col>
                      <div class="heading h3">
                        {{ p.Callsign || p.Name || 'Unnamed Pilot' }}
                        <span v-if="p.PlayerName" class="text-cc-overline text-disabled">
                          ({{ p.PlayerName }})
                        </span>
                      </div>
                      <div class="text-cc-overline">
                        <cc-slashes />
                        <span v-if="p.Mechname">{{ p.Mechname }}</span>
                        {{
                          p.ActiveMech && p.ActiveMech.Frame
                            ? `${p.ActiveMech.Frame.Source} ${p.ActiveMech.Frame.Name}`
                            : p.Mechname
                              ? ''
                              : 'No Active Mech'
                        }}
                      </div>
                    </v-col>
                  </v-row>
                </cc-panel>
              </v-col>
              <v-col>
                <cc-panel color="panel" flat tile class="pb-4">
                  <div class="heading" h3>
                    <cc-slashes />
                    NPCs
                  </div>
                  <v-divider class="mb-2" />
                  <v-row
                    v-for="(n, i) in encounter.Combatants.sort((a, b) =>
                      a.side.localeCompare(b.side)
                    ).filter((c) => c.playerCount <= 1 || c.playerCount <= pilots.length)"
                    :class="i % 2 === 0 ? 'bg-background' : 'bg-surface'"
                    flat
                    tile
                    dense
                    class="px-2"
                    :key="n.ID">
                    <v-col cols="auto" class="mr-n2">
                      <v-icon size="48" :icon="n.actor.Icon" />
                    </v-col>
                    <v-col cols="auto" class="mr-1">
                      <cc-img
                        v-if="n.actor.Portrait"
                        :src="n.actor.Portrait"
                        height="48"
                        width="48" />
                      <v-icon v-else size="48" :icon="n.actor.TagIcon" />
                    </v-col>

                    <v-col>
                      <div class="heading h3">
                        {{ n.actor.Name }}
                      </div>
                      <div class="text-cc-overline">
                        <span v-if="n.actor.NpcClassController?.Tier" class="pr-1">
                          Tier {{ n.actor.NpcClassController?.Tier }}
                        </span>
                        <span v-if="n.actor.NpcClassController?.Class" class="pr-1">
                          {{ n.actor.NpcClassController?.Class.Name }}
                        </span>
                        <span v-if="n.actor.Tag" class="pr-1">
                          {{ n.actor.Tag }}
                        </span>
                        <span v-if="n.actor.NpcTemplateController?.Templates.length">
                          <cc-slashes />
                          {{
                            n.actor.NpcTemplateController?.Templates.map((t) => t.Name).join(', ')
                          }}
                        </span>
                      </div>
                      <div
                        v-if="n.reinforcement"
                        cols="12"
                        class="bg-panel text-center text-cc-overline pa-0">
                        Reinforcement
                        <span v-if="n.reinforcementTurn">(TURN {{ n.reinforcementTurn }})</span>
                      </div>
                    </v-col>
                    <v-col cols="auto" class="pr-0">
                      <v-chip size="x-small" flat tile class="text-cc-overline" :color="n.side">
                        {{ n.side }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </cc-panel>
              </v-col>
            </v-row>
            <cc-button
              block
              color="success"
              :disabled="!pilots.length && !placeholders.length"
              :prepend-icon="
                pilots.length && placeholders.length
                  ? 'mdi-arrow-right-bold-hexagon-outline'
                  : 'mdi-alert'
              "
              @click="createEncounter(true)">
              <span v-if="!pilots.length && !placeholders.length">
                An encounter requires at least one pilot.
              </span>
              <span v-else>Create and Launch Encounter</span>
            </cc-button>
            <v-row v-if="pilots.length || placeholders.length" dense class="mt-1">
              <v-col cols="3">
                <cc-button
                  block
                  size="small"
                  color="error"
                  prepend-icon="mdi-close"
                  @click="reset()">
                  Cancel
                </cc-button>
              </v-col>
              <v-col>
                <cc-button
                  block
                  size="small"
                  color="primary"
                  prepend-icon="mdi-content-save"
                  @click="createEncounter(false)">
                  Create and return to library
                </cc-button>
              </v-col>
            </v-row>
          </cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore, EncounterStore } from '@/stores';
import GmEncounterListItem from '@/features/gm/_views/_components/gmItemCards/GMEncounterListItem.vue';
import { Encounter } from '@/classes/encounter/Encounter';
import SitrepEditor from '@/features/gm/encounters/_components/SitrepEditor.vue';
import EnvironmentEditor from '@/features/gm/encounters/_components/EnvironmentEditor.vue';
import AddFromRoster from './_components/AddFromRoster.vue';
import AddFromShare from './_components/AddFromShare.vue';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import FileImport from '@/features/pilot_management/Roster/components/add_panels/FileImport.vue';
import { Placeholder } from '@/classes/encounter/Placeholder';

export default {
  name: 'active-new-encounter',
  components: {
    GmEncounterListItem,
    SitrepEditor,
    EnvironmentEditor,
    AddFromRoster,
    AddFromShare,
    FileImport,
  },
  data: () => ({
    search: '',
    folder: 'All',
    emptyEncounter: null as any,
    selectedEncounter: null as any,
    pilots: [] as any[],
    placeholders: [] as any[],
  }),
  emits: ['select', 'close'],
  computed: {
    encounter() {
      return this.selectedEncounter || this.emptyEncounter;
    },
    folders() {
      return EncounterStore().Folders;
    },
    encounters() {
      let enc = EncounterStore().Encounters;

      if (this.folder && this.folder !== 'All') {
        enc = enc.filter((x) => x.FolderController.Folder === this.folder);
      }

      if (!this.search) {
        return enc.filter((x) => !x.SaveController.IsDeleted);
      }
      return enc
        .filter((x) => !x.SaveController.IsDeleted)
        .filter((x) => x.Name.toLowerCase().includes(this.search.toLowerCase()));
    },
    environments() {
      return CompendiumStore().Environments;
    },
  },
  methods: {
    addPlaceholder() {
      this.placeholders.push(
        new Placeholder({
          id: `placeholder-${this.placeholders.length + 1}`,
          name: '',
          Mechname: '',
          type: 'pilot',
          side: 'ally',
        })
      );
    },
    useEmptyEncounter() {
      this.emptyEncounter = new Encounter();
    },
    clearEmptyEncounter() {
      EncounterStore().DeleteEncounterPermanent(this.emptyEncounter);
      this.emptyEncounter = null;
    },
    removePilot(pilot) {
      this.pilots = this.pilots.filter((p) => p.ID !== pilot.ID);
      this.placeholders = this.placeholders.filter((p) => p.id !== pilot.id);
    },
    async createEncounter(launch) {
      if (!this.encounter) {
        return;
      }
      // this.encounter.Pilots = this.pilots.map((p) => p.ID);
      // this.encounter.Placeholders = this.placeholders.map((p) => p.id);

      const instance = new EncounterInstance({
        itemType: 'EncounterInstance',
        id: `encounter-instance-${this.encounter.ID}${Date.now()}`,
        encounterData: this.encounter.Serialize(),
        pilotData: this.pilots.map((p) => p.Serialize()),
        placeholderData: this.placeholders.map((p) => p.Serialize()),
        round: 1,
      } as any);

      await EncounterStore().AddEncounterInstance(instance);
      await EncounterStore().AssignActiveEncounter(instance);
      if (launch) this.Launch();
      else this.$router.push('manage-encounters');
    },
    Launch() {
      this.$router.push('gm-encounter-runner');
    },
    reset() {
      this.selectedEncounter = null;
      this.emptyEncounter = null;
      this.pilots = [];
      this.placeholders = [];
      this.$router.push('manage-encounters');
    },
  },
};
</script>
