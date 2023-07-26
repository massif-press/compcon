<template>
  <v-row>
    <v-col cols="3" style="max-width: 325px !important">
      <v-list density="compact" nav class="side-fixed" color="panel" v-model:opened="open">
        <v-btn-toggle
          v-model="view"
          mandatory
          divided
          variant="plain"
          border
          color="primary"
          density="compact"
          style="width: 100%; height: 30px"
          class="mb-2"
        >
          <v-btn value="list" icon size="small" style="width: 33%"
            ><v-icon size="25" icon="mdi-view-list"
          /></v-btn>
          <v-btn value="table" icon size="small" style="width: 33%"
            ><v-icon size="25" icon="mdi-table"
          /></v-btn>
          <v-btn value="cards" icon size="small" style="width: 33%"
            ><v-icon size="25" icon="mdi-card-multiple-outline"
          /></v-btn>
        </v-btn-toggle>
        <v-btn-toggle
          v-model="group"
          mandatory
          divided
          variant="plain"
          border
          color="primary"
          density="compact"
          style="width: 100%; height: 25px"
          class="mb-2"
        >
          <v-btn value="source" size="x-small" class="py-0" style="width: 33%">By Source</v-btn>
          <v-btn value="lcp" size="x-small" class="py-0" style="width: 33%">By LCP</v-btn>
          <v-btn value="none" size="x-small" class="py-0" style="width: 33%">No Group</v-btn>
        </v-btn-toggle>
        <v-select
          v-model="filter"
          :items="lcps"
          prepend-icon="mdi-filter"
          density="compact"
          hide-details
          variant="outlined"
          multiple
        >
          <template v-slot:prepend-item>
            <v-list-item title="Select All" @click="setAllLcps()">
              <template v-slot:prepend>
                <v-checkbox-btn
                  :model-value="filter.length === lcps.length"
                  :indeterminate="filter.length > 0 && filter.length < lcps.length"
                />
              </template>
            </v-list-item>
            <v-divider />
          </template>

          <template v-slot:selection="{ item, index }">
            <v-chip size="x-small" v-if="index < 2">{{ getTitle(item.title) }}</v-chip>
            <span v-if="index === 2" class="text-grey text-caption">
              (+{{ filter.length - 2 }} others)
            </span>
          </template>
        </v-select>
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
            v-for="lcp in lcps.filter((l) => filter.includes(l))"
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

            <v-list-group
              v-for="manufacturer in manufacturersByLcp[lcp]"
              :value="`${lcp}_${manufacturer}`"
              color="accent"
              class="pt-0"
            >
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <template #title>
                    <cc-logo
                      v-if="mf(manufacturer).LogoIsExternal"
                      :source="mf(manufacturer)"
                      size="small"
                      class="pt-3 mb-n1 mr-2"
                    />
                    <v-icon
                      v-else
                      size="30"
                      :icon="mf(manufacturer).Icon"
                      :color="mf(manufacturer).GetColor($vuetify.theme.current.dark)"
                      start
                    />
                    <span class="text-button">
                      <b>{{ manufacturer }}</b>
                    </span>
                  </template></v-list-item
                >
              </template>
              <v-list-item
                v-for="item in getItems(manufacturer, lcp)"
                @click="selectItem(item as CompendiumItem)"
              >
                <template #title>
                  <v-icon start class="ml-3" :icon="(item as CompendiumItem).Icon" />
                  <span class="text-button">
                    {{ (item as CompendiumItem).Name }}
                  </span>
                </template>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </div>
        <div v-else-if="group === 'source'">
          <v-list-group
            v-for="manufacturer in manufacturers"
            :value="manufacturer"
            color="accent"
            class="pt-0"
          >
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <cc-logo
                    v-if="mf(manufacturer).LogoIsExternal"
                    :source="mf(manufacturer)"
                    size="small"
                    class="pt-3 mb-n1 mr-2"
                  />
                  <v-icon
                    v-else
                    size="30"
                    :icon="mf(manufacturer).Icon"
                    :color="mf(manufacturer).GetColor($vuetify.theme.current.dark)"
                    start
                  />
                  <span class="text-button">
                    <b>{{ manufacturer }}</b>
                  </span>
                </template></v-list-item
              >
            </template>
            <v-list-item
              v-for="item in getItems(manufacturer)"
              @click="selectItem(item as CompendiumItem)"
            >
              <template #title>
                <v-icon start class="ml-3" :icon="(item as CompendiumItem).Icon" />
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

    <v-col class="pl-6 pr-8">
      <v-container id="content" style="height: calc(100vh - 35px) !important; overflow-y: scroll">
        <v-alert
          v-show="!!$slots.header"
          variant="outlined"
          class="mt-n2 mb-3 py-1"
          style="border-color: rgb(var(--v-theme-primary))"
        >
          <slot name="header"> </slot>
        </v-alert>

        <v-row v-if="view === 'list'">
          <v-col cols="12">
            <selector-list-item :item="(selectedItem as CompendiumItem)" />
          </v-col>
        </v-row>
        <v-row v-else-if="view === 'table'">
          <v-col v-if="group === 'lcp'" cols="12">
            <div v-for="lcp in filter">
              <div class="heading mech" v-text="lcp" />
              <selector-table
                :headers="tableHeaders"
                :items="itemsByLcp[lcp]"
                :selected="(selectedItem as any)"
              />
            </div>
          </v-col>
          <v-col v-else-if="group === 'source'" cols="12">
            <div v-for="manufacturer in manufacturers">
              <v-row align="center">
                <v-col cols="auto">
                  <cc-logo
                    v-if="mf(manufacturer).LogoIsExternal"
                    :source="mf(manufacturer)"
                    size="x-large"
                    class="pt-3 mb-n1"
                  />
                  <v-icon
                    v-else
                    size="60"
                    :icon="mf(manufacturer).Icon"
                    :color="mf(manufacturer).GetColor($vuetify.theme.current.dark)"
                  />
                </v-col>
                <v-col>
                  <div class="heading mech" v-text="manufacturer" />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <selector-table
                    :headers="tableHeaders"
                    :items="getItems(manufacturer)"
                    :selected="(selectedItem as any)"
                  />
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col v-else cols="12">
            <v-row>
              <v-col>
                <selector-table
                  :headers="tableHeaders"
                  :items="shownItems"
                  :selected="(selectedItem as any)"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-else-if="view === 'cards'">
          <selector-card-item
            v-for="item in shownItems"
            :id="(item as any).ID"
            :item="(item as CompendiumItem)"
            :highlighted="selectedItem ? (selectedItem as any).ID === (item as any).ID : false"
          />
        </v-row>
        <div style="height: 30px" />
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import _ from 'lodash';
import SelectorListItem from './items/_selectorListItem.vue';
import SelectorCardItem from './items/_selectorCardItem.vue';
import SelectorTable from './items/_selectorTable.vue';
import { CompendiumItem } from '@/class';
import { CompendiumStore } from '../store';

