<template>
  <div class="text-overline">{{ $t('gm.eidolon.persistentTraitsHeading') }}</div>
  <v-row>
    <v-col>
      <v-expansion-panels color="primary">
        <v-expansion-panel
          v-for="n in 4"
          :key="`trait-a-${n}`"
          tile
          :title="traits[n - 1].name"
          :text="traits[n - 1].detail" />
      </v-expansion-panels>
    </v-col>
    <v-col>
      <v-expansion-panels color="primary">
        <v-expansion-panel
          v-for="n in 3"
          :key="`trait-b-${n}`"
          tile
          :title="traits[n + 3].name"
          :text="traits[n + 3].detail"></v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PersistentTraits from '@/classes/npc/eidolon/persistent_traits.json';

defineOptions({ name: 'eidolon-persistent-traits' })

const traits = computed(() => {
      return PersistentTraits;
    })
</script>
