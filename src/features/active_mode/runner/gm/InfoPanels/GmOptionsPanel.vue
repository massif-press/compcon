<template>
  <v-card>
    <v-card-text>
      <v-row dense align="center" justify="space-between">
        <v-col cols="auto" class="heading">
          Last Saved:
          <b class="text-accent ml-1">
            {{
              new Date(encounterInstance.SaveController.LastModified).toLocaleString(undefined, {
                dateStyle: 'long',
                timeStyle: 'long',
              })
            }}
          </b>
        </v-col>
        <v-col cols="auto">
          <v-btn flat tile prepend-icon="mdi-content-save" size="small">Manual Save</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2" />
      <div class="text-cc-overline mb-1 text-disabled">Autosave Options</div>
      <v-row dense align="center" justify="space-between">
        <v-col cols="auto">
          <cc-switch size="large" label="On Round Start" />
        </v-col>
        <v-col cols="auto">
          <cc-switch size="large" label="PC Turn End" />
        </v-col>
        <v-col cols="auto">
          <cc-switch size="large" label="NPC Turn End" />
        </v-col>
      </v-row>
      <br />
      <v-row dense align="center" justify="space-between">
        <v-col>
          <v-btn flat tile block color="primary" size="small">Export Encounter State</v-btn>
        </v-col>
        <v-col>
          <v-btn flat tile block color="primary" size="small">Import Encounter State</v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-row dense align="center" justify="space-between">
        <v-col class="heading">Set Round</v-col>
        <v-col>
          <cc-number-field color="primary" v-model="encounterInstance.Round" min="1" />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <div class="text-cc-overline text-disabled">Overrides</div>
      <v-expansion-panels variant="accordion" color="panel">
        <v-expansion-panel
          v-for="combatant in encounterInstance.Combatants.filter((c) => !c.reinforcement)">
          <v-expansion-panel-title>
            <div class="heading h3">{{ combatant.actor.Name }}</div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="bg-background pa-0 mx-n5">
            <cc-select
              v-model="combatant.side"
              color="primary"
              chip-variant="text"
              :items="['ally', 'enemy', 'neutral']"
              label="Side" />
            <br />
            <div v-if="combatant.actor.StatController">
              <v-row
                v-for="(stat, key) in combatant.actor.StatController.MaxStats"
                :key="key"
                dense
                class="border-sm mb-1 px-2"
                align="center">
                <v-col class="heading">{{ key }}</v-col>
                <v-col class="mx-6">
                  <div class="text-cc-overline ml-4 text-disabled">Current</div>
                  <cc-number-field
                    color="primary"
                    v-model="combatant.actor.StatController.CurrentStats[key]" />
                </v-col>
                <v-col>
                  <div class="text-cc-overline ml-4 text-disabled">Max</div>
                  <cc-number-field
                    color="exotic"
                    v-model="combatant.actor.StatController.MaxStats[key]" />
                </v-col>
              </v-row>
              <div class="d-flex justify-space-between pa-2">
                <v-btn flat tile size="small" color="primary">Add Stat</v-btn>
                <v-btn flat tile color="error" size="small" @click="removeActor(combatant.actor)">
                  Remove {{ combatant.actor.Name }} From Encounter
                </v-btn>
              </div>
            </div>
            <div v-else>No Stat Controller Found</div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-text>
      <div class="text-cc-overline text-disabled mb-1">Edit Reinforcements</div>
      <i v-if="!reinforcements.length" class="text-text ml-2">No Reinforcement Schedule</i>
      <v-row v-for="combatant in reinforcements" :key="combatant.id" dense align="center">
        <v-col class="heading h3">{{ combatant.actor.Name }}</v-col>
        <v-col cols="auto">
          <cc-number-field
            color="primary"
            v-model="combatant.reinforcementTurn"
            label="Round"
            min="1" />
        </v-col>
        <v-col cols="auto">
          <v-btn flat tile color="error" size="small" @click="removeActor(combatant.actor)">
            Remove
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn flat tile color="primary" size="small" @click="removeActor(combatant.actor)">
            Deploy
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'gm-options-panel',
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    reinforcements() {
      return this.encounterInstance.Combatants.filter((c) => c.reinforcement);
    },
  },
  methods: {
    removeActor(actor) {
      //todo
    },
  },
};
</script>
