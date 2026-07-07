<template>
  <v-card :style="`max-width: ${mobile ? '100vw' : 'calc(100vw - 390px)'} !important`">
    <v-card-text v-if="!selected"
      class="heading h2 py-12 my-12 text-center text-disabled">
      {{ $t('ui.widget.noSelection') }}
    </v-card-text>
    <v-card-text v-else>
      <v-table>
        <thead>
          <tr>
            <th class="text-left side-border"
              width="160px">{{ $t('ui.fields.metric') }}</th>
            <th class="text-center font-weight-bold text-primary side-border">
              <cc-item-modal small-btn
                hide-type
                :item="selected" />
            </th>
            <th v-for="item in items"
              :key="(item as any).ID"
              class="text-center side-border">
              <cc-item-modal small-btn
                hide-type
                :item="(item as any)" />
            </th>
          </tr>
        </thead>
        <tbody v-if="!isNpcClass">
          <tr v-for="metric in relevantMetrics"
            :key="metric.value">
            <td class="text-left side-border"
              :class="metric.bold ? 'font-weight-bold' : ''">
              {{ metric.title }}
            </td>
            <td class="text-center heading h3 side-border font-weight-bold bg-primary">
              {{ selected.Stats[metric.value] }}
            </td>
            <td v-for="item in items"
              :key="(item as any).ID"
              class="text-center heading h3 font-weight-bold side-border">
              {{ (item as any).Stats[metric.value] }}
              <div v-html-safe="diff(metric.value, item)"
                class="mt-n3" />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="metric in metrics"
            :key="metric.value">
            <td class="text-left side-border"
              :class="metric.bold ? 'font-weight-bold' : ''">
              {{ metric.title }}
            </td>
            <td class="text-center heading h3 side-border font-weight-bold text-accent">
              {{ selected.Stats.Stat(metric.value, tier) }}
            </td>
            <td v-for="item in items"
              :key="(item as any).ID"
              class="text-center heading h3 side-border">
              {{ (item as any).Stats.Stat(metric.value, tier) }}
              <div v-html-safe="npcDiff(metric.value, item)"
                class="mt-n3" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <div v-show="!!selected"
      class="text-right px-4 pb-2">
      <v-btn size="x-small"
        variant="outlined"
        color="primary"
        @click="$emit('clear')">
        {{ $t('ui.dice.clearAll') }}
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumItem } from '@/classes/CompendiumItem'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    items: {
      type: Array,
      required: true,
    },
    selected: {
      type: Object,
      required: false,
      default: null,
    },
    tier: {
      type: Number,
      required: false,
      default: 1,
    },
  })

const emit = defineEmits(['clear'])

const { smAndDown: mobile, xs: portrait } = useDisplay()

const isNpcClass = computed(() => (props.selected as CompendiumItem)?.ItemType === 'NpcClass')

const metrics = computed(() => {
  switch ((props.selected as CompendiumItem)?.ItemType) {
    case 'Frame':
      return [
        { title: 'HP', value: 'hp' },
        { title: t('ui.titles.evasion'), value: 'evasion' },
        { title: t('ui.titles.armor'), value: 'armor' },
        { title: t('ui.titles.eDefense'), value: 'edef' },
        { title: t('ui.titles.heatCapacity'), value: 'heatcap' },
        { title: t('ui.titles.repairCapacity'), value: 'repcap' },
        { title: t('ui.titles.sensors'), value: 'sensor_range' },
        { title: t('common.techAttack'), value: 'tech_attack' },
        { title: t('ui.titles.save'), value: 'save' },
        { title: t('ui.titles.speed'), value: 'speed' },
        { title: t('common.systemPoints'), value: 'sp' },
      ]
    case 'PilotArmor':
      return [
        { title: t('ui.titles.armor'), value: 'armor' },
        { title: t('common.hpBonus'), value: 'hp' },
        { title: t('ui.titles.eDefense'), value: 'edef' },
        { title: t('ui.titles.evasion'), value: 'evasion' },
        { title: t('ui.titles.speed'), value: 'speed' },
      ]
    case 'PilotWeapon':
      return [
        { title: t('ui.titles.range'), value: 'range' },
        { title: t('ui.titles.totalDamage'), value: 'damage' },
      ]
    case 'NpcClass':
      return [
        { title: t('ui.titles.hull'), value: 'hull' },
        { title: t('ui.titles.agility'), value: 'agi' },
        { title: t('ui.titles.systems'), value: 'sys' },
        { title: t('ui.titles.engineering'), value: 'eng' },
        { title: t('ui.titles.armor'), value: 'armor' },
        { title: 'HP', value: 'hp' },
        { title: t('ui.titles.heatcap'), value: 'heatcap' },
        { title: t('ui.titles.evade'), value: 'evasion' },
        { title: t('ui.titles.eDefense'), value: 'edef' },
        { title: t('ui.titles.speed'), value: 'speed' },
        { title: t('common.sensorRange'), value: 'sensorRange' },
        { title: t('ui.titles.saveTarget'), value: 'saveTarget' },
      ]
    default:
      return [
        { title: t('ui.titles.range'), value: 'range', bold: true },
        { title: t('ui.titles.line'), value: 'line' },
        { title: t('ui.titles.blast'), value: 'blast' },
        { title: t('ui.titles.burst'), value: 'burst' },
        { title: t('ui.titles.cone'), value: 'cone' },
        { title: t('ui.titles.totalDamage'), value: 'damage', bold: true },
        { title: t('ui.titles.kineticDamage'), value: 'kineticDamage' },
        { title: t('ui.titles.energyDamage'), value: 'energyDamage' },
        { title: t('ui.titles.heatDamage'), value: 'heatDamage' },
        { title: t('ui.titles.explosiveDamage'), value: 'explosiveDamage' },
        { title: t('ui.titles.variableDamage'), value: 'variableDamage' },
      ]
  }
})

const relevantMetrics = computed(() => {
  return metrics.value.filter((m) => {
    return (
      (props.items as any[]).some((i) => i.Stats[m.value] > 0) ||
      (props.selected as any)?.Stats[m.value] > 0
    )
  })
})

function diff(metric: string, item: any) {
  const selectedValue = (props.selected as any).Stats[metric]
  const itemValue = item.Stats[metric]
  if (selectedValue === itemValue) return '<i class="text-caption text-disabled">(&mdash;)</i>'
  return `<i class="text-caption font-weight-bold  ${selectedValue > itemValue ? 'text-error">(' : 'text-success">(+'}${itemValue - selectedValue})</i>`
}

function npcDiff(metric: string, item: any) {
  const selectedValue = (props.selected as any).Stats.Stat(metric, props.tier)
  const itemValue = item.Stats.Stat(metric, props.tier)
  if (selectedValue === itemValue) return ''
  return `<i class="text-caption font-weight-bold  ${selectedValue > itemValue ? 'text-error">(' : 'text-success">(+'}${itemValue - selectedValue})</i>`
}
</script>

<style scoped>
.side-border {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.lh0 {
  line-height: 12px;
}
</style>
