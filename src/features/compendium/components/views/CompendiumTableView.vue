<template>
  <v-data-table
    v-resize="onResize"
    :headers="headers"
    :items="items"
    item-key="ID"
    :height="tableHeight"
    hide-default-footer
    disable-pagination
    class="elevation-0 flavor-text background"
    calculate-widths
    fixed-header
    multi-sort
    show-select
    single-select
  >
    <template v-slot:item.data-table-select="{ item }">
      <v-btn x-small fab color="primary" dark @click="$refs[`modal_${item.ID}`].show()">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <cc-search-result-modal :ref="`modal_${item.ID}`" :item="item" />
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
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'compendium-table-view',
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
    itemType: '',
    tableHeight: 500,
  }),
  mounted() {
    this.onResize()
  },
  methods: {
    customSort(items, index, descending) {
      const desc = descending[0]
      items.sort((a, b) => {
        index.forEach(idx => {
          if (idx === 'Damage') {
            return desc ? b.Damage[0].Max - a.Damage[0].Max : a.Damage[0].Max - b.Damage[0].Max
          } else if (idx === 'Range') {
            return desc ? b.Range[0].Max - a.Range[0].Max : a.Range[0].Max - b.Range[0].Max
          } else {
            return desc ? (a[idx] < b[idx] ? -1 : 1) : b[idx] < a[idx] ? -1 : 1
          }
        })
      })
      return items
    },
    onResize() {
      this.tableHeight = window.innerHeight - 160
    },
  },
})
</script>

<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
</style>
