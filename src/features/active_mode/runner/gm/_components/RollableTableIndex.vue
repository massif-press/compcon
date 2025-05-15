<template>
  <v-card min-height="90vh" flat tile>
    <v-toolbar flat tile density="compact" color="primary" height="46">
      <v-toolbar-title class="heading h3">TABLE INDEX</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pb-0">
      <v-row style="min-height: 85vh">
        <v-col cols="auto">
          <v-list density="compact" slim>
            <div class="text-cc-overline">Encounter Tables</div>
            <v-list-item title="Example Encounter Table" />
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
            <cc-rollable-table v-if="exampleTable" :table="exampleTable" readonly />
            <cc-button
              size="small"
              block
              color="primary"
              prepend-icon="mdi-dice-d20"
              class="my-2"
              @click="roll">
              Roll 1d20
            </cc-button>
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
  data: () => ({
    exampleTable: null,
    result: null,
  }),
  mounted() {
    this.exampleTable = new RollableTable({
      title: 'Example Encounter Table',
      description: 'This is an example table.',
      die: 20,
      mult: 2,
      results: [
        {
          min: 1,
          max: 4,
          result: 'This is an example result for rolling 1-4.',
        },
        {
          min: 5,
          max: 10,
          result: 'Another example result for rolling 5-10.',
        },
        {
          min: 11,
          max: 19,
          result: "Here's a result for rolling 11-19.",
        },
        {
          min: 20,
          max: 20,
          result: 'This is a special result for rolling a 20.',
        },
      ],

      gm_only: true,
    });
  },
  methods: {
    roll() {
      this.result = this.exampleTable.Roll();
    },
  },
};
</script>
