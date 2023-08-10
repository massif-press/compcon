<template>
  <v-card style="max-width: calc(100vw - 390px) !important">
    <v-card-text v-if="!selected" class="heading h2 py-12 my-12 text-center text-subtle"
      >NO SELECTION</v-card-text
    >
    <v-card-text v-else>
      <v-table>
        <thead>
          <tr>
            <th class="text-left side-border" width="160px">Metric</th>
            <th class="text-center font-weight-bold text-primary side-border">
              <cc-item-modal small-btn hide-type :item="selected" />
            </th>
            <th v-for="item in items" class="text-center side-border">
              <cc-item-modal small-btn hide-type :item="item" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="metric in relevantMetrics">
            <td class="text-left side-border" :class="metric.bold ? 'font-weight-bold' : ''">
              {{ metric.title }}
            </td>
            <td class="text-center side-border font-weight-bold text-primary">
              {{ selected.Stats[metric.value] }}
            </td>
            <td v-for="item in items" class="text-center side-border">
              {{ (item as any).Stats[metric.value] }} <span v-html="diff(metric.value, item)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <div v-show="!!selected" class="text-right px-4 pb-2">
      <v-btn size="x-small" variant="outlined" color="primary" @click="$emit('clear')"
        >Clear All</v-btn
      >
    </div>
  </v-card>
</template>

<script lang="ts">
import { CompendiumItem } from '@/class';

export default {
  name: 'selector-table',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    selected: {
      type: Object,
      required: false,
    },
  },
  emits: ['clear'],
  computed: {
    metrics() {
      switch ((this.selected as CompendiumItem).ItemType) {
        case 'Frame':
          return [
            { title: 'HP', value: 'hp' },
            { title: 'Evasion', value: 'evasion' },
            { title: 'Armor', value: 'armor' },
            { title: 'E-Defense', value: 'edef' },
            { title: 'Heat Capacity', value: 'heatcap' },
            { title: 'Repair Capacity', value: 'repcap' },
            { title: 'Sensors', value: 'sensor_range' },
            { title: 'Tech Attack', value: 'tech_attack' },
            { title: 'Save', value: 'save' },
            { title: 'Speed', value: 'speed' },
            { title: 'System Points', value: 'sp' },
          ];
        default:
          return [
            { title: 'Range', value: 'range', bold: true },
            { title: 'Line', value: 'line' },
            { title: 'Blast', value: 'blast' },
            { title: 'Burst', value: 'burst' },
            { title: 'Cone', value: 'cone' },
            { title: 'Total Damage', value: 'damage', bold: true },
            { title: 'Kinetic Damage', value: 'kineticDamage' },
            { title: 'Energy Damage', value: 'energyDamage' },
            { title: 'Heat Damage', value: 'heatDamage' },
            { title: 'Explosive Damage', value: 'explosiveDamage' },
            { title: 'Variable Damage', value: 'variableDamage' },
          ];
      }
    },
    relevantMetrics() {
      return this.metrics.filter((m) => {
        return (
          this.items.some((i) => (i as any).Stats[m.value] > 0) ||
          (this.selected as any).Stats[m.value] > 0
        );
      });
    },
  },
  methods: {
    diff(metric: string, item: any) {
      const selectedValue = (this.selected as any).Stats[metric];
      const itemValue = item.Stats[metric];
      if (selectedValue === itemValue) return '';

      return `<i class="text-overline ${
        selectedValue > itemValue ? 'text-error">(' : 'text-success">(+'
      }${itemValue - selectedValue})</i>`;
    },
  },
};
</script>

<style scoped>
.side-border {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
