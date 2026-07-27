<template>
  <div
    v-for="(d, index) in damage"
    :key="`damage-${index}`"
    class="text-center d-inline-block"
  >
    <v-tooltip max-width="600">
      <template #activator="{ props }">
        <span
          v-if="small"
          v-bind="props"
        >
          <v-icon
            :color="damageColor(d)"
            :icon="damageIcon(d)"
          />
          <v-icon
            v-if="d.Override"
            icon="mdi-information-outline"
            color="text"
          />
          <b
            v-else
            v-text="`${added ? '+' : ''}${displayValue(d.Value)}`"
          />
        </span>
        <v-row
          v-else
          align="center"
          no-gutters
          v-bind="props"
        >
          <v-col cols="auto">
            <v-icon
              :size="dense ? 25 : 35"
              class="mt-n1"
              :color="damageColor(d)"
              :icon="damageIcon(d)"
            />
          </v-col>
          <v-col
            class="heading"
            :style="`font-size: ${dense ? '20' : '24'}pt`"
          >
            {{ `${added ? '+' : ''}${displayValue(d.Value)}` }}
          </v-col>
        </v-row>
      </template>
      <div class="heading h3">
        {{ displayValue(d.Value) }} {{ $enum('damageType', typeOverride || d.Type) }}
        {{ $t('ui.widget.damage') }}
      </div>
      <div v-html-safe="gloss(d)" />
    </v-tooltip>
    <div
      v-if="!small"
      class="text-cc-overline mt-n2"
    >
      {{ $enum('damageType', typeOverride ? typeOverride : d.Type) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Damage } from '@/classes/Damage'
  import { DamageType } from '@/classes/enums'
  import { enumLabel } from '@/i18n/enumLabel'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      damage: Damage[]
      typeOverride?: string | DamageType | null
      small?: boolean
      added?: boolean
      inline?: boolean
      dense?: boolean
    }>(),
    {
      typeOverride: undefined,
    }
  )

  function damageColor(d: Damage) {
    return props.typeOverride ? `damage--${props.typeOverride.toLowerCase()}` : d.Color
  }
  function damageIcon(d: Damage) {
    return props.typeOverride ? `cc:${props.typeOverride.toLowerCase()}` : d.Icon
  }
  function gloss(d: Damage) {
    const typeLabel = enumLabel('damageType', d.Type)
    const intro = t('ui.widget.glossary.intro', { value: d.Value, type: typeLabel })
    switch (d.Type.toLowerCase()) {
      case 'heat':
        return `${intro}<br><div class="text-overline text-disabled mb-n2">${t('ui.widget.glossary.heatLabel')}</div>${t('ui.widget.glossary.heatDescription')}`
      case 'burn':
        return `${intro}<br><div class="text-overline text-disabled mb-n2">${t('ui.widget.glossary.burnLabel')}</div>${t('ui.widget.glossary.burnDescription')}`
      default:
        return intro
    }
  }
  function displayValue(value: number | string | number[] | string[]) {
    if (Array.isArray(value)) {
      return value.join(' / ')
    }
    return value.toString()
  }
</script>
