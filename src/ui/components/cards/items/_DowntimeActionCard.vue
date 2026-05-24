<template>
  <i v-html-safe="item.Terse"
    class="text-accent" />
  <br />
  <p v-html-safe="item.Detail"
    class="my-1" />

  <v-table v-if="item.Table">
    <thead>
      <tr>
        <th class="text-center">
          <v-icon v-for="(n, index) in diceQuantity"
            :key="`dice-${index}`"
            size="35"
            :icon="diceIcon" />
        </th>
        <th class="text-overline">Result</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(result, index) in item.Table.results"
        :key="`result-${index}`">
        <td v-if="result.min === result.max"
          class="text-center">{{ result.min }}</td>
        <td v-else
          class="text-center">{{ result.min }}&ndash;{{ result.max }}</td>
        <td v-html-safe="result.text"
          class="text-text" />
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  item: object & { Table?: { die: string, results: any[] } }
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()

const diceQuantity = computed<number>(() => {
  if (!(props.item as any).Table) return 0
  return (props.item as any).Table.die.split('d')[0] || 1
})

const diceIcon = computed<string>(() => {
  if (!(props.item as any).Table) return 'mdi-dice-d6'
  return `mdi-dice-d${(props.item as any).Table.die.split('d')[1]}`
})
</script>
