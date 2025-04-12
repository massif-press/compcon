<template>
  <v-dialog
    v-model="searchDialog"
    width="800px"
    max-width="90vw"
    hide-overlay
    opacity="0.65"
    transition="dialog-top-transition">
    <template #activator="{ props }">
      <cc-button v-if="mobile" v-bind="props" icon="mdi-magnify" size="small" class="mx-1" />

      <v-btn v-else v-bind="props" variant="plain" size="small" prepend-icon="mdi-magnify">
        <v-chip label size="x-small" class="px-1 ml-1">{{ hasCmdKey ? 'CMD' : 'CTRL' }} + /</v-chip>
      </v-btn>
    </template>
    <v-card border tile>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        outlined
        autofocus
        hide-details>
        <template #append-inner>
          <v-btn v-if="mobile" icon="mdi-close" variant="text" @click="searchDialog = false" />
          <v-chip v-else label size="x-small" class="px-1" @click="searchDialog = false">
            ESC
          </v-chip>
        </template>
      </v-text-field>
      <v-card-text :class="mobile && 'py-0 px-2'">
        <div v-if="search">
          <v-list density="compact">
            <div class="text-caption font-weight-bold text-uppercase">search results</div>
            <v-scroll-y-transition group>
              <search-result-item
                v-for="r in searchResults"
                :key="r.path"
                :indexItem="r"
                :mobile="mobile"
                @onNav="
                  search = '';
                  searchDialog = false;
                " />
            </v-scroll-y-transition>
          </v-list>
        </div>

        <div v-else>
          <div class="text-caption font-weight-bold text-uppercase">recent searches</div>
          <v-scroll-y-transition group>
            <search-result-item
              v-for="r in recent"
              :key="r.path"
              :indexItem="r"
              @onNav="
                search = '';
                searchDialog = false;
              " />
          </v-scroll-y-transition>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { unCamelCase } from '@/classes/utility/accent_fold';
import { NavStore } from '@/stores';
import SearchResultItem from './searchResultItem.vue';

export default {
  name: 'cc-global-search',
  components: {
    SearchResultItem,
  },
  data: () => ({
    search: '',
    searchDialog: false,
    hasCmdKey: false,
  }),
  created() {
    this.hasCmdKey = navigator.userAgent.includes('Mac');
  },
  mounted() {
    window.addEventListener('keydown', this.handleSearch);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleSearch);
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    searchResults() {
      if (!this.search || this.search.length < 3) return [];

      return NavStore()
        .Index.filter((item) => {
          return item.title.toLowerCase().includes(this.search.toLowerCase());
        })
        .slice(0, 5);
    },
    recent() {
      return NavStore().SearchHistory;
    },
  },
  methods: {
    handleSearch(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        this.search = '';
        this.searchDialog = !this.searchDialog;
      }
      if (event.key === 'Escape') {
        this.searchDialog = false;
      }
      if (event.key === 'Enter') {
        if (this.searchResults.length > 0) {
          this.navTo(this.searchResults[0].path);
        } else {
          this.searchDialog = false;
        }
      }
    },
    navTo(path) {
      //save nav to store
      this.$router.push(path);
      this.searchDialog = false;
    },
    unCamelCase(str) {
      return unCamelCase(str);
    },
  },
};
</script>
