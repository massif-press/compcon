<template>
  <cc-panel
    color="background"
    class="mb-2"
  >
    <div class="d-flex align-center">
      <component
        :is="expandable ? 'button' : 'div'"
        :class="{ 'chart-header': expandable }"
        :type="expandable ? 'button' : undefined"
        @click="expandable && emit('toggle-expand')"
      >
        <div class="text-cc-overline">{{ title }}</div>
        <div
          v-if="subtitle"
          class="text-caption text-disabled"
        >
          {{ subtitle }}
        </div>
      </component>
      <v-spacer />
      <v-btn
        v-if="table.length"
        :icon="showTable ? 'mdi-chart-box-outline' : 'mdi-table'"
        size="x-small"
        flat
        tile
        :title="showTable ? $t('active.charts.showChart') : $t('active.charts.showTable')"
        @click.stop="showTable = !showTable"
      />
      <v-btn
        v-if="expandable"
        :icon="expanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'"
        size="x-small"
        flat
        tile
        :title="expanded ? $t('active.charts.collapseChart') : $t('active.charts.expandChart')"
        @click.stop="emit('toggle-expand')"
      />
    </div>

    <div
      v-if="!hasData"
      class="text-center text-disabled text-cc-overline pa-6"
    >
      {{ $t('active.charts.noData') }}
    </div>

    <div
      v-else-if="!showTable"
      :style="`height: ${height}px; position: relative`"
    >
      <component
        :is="renderer"
        :data="data"
        :options="options"
      />
    </div>

    <v-table
      v-else
      density="compact"
      class="bg-background"
    >
      <thead>
        <tr>
          <th
            v-for="h in tableHeaders"
            :key="h"
            class="text-cc-overline"
          >
            {{ h }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in table"
          :key="i"
        >
          <td
            v-for="h in tableHeaders"
            :key="h"
          >
            {{ row[h] }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </cc-panel>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Bar, Line, Doughnut, Bubble } from 'vue-chartjs'

  const props = withDefaults(
    defineProps<{
      title: string
      subtitle?: string
      type: 'bar' | 'line' | 'doughnut' | 'bubble'
      data: any
      options: any
      table?: Record<string, string | number>[]
      height?: number
      expandable?: boolean
      expanded?: boolean
    }>(),
    { subtitle: '', table: () => [], height: 260, expandable: false, expanded: false }
  )

  const emit = defineEmits<{ 'toggle-expand': [] }>()

  const showTable = ref(false)

  const renderer = computed(
    () => ({ bar: Bar, line: Line, doughnut: Doughnut, bubble: Bubble })[props.type]
  )

  const tableHeaders = computed(() => Object.keys(props.table[0] ?? {}))

  const hasData = computed(() =>
    (props.data?.datasets ?? []).some((d: any) =>
      (d.data ?? []).some((v: any) => {
        const n = typeof v === 'object' && v !== null ? (v.x ?? 0) + (v.y ?? 0) : v
        return Number.isFinite(n) && n !== 0
      })
    )
  )
</script>

<style scoped>
  .chart-header {
    cursor: pointer;
    padding: 0;
    background: none;
    border: 0;
    text-align: left;
    font: inherit;
    color: inherit;
  }
</style>
