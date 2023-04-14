<template>
  <v-container fluid>
    <v-row class="mx-2 my-1" no-gutters align="center">
      <v-col cols="auto">
        <h1
          class="ml-n2 heading text-accent"
          v-text="Array.isArray(items) ? title : items"
        />
      </v-col>
      <v-col cols="auto" class="ml-4 mr-2">
        <v-btn-toggle :value="getView" mandatory>
          <v-btn
            v-show="!lockView"
            icon
            value="split"
            @click="profile.SetView('selector', 'split')"
          >
            <v-icon color="accent">mdi-view-split-vertical</v-icon>
          </v-btn>
          <v-btn icon value="list" @click="profile.SetView('selector', 'list')">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn
            icon
            value="cards"
            @click="profile.SetView('selector', 'cards')"
          >
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-spacer />
      <v-col cols="12" md="3" class="mt-2 mr-5">
        <v-text-field
          v-model="search"
          class="search-field"
          prepend-icon="search"
          flat
          hide-actions
          single-line
          density="compact"
          placeholder="Search"
          clearable
          persistent-hint
          :hint="`${fItems.length} Items`"
        />
      </v-col>
      <cc-filter-panel
        v-if="!noFilter"
        :item-type="itemType"
        @set-filters="setFilters"
      />
    </v-row>
    <div>
      <div v-if="getView === 'split' || lockView">
        <compendium-mobile-view
          v-if="$vuetify.display.smAndDown"
          :items="fItems"
        />
        <compendium-split-view v-else :items="fItems" />
      </div>
      <compendium-table-view
        v-else-if="getView === 'list'"
        :items="fItems"
        :headers="headers"
      />
      <compendium-cards-view v-else-if="getView === 'cards'" :items="fItems" />
    </div>
  </v-container>
</template>

<script lang="ts">
import ItemFilter from '@/classes/utility/ItemFilter';
import { accentInclude } from '@/classes/utility/accent_fold';
import CompendiumMobileView from './views/CompendiumMobileView.vue';
import CompendiumSplitView from './views/CompendiumSplitView.vue';
import CompendiumCardsView from './views/CompendiumCardsView.vue';
import CompendiumTableView from './views/CompendiumTableView.vue';
import { UserStore, CompendiumStore } from '@/stores';
import { UserProfile } from '@/user';
import _ from 'lodash';

export default {
  name: 'compendium-browser',
  components: {
    CompendiumMobileView,
    CompendiumTableView,
    CompendiumSplitView,
    CompendiumCardsView,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: [Array, String],
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
  async mounted() {
    await UserStore().getUserProfile();
  },
  computed: {
    profile(): UserProfile {
      return UserStore().UserProfile as UserProfile;
    },
    getView() {
      if (this.profile && Object.keys(this.profile).length > 0)
        return this.profile.GetView('selector');
      return 'split';
    },
    fItems() {
      let i = Array.isArray(this.items)
        ? this.items
        : CompendiumStore()[this.itemType.replace(' ', '')];

      if (this.search) i = i.filter((x) => accentInclude(x.Name, this.search));

      if (Object.keys(this.filters).length) {
        i = ItemFilter.Filter(i, this.filters);
      }

      const canShowExotics =
        this.profile &&
        Object.keys(this.profile).length > 0 &&
        this.profile.GetView('showExotics');

      if (!canShowExotics) i = i.filter((x) => !x.IsExotic);

      const sourceIds = CompendiumStore().Manufacturers.map((x) => x.ID);

      _.orderBy(i, [(item) => sourceIds.indexOf(item.Source), 'Name']);

      return i.filter((x) => !x.IsHidden);
    },
  },
  created() {
    this.itemType =
      this.items && !Array.isArray(this.items)
        ? this.items
        : this.items.length
        ? (this.items[0] as any).ItemType
        : '';
  },
  methods: {
    setFilters(newFilter) {
      this.filters = newFilter;
    },
  },
};
</script>
