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
          v-model="coreStatsOnly"
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
  import { useLayoutOptions, applyPreset, matchedPreset, PRESET_KEYS } from '../layoutOptions'

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
  const coreStatsOnly = field('coreStatsOnly')

  const CUSTOM = '__custom__'

  const preset = computed({
    get: () => matchedPreset(options.value) || CUSTOM,
    set: (v: string) => {
      if (v !== CUSTOM) applyPreset(v)
    },
  })

  function items(group: string, values: any[], keys: string[] = values): any[] {
    return values.map((value, i) => ({ value, title: t(`active.layout.${group}.${keys[i]}`) }))
  }

  const presetItems = computed(() =>
    items('presets', [...PRESET_KEYS, CUSTOM], [...PRESET_KEYS, 'custom'])
  )
  const labelItems = computed(() =>
    items('labelModes', ['icon', 'icon+text', 'text'], ['icon', 'iconText', 'text'])
  )
  const densityItems = computed(() => items('densities', ['compact', 'default', 'comfortable']))
  const tickbarItems = computed(() => items('tickbarModes', ['auto', 'simple', 'standard']))
  const statSetItems = computed(() => items('statSets', [false, true], ['all', 'core']))
</script>
