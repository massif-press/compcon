<template>
  <v-card-text class="flavor-text">
    <v-card
      flat
      tile
    >
      <fieldset class="pa-2">
        <legend class="clipped-small heading h3">{{ $t('print.generalOptions') }}&emsp;</legend>
        <print-option-select
          v-if="layoutOptions"
          v-model="options.layout"
          mandatory
          :title="$t('pm.titles.layout')"
          :items="layoutOptions"
        />
        <v-row>
          <v-col>
            <print-option-select
              v-model="options.paper"
              mandatory
              :title="$t('pm.titles.paper')"
              :items="paperOptions"
            />
          </v-col>
          <v-col v-if="contentOptions && !isCards">
            <print-option-select
              v-model="options.content"
              mandatory
              :title="$t('common.contentLabel')"
              :items="contentOptions"
            />
          </v-col>
          <v-col v-if="!isCards">
            <print-option-select
              v-model="options.orientation"
              mandatory
              :title="$t('pm.titles.orientation')"
              :items="orientationOptions"
            />
          </v-col>
          <v-col v-if="bondsOptions && !isCards">
            <print-option-select
              v-model="options.bonds"
              mandatory
              :title="$t('pm.sheet.bonds')"
              :items="bondsOptions"
            />
          </v-col>
        </v-row>
        <print-option-select
          v-if="cardOptions && isCards"
          v-model="options.card"
          multiple
          :title="$t('pm.titles.cardOptions')"
          :items="cardOptions"
        />
      </fieldset>
    </v-card>
    <v-scroll-y-transition
      v-for="group in includeGroups"
      :key="group.field"
    >
      <v-card
        v-if="group.items.length > 0"
        flat
        tile
      >
        <fieldset class="pa-2">
          <legend class="clipped-small heading h3">{{ group.legend }}&emsp;</legend>
          <print-option-select
            v-model="options[group.field]"
            multiple
            :items="group.items"
          />
        </fieldset>
      </v-card>
    </v-scroll-y-transition>
    <v-card
      v-if="extraOptions && extraOptions.length > 0"
      flat
      tile
    >
      <fieldset class="pa-2">
        <legend class="clipped-small heading h3">{{ $t('pm.print.extras') }}&emsp;</legend>
        <print-option-select
          v-model="options.extras"
          multiple
          :items="extraOptions"
        />
      </fieldset>
    </v-card>
  </v-card-text>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import PrintOptionSelect from './PrintOptionSelect.vue'
  import { LAYOUT, ORIENTATION, PAPER } from '@/ui/print/options'
  import type { PrintOption } from '@/ui/print/types'

  type IncludeGroup = { field: string; legend: string; items: PrintOption[] }

  const props = defineProps<{
    options: any
    layoutOptions?: PrintOption[]
    contentOptions?: PrintOption[]
    bondsOptions?: PrintOption[]
    cardOptions?: PrintOption[]
    includeGroups?: IncludeGroup[]
    extraOptions?: PrintOption[]
  }>()

  const isCards = computed(() => props.options?.layout?.key === LAYOUT.cards.key)

  const orientationOptions = Object.values(ORIENTATION)
  const paperOptions = Object.values(PAPER)
</script>

<style scoped>
  fieldset {
    border-color: rgb(var(--v-theme-primary));
    border-radius: 2px;
    margin-bottom: 12px;
    padding: 4px;
  }

  legend {
    background-color: rgb(var(--v-theme-primary));
    color: #fff;
    padding: 3px 6px;
  }
</style>
