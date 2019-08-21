<template>
  <v-container fluid>
    <v-layout>
      <v-spacer />
      <v-flex xs3>
        <v-text-field
          class="search-field"
          prepend-icon="search"
          v-model="search"
          flat
          hide-actions
          single-line
          placeholder="Search"
          clearable
        />
      </v-flex>
      <v-flex shrink mx-2>
        <!-- <v-btn fab small color="primary" dark @click="$refs.fpanel.show()">
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>-->
        <cc-filter-panel ref="fpanel" />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="fItems"
          :custom-sort="customSort"
          item-key="id"
          hide-default-footer
          disable-pagination
          class="elevation-0 flavor-text"
          calculate-widths
          fixed-header
          show-select
          single-select
        >
          <template v-slot:item.data-table-select="{ item }">
            <v-btn x-small fab color="primary" dark @click="$refs[`modal_${item.ID}`].show()">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <search-result-modal :item="item" :ref="`modal_${item.ID}`" />
          </template>
          <template v-slot:item.Name="{ item }">
            <span class="stat-text">{{item.Name}}</span>
          </template>
          <template v-slot:item.Damage="{ item }">
            <cc-damage-element small :damage="item.Damage" />
          </template>
          <template v-slot:item.Range="{ item }">
            <cc-range-element small :range="item.Range" />
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchResultModal from './SearchResultModal.vue'

export default Vue.extend({
  name: 'frames',
  components: { SearchResultModal },
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
    search: '',
    filter: [],
  }),
  computed: {
    fItems() {
      var vm = this as any
      let i = vm.items

      if (vm.search) i = i.filter(x => x.Name.toUpperCase().includes(vm.search.toUpperCase()))

      // if (vm.filter.length) {
      //   i = i.filter(x => x.Mechtype.some(y => vm.filter.includes(y)))
      // }

      return i
    },
  },
  methods: {
    customSort(items, index, descending) {
      const desc = descending[0]
      const idx = index[0]
      items.sort((a, b) => {
        if (index[0] === 'Damage') {
          return desc ? b.Damage[0].Max - a.Damage[0].Max : a.Damage[0].Max - b.Damage[0].Max
        } else if (index[0] === 'Range') {
          return desc ? b.Range[0].Max - a.Range[0].Max : a.Range[0].Max - b.Range[0].Max
        } else {
          return desc ? (a[index[0]] < b[index[0]] ? -1 : 1) : b[index[0]] < a[index[0]] ? -1 : 1
        }
      })
      return items
    },
  },
})
</script>