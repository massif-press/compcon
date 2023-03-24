<template>
  <v-container>
    <div class="my-2">
      <div class="heading h3">Active Encounters</div>
      <encounter-table active />

      <div class="heading h3">Encounter Library</div>
      <v-tabs>
        <v-tab>No Campaign</v-tab>
        <v-tab>My Campaign A</v-tab>
        <v-tab-item>
          <encounter-table />
        </v-tab-item>
        <v-tab-item>
          <encounter-table />
        </v-tab-item>
      </v-tabs>
    </div>
    <v-row justify="center" align="center">
      <v-col cols="8">
        <v-btn color="primary" block large>
          <v-icon start v-html="'mdi-plus'" />
          Create New Encounter
        </v-btn>
      </v-col>
    </v-row>
    <v-footer fixed>
      <v-btn small to="/gm">
        <v-icon start>mdi-chevron-left</v-icon>
        Return to GM Menu
      </v-btn>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import EncounterTable from './_components/EncounterTable.vue';

export default {
  name: 'encounter-landing',
  components: { EncounterTable },
};
</script>
