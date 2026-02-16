<template>
  <v-card min-height="90vh"
    flat
    tile>
    <v-toolbar flat
      tile
      density="compact"
      color="primary"
      height="46">
      <v-toolbar-title class="heading h3">TABLE INDEX</v-toolbar-title>
      <v-spacer />
      <v-btn icon
        @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="selected">
      <div class="heading bg-primary px-5">
        <span class="text-disabled pr-2">Currently Selected:</span>
        <strong v-if="selected">
          {{ actor.Name }}
        </strong>
        <span v-else
          class="text-disabled">None</span>
      </div>
    </div>
    <v-card-text class="pb-0">
      <v-row>
        <v-col :cols="portrait ? '12' : 'auto'"
          style="min-width: 300px;">
          <v-list v-model="selectedTable"
            density="compact"
            slim>
            <div class="text-cc-overline">Encounter Tables</div>
            <v-list-item :class="selectedTable?.ID === t.ID && 'bg-primary border-sm'"
              v-for="t in tables"
              :title="t.Title"
              :subtitle="t.LcpName"
              :append-icon="t.InLcp ? 'cc:compendium' : ''"
              @click="selectedTable = t" />
            <div v-if="otherTables.length">
              <v-divider class="my-2" />
              <div class="text-cc-overline">Other Tables</div>
              <v-list-item :class="selectedTable?.ID === t.ID && 'bg-primary border-sm'"
                v-for="t in otherTables"
                :title="t.Title"
                @click="selectedTable = t" />
            </div>
          </v-list>
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-card flat
            tile>
            <cc-alert v-if="!isCoreTable"
              color="background"
              class="mb-2 border-s-xl border-accent"
              icon="mdi-warning">
              <div class="text-caption">
                Currently, only Lancer Core Book tables are supported. LCP and custom tables will
                have
                to be resolved manually
              </div>
            </cc-alert>

            <div v-if="selectedTable">
              <cc-rollable-table :table="selectedTable"
                readonly />
              <cc-button size="small"
                block
                color="primary"
                prepend-icon="mdi-dice-d20"
                class="my-2"
                @click="roll(selectedTable)">
                Roll {{ `${selectedTable.Mult}d${selectedTable.Die}` }}
              </cc-button>
            </div>
            <div v-else
              class="text-disabled text-cc-overline text-center py-4">
              Select a table to view its contents.
            </div>
            <v-scroll-y-reverse-transition>
              <cc-panel v-if="results[selectedTable.ID].roll"
                title="Result">
                <v-row align="center"
                  class="mb-1">
                  <v-col cols="auto"
                    class="text-center">
                    <div class="heading h1">{{ results[selectedTable.ID].roll }}</div>
                  </v-col>
                  <v-col>
                    <p v-html-safe="results[selectedTable.ID].result" />
                  </v-col>
                </v-row>
              </cc-panel>
            </v-scroll-y-reverse-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { RollableTable } from '@/classes/narrative/elements/RollableTable';
import { CompendiumStore } from '@/stores';

export default {
  name: 'RollableTableIndex',
  props: {
    selected: {
      type: Object,
      required: false,
    },
    instance: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selectedTable: null,
    results: [],
  }),
  created() {
    this.selectedTable = this.tables[0] || this.otherTables[0] || null;
    this.results = this.allTables.reduce((acc, t) => {
      acc[t.ID] = { roll: null, result: null };
      return acc;
    }, {});
  },
  computed: {
    portrait() {
      return !this.$vuetify.display.mdAndUp
    },
    isCoreTable() {
      const core = ['core-structure-damage', 'core-overheating'];
      return this.selectedTable && this.selectedTable.ID;
    },
    tables() {
      return CompendiumStore().Tables;
    },
    otherTables() {
      return this.instance.Encounter.NarrativeController.Tables;
    },
    allTables() {
      return [...this.tables, ...this.otherTables];
    },
    actor() {
      return this.selected ? this.selected.actor : null;
    },
  },
  methods: {
    roll(t) {
      this.results[t.ID] = t.Roll();
    },
  },
};
</script>
