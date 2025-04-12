<template>
  <div class="printable">
    <v-card
      tile
      flat
      :class="options.orientation.title"
      class="print-card"
      style="margin-left: auto; margin-right: auto">
      <div v-if="selectedItems.length">
        <layout :options="options" :items="selectedItems" />
      </div>

      <v-bottom-navigation fixed grow horizontal color="primary" class="no-print pa-2">
        <v-btn stacked @click="$router.go(-1)">
          <span>Close Preview</span>
          <v-icon icon="mdi-close" />
        </v-btn>
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

        <v-spacer />

        <cc-modal title="Print Options" icon="mdi-cog">
          <template #activator="{ open }">
            <v-btn @click="open">
              <span>Options</span>
              <v-icon icon="mdi-cog" />
            </v-btn>
          </template>
          <options-dialog :options="options" />
        </cc-modal>
        <v-btn @click="print()">
          <span>Print</span>
          <v-icon icon="mdi-printer" />
        </v-btn>
      </v-bottom-navigation>
    </v-card>
    <div class="no-print" style="min-height: 70px !important" />
  </div>
</template>

<script lang="ts">
import Layout from './layouts/index.vue';

import OptionsDialog from './OptionsDialog.vue';

import { NarrativeStore } from '@/stores';
import PageBreak from './components/PageBreak.vue';
import { CollectionItem } from '@/classes/narrative/CollectionItem';
import { options } from 'marked';

export default {
  name: 'combined-print',
  components: {
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
    print() {
      window.print();
    },
    toggle() {
      if (this.selectedItems.length === this.allItems.length) this.selectedItems = [];
      else this.selectedItems = this.allItems.slice();
    },
    setOptions(options) {
      let out = {};
      for (const key in options) {
        if (Array.isArray(options[key])) {
          out[key] = options[key].map((x) => x.title.toLowerCase());
        } else {
          out[key] = options[key].title.toLowerCase();
        }
      }
      this.options = out;
    },
  },
};
</script>

<style>
.v-application .caption {
  line-height: normal !important;
}
</style>

<style scoped>
.Portrait {
  background-color: white !important;
  width: 210mm;
}

.Landscape {
  background-color: white !important;
  width: 297mm;
}

.print-card {
  background-color: white;
  color: black;
  margin-top: 16px;
}

@page {
  margin: 0;
  padding: 0;
}

@media print {
  @page {
    size: portrait;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0;
    padding: 0;
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    background-color: white !important;
    overflow: visible;
  }

  .print-card {
    margin: 0;
    padding: 0;
    width: 100% !important;
    overflow: visible;
  }

  .printable {
    /* zoom: 75%; */
    width: 100% !important;
    max-width: 100% !important;
    background-color: white;
    margin: 0 !important;
    padding: 0 !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    overflow: visible;
  }
}
</style>
