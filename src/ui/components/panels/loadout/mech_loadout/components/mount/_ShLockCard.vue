<template>
  <v-col class="pa-2 mt-2" style="height: 100%">
    <v-card
      flat
      tile
      class="clipped-large light-panel"
      style="height: calc(100% - 20px); min-height: 100px"
    >
      <v-row
        class="text-center"
        style="height: 100%"
        justify="center"
        align="center"
      >
        <v-col class="panel">
          <div class="heading h1 subtle--text text--darken-1">MOUNT LOCKED</div>
          <div class="mt-2 mb-n4">SUPERHEAVY WEAPON BRACING</div>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'sh-lock-card',
};
</script>
