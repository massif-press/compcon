<template>
  <v-card>
    <v-card-title class="heading h2">{{ encounter.Name }}</v-card-title>
    <v-card-subtitle class="text-cc-overline">
      <span v-if="encounter.Environment.Name !== 'Default'" v-text="encounter.Environment.Name" />
      &mdash;
      <span v-text="encounter.Sitrep.Name" />
    </v-card-subtitle>
    <v-card-text v-if="encounter.Description" class="pb-0">
      <p v-html-safe="encounter.Description" class="text-text mb-0" />
      <div class="text-right mt-n2">
        <v-btn
          size="x-small"
          flat
          tile
          variant="text"
          color="accent"
          class="fade-select"
          icon
          @click="copy(encounter.Description)">
          <v-icon size="16" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </v-card-text>

    <v-card-text v-if="encounter.NarrativeController.TextItems.length" class="py-0">
      <div class="text-cc-overline text-disabled">Detail</div>

      <div v-for="item in encounter.NarrativeController.TextItems">
        <div class="heading h3 text-accent">{{ item.header }}</div>
        <p v-html-safe="item.body" />
        <div class="text-right mt-n2">
          <v-btn
            size="x-small"
            flat
            tile
            variant="text"
            color="accent"
            class="fade-select"
            icon
            @click="copy(encounter.Description)">
            <v-icon size="16" icon="mdi-content-copy" />
          </v-btn>
        </div>
      </div>
    </v-card-text>

    <v-card-text class="py-2">
      <div class="text-cc-overline text-disabled">SITREP</div>
      <div class="heading h3 text-accent">{{ encounter.Sitrep.Name }}</div>
      <div v-for="block in sitrepBlocks">
        <div v-if="encounter.Sitrep[block].length" class="mb-4">
          <div class="text-cc-overline">{{ block }}</div>
          <p v-html-safe="encounter.Sitrep[block]" class="text-text" />
          <div class="text-right mt-n2">
            <v-btn
              size="x-small"
              flat
              tile
              variant="text"
              color="accent"
              class="fade-select"
              icon
              @click="copy(`SITREP.${block.toLocaleUpperCase()} // ${encounter.Sitrep[block]}`)">
              <v-icon size="16" icon="mdi-content-copy" />
            </v-btn>
          </div>
        </div>
      </div>
    </v-card-text>

    <v-card-text class="py-2">
      <div class="text-cc-overline text-disabled">Environment</div>
      <div class="heading h3 text-accent">{{ encounter.Environment.Name }}</div>
      <p v-html-safe="encounter.Environment.Description" class="text-text" />
      <div class="text-right mt-n2">
        <v-btn
          size="x-small"
          flat
          tile
          variant="text"
          color="accent"
          class="fade-select"
          icon
          @click="copy(`ENVIRONMENT.DETAIL // ${encounter.Environment.Description}`)">
          <v-icon size="16" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </v-card-text>

    <v-card-text>
      <div class="text-cc-overline text-disabled">Reinforcements</div>
      <span v-if="!reinforcementsByTurn.length" class="text-disabled">
        No encounter reinforcements.
      </span>
      <div v-else>
        <v-row
          v-for="reinforcement in reinforcementsByTurn"
          :key="reinforcement.turn"
          align="center">
          <v-col cols="auto" class="text-accent heading">Turn {{ reinforcement.turn }}</v-col>
          <v-col>
            <ul>
              <li v-for="combatant in reinforcement.combatants" :key="combatant.id">
                {{ combatant.actor.Name }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'EncounterInfo',
  props: {
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    sitrepBlocks: ['Description', 'Deployment', 'Objective', 'Extraction', 'Conditions'],
  }),
  computed: {
    reinforcementsByTurn() {
      if (!this.encounter || !this.encounter.Combatants) return [];

      const reinforcements = {};
      this.encounter.Combatants.forEach((combatant) => {
        if (combatant.reinforcement && combatant.reinforcementTurn) {
          if (!reinforcements[combatant.reinforcementTurn]) {
            reinforcements[combatant.reinforcementTurn] = [];
          }
          reinforcements[combatant.reinforcementTurn].push(combatant);
        }
      });
      const res = Object.entries(reinforcements).map(([turn, combatants]) => ({
        turn: Number(turn),
        combatants,
      }));
      return _.sortBy(res, 'turn');
    },
  },
  methods: {
    copy(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.$notify({
            text: `Copied to Clipboard`,
            data: { color: 'success' },
          });
        })
        .catch((err) => {
          this.$notify({
            title: `Failed to Copy`,
            data: { color: 'error' },
          });
        });
    },
  },
};
</script>
