<template>
  <v-row>
    <v-col cols="3" style="max-width: 325px !important">
      <v-list density="compact" nav class="side-fixed" color="panel" v-model:opened="open">
        <v-alert
          v-show="title"
          variant="outlined"
          class="mb-3 py-1"
          style="border-color: rgb(var(--v-theme-primary))"
        >
          <div class="heading h3 text-center text-primary">{{ title }}</div>
        </v-alert>
        <v-btn-toggle
          v-model="group"
          mandatory
          divided
          variant="plain"
          border
          color="primary"
          density="compact"
          style="width: 100%; height: 30px"
          class="mb-2"
        >
          <v-tooltip text="Group by Content Pack" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" value="lcp" icon style="width: 50%"
                ><v-icon icon="cc:content_manager"
              /></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="No Grouping" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" value="none" size="small" icon style="width: 50%"
                ><v-icon icon="mdi-cancel"
              /></v-btn>
            </template>
          </v-tooltip>
        </v-btn-toggle>

        <v-btn-toggle
          mandatory
          divided
          variant="plain"
          border
          color="primary"
          density="compact"
          style="width: 100%; height: 30px"
        >
          <v-menu offset-y :close-on-content-click="false" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="small" style="width: 50%">
                <v-tooltip text="Content Packs" location="top">
                  <template v-slot:activator="{ props }">
                    <span v-bind="props">
                      <v-icon size="x-large" icon="cc:content_manager" start />
                      <v-chip size="x-small"
                        ><b>{{ lcpFilter.length }}</b></v-chip
                      >
                    </span>
                  </template>
                </v-tooltip>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-list>
                  <v-list-item title="Select All">
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :model-value="lcpFilter.length === lcps.length"
                        :indeterminate="lcpFilter.length > 0 && lcpFilter.length < lcps.length"
                        @click="setAllLcps()"
                      />
                    </template>
                  </v-list-item>
                  <v-divider />
                  <v-list-item v-for="lcp in lcps" :title="lcp">
                    <template v-slot:prepend>
                      <v-checkbox-btn v-model="lcpFilter" :value="lcp" />
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-menu>

          <v-menu offset-y :close-on-content-click="false" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="small" style="width: 50%">
                <v-tooltip text="Item Filters" location="top">
                  <template v-slot:activator="{ props }">
                    <span v-bind="props">
                      <v-icon size="large" icon="mdi-filter" start />
                      <v-chip size="x-small"
                        ><b>{{ otherFilterCount }}</b></v-chip
                      >
                    </span>
                  </template>
                </v-tooltip>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <cc-item-filter :item-type="itemType" @set-filters="otherFilter = $event" />
              </v-card-text>
            </v-card>
          </v-menu>
        </v-btn-toggle>

        <v-text-field
          v-model="search"
          item-title="Name"
          prepend-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mt-2"
        />
        <v-divider class="mt-2" />

        <div v-if="group === 'lcp'">
          <v-list-group
            v-for="lcp in lcps.filter((l) => lcpFilter.includes(l))"
            :value="lcp"
            color="accent"
            class="pt-0"
          >
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <span class="text-button">
                    <b>{{ lcp }}</b>
                  </span>
                </template></v-list-item
              >
            </template>

            <v-list-item v-for="item in getItems(lcp)" @click="selectItem(item as CompendiumItem)">
              <template #title>
                <span class="text-button">
                  {{ (item as CompendiumItem).Name }}
                </span>
              </template>
            </v-list-item>
          </v-list-group>
        </div>

        <div v-else>
          <v-list-item v-for="item in shownItems" @click="selectItem(item as CompendiumItem)">
            <template #title>
              <v-icon start class="ml-3" :icon="(item as CompendiumItem).Icon" />
              <span class="text-button">
                {{ (item as CompendiumItem).Name }}
              </span>
            </template>
          </v-list-item>
        </div>
      </v-list>
    </v-col>

    <v-col class="pl-6">
      <v-container id="content" style="height: calc(100vh - 65px) !important; overflow-y: scroll">
        <v-row>
          <v-col cols="12" v-for="item in shownItems" :id="(item as CompendiumItem).ID">
            <selector-list-item :item="(item as CompendiumItem)" />
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import ItemFilter from '@/classes/utility/ItemFilter';
import _ from 'lodash';
import SelectorListItem from './items/_selectorListItem.vue';
import { CompendiumItem } from '@/class';

export default {
  name: 'cc-selector',
  components: { SelectorListItem },
  emits: ['equip'],
  props: {
    items: {
      type: Array,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
    },
    initialGroup: {
      type: String,
      default: 'lcp',
    },
    title: {
      type: String,
    },
  },
  data: () => ({
    open: [] as string[],
    group: 'lcp',
    search: '',
    otherFilter: {},
    lcpFilter: [] as string[],
    selectedItem: null as CompendiumItem | null,
  }),
  watch: {
    group() {
      this.open = [...this.lcps];
    },
  },
  created() {
    this.group = this.initialGroup;
  },
  mounted() {
    this.lcpFilter = this.lcps;
    this.open = [...this.lcps];
  },
  computed: {
    otherFilterCount() {
      let count = 0;
      for (const filter of Object.keys(this.otherFilter)) {
        count += Object.keys(this.otherFilter[filter]).length;
      }
      return count;
    },
    itemsByLcp() {
      return _.groupBy(this.items, 'LcpName');
    },
    lcps() {
      return Object.keys(this.itemsByLcp);
    },
    shownItems() {
      let shown = this.items;
      shown = shown.filter((i: any) => this.lcpFilter.includes(i.LcpName));
      if (this.search) {
        shown = shown.filter((i: any) => i.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      if (Object.keys(this.otherFilter).length) {
        shown = ItemFilter.Filter(shown as CompendiumItem[], this.otherFilter);
      }
      return shown;
    },
  },
  methods: {
    getItems(lcp?: string) {
      if (lcp) return this.itemsByLcp[lcp];

      return this.shownItems;
    },
    selectItem(item: CompendiumItem) {
      this.selectedItem = item;
      this.scrollTo(item.ID);
    },
    scrollTo(id: string): void {
      const el = document.getElementById(id);

      if (el) {
        const yOffset = -70;
        const mEl = document.getElementById('content');
        if (!mEl) return;
        const y = el.getBoundingClientRect().top + mEl.scrollTop + yOffset;
        mEl.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
    getTitle(title: string) {
      let t = title.replace(/\b(?:book|data|lancer)\b/gi, ' ');
      t = t.length > 20 ? t.substring(0, 19) + '…' : t;
      return t;
    },
    setAllLcps() {
      if (this.lcpFilter.length === this.lcps.length) {
        this.lcpFilter = [];
      } else {
        this.lcpFilter = this.lcps;
      }
    },
  },
};
</script>

<style scoped>
.side-fixed {
  height: calc(100vh - 64px);
  overflow-y: scroll;
  top: 48px;
  bottom: 0;
  /* padding-bottom: 35px; */
  position: fixed;
  width: 23vw;
  max-width: 325px !important;
}
</style>
