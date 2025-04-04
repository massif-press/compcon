<template>
  <v-card :style="`max-width: ${mobile ? '100vw' : 'calc(100vw - 390px)'} !important`">
    <v-card-text v-if="!selected" class="heading h2 py-12 my-12 text-center text-disabled">
      NO SELECTION
    </v-card-text>
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
        <tbody v-if="!isNpcClass">
          <tr v-for="metric in relevantMetrics">
            <td class="text-left side-border" :class="metric.bold ? 'font-weight-bold' : ''">
              {{ metric.title }}
            </td>
            <td class="text-center heading h3 side-border font-weight-bold bg-primary">
              {{ selected.Stats[metric.value] }}
            </td>
            <td v-for="item in items" class="text-center heading h3 font-weight-bold side-border">
              {{ (item as any).Stats[metric.value] }}
              <div class="mt-n3" v-html="diff(metric.value, item)" />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="metric in metrics">
            <td class="text-left side-border" :class="metric.bold ? 'font-weight-bold' : ''">
              {{ metric.title }}
            </td>
            <td class="text-center heading h3 side-border font-weight-bold text-accent">
              {{ selected.Stats.Stat(metric.value, tier) }}
            </td>
            <td v-for="item in items" class="text-center heading h3 side-border">
              {{ (item as any).Stats.Stat(metric.value, tier) }}
              <div class="mt-n3" v-html="npcDiff(metric.value, item)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <div v-show="!!selected" class="text-right px-4 pb-2">
      <v-btn size="x-small" variant="outlined" color="primary" @click="$emit('clear')">
        Clear All
      </v-btn>
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
    tier: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  emits: ['clear'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    isNpcClass() {
      return (this.selected as CompendiumItem).ItemType === 'NpcClass';
    },
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
        case 'PilotArmor':
          return [
            { title: 'Armor', value: 'armor' },
            { title: 'HP Bonus', value: 'hp' },
            { title: 'E-Defense', value: 'edef' },
            { title: 'Evasion', value: 'evasion' },
            { title: 'Speed', value: 'speed' },
          ];
        case 'PilotWeapon':
          return [
            { title: 'Range', value: 'range' },
            { title: 'Total Damage', value: 'damage' },
          ];
        case 'NpcClass':
          return [
            { title: 'Hull', value: 'hull' },
            { title: 'Agility', value: 'agi' },
            { title: 'Systems', value: 'sys' },
            { title: 'Engineering', value: 'eng' },
            { title: 'Armor', value: 'armor' },
            { title: 'HP', value: 'hp' },
            { title: 'HeatCap', value: 'heat' },
            { title: 'Evade', value: 'evasion' },
            { title: 'E-Defense', value: 'edef' },
            { title: 'Speed', value: 'speed' },
            { title: 'Sensor Range', value: 'sensorRange' },
            { title: 'Save Target', value: 'saveTarget' },
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
    npcMetrics() {},
  },
  methods: {
    diff(metric: string, item: any) {
      const selectedValue = (this.selected as any).Stats[metric];
      const itemValue = item.Stats[metric];
      if (selectedValue === itemValue) return '<i class="text-caption text-disabled">(&mdash;)</i>';

      return `<i class="text-caption font-weight-bold  ${
        selectedValue > itemValue ? 'text-error">(' : 'text-success">(+'
      }${itemValue - selectedValue})</i>`;
    },
    npcDiff(metric: string, item: any) {
      const selectedValue = (this.selected as any).Stats.Stat(metric, this.tier);
      const itemValue = item.Stats.Stat(metric, this.tier);
      if (selectedValue === itemValue) return '';

      return `<i class="text-caption font-weight-bold  ${
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

.lh0 {
  line-height: 12px;
}
</style>
