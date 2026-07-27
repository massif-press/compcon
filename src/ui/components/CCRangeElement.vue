<template>
  <div
    v-for="r in range"
    :key="r.Type"
    class="text-center d-inline-block mr-4"
  >
    <v-tooltip max-width="600">
      <template #activator="{ props }">
        <span
          v-if="small"
          v-bind="props"
        >
          <v-icon :icon="r.Icon" />
          <v-icon
            v-if="r.Override"
            icon="mdi-information-outline"
          />
          <b
            v-else
            v-text="`${added ? '+' : ''}${r.Value}`"
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
              :icon="r.Icon"
            />
          </v-col>
          <v-col
            class="heading"
            :style="`font-size: ${dense ? '20' : '24'}pt`"
          >
            {{ `${added ? '+' : ''}${r.Value}` }}
          </v-col>
        </v-row>
      </template>
      <div class="heading h3">{{ rangeText(r) }}</div>
      <div v-if="gloss(r)">
        <v-divider class="my-2" />
        <b>{{ enumLabel('rangeType', r.Type) }}</b>
        <br />
        <div>{{ glossDescription(r) }}</div>
      </div>
    </v-tooltip>
    <div
      v-if="!small"
      class="text-cc-overline mt-n1"
    >
      {{ $enum('rangeType', r.Type) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Range } from '@/classes/Range'
  import { glossary } from '@massif/lancer-data'
  import { enumLabel } from '@/i18n/enumLabel'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps<{
    range: Range[]
    small?: boolean
    dense?: boolean
    added?: boolean
  }>()

  // Composes translated tooltip heading: "Range 5" or "Threat 3"
  function rangeText(r: Range): string {
    if (r.Override) return r.Value.toString()
    const typeLabel = enumLabel('rangeType', r.Type)
    if (r.Bonus)
      return t('ui.widget.glossary.rangeTextBonus', {
        type: typeLabel,
        value: r.Value,
        bonus: r.Bonus,
      })
    return t('ui.widget.glossary.rangeText', { type: typeLabel, value: r.Value })
  }

  function gloss(r: Range) {
    if (!r?.Type) return null
    return glossary.find(x => x.name.toLowerCase() === r.Type.toLowerCase()) || null
  }
  // Key maps avoid dynamic te() calls broken by @unplugin-vue-i18n tree-shaking
  const rangeWhatKeys: Record<string, string> = {
    range: 'ui.widget.glossary.rangeDesc.whatRange',
    threat: 'ui.widget.glossary.rangeDesc.whatThreat',
    thrown: 'ui.widget.glossary.rangeDesc.whatThrown',
  }

  const rangeAreaKeys: Record<string, string> = {
    line: 'ui.widget.glossary.rangeDesc.areaLine',
    cone: 'ui.widget.glossary.rangeDesc.areaCone',
    blast: 'ui.widget.glossary.rangeDesc.areaBlast',
    burst: 'ui.widget.glossary.rangeDesc.areaBurst',
  }

  // Builds translated range description from reusable templates
  function glossDescription(r: Range): string {
    const type = r.Type.toLowerCase()
    if (rangeWhatKeys[type]) {
      return t('ui.widget.glossary.rangeDesc.maxRange', { what: t(rangeWhatKeys[type]) })
    }
    if (rangeAreaKeys[type]) {
      return t('ui.widget.glossary.rangeDesc.equipmentAffects', {
        pattern: enumLabel('rangeType', r.Type),
        area: t(rangeAreaKeys[type]),
      })
    }
    return ''
  }
</script>
