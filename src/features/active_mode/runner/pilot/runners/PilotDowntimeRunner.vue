<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <cc-panel>
          <v-card-title>ongoing project</v-card-title>
          <p>details</p>
        </cc-panel>
      </v-col>
      <v-col cols="6">
        <cc-panel>
          <v-card-title>org</v-card-title>
          <p>details</p>
        </cc-panel>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>downtime</v-card-title>
      downtime manager, show downtime actions and previous selections etc
    </v-card>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'PilotDowntimeRunner',
};
</script>
