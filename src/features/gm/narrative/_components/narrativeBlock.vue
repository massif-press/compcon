<template>
  <div v-if="!readonly || (readonly && item.NarrativeController.TextItems.length)">
    <v-divider class="my-4" />
    <div class="text-cc-overline mb-2">{{ $t('gm.narrative.additionalDetail') }}</div>
    <section-editor :item="item" :readonly="readonly" />
  </div>

  <div v-if="!readonly || (readonly && item.NarrativeController.Clocks.length)">
    <v-divider class="my-4" />
    <div class="text-cc-overline mb-2">{{ $t('gm.narrative.clocks') }}</div>
    <cc-clock
      v-for="(c, ci) in item.NarrativeController.Clocks"
      :key="`clock-${ci}`"
      :clock="c"
      class="mx-1 my-4"
      :readonly="readonly"
      @delete="item.NarrativeController.DeleteClock(c)" />
    <cc-button
      v-if="!readonly"
      color="primary"
      block
      prepend-icon="mdi-plus"
      size="x-small"
      @click="item.NarrativeController.AddClock()">
      {{ $t('gm.narrative.addClock') }}
    </cc-button>
  </div>

  <div v-if="!readonly || (readonly && item.NarrativeController.Tables.length)">
    <v-divider class="my-4" />
    <div
      v-if="!readonly || (readonly && item.NarrativeController.Tables.length)"
      class="text-cc-overline mb-2">
      {{ $t('gm.narrative.tables') }}
    </div>
    <cc-rollable-table
      v-for="(t, ti) in item.NarrativeController.Tables"
      :key="`table-${ti}`"
      :table="t"
      class="mx-1 my-4"
      :readonly="readonly"
      @delete="item.NarrativeController.DeleteTable(t)" />
    <cc-button
      color="primary"
      block
      prepend-icon="mdi-plus"
      size="x-small"
      @click="item.NarrativeController.AddTable()">
      {{ $t('gm.narrative.addTable') }}
    </cc-button>
  </div>
</template>

<script setup lang="ts">
import SectionEditor from '../../_components/SectionEditor.vue';

defineOptions({ name: 'gm-narrative-block' })

const props = withDefaults(defineProps<{
  item: object
  readonly?: boolean
}>(), {
  readonly: false
})
</script>
