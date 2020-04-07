<template>
  <v-data-table
    v-resize="onResize"
    :headers="headers"
    :items="items"
    :custom-sort="customSort"
    item-key="ID"
    :height="tableHeight"
    hide-default-footer
    disable-pagination
    class="elevation-0 flavor-text"
    calculate-widths
    fixed-header
    show-select
    single-select
    style="text-transform: uppercase; background-color: transparent"
  >
    <template v-slot:item.data-table-select="{ item }">
      <cc-tooltip simple inline :content="`Equip ${item.Name}`">
        <v-btn icon color="accent" dark @click="$emit('equip', item)">
          <v-icon large>cci-accuracy</v-icon>
        </v-btn>
      </cc-tooltip>
    </template>
    <template v-slot:item.Name="{ item }">
      <span class="stat-text">{{ item.Name }}</span>
    </template>
    <template v-slot:item.Damage[0].Max="{ item }">
      <cc-damage-element small :damage="item.Damage" />
    </template>
    <template v-slot:item.Range[0].Max="{ item }">
      <cc-range-element small :range="item.Range" />
    </template>
    <template v-slot:item.Detail="{ item }">
      <v-icon color="accent" @click="$refs[`modal_${item.ID}`].show()">
        mdi-information-outline
      </v-icon>
      <cc-search-result-modal :ref="`modal_${item.ID}`" :item="item" />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'selector-table-view',
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    tableHeight: 535,
  }),
  mounted() {
    this.onResize()
  },
  methods: {
    customSort(items, index, descending) {
      const desc = descending[0]
      items.sort((a, b) => {
        if (index[0] === 'Damage[0].Max') {
          return desc ? b.Damage[0].Max - a.Damage[0].Max : a.Damage[0].Max - b.Damage[0].Max
        } else if (index[0] === 'Range[0].Max') {
          return desc ? b.Range[0].Max - a.Range[0].Max : a.Range[0].Max - b.Range[0].Max
        } else {
          return desc ? (a[index[0]] < b[index[0]] ? -1 : 1) : b[index[0]] < a[index[0]] ? -1 : 1
        }
      })
      return items
    },
    onResize() {
      this.tableHeight = window.innerHeight - 215
    },
  },
})
</script>
