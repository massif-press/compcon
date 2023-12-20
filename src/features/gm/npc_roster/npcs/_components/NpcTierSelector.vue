<template>
  <v-row density="compact" justify="end" align="center">
    <v-col cols="auto">
      <v-btn-toggle
        v-model="item.NpcClassController.Tier"
        density="compact"
        mandatory
        active-class="text-accent"
        class="mb-2"
      >
        <v-btn :value="1">
          <v-icon start>cc:rank_1</v-icon>
          Tier 1
        </v-btn>
        <v-btn :value="2">
          <v-icon start>cc:rank_2</v-icon>
          Tier 2
        </v-btn>
        <v-btn :value="3">
          <v-icon start>cc:rank_3</v-icon>
          Tier 3
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'npc-tier-selector',
  props: { item: { type: Object, required: true } },
};
</script>
