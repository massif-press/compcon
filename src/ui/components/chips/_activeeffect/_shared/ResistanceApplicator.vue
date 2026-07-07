<template>
  <v-col :cols="cols"
    v-if="event.ResistEvents?.length">
    <v-row v-for="(r, index) in event.ResistEvents"
      :key="`resist-${index}`"
      no-gutters>
      <v-col>
        <div class="text-cc-overline text-disabled">{{ $t('ui.fields.damageType') }}</div>
        <v-select :model-value="r.Resist"
          :items="resistanceOptions"
          density="compact"
          hide-details
          variant="outlined"
          flat
          tile />
        <base-duration-display v-if="r.Duration"
          :duration="r.Duration" />
      </v-col>
      <v-col>
        <div class="text-cc-overline text-disabled">{{ $t('ui.combat.resistanceType') }}</div>
        <v-select :model-value="r.resistTypes"
          :items="resistTypes"
          density="compact"
          hide-details
          variant="outlined"
          flat
          tile />
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import BaseDurationDisplay from './BaseDurationDisplay.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

withDefaults(defineProps<{
  event: Record<string, any>
  cols?: number | string
}>(), { cols: 'auto' })

const resistanceOptions = [
  { title: t('ui.titles.kinetic'), value: 'kinetic' },
  { title: t('ui.titles.energy'), value: 'energy' },
  { title: t('ui.titles.explosive'), value: 'explosive' },
  { title: t('ui.titles.heat'), value: 'heat' },
  { title: t('ui.titles.burn'), value: 'burn' },
  { title: t('ui.titles.areaOfEffect'), value: 'aoe' },
  { title: t('ui.titles.all'), value: 'all' },
]

const resistTypes = [
  { title: t('ui.titles.resistance'), value: 'Resistance' },
  { title: t('ui.titles.immunity'), value: 'Immunity' },
  { title: t('ui.titles.vulnerability'), value: 'Vulnerability' },
]
</script>