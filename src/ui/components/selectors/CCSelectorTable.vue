<template>
  <v-container fluid>
    <v-row class="mx-2 mt-n2 mb-2" no-gutters align="center">
      <v-col>
        <slot />
      </v-col>
      <v-col cols="auto" class="ml-auto mr-5">
        <slot name="extra-item" />
      </v-col>
      <v-col cols="auto" class="mr-1">
        <v-btn-toggle v-model="profile.SelectorView" mandatory>
          <v-btn small icon value="split">
            <v-icon color="accent">mdi-view-split-vertical</v-icon>
          </v-btn>
          <v-btn small icon value="list">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn small icon value="cards" disabled>
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-divider vertical class="mx-2" />
      <v-col cols="3" class="ml-auto mr-5">
        <v-text-field
          v-model="search"
          class="search-field"
          prepend-icon="search"
          flat
          hide-actions
          single-line
          dense
          placeholder="Search"
          clearable
          persistent-hint
          :hint="`${fItems.length} Items`"
        />
      </v-col>
      <cc-filter-panel v-if="!noFilter" :item-type="itemType" @set-filters="setFilters" />
    </v-row>
    <selector-table-view
      v-if="profile.SelectorView === 'list'"
      :headers="headers"
      :items="fItems"
      @equip="$emit('equip', $event)"
    />
    <selector-split-view
      v-else-if="profile.SelectorView === 'split'"
      :headers="headers"
      :items="fItems"
      @equip="$emit('equip', $event)"
    />
    <div v-else />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemFilter from '@/classes/utility/ItemFilter'
import SelectorTableView from './views/_SelectorTableView.vue'
import SelectorSplitView from './views/_SelectorSplitView.vue'
import { accentInclude } from '@/classes/utility/accent_fold'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { UserProfile } from '@/io/User'

export default Vue.extend({
  name: 'cc-selector-table',
  components: { SelectorTableView, SelectorSplitView },
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    noFilter: {
      type: Boolean,
      required: false,
    },
    itemTypeFallback: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    search: '',
    filters: {},
    itemType: '',
  }),
  computed: {
    profile(): UserProfile {
      const store = getModule(CompendiumStore, this.$store)
      return store.UserProfile
    },
    fItems() {
      const vm = this as any
      let i = vm.items

      if (vm.search) i = i.filter(x => accentInclude(x.Name, vm.search))

      if (Object.keys(vm.filters).length) {
        i = ItemFilter.Filter(i, vm.filters)
      }

      return i
    },
  },
  created() {
    if (!this.itemType) this.itemType = this.itemTypeFallback
  },
  methods: {
    setFilters(newFilter) {
      this.filters = newFilter
    },
  },
})
</script>

<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
