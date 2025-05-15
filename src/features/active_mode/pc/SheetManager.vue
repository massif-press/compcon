<template>
  <v-container>
    <cc-title small offset>Active Character Sheets</cc-title>
    <div class="my-1">
      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" color="panel" flat tile size="small" @click="setSort('Updated')">
            <v-icon icon="mdi-clock-outline" color="accent" />
            <v-icon
              v-if="sort === 'Source'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1" />
          </v-btn>
        </template>
        <span>Sort by Recent</span>
      </v-tooltip>

      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" color="panel" flat tile size="small" @click="setSort('Name')">
            <v-icon icon="mdi-format-text-variant" class="mb-n1" color="accent" />
            <v-icon
              v-if="sort === 'Name'"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1"
              color="accent" />
          </v-btn>
        </template>
        <span>Sort by Name</span>
      </v-tooltip>

      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" color="panel" flat tile size="small" @click="setSort('TableName')">
            <v-icon icon="mdi-lan" color="accent" />
            <v-icon
              v-if="sort === 'Source'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1" />
          </v-btn>
        </template>
        <span>Sort by Table</span>
      </v-tooltip>

      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" color="panel" flat tile size="small" @click="setSort('Created')">
            <v-icon icon="mdi-calendar" class="mb-n1" color="accent" />
            <v-icon
              v-if="sort === 'Created'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              class="mb-n1" />
          </v-btn>
        </template>
        <span>Sort by created timestamp</span>
      </v-tooltip>
    </div>
    <sheet-item v-for="example in examples" :sheet="example" />
    <v-divider class="my-5" />
    <cc-button
      prepend-icon="mdi-plus"
      block
      color="primary"
      to="/active-mode/new-sheet"
      class="mb-2">
      New Active Character Sheet
    </cc-button>
  </v-container>
</template>

<script>
import SheetItem from './_components/SheetItem.vue';

export default {
  name: 'SheetManager',
  components: {
    SheetItem,
  },
  data: () => ({
    sort: '',
    asc: true,
    examples: [
      {
        Callsign: 'Gemini',
        Name: 'Besije Sheer',
        Level: 4,
        MechName: 'Example Mech',
        Frame: 'HORUS Goblin',
        Source: 'HORUS',
        Portrait: 'https://placebear.com/250/250',
        MechPortrait: 'https://d2c79xe1p61csc.cloudfront.net/frames/mf_goblin.png',
        mode: 'Encounter//Active (Round 4)',
        tableStatus: 'Online',
        SourceColor: '#046e3c',
        Campaign: 'Operation Winter Scar',
        TableName: "Beef's Cool Table",
        Description: 'Narrative: Mission 2 - Beat 3',
      },
      {
        Callsign: 'Barghest',
        Name: 'Liang Mei Ofarrell',
        Level: 1,
        MechName: 'Example Mech',
        Frame: 'GMS Everest',
        Portrait: 'https://placebear.com/251/251',
        mode: 'Encounter//Active (Round 4)',
        tableStatus: 'Offline',
        SourceColor: '#991E2A',
        TableName: 'A Different Table',
        Description: 'Active Encounter (Round 4)',
      },
      {
        Callsign: 'Vagabond',
        Name: 'Alidio Denos',
        Level: 6,
        MechName: 'Example Mech',
        Frame: 'IPS-N Iskander',
        Portrait: 'https://placebear.com/253/253',
        MechPortrait: 'https://d2c79xe1p61csc.cloudfront.net/frames/mf_iskander.png',
        mode: 'Encounter//Active (Round 4)',
        SourceColor: '#046e3c',
        Campaign: 'No Room for a Wallflower: Act I',
        Description: 'Active Encounter: Early Summer - Sepulcher (Round 1)',
      },
    ],
  }),
  methods: {
    setSort(sort) {
      console.log('nyi');
    },
  },
};
</script>
