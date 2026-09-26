<template>
  <v-col
    v-if="event.ResistEvents?.length"
    :cols="cols"
  >
    <v-row
      v-for="(r, index) in event.ResistEvents"
      :key="`resist-${index}`"
      no-gutters
    >
      <v-col>
        <div class="text-cc-overline text-disabled">{{ $t('common.damageType') }}</div>
        <v-select
          :model-value="r.Resist"
          :items="resistanceOptions"
          density="compact"
          hide-details
          variant="outlined"
          flat
          tile
        />
        <base-duration-display
          v-if="r.Duration"
          :duration="r.Duration"
        />
      </v-col>
      <v-col>
        <div class="text-cc-overline text-disabled">{{ $t('ui.combat.resistanceType') }}</div>
        <v-select
          :model-value="r.resistTypes"
          :items="resistTypes"
          density="compact"
          hide-details
          variant="outlined"
          flat
          tile
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
  import BaseDurationDisplay from './BaseDurationDisplay.vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  withDefaults(
    defineProps<{
      event: Record<string, any>
      cols?: number | string
    }>(),
    { cols: 'auto' }
  )

  const resistanceOptions = [
    { title: t('enums.damageType.kinetic'), value: 'kinetic' },
    { title: t('enums.damageType.energy'), value: 'energy' },
    { title: t('enums.damageType.explosive'), value: 'explosive' },
    { title: t('enums.damageType.heat'), value: 'heat' },
    { title: t('common.burnStatus'), value: 'burn' },
    { title: t('ui.combat.areaOfEffect'), value: 'aoe' },
    { title: t('common.all'), value: 'all' },
  ]

  const resistTypes = [
    { title: t('active.dmgCond.resistance'), value: 'Resistance' },
    { title: t('active.dmgCond.immunity'), value: 'Immunity' },
    { title: t('active.dmgCond.vulnerability'), value: 'Vulnerability' },
  ]
</script>
