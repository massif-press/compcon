<template>
  <v-row>
    <v-col cols="3" style="max-width: 325px !important">
      <v-list density="compact" nav class="side-fixed" color="panel" v-model:opened="open">
        <v-alert
          v-show="!!$slots.header"
          variant="outlined"
          class="mb-3 py-1"
          style="border-color: rgb(var(--v-theme-primary))"
        >
          <slot name="header"> </slot>
        </v-alert>
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
          <v-tooltip v-for="v in options.views" :text="viewTooltip(v)" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                :value="v"
                icon
                size="small"
                :style="`width: ${100 / options.views.length}%`"
                ><v-icon size="25" :icon="viewIcon(v)"
              /></v-btn>
            </template>
          </v-tooltip>
        </v-btn-toggle>
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
          <v-tooltip v-for="g in options.groups" :text="groupTooltip(g)" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                :value="g"
                icon
                size="small"
                :style="`width: ${100 / (options.groups.length + 1)}%`"
                ><v-icon size="25" :icon="groupIcon(g)"
              /></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="No Grouping" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                value="none"
                size="small"
                icon
                :style="`width: ${100 / (options.groups.length + 1)}%`"
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

            <v-list-item
              v-if="options.noSource"
              v-for="item in shownItems"
              @click="selectItem(item as CompendiumItem)"
            >
              <template #title>
                <v-icon start class="ml-3" :icon="(item as CompendiumItem).Icon" />
                <span class="text-button">
                  {{ (item as CompendiumItem).Name }}
                </span>
              </template>
            </v-list-item>

            <v-list-group
              v-else
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
        <div v-else-if="group === 'license'">
          <v-list-group v-for="license in licenses" :value="license" color="accent" class="pt-0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <span class="text-button">
                    <b>{{ license }}</b>
                  </span>
                </template></v-list-item
              >
            </template>
            <v-list-item
              v-for="item in getLicenseItems(license)"
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

    <v-col class="pl-6">
      <v-container id="content" style="height: calc(100vh - 65px) !important; overflow-y: scroll">
        <v-row v-if="view === 'single'">
          <v-col cols="12">
            <selector-list-item
              :hide-title="options.hideTitle"
              :item="(selectedItem as CompendiumItem)"
            />
          </v-col>
        </v-row>

        <v-row v-if="view === 'list'">
          <v-col cols="12" v-for="item in items" :id="(item as any).ID">
            <v-card
              :variant="options.hideTitle ? 'flat' : 'outlined'"
              :color="options.hideTitle ? '' : '#7d7d7d33'"
              :class="options.hideTitle ? '' : 'px-3'"
            >
              <selector-list-item
                :hide-title="options.hideTitle"
                :highlighted="selectedItem ? (selectedItem as any).ID === (item as any).ID : false"
                :item="(item as CompendiumItem)"
              />
            </v-card>
          </v-col>
        </v-row>

        <div v-else-if="view === 'table'">
          <div v-if="group === 'lcp'">
            <div v-for="lcp in lcpFilter">
              <div class="heading mech" v-text="lcp" />
              <selector-table
                :headers="tableHeaders"
                :items="itemsByLcp[lcp]"
                :selected="(selectedItem as any)"
              />
            </div>
          </div>

          <div v-else-if="group === 'source'" cols="12">
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
          </div>

          <div v-else-if="group === 'license'" cols="12">
            <div v-for="license in licenses">
              <div class="heading h2 text-primary mt-4" v-text="license" />

              <v-row>
                <v-col>
                  <selector-table
                    :headers="tableHeaders"
                    :items="getLicenseItems(license)"
                    :selected="(selectedItem as any)"
                  />
                </v-col>
              </v-row>
            </div>
          </div>

          <div v-else cols="12">
            <selector-table
              :headers="tableHeaders"
              :items="shownItems"
              :selected="(selectedItem as any)"
            />
          </div>
        </div>

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
import ItemFilter from '@/classes/utility/ItemFilter';
import _ from 'lodash';
import SelectorListItem from './items/_selectorListItem.vue';
import SelectorCardItem from './items/_selectorCardItem.vue';
import SelectorTable from './items/_selectorTable.vue';
import { CompendiumItem } from '@/class';
import { CompendiumStore } from '../store';

type BrowserOptions = {
  views: string[];
  initialView: 'single' | 'list' | 'table' | 'cards';
  groups: string[];
  initialGroup: 'source' | 'lcp' | 'license';
  noSource: boolean;
  hideTitle: boolean;
};

export default {
  name: 'cc-selector',
  components: { SelectorListItem, SelectorCardItem, SelectorTable },
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
    tableHeaders: {
      type: Array,
      required: true,
    },
    options: {
      type: Object as () => BrowserOptions,
      required: true,
    },
  },
  data: () => ({
    open: [] as string[],
    view: 'list',
    group: 'source',
    search: '',
    otherFilter: {},
    lcpFilter: [] as string[],
    selectedItem: null as CompendiumItem | null,
  }),
  watch: {
    group() {
      this.open = [...this.lcps, ...this.manufacturers];
    },
  },
  created() {
    this.view = this.options.initialView;
    this.group = this.options.initialGroup;
  },
  mounted() {
    this.lcpFilter = this.lcps;
    this.open = [...this.lcps, ...this.manufacturers, ...this.licenses];
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
    licenses() {
      return _.uniq(this.shownItems.map((x: any) => x.License));
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
    viewIcon(i: string) {
      switch (i) {
        case 'single':
          return 'mdi-card-bulleted-outline';
        case 'list':
          return 'mdi-view-list';
        case 'table':
          return 'mdi-table';
        case 'cards':
          return 'mdi-view-grid';
        default:
          return '';
      }
    },
    viewTooltip(i: string) {
      switch (i) {
        case 'single':
          return 'Single View';
        case 'list':
          return 'List View';
        case 'table':
          return 'Table View';
        case 'cards':
          return 'Card View';
        default:
          return '';
      }
    },
    groupIcon(i: string) {
      switch (i) {
        case 'source':
          return 'cc:manufacturer';
        case 'lcp':
          return 'cc:content_manager';
        case 'license':
          return 'cc:license';
        default:
          return '';
      }
    },
    groupTooltip(i: string) {
      switch (i) {
        case 'source':
          return 'Group by Source';
        case 'lcp':
          return 'Group by LCP';
        case 'license':
          return 'Group by License';
        default:
          return '';
      }
    },
    getItems(manufacturer: string, lcp?: string) {
      if (lcp) return this.itemsByLcp[lcp].filter((i: any) => i.Source === manufacturer);

      return this.shownItems.filter((i: any) => i.Source === manufacturer);
    },
    getLicenseItems(license: string) {
      return this.shownItems.filter((i: any) => i.License === license);
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
