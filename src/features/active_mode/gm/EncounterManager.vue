<template>
  <v-container>
    <div class="heading h2">Local Active Encounters</div>
    <cc-alert>
      <v-icon icon="mdi-information-outline" class="mr-2" />
      These encounters will only be accessible on this device. Pilot data can be loaded from remote
      sources, but will not push any updates to their owners. For cloud-based and simultaneous
      multiplayer, create a
      <a>Table</a>
      instead.
    </cc-alert>
    <div
      v-for="e in encounters"
      style="position: relative"
      class="li-top-element my-2"
      @click="launch(e)">
      <div class="light" style="position: absolute; top: 0; left: -15px; bottom: 0; width: 10px" />
      <v-row no-gutters class="lighten-select" :class="mobile ? 'mb-2' : 'mb-4'">
        <v-col cols="auto" style="border: rgb(var(--v-theme-primary)) 3px double">
          <!-- <v-img v-if="e.Encounter.Map" :src="e.Encounter.Map" cover min-height="100%" /> -->
          <v-img
            v-if="e.Encounter.Portrait"
            :src="e.Encounter.Portrait"
            height="100%"
            width="120px"
            cover />
        </v-col>
        <v-col style="position: relative">
          <v-toolbar density="compact" class="cToolbar" :height="mobile ? '40' : '46'">
            <v-row no-gutters align="center" class="px-2">
              <v-col cols="auto" class="heading text-white">
                {{ e.Encounter.Name }}
                <cc-slashes class="mx-3" />
                <span class="text-disabled mr-1">ROUND</span>
                <b>{{ e.Round }}</b>
              </v-col>
              <v-col cols="auto" class="mr-n2 ml-auto">
                <v-menu>
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      start
                      color="white"
                      @click.stop
                      icon="mdi-cog"
                      size="small"
                      class="fade-select" />
                  </template>
                  <v-card>
                    <v-list>
                      <v-list-item prepend-icon="mdi-archive" @click="ArchiveEncounter(e)">
                        <v-list-item-title>Archive Encounter</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        prepend-icon="mdi-delete"
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

          <div class="px-3 text-cc-overline">
            <v-row class="detail-row">
              <v-col cols="auto" class="mb-0 pb-0 mt-1">
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

              <v-col cols="12" class="my-0 py-0">
                <v-chip
                  v-for="item in e.Pilots"
                  prepend-icon="cc:pilot"
                  tile
                  variant="elevated"
                  size="x-small"
                  :key="item.ID"
                  class="mr-1 mb-1 elevation-0">
                  {{ item.Callsign }}
                  <cc-slashes class="px-1" />
                  {{ item.Name }}
                  <span v-if="item.PlayerName">&nbsp;({{ item.PlayerName }})</span>
                </v-chip>
                <br />
                <v-chip
                  v-for="item in e.Encounter.Combatants"
                  size="x-small"
                  tile
                  :color="item.side"
                  variant="elevated"
                  :prepend-icon="item.actor.Icon"
                  :key="item.ID"
                  class="mr-1 mb-1 elevation-0">
                  {{ item.actor.Name }}
                </v-chip>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </div>
    <br />
    <cc-button size="small" block color="primary" :to="'new-encounter'">
      Create New Encounter
    </cc-button>
    <br />

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          Archived Encounters ({{ archived.length }})
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div v-if="archived.length === 0" class="text-center text-cc-overline text-disabled">
            <i>No archived encounters</i>
          </div>
          <v-row v-for="e in archived" class="text-cc-overline" align="center">
            <v-col cols="auto" style="height: 100%">
              <v-card style="position: relative">
                <cc-img v-if="e.Encounter.Map" :src="e.Encounter.Map" cover width="120px" />
                <cc-img
                  v-else-if="e.Encounter.Portrait"
                  :src="e.Encounter.Portrait"
                  cover
                  width="50px" />
              </v-card>
            </v-col>
            <v-col cols="auto">
              {{ e.Round }} Rounds
              <div>
                <span class="text-disabled mr-1">CREATED</span>
                <b>{{ new Date(e.SaveController.Created).toLocaleDateString() }}</b>
              </div>
              <div v-if="e.SaveController.LastModified">
                <span class="text-disabled mr-1">ARCHIVED</span>
                <b>{{ new Date(e.SaveController.LastModified).toLocaleDateString() }}</b>
              </div>
            </v-col>
            <v-col cols="auto">
              <div>
                {{ e.Encounter.Sitrep.Name }} /
                {{ e.Encounter.Environment.Name }}
              </div>
              <div>
                {{ e.Pilots.length }} Pilots / {{ e.Encounter.Combatants.length }} Combatants
              </div>
            </v-col>
            <v-col cols="auto" class="ml-auto">
              <v-btn icon variant="text" @click="unarchive(e)">
                <v-icon icon="mdi-undo" />
              </v-btn>
              <v-btn icon variant="text" @click="deleteEncounter(e)">
                <v-icon icon="mdi-delete" />
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { EncounterStore } from '@/stores';

export default {
  name: '',
  computed: {
    currentEncounter() {
      return EncounterStore().getCurrentActiveEncounter;
    },
    encounters() {
      return EncounterStore().ActiveEncounters.filter(
        (e) => !e.IsArchived && !e.SaveController.IsDeleted
      );
    },
    archived() {
      return EncounterStore().ActiveEncounters.filter(
        (e) => e.IsArchived && !e.SaveController.IsDeleted
      );
    },
    deleted() {
      return EncounterStore().ActiveEncounters.filter((e) => e.SaveController.IsDeleted);
    },
  },
  methods: {
    async launch(encounter) {
      await EncounterStore().AssignActiveEncounter(encounter);
      this.$router.push('gm-encounter-runner');
    },
    deleteEncounter(encounter) {
      encounter.SaveController.Delete();
    },
    async RemoveEncounter(encounter) {
      await EncounterStore().RemoveEncounterInstance(encounter);
    },
    async ArchiveEncounter(encounter) {
      encounter.IsArchived = true;
      encounter.save();
      await EncounterStore().SaveActiveEncounterData();
    },
    async unarchive(encounter) {
      encounter.IsArchived = false;
      encounter.save();
      await EncounterStore().SaveActiveEncounterData();
    },
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
  background: repeating-linear-gradient(
    45deg,
    rgb(var(--v-theme-error-darken-2)),
    rgb(var(--v-theme-error-darken-2)) 10px,
    rgb(var(--v-theme-error-darken-3)) 10px,
    rgb(var(--v-theme-error-darken-3)) 20px
  );
}

.light {
  transition: background-color 0.2s ease-in-out;
  background-color: rgb(var(--v-theme-primary));
}

.li-top-element:hover .light {
  background-color: rgb(var(--v-theme-success));
}
</style>
