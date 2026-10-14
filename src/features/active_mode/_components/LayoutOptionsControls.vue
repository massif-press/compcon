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
        sm="6"
      >
        <div class="heading h4 text-accent mt-3">{{ $t('active.layout.sectionDisplay') }}</div>
        <v-divider />

        <div class="text-cc-overline text-disabled mt-2">{{ $t('active.layout.labels') }}</div>
        <cc-select
          v-model="labels"
          :items="labelItems"
          item-title="title"
          item-value="value"
          color="primary"
        />

        <template v-if="!pc">
          <div class="text-cc-overline text-disabled mt-2">
            {{ $t('active.layout.sidebarLabels') }}
          </div>
          <cc-select
            v-model="sidebarLabels"
            :items="labelItems"
            item-title="title"
            item-value="value"
            color="primary"
          />
        </template>

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

        <div class="text-cc-overline text-disabled mt-2">{{ $t('active.layout.statSet') }}</div>
        <cc-select
          v-model="coreStatsOnly"
          :items="statSetItems"
          item-title="title"
          item-value="value"
          color="primary"
        />

        <div class="heading h4 text-accent mt-4">{{ $t('active.layout.sectionActions') }}</div>
        <v-divider />

        <div class="text-cc-overline text-disabled mt-2">
          {{ $t('active.layout.actionGrouping') }}
        </div>
        <cc-select
          v-model="actionGrouping"
          :items="actionGroupingItems"
          item-title="title"
          item-value="value"
          color="primary"
        />
        <div class="mt-2">
          <cc-switch
            v-model="showActionDetails"
            size="large"
            color="primary"
            :label="$t('active.layout.showActionDetails')"
            :tooltip="$t('active.layout.showActionDetailsTooltip')"
          />
        </div>
      </v-col>

      <v-col
        cols="12"
        sm="6"
      >
        <div class="heading h4 text-accent mt-3">{{ $t('active.layout.content') }}</div>
        <v-divider />

        <div
          v-for="key in CONTENT_SWITCHES"
          :key="key"
          class="mt-2"
        >
          <cc-switch
            :model-value="options[key]"
            size="large"
            color="primary"
            :label="$t(`active.layout.${key}`)"
            :tooltip="$t(`active.layout.${key}Tooltip`)"
            @update:model-value="options = { ...options, [key]: $event }"
          />
        </div>

        <div class="heading h4 text-accent mt-4">{{ $t('active.layout.structure') }}</div>
        <v-divider />

        <div class="mt-2">
          <cc-switch
            v-model="columns"
            size="large"
            color="primary"
            :label="$t('active.layout.columnsLabel')"
            :tooltip="$t('active.layoutOptionsControls.panelColumnsHint')"
          />
        </div>
        <div class="mt-4">
          <cc-number-field
            v-model="maxColumns"
            size="large"
            color="primary"
            min="1"
            max="4"
            :label="$t('active.layoutOptionsControls.maxLoadoutFeatureSetColumns')"
            :tooltip="$t('active.layoutOptionsControls.loadoutColumnsHint')"
          />
        </div>

        <template v-if="!pc">
          <div class="heading h4 text-accent mt-4">{{ $t('active.layout.sectionBehavior') }}</div>
          <v-divider />

          <div class="text-cc-overline text-disabled mt-2">
            {{ $t('active.layout.scrollOnSelect') }}
          </div>
          <cc-select
            v-model="scrollOnSelect"
            :items="scrollItems"
            item-title="title"
            item-value="value"
            color="primary"
          />
        </template>
      </v-col>
    </v-row>

    <div
      v-if="isInstance"
      class="mt-4"
    >
      <cc-button
        color="primary"
        size="small"
        prepend-icon="mdi-content-save-cog"
        :tooltip="$t('active.layout.saveAsDefaultTooltip')"
        @click="saveAsDefault()"
      >
        {{ $t('active.layout.saveAsDefault') }}
      </cc-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useLayoutOptions, PRESET_KEYS } from '../layoutOptions'

  defineOptions({ name: 'LayoutOptionsControls' })
  withDefaults(defineProps<{ pc?: boolean }>(), { pc: false })

  const { t } = useI18n()
  const { options, field, applyPreset, matchedPreset, isInstance, saveAsDefault } =
    useLayoutOptions()

  const labels = field('labels')
  const sidebarLabels = field('sidebarLabels')
  const density = field('density')
  const tickbars = field('tickbars')
  const actionGrouping = field('actionGrouping')
  const columns = field('columns')
  const maxColumns = field('maxColumns')
  const coreStatsOnly = field('coreStatsOnly')
  const showActionDetails = field('showActionDetails')
  const scrollOnSelect = field('scrollOnSelect')

  const CONTENT_SWITCHES = [
    'showPortraits',
    'showFlavor',
    'showTurnStates',
    'showCover',
    'showActiveEffects',
    'trackMovement',
  ] as const

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
  const actionGroupingItems = computed(() =>
    items('actionGroupings', ['none', 'standard', 'byType', 'menus'])
  )
  const statSetItems = computed(() => items('statSets', [false, true], ['all', 'core']))
  const scrollItems = computed(() => items('scrollModes', ['top', 'keep']))
</script>
