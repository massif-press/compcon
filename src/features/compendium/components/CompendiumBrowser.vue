<template>
  <v-container fluid>
    <v-row class="mx-2 mt-n2 mb-2" no-gutters align="center">
      <v-col cols="auto">
        <h1 class="ml-n2 heading accent--text"><slot /></h1>
      </v-col>
      <v-col cols="auto" class="ml-4 mr-2">
        <v-btn-toggle :value="profile.GetView('selector')" mandatory>
          <v-btn
            v-show="!lockView"
            small
            icon
            value="split"
            @click="profile.SetView('selector', 'split')"
          >
            <v-icon color="accent">mdi-view-split-vertical</v-icon>
          </v-btn>
          <v-btn small icon value="list" @click="profile.SetView('selector', 'list')">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn small icon value="cards" @click="profile.SetView('selector', 'cards')">
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" md="3" class="ml-auto mr-5">
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
      <cc-filter-panel :item-type="itemType" @set-filters="setFilters" />
    </v-row>
    <div>
      <div v-if="profile.GetView('selector') === 'split' || lockView">
        <compendium-mobile-view v-if="$vuetify.breakpoint.smAndDown" :items="fItems" />
        <compendium-split-view v-else :items="fItems" />
      </div>
      <compendium-table-view
        v-else-if="profile.GetView('selector') === 'list'"
        :items="fItems"
        :headers="headers"
      />
      <compendium-cards-view v-else-if="profile.GetView('selector') === 'cards'" :items="fItems" />
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemFilter from '@/classes/utility/ItemFilter'
import { accentInclude } from '@/classes/utility/accent_fold'
import CompendiumMobileView from './views/CompendiumMobileView.vue'
import CompendiumSplitView from './views/CompendiumSplitView.vue'
import CompendiumCardsView from './views/CompendiumCardsView.vue'
import CompendiumTableView from './views/CompendiumTableView.vue'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { UserProfile } from '@/user'

export default Vue.extend({
  name: 'compendium-browser',
  components: {
    CompendiumMobileView,
    CompendiumTableView,
    CompendiumSplitView,
    CompendiumCardsView,
  },
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
    lockView: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    search: '',
    filters: {},
    itemType: '',
  }),
  computed: {
    profile(): UserProfile {
      const store = getModule(UserStore, this.$store)
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
    this.itemType = this.items && this.items.length ? this.items[0].ItemType : ''
  },
  methods: {
    setFilters(newFilter) {
      this.filters = newFilter
    },
  },
})
</script>
