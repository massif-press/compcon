<template>
  <v-card min-height="90vh" flat tile>
    <v-toolbar flat tile density="compact" color="primary" height="46">
      <v-toolbar-title class="heading h3">TABLE INDEX</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="selected">
      <div class="heading bg-primary px-5">
        <span class="text-disabled pr-2">Currently Selected:</span>
        <strong v-if="selected">
          {{ actor.Name }}
        </strong>
        <span v-else class="text-disabled">None</span>
      </div>
    </div>
    <v-card-text class="pb-0">
      <v-row style="min-height: 85vh">
        <v-col cols="auto">
          <v-list density="compact" slim>
            <div class="text-cc-overline">Encounter Tables</div>
            <v-list-item
              :class="selectedTable?.ID === t.ID && 'bg-primary border-sm'"
              v-for="t in tables"
              :title="t.Title"
              @click="selectedTable = t" />
            <v-divider class="my-2" />
            <div class="text-cc-overline">Combat Tables</div>
            <v-list-item title="Structure Damage Table" subtitle="Lancer Core" />
            <v-list-item title="Overheating Table" subtitle="Lancer Core" />
            <v-list-item title="Down and Out Table" subtitle="Lancer Core" />
            <v-list-item
              title="Fumble Table"
              subtitle="Beef's Cool LCP"
              append-icon="cc:compendium" />
            <v-divider class="my-2" />
            <div class="text-cc-overline">Other Tables</div>
            <v-list-item title="Clone Quirks" subtitle="Lancer Core" />
          </v-list>
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-card flat tile>
            <div v-if="selectedTable">
              <cc-rollable-table :table="selectedTable" readonly />
              <cc-button
                size="small"
                block
                color="primary"
                prepend-icon="mdi-dice-d20"
                class="my-2"
                @click="roll(selectedTable)">
                Roll {{ `${selectedTable.Mult}d${selectedTable.Die}` }}
              </cc-button>
            </div>
            <div v-else class="text-disabled text-cc-overline text-center py-4">
              Select a table to view its contents.
            </div>
            <v-scroll-y-reverse-transition>
              <cc-panel v-if="result" title="Result">
                <v-row align="center" class="mb-1">
                  <v-col cols="auto" class="text-center">
                    <div class="heading h1">{{ result.roll }}</div>
                  </v-col>
                  <v-col>
                    <p>{{ result.result }}</p>
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
    result: null,
  }),
  computed: {
    tables() {
      return this.instance.Encounter.NarrativeController.Tables;
    },
    actor() {
      return this.selected ? this.selected.actor : null;
    },
  },
  methods: {
    roll(t) {
      this.result = t.Roll();
    },
  },
};
</script>
