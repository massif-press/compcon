<template>
  <print-page-shell :orientation="options.orientation.title">
    <div v-if="selectedItems.length">
      <layout :options="options" :items="selectedItems" />
    </div>

    <template #selector>
      <v-select
        v-model="selectedItems"
        multiple
        :items="allItems"
        item-title="Name"
        return-object
        density="compact"
        hide-details
        variant="outlined"
        label="Items"
        class="mx-3"
        clearable>
        <template #selection="{ item, index }">
          <v-chip v-if="index < 4">
            <span>{{ item.title }}</span>
          </v-chip>
          <span v-if="index === 4" class="text-grey text-caption align-self-center">
            (+{{ selectedItems.length - 4 }} others)
          </span>
        </template>
        <template #prepend-item>
          <v-list-item ripple @click="toggle">
            <v-icon :icon="selectIcon" class="ml-2 mr-1" />
            Select All
          </v-list-item>
          <v-divider class="mt-2" />
        </template>
      </v-select>
    </template>

    <template #options-dialog>
      <options-dialog :options="options" />
    </template>
  </print-page-shell>
</template>

<script lang="ts">
import PrintPageShell from '@/ui/components/print/PrintPageShell.vue';
import Layout from './layouts/index.vue';
import OptionsDialog from './OptionsDialog.vue';
import { NarrativeStore } from '@/stores';
import PageBreak from '@/features/pilot_management/Print/components/PageBreak.vue';
import { CollectionItem } from '@/classes/narrative/CollectionItem';

export default {
  name: 'combined-print',
  components: {
    PrintPageShell,
    Layout,
    OptionsDialog,
    PageBreak,
  },
  props: {
    ids: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    selectedItems: [] as CollectionItem[],
    options: {
      layout: { title: 'Standard', icon: 'mdi-book-open' },
      orientation: { title: 'Portrait', icon: 'mdi-file' },
      paper: { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      include: [],
      extras: [],
      card: [],
    } as any,
  }),
  mounted() {
    if (!this.ids) return;
    let idArr = typeof this.ids === 'string' ? JSON.parse(this.ids) : this.ids;
    this.selectedItems = idArr.map(
      (x) => NarrativeStore().CollectionItems.find((p) => p.ID === x) as CollectionItem
    );
    this.selectedItems = this.selectedItems.filter((x) => !!x);
  },
  computed: {
    allItems() {
      return NarrativeStore().CollectionItems.filter((x) => !x.SaveController.IsDeleted);
    },
    selectIcon() {
      return this.selectedItems.length === this.allItems.length
        ? 'mdi-checkbox-marked'
        : this.selectedItems.length
          ? 'mdi-minus-box'
          : 'mdi-checkbox-blank-outline';
    },
  },
  methods: {
    toggle() {
      if (this.selectedItems.length === this.allItems.length) this.selectedItems = [];
      else this.selectedItems = this.allItems.slice();
    },
  },
};
</script>
