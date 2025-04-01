<template>
  <div class="printable">
    <v-card
      tile
      flat
      :class="options.orientation"
      class="print-card"
      style="margin-left: auto; margin-right: auto">
      <div v-if="selectedNpcs.length">
        <layout :options="options" :npcs="selectedNpcs" />
        <div v-if="options && options.extras">
          <page-break v-if="options.extras.includes('relevant tag reference')" />
          <tag-info-print
            v-if="options.extras.includes('relevant tag reference')"
            :npcs="selectedNpcs" />
        </div>
      </div>

      <!-- {{ options }} -->
      <v-bottom-navigation fixed grow horizontal color="primary" class="no-print pa-2">
        <v-btn stacked @click="$router.go(-1)">
          <span>Close Preview</span>
          <v-icon icon="mdi-close" />
        </v-btn>
        <v-select
          v-model="selectedNpcs"
          multiple
          :items="allNpcs"
          :item-title="(x: Npc) => `${x.Name} `"
          return-object
          density="compact"
          hide-details
          variant="outlined"
          label="Npc"
          class="mx-3"
          clearable>
          <template #selection="{ item, index }">
            <v-chip v-if="index < 4">
              <span>{{ item.title }}</span>
            </v-chip>
            <span v-if="index === 4" class="text-grey text-caption align-self-center">
              (+{{ selectedNpcs.length - 4 }} others)
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

        <cc-modal>
          <template #activator="{ open }">
            <v-btn @click="open">
              <span>Options</span>
              <v-icon icon="mdi-cog" />
            </v-btn>
          </template>
          <options-dialog ref="options" @set="setOptions($event)" />
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

import TagInfoPrint from './extras/TagInfoPrint.vue';

import OptionsDialog from './OptionsDialog.vue';

import { NpcStore } from '@/stores';
import PageBreak from './components/PageBreak.vue';
import { Npc } from '@/classes/npc/Npc';

export default {
  name: 'combined-print',
  components: {
    Layout,
    OptionsDialog,
    PageBreak,
    TagInfoPrint,
  },
  props: {
    ids: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    selectedNpcs: [] as Npc[],
    options: {} as any,
  }),
  created() {
    if (!this.ids) return;
    let idArr = typeof this.ids === 'string' ? JSON.parse(this.ids) : this.ids;
    this.selectedNpcs = idArr.map((x) => NpcStore().Npcs.find((p) => p.ID === x) as Npc);
  },
  computed: {
    allNpcs() {
      return NpcStore().Npcs.filter((x) => !x.SaveController.IsDeleted);
    },
    selectIcon() {
      return this.selectedNpcs.length === this.allNpcs.length
        ? 'mdi-checkbox-marked'
        : this.selectedNpcs.length
          ? 'mdi-minus-box'
          : 'mdi-checkbox-blank-outline';
    },
  },
  methods: {
    print() {
      window.print();
    },
    toggle() {
      if (this.selectedNpcs.length === this.allNpcs.length) this.selectedNpcs = [];
      else this.selectedNpcs = this.allNpcs.slice();
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
.portrait {
  background-color: white !important;
  width: 210mm;
}

.landscape {
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
