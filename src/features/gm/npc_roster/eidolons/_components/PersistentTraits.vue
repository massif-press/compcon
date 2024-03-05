<template>
  <div class="text-overline">PERSISTENT TRAITS</div>
  <v-row>
    <v-col>
      <v-expansion-panels color="primary">
        <v-expansion-panel v-for="n in 4" :title="traits[n - 1].name" :text="traits[n - 1].detail">
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col>
      <v-expansion-panels color="primary">
        <v-expansion-panel v-for="n in 3" :title="traits[n + 3].name" :text="traits[n + 3].detail">
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import PersistentTraits from '@/classes/npc/eidolon/persistent_traits.json';

export default {
  name: 'eidolon-persistent-traits',
  computed: {
    traits(): any[] {
      return PersistentTraits;
    },
  },
};
</script>
