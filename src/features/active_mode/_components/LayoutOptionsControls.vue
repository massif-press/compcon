<template>
  <div>
    <div class="text-cc-overline text-disabled">{{ $t('active.layout.preset') }}</div>
    <cc-select
      v-model="preset"
      :items="presetItems"
      item-title="title"
      item-value="value"
      color="primary"
    />

    <v-row dense>
      <v-col
        cols="12"
        :sm="dense ? 12 : 6"
      >
        <div class="text-cc-overline text-disabled mt-2">{{ $t('active.layout.labels') }}</div>
        <cc-select
          v-model="labels"
          :items="labelItems"
          item-title="title"
          item-value="value"
          color="primary"
        />

        <div class="text-cc-overline text-disabled mt-2">{{ $t('active.layout.density') }}</div>
        <cc-select
          v-model="density"
          :items="densityItems"
          item-title="title"
          item-value="value"
          color="primary"
        />

        <div class="text-cc-overline text-disabled mt-2">{{ $t('active.layout.tickbars') }}</div>
        <cc-select
          v-model="tickbars"
          :items="tickbarItems"
          item-title="title"
          item-value="value"
          color="primary"
        />
      </v-col>

      <v-col
        cols="12"
        :sm="dense ? 12 : 6"
      >
        <div class="text-cc-overline text-disabled mt-2">{{ $t('active.layout.statSet') }}</div>
        <cc-select
          v-model="statSetMode"
          :items="statSetItems"
          item-title="title"
          item-value="value"
          color="primary"
        />

        <div class="text-cc-overline text-disabled mt-2">{{ $t('active.layout.structure') }}</div>
        <cc-switch
          v-model="columns"
          size="large"
          color="primary"
          :label="$t('active.layout.columnsLabel')"
          :tooltip="$t('active.tooltips.thisControlsIfColumnsWill')"
        />
        <cc-number-field
          v-model="maxColumns"
          size="large"
          color="primary"
          min="1"
          max="4"
          :label="$t('active.fields.maxLoadoutFeatureSetColumns')"
          :tooltip="$t('active.tooltips.thisControlsHowManyColumns')"
        />

        <div class="text-cc-overline text-disabled mt-2">{{ $t('active.layout.content') }}</div>
        <cc-switch
          v-model="showPortraits"
          size="large"
          color="primary"
          :label="$t('active.layout.showPortraits')"
          :tooltip="$t('active.layout.showPortraitsTooltip')"
        />
        <cc-switch
          v-model="showFlavor"
          size="large"
          color="primary"
          :label="$t('active.layout.showFlavor')"
          :tooltip="$t('active.layout.showFlavorTooltip')"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    useLayoutOptions,
    applyPreset,
    matchedPreset,
    PRESET_KEYS,
    CORE_STATS,
  } from '../layoutOptions'

  defineOptions({ name: 'LayoutOptionsControls' })
  withDefaults(defineProps<{ dense?: boolean }>(), { dense: false })

  const { t } = useI18n()
  const { options, field } = useLayoutOptions()

  const labels = field('labels')
  const density = field('density')
  const tickbars = field('tickbars')
  const columns = field('columns')
  const maxColumns = field('maxColumns')
  const showPortraits = field('showPortraits')
  const showFlavor = field('showFlavor')
  const statSet = field('statSet')

  const CUSTOM = '__custom__'

  const preset = computed({
    get: () => matchedPreset(options.value) || CUSTOM,
    set: (v: string) => {
      if (v !== CUSTOM) applyPreset(v)
    },
  })

  const presetItems = computed(() => [
    ...PRESET_KEYS.map(k => ({ value: k, title: t(`active.layout.presets.${k}`) })),
    { value: CUSTOM, title: t('active.layout.presets.custom') },
  ])

  const labelItems = computed(() => [
    { value: 'icon', title: t('active.layout.labelModes.icon') },
    { value: 'icon+text', title: t('active.layout.labelModes.iconText') },
    { value: 'text', title: t('active.layout.labelModes.text') },
  ])

  const densityItems = computed(() => [
    { value: 'compact', title: t('active.layout.densities.compact') },
    { value: 'default', title: t('active.layout.densities.default') },
    { value: 'comfortable', title: t('active.layout.densities.comfortable') },
  ])

  const tickbarItems = computed(() => [
    { value: 'auto', title: t('active.layout.tickbarModes.auto') },
    { value: 'simple', title: t('active.layout.tickbarModes.simple') },
    { value: 'standard', title: t('active.layout.tickbarModes.standard') },
  ])

  const statSetItems = computed(() => [
    { value: 'all', title: t('active.layout.statSets.all') },
    { value: 'core', title: t('active.layout.statSets.core') },
  ])

  const statSetMode = computed({
    get: () => (statSet.value === 'all' ? 'all' : 'core'),
    set: (v: string) => {
      statSet.value = v === 'all' ? 'all' : CORE_STATS
    },
  })
</script>
