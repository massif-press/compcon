<template>
  <div class="text-overline">{{ $t('gm.eidolonPrint.persistentTraits') }}</div>
  <v-row>
    <v-col
      v-for="(column, i) in columns"
      :key="`trait-column-${i}`"
    >
      <v-expansion-panels color="primary">
        <v-expansion-panel
          v-for="trait in column"
          :key="trait.name"
          tile
          :title="trait.name"
          :text="trait.detail"
        />
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { persistentTraits } from '@/classes/npc/eidolon/EidolonLayer'

  defineOptions({ name: 'eidolon-persistent-traits' })

  const columns = computed(() => {
    const traits = persistentTraits()
    const half = Math.ceil(traits.length / 2)
    return [traits.slice(0, half), traits.slice(half)]
  })
</script>
