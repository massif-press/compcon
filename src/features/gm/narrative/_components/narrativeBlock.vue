<template>
  <div v-if="!readonly || (readonly && item.NarrativeController.TextItems.length)">
    <v-divider class="my-4" />
    <div class="text-cc-overline mb-2">ADDITIONAL DETAIL</div>
    <section-editor :item="item" :readonly="readonly" />
  </div>

  <div v-if="!readonly || (readonly && item.NarrativeController.Clocks.length)">
    <v-divider class="my-4" />
    <div class="text-cc-overline mb-2">CLOCKS</div>
    <cc-clock
      v-for="c in item.NarrativeController.Clocks"
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
      Add New Clock
    </cc-button>
  </div>

  <div v-if="!readonly || (readonly && item.NarrativeController.Tables.length)">
    <v-divider class="my-4" />
    <div
      v-if="!readonly || (readonly && item.NarrativeController.Tables.length)"
      class="text-cc-overline mb-2">
      TABLES
    </div>
    <cc-rollable-table
      v-for="t in item.NarrativeController.Tables"
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
      Add New Table
    </cc-button>
  </div>
</template>

<script>
import SectionEditor from '../../_components/SectionEditor.vue';

export default {
  name: 'gm-narrative-block',
  components: { SectionEditor },
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
};
</script>
