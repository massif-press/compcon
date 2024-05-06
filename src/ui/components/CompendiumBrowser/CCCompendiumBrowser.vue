<template>
  <v-row>
    <v-col cols="3" style="max-width: 325px !important">
      <v-list
        density="compact"
        nav
        class="side-fixed"
        color="panel"
        v-model:opened="open"
        :class="dialog ? 'mt-4' : ''">
        <v-alert
          v-show="!!$slots.header"
          variant="outlined"
          class="mb-3 py-1"
          style="border-color: rgb(var(--v-theme-primary))">
          <slot name="header"></slot>
        </v-alert>

        <b-view-toggle v-model="view" :options="options" />
        <b-group-toggle v-model="group" :options="options" />

        <b-filter-set
          v-model="lcpFilter"
          :lcp-filter="lcpFilter"
          :lcps="lcps"
          :other-filter="otherFilter"
          :item-type="itemType"
          @set-all="setAllLcps()"
          @set-filters="otherFilter = $event" />

        <v-text-field
          v-model="search"
          item-title="Name"
          prepend-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mt-2" />
        <v-divider class="mt-2" />

        <div v-if="group === 'lcp'">
          <v-list-group
            v-for="lcp in lcps.filter((l) => lcpFilter.includes(l))"
            :value="lcp"
            color="accent"
            class="pt-0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <span class="text-button">
                    <b>{{ lcp }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>

            <b-list-item
              v-if="options.noSource"
              v-for="item in itemsByLcp[lcp]"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :item="<CompendiumItem>item"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="$emit('equip', item)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
              ">
              <template #checkbox>
                <v-checkbox-btn
                  density="compact"
                  v-model="comparisons"
                  @click.stop
                  class="d-inline ml-3"
                  :value="item" />
              </template>
            </b-list-item>

            <b-list-group
              v-else-if="itemType === 'NpcClass'"
              v-for="role in rolesByLcp[lcp]"
              :parent="lcp"
              :collection="role"
              :role="role">
              <b-list-item
                v-for="item in getRoleItems(role, lcp)"
                :selected="!!selectedItem && selectedItem.ID === item.ID"
                :compare="view === 'compare'"
                :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
                @equip="$emit('equip', item)"
                :item="<CompendiumItem>item"
                @clicked="
                  selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                ">
                <template #checkbox>
                  <v-checkbox-btn
                    density="compact"
                    v-model="comparisons"
                    @click.stop
                    class="d-inline ml-3"
                    :value="item" />
                </template>
              </b-list-item>
            </b-list-group>

            <b-list-group
              v-else-if="itemType === 'NpcFeature'"
              v-for="origin in originsByLcp[lcp]"
              :parent="lcp"
              :collection="origin">
              <b-list-item
                v-for="item in getOriginItems(origin, lcp)"
                :selected="!!selectedItem && selectedItem.ID === item.ID"
                :compare="view === 'compare'"
                :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
                @equip="$emit('equip', item)"
                :item="<CompendiumItem>item"
                @clicked="
                  selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                ">
                <template #checkbox>
                  <v-checkbox-btn
                    density="compact"
                    v-model="comparisons"
                    @click.stop
                    class="d-inline ml-3"
                    :value="item" />
                </template>
              </b-list-item>
            </b-list-group>

            <b-list-group
              v-else
              v-for="manufacturer in manufacturersByLcp[lcp]"
              :parent="lcp"
              :collection="manufacturer"
              :manufacturer="mf(manufacturer)">
              <b-list-item
                v-for="item in getItems(manufacturer, lcp)"
                :selected="!!selectedItem && selectedItem.ID === item.ID"
                :compare="view === 'compare'"
                :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
                @equip="$emit('equip', item)"
                :item="<CompendiumItem>item"
                @clicked="
                  selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                ">
                <template #checkbox>
                  <v-checkbox-btn
                    density="compact"
                    v-model="comparisons"
                    @click.stop
                    class="d-inline ml-3"
                    :value="item" />
                </template>
              </b-list-item>
            </b-list-group>
          </v-list-group>
        </div>

        <div v-else-if="group === 'source'">
          <v-list-group
            v-for="manufacturer in manufacturers"
            :value="manufacturer"
            color="accent"
            class="pt-0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <cc-logo
                    v-if="mf(manufacturer).LogoIsExternal"
                    :source="mf(manufacturer)"
                    size="small"
                    class="pt-3 mb-n1 mr-2" />
                  <v-icon
                    v-else
                    size="30"
                    :icon="mf(manufacturer).Icon"
                    :color="mf(manufacturer).GetColor($vuetify.theme.current.dark)"
                    start />
                  <span class="text-button">
                    <b>{{ manufacturer ? manufacturer : 'Other' }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>

            <b-list-item
              v-for="item in getItems(manufacturer)"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :item="<CompendiumItem>item"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="$emit('equip', item)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
              ">
              <template #checkbox>
                <v-checkbox-btn
                  density="compact"
                  v-model="comparisons"
                  @click.stop
                  class="d-inline ml-3"
                  :value="item" />
              </template>
            </b-list-item>
          </v-list-group>
        </div>

        <div v-else-if="group === 'role'">
          <b-list-group v-for="role in roles" :collection="role" :role="role">
            <b-list-item
              v-for="item in getRoleItems(role)"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="$emit('equip', item)"
              :item="<CompendiumItem>item"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
              ">
              <template #checkbox>
                <v-checkbox-btn
                  density="compact"
                  v-model="comparisons"
                  @click.stop
                  class="d-inline ml-3"
                  :value="item" />
              </template>
            </b-list-item>
          </b-list-group>
        </div>

        <div v-else-if="group === 'featureType'">
          <b-list-group
            v-for="featureType in featureTypes"
            :collection="featureType"
            :feature="featureType">
            <b-list-item
              v-for="item in getFeatureItems(featureType)"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="$emit('equip', item)"
              :item="<CompendiumItem>item"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
              ">
              <template #checkbox>
                <v-checkbox-btn
                  density="compact"
                  v-model="comparisons"
                  @click.stop
                  class="d-inline ml-3"
                  :value="item" />
              </template>
            </b-list-item>
          </b-list-group>
        </div>

        <div v-else-if="group === 'origin'">
          <b-list-group v-for="origin in origins" :collection="origin">
            <b-list-item
              v-for="item in getOriginItems(origin)"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="$emit('equip', item)"
              :item="<CompendiumItem>item"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
              ">
              <template #checkbox>
                <v-checkbox-btn
                  density="compact"
                  v-model="comparisons"
                  @click.stop
                  class="d-inline ml-3"
                  :value="item" />
              </template>
            </b-list-item>
          </b-list-group>
        </div>

        <div v-else-if="group === 'license'">
          <v-list-group v-for="license in licenses" :value="license" color="accent" class="pt-0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <span class="text-button">
                    <b>{{ license ? license : 'Other' }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>
            <b-list-item
              v-for="item in getLicenseItems(license)"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :item="<CompendiumItem>item"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="$emit('equip', item)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
              ">
              <template #checkbox>
                <v-checkbox-btn
                  density="compact"
                  v-model="comparisons"
                  @click.stop
                  class="d-inline ml-3"
                  :value="item" />
              </template>
            </b-list-item>
          </v-list-group>
        </div>

        <div v-else-if="group === 'type'">
          <v-list-group v-for="subtype in subtypes" :value="subtype" color="accent" class="pt-0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <span class="text-button">
                    <b>{{ subtype }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>
            <b-list-item
              v-for="item in getSubtypeItems(subtype)"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :item="<CompendiumItem>item"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="$emit('equip', item)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
              ">
              <template #checkbox>
                <v-checkbox-btn
                  density="compact"
                  v-model="comparisons"
                  @click.stop
                  class="d-inline ml-3"
                  :value="item" />
              </template>
            </b-list-item>
          </v-list-group>
        </div>

        <div v-else>
          <b-list-item
            v-for="item in shownItems"
            :selected="!!selectedItem && selectedItem.ID === item.ID"
            :compare="view === 'compare'"
            :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
            @equip="$emit('equip', item)"
            :item="<CompendiumItem>item"
            @clicked="
              selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
            ">
            <template #checkbox>
              <v-checkbox-btn
                density="compact"
                v-model="comparisons"
                @click.stop
                class="d-inline ml-3"
                :value="item" />
            </template>
          </b-list-item>
        </div>
      </v-list>
    </v-col>

    <v-col class="pl-6">
      <v-container id="content" style="height: calc(100vh - 65px) !important; overflow-y: scroll">
        <v-alert
          v-show="!!$slots.top"
          variant="outlined"
          class="mb-3 py-1"
          style="border-color: rgb(var(--v-theme-primary))">
          <slot name="top" />
        </v-alert>

        <v-row v-if="view === 'single'">
          <v-col cols="12">
            <selector-list-item
              :hide-title="options.hideTitle"
              :item="<CompendiumItem>selectedItem" />
          </v-col>
        </v-row>

        <div v-else-if="view === 'scatter'">
          <selector-scatter
            :items="shownItems"
            :selected="<CompendiumItem>selectedItem"
            :group="group"
            :tier="tier"
            :short="!!$slots.top" />
        </div>

        <div v-else-if="view === 'bar'">
          <selector-bar
            :items="shownItems"
            :group="group"
            :manufacturers="manufacturers"
            :licenses="licenses"
            :lcp-filter="lcpFilter"
            :selected="<CompendiumItem>selectedItem"
            :tier="tier"
            :short="!!$slots.top" />
        </div>

        <div v-if="view === 'list' && itemType === 'License'">
          <v-row v-for="m in manufacturers">
            <v-col v-if="!!mf(m)" class="text-center pa-3">
              <v-row align="center" justify="center">
                <v-col cols="auto">
                  <cc-logo
                    v-if="mf(m).LogoIsExternal"
                    :source="mf(m)"
                    :size="$vuetify.display.mdAndDown ? 'large' : 'xLarge'"
                    class="pt-3 mb-n1" />
                  <v-icon
                    v-else
                    size="60"
                    :icon="mf(m).Icon"
                    :color="mf(m).GetColor($vuetify.theme.current.dark)" />
                </v-col>
                <v-col
                  cols="auto"
                  :class="$vuetify.display.mdAndDown ? 'heading h2' : 'heading mech'"
                  :style="`color: ${mf(m).GetColor($vuetify.theme.current.dark)}`">
                  {{ mf(m).Name }}
                </v-col>
              </v-row>
              <v-expansion-panels accordion focusable>
                <v-expansion-panel v-for="item in getItems(m)" :id="(item as License).ID">
                  <v-expansion-panel-title class="hover-parent py-0 pr-0 pl-3" hide-actions>
                    <template #default="{ expanded }">
                      <div>
                        <div>
                          <div class="caption">{{ (item as License).Frame.Source }}</div>
                          <div class="heading h2 font-weight-bold">
                            {{ (item as License).Frame.Name }}
                          </div>
                        </div>
                        <div style="min-width: 20vw">
                          <v-chip
                            v-for="f in (item as License).Frame.MechType"
                            size="small"
                            dark
                            variant="outlined"
                            color="accent"
                            class="ma-1">
                            {{ f }}
                          </v-chip>
                        </div>
                      </div>
                      <div
                        :class="expanded ? 'img-expanded' : 'img-hover'"
                        :style="`background-image: url('${
                          (item as License).Frame.DefaultImage
                        }'); height:110px;
                    width:100%;  background-position: top ${
                      (item as License).Frame.YPosition
                    }% left 0`" />
                    </template>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <cc-license-panel :license="item" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </div>

        <v-row v-else-if="view === 'list'">
          <v-col cols="12" v-for="item in <any[]>items" :id="item.ID">
            <v-card
              :variant="options.hideTitle ? 'flat' : 'outlined'"
              :class="options.hideTitle ? '' : 'px-3'">
              <selector-list-item
                :hide-title="options.hideTitle"
                :highlighted="selectedItem ? selectedItem.ID === item.ID : false"
                :item="item" />
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
                :selected="<CompendiumItem>selectedItem" />
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
                    class="pt-3 mb-n1" />
                  <v-icon
                    v-else
                    size="60"
                    :icon="mf(manufacturer).Icon"
                    :color="mf(manufacturer).GetColor($vuetify.theme.current.dark)" />
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
                    :selected="<CompendiumItem>selectedItem" />
                </v-col>
              </v-row>
            </div>
          </div>

          <div v-else-if="group === 'license'" cols="12">
            <div v-for="license in licenses">
              <div class="heading h2 text-accent mt-4" v-text="license" />

              <v-row>
                <v-col>
                  <selector-table
                    :headers="tableHeaders"
                    :items="getLicenseItems(license)"
                    :selected="<CompendiumItem>selectedItem" />
                </v-col>
              </v-row>
            </div>
          </div>

          <div v-else-if="group === 'type'" cols="12">
            <div v-for="subtype in subtypes">
              <div class="heading h2 text-accent mt-4" v-text="subtype" />
              <v-row>
                <v-col>
                  <selector-table
                    :headers="getMultiHeader(subtype)"
                    :items="getSubtypeItems(subtype)"
                    :selected="<CompendiumItem>selectedItem" />
                </v-col>
              </v-row>
            </div>
          </div>

          <div v-else-if="group === 'role'" cols="12">
            <div v-for="role in roles">
              <div class="heading h2 text-accent mt-4" v-text="role" />
              <v-row>
                <v-col>
                  <selector-table
                    :headers="tableHeaders"
                    :items="getRoleItems(role)"
                    :selected="<CompendiumItem>selectedItem" />
                </v-col>
              </v-row>
            </div>
          </div>

          <div v-else-if="group === 'featureType'" cols="12">
            <div v-for="featureType in featureTypes">
              <div class="heading h2 text-accent mt-4" v-text="featureType" />
              <v-row>
                <v-col>
                  <selector-table
                    :headers="tableHeaders"
                    :items="getFeatureItems(featureType)"
                    :selected="<CompendiumItem>selectedItem" />
                </v-col>
              </v-row>
            </div>
          </div>

          <div v-else-if="group === 'origin'" cols="12">
            <div v-for="origin in origins">
              <div class="heading h2 text-accent mt-4" v-text="origin" />
              <v-row>
                <v-col>
                  <selector-table
                    :headers="tableHeaders"
                    :items="getOriginItems(origin)"
                    :selected="<CompendiumItem>selectedItem" />
                </v-col>
              </v-row>
            </div>
          </div>

          <div v-else cols="12">
            <selector-table
              :headers="tableHeaders"
              :items="shownItems"
              :selected="<CompendiumItem>selectedItem" />
          </div>
        </div>

        <div v-else-if="view === 'cards'">
          <v-row>
            <selector-card-item
              v-for="item in shownItems.slice(minSliceIndex, maxSliceIndex)"
              :id="item.ID"
              :item="item"
              :highlighted="selectedItem ? selectedItem.ID === item.ID : false" />
          </v-row>
          <v-pagination
            v-model="page"
            total-visible="8"
            class="mt-8"
            :length="Math.ceil(shownItems.length / itemsPerPage)" />
          <!-- @input="scrollToTop()" /> -->
        </div>

        <div v-else-if="view === 'compare'">
          <selector-compare
            :items="comparisons"
            :selected="<CompendiumItem>selectedItem"
            :tier="tier"
            @clear="comparisons = []" />
        </div>

        <div style="height: 30px" />
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import ItemFilter from '@/classes/utility/ItemFilter';
import _, { min } from 'lodash';

import SelectorListItem from './views/_selectorListItem.vue';
import SelectorCardItem from './views/_selectorCardItem.vue';
import SelectorTable from './views/_selectorTable.vue';
import SelectorScatter from './views/_selectorScatter.vue';
import SelectorBar from './views/_selectorBar.vue';
import SelectorCompare from './views/_selectorCompare.vue';

import bListItem from './components/_b-list-item.vue';
import bViewToggle from './components/_b-view-toggle.vue';
import bGroupToggle from './components/_b-group-toggle.vue';
import bFilterSet from './components/_b-filter-set.vue';
import bListGroup from './components/_b-list-group.vue';

import { CompendiumItem, License } from '@/class';
import { CompendiumStore, UserStore } from '@/stores';

type BrowserOptions = {
  views: string[];
  initialView: string;
  groups: string[];
  initialGroup: string;
  noSource?: boolean;
  hideTitle?: boolean;
  showExotics?: boolean;
};

const sortFn = (a: any, b: any): number => {
  const excl = ['exotic'];
  if (!a || excl.includes(a.toLowerCase())) return 1;
  if (!b || excl.includes(b.toLowerCase())) return -1;
  return a.localeCompare(b);
};

export default {
  name: 'cc-selector',
  components: {
    SelectorListItem,
    SelectorCardItem,
    SelectorTable,
    SelectorScatter,
    SelectorBar,
    SelectorCompare,
    bListItem,
    bViewToggle,
    bGroupToggle,
    bFilterSet,
    bListGroup,
  },
  emits: ['equip', 'view-change'],
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
      required: false,
      default: () => [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Name', key: 'Name' },
      ],
    },
    multiHeaders: {
      type: Object,
      required: false,
    },
    options: {
      type: Object as () => BrowserOptions,
      required: true,
    },
    equippable: {
      type: Boolean,
    },
    equipped: {
      type: Object,
      required: false,
    },
    tier: {
      type: Number,
      required: false,
      default: 1,
    },
    dialog: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    open: [] as string[],
    view: 'list',
    group: 'source',
    search: '',
    otherFilter: {},
    lcpFilter: [] as string[],
    selectedItem: null as CompendiumItem | License | null,
    comparisons: [] as CompendiumItem[],
    page: 1,
    itemsPerPage: 15,
  }),
  watch: {
    group() {
      this.open = [...this.lcps, ...this.manufacturers, ...this.subtypes, ...this.licenses];
    },
    comparisons() {
      const idx = this.comparisons.findIndex((x) => x.ID === this.selectedItem?.ID);
      if (idx > -1) this.comparisons.splice(idx, 1);
    },
    items() {
      this.lcpFilter = this.lcps;
      this.open = [...this.lcps, ...this.manufacturers, ...this.subtypes, ...this.licenses];
    },
    view() {
      this.$emit('view-change', this.view);
    },
  },
  created() {
    this.view = this.options.initialView;
    this.group = this.options.initialGroup;
  },
  mounted() {
    this.lcpFilter = this.lcps;
    this.open = [...this.lcps, ...this.manufacturers, ...this.subtypes, ...this.licenses];
  },
  computed: {
    minSliceIndex() {
      return (this.page - 1) * this.itemsPerPage;
    },
    maxSliceIndex() {
      return this.page * this.itemsPerPage;
    },
    itemsByLcp() {
      return _.groupBy(this.items as CompendiumItem[], 'LcpName');
    },
    manufacturers() {
      return _.uniq(this.shownItems.map((x: any) => x.Source)).sort((a, b) => sortFn(a, b));
    },
    manufacturersByLcp() {
      const m = {} as any;
      for (const lcp of this.lcps) {
        m[lcp] = _.uniq(this.itemsByLcp[lcp].map((x: any) => x.Source)).sort((a, b) =>
          sortFn(a, b)
        );
      }
      return m;
    },
    roles() {
      return _.uniq(this.shownItems.map((x: any) => x.Role)).sort((a, b) => sortFn(a, b));
    },
    rolesByLcp() {
      const m = {} as any;
      for (const lcp of this.lcps) {
        m[lcp] = _.uniq(this.itemsByLcp[lcp].map((x: any) => x.Role)).sort((a, b) => sortFn(a, b));
      }
      return m;
    },
    featureTypes() {
      return _.uniq(this.shownItems.map((x: any) => x.FeatureType)).sort((a, b) => sortFn(a, b));
    },
    featureTypesByLcp() {
      const m = {} as any;
      for (const lcp of this.lcps) {
        m[lcp] = _.uniq(this.itemsByLcp[lcp].map((x: any) => x.FeatureType)).sort((a, b) =>
          sortFn(a, b)
        );
      }
      return m;
    },
    origins() {
      return _.uniq(this.shownItems.map((x: any) => x.Origin.Name)).sort((a, b) => sortFn(a, b));
    },
    originsByLcp() {
      const m = {} as any;
      for (const lcp of this.lcps) {
        m[lcp] = _.uniq(this.itemsByLcp[lcp].map((x: any) => x.Origin.Name)).sort((a, b) =>
          sortFn(a, b)
        );
      }
      return m;
    },
    lcps() {
      return Object.keys(this.itemsByLcp).sort((a, b) => sortFn(a, b));
    },
    licenses() {
      return _.uniq(this.shownItems.map((x: any) => x.License)).sort((a, b) => sortFn(a, b));
    },
    subtypes() {
      return _.uniq(this.shownItems.map((x: any) => x.Type)).sort((a, b) => sortFn(a, b));
    },
    showExotics() {
      return this.options.showExotics || UserStore().User.Option('showExotics');
    },
    shownItems() {
      let shown = this.items as CompendiumItem[];
      shown = shown.filter((i: any) => this.lcpFilter.includes(i.LcpName));
      if (this.search) {
        shown = shown.filter((i: any) => i.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      if (Object.keys(this.otherFilter).length) {
        shown = ItemFilter.Filter(shown, this.otherFilter);
      }

      if (!this.showExotics) shown = shown.filter((i: CompendiumItem) => !i.IsExotic);

      return shown;
    },
  },
  methods: {
    getItems(manufacturer: string, lcp?: string): CompendiumItem[] | License[] {
      if (lcp) return this.itemsByLcp[lcp].filter((i: any) => i.Source === manufacturer);

      return this.shownItems.filter((i: any) => i.Source === manufacturer);
    },
    getRoleItems(role: string, lcp?: string) {
      if (lcp) return this.itemsByLcp[lcp].filter((i: any) => i.Role && i.Role === role);

      return this.shownItems.filter((i: any) => i.Role && i.Role === role);
    },
    getFeatureItems(featureType: string, lcp?: string) {
      if (lcp) return this.itemsByLcp[lcp].filter((i: any) => i.FeatureType === featureType);

      return this.shownItems.filter((i: any) => i.FeatureType === featureType);
    },
    getOriginItems(origin: string, lcp?: string) {
      if (lcp) return this.itemsByLcp[lcp].filter((i: any) => i.Origin.Name === origin);

      return this.shownItems.filter((i: any) => i.Origin.Name === origin);
    },
    getLicenseItems(license: string) {
      return this.shownItems.filter((i: any) => i.License === license);
    },
    getSubtypeItems(t: string) {
      return this.shownItems.filter((i: any) => i.Type === t);
    },
    selectItem(item: CompendiumItem | License | null) {
      this.selectedItem = item;
      if (item) {
        this.page = Math.ceil(
          (this.shownItems.findIndex((x: any) => x.ID === item.ID) + 1) / this.itemsPerPage
        );
        this.$nextTick(() => this.scrollTo(item.ID));
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
      if (this.lcpFilter.length === this.lcps.length) {
        this.lcpFilter = [];
      } else {
        this.lcpFilter = this.lcps;
      }
    },
    getMultiHeader(subtype: string) {
      return this.multiHeaders && this.multiHeaders[subtype.replace(/\s/g, '')]
        ? this.multiHeaders[subtype.replace(/\s/g, '')]
        : this.tableHeaders;
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

.img-hover {
  filter: brightness(60%) saturate(0.7);
  transition: all 0.15s ease-in-out;
}

.img-expanded {
  filter: brightness(115%) saturate(1.1);
  transition: all 0.15s ease-in-out;
}

.hover-parent:hover > .img-hover {
  filter: brightness(100%);
}
</style>