export default {
  name: 'cc-selector',
  components: { SelectorListItem, SelectorCardItem, SelectorTable },
  emits: ['equip'],
  props: {
    items: {
      type: Array,
      required: true,
    },
    hiddenItems: {
      type: Array,
      default: () => [],
    },
    itemType: {
      type: String,
      required: true,
    },
    tableHeaders: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    open: [] as string[],
    view: 'list',
    group: 'source',
    search: '',
    filter: [] as string[],
    selectedItem: null as CompendiumItem | null,
  }),
  watch: {
    group() {
      this.open = [...this.lcps, ...this.manufacturers];
    },
  },
  mounted() {
    this.filter = this.lcps;
    this.open = [...this.lcps, ...this.manufacturers];
  },
  computed: {
    itemsByLcp() {
      return _.groupBy(this.items, 'LcpName');
    },
    manufacturers() {
      return _.uniq(this.shownItems.map((x: any) => x.Source));
    },
    manufacturersByLcp() {
      const m = {} as any;
      for (const lcp of this.lcps) {
        m[lcp] = _.uniq(this.itemsByLcp[lcp].map((x: any) => x.Source));
      }
      return m;
    },
    lcps() {
      return Object.keys(this.itemsByLcp);
    },
    shownItems() {
      let shown = this.items;
      shown = shown.filter((i: any) => this.filter.includes(i.LcpName));
      if (this.search) {
        shown = shown.filter((i: any) => i.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      return shown;
    },
  },
  methods: {
    getItems(manufacturer: string, lcp?: string) {
      if (lcp) return this.itemsByLcp[lcp].filter((i: any) => i.Source === manufacturer);

      return this.shownItems.filter((i: any) => i.Source === manufacturer);
    },
    selectItem(item: CompendiumItem) {
      this.selectedItem = item;
      if (this.view !== 'list') {
        this.scrollTo(item.ID);
      }
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
    mf(id: string) {
      return (
        CompendiumStore().Manufacturers.find((x) => x.ID === id) || {
          GetColor: () => 'black',
          Name: 'err',
          LogoIsExternal: false,
          Icon: 'gms',
        }
      );
    },
    setAllLcps() {
      if (this.filter.length === this.lcps.length) {
        this.filter = [];
      } else {
        this.filter = this.lcps;
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
