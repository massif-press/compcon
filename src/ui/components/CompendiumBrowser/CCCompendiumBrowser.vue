<template>
  <v-layout>
    <cc-button
      :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
      size="small"
      color="primary"
      :style="`position: absolute; z-index: 999; left: ${showNav ? (mobile ? '322' : '352') : '3'}px; top: 6px`"
      @click="(showNav as any) = !showNav" />
    <v-navigation-drawer v-model="showNav" :width="mobile ? 320 : 350">
      <v-list density="compact" nav v-model:opened="open">
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
              v-for="item in itemsByLcp[lcp].filter((i) =>
                search ? i.Name.toLowerCase().includes(search.toLowerCase()) : true
              )"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :item="<CompendiumItem>item"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="handleEquip(item)"
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
                @equip="handleEquip(item)"
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
              v-show="
                search
                  ? getOriginItems(origin, lcp).filter((i) =>
                      i.Name.toLowerCase().includes(search.toLowerCase())
                    ).length > 0
                  : true
              "
              :parent="lcp"
              :collection="origin">
              <b-list-item
                v-for="item in getOriginItems(origin, lcp).filter((i) =>
                  search ? i.Name.toLowerCase().includes(search.toLowerCase()) : true
                )"
                :selected="!!selectedItem && selectedItem.ID === item.ID"
                :compare="view === 'compare'"
                :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
                @equip="handleEquip(item)"
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
                @equip="handleEquip(item as any)"
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
              @equip="handleEquip(item as any)"
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
              @equip="handleEquip(item)"
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
              @equip="handleEquip(item)"
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
              @equip="handleEquip(item)"
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
              @equip="handleEquip(item)"
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
              @equip="handleEquip(item)"
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
            @equip="handleEquip(item)"
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
    </v-navigation-drawer>

    <v-main class="mt-2">
      <div
        id="content"
        :style="`padding: 16px ${horizPadding}px 16px ${horizPadding}px`"
        style="height: calc(100vh - 65px) !important; overflow-y: scroll">
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
              :selectable="equippable"
              @select="$emit('equip', $event)"
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
              <v-expansion-panels accordion focusable flat>
                <license-expandable :items="getItems(m)" />
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
                :selectable="equippable"
                @select="$emit('equip', $event)"
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
                :selectable="equippable"
                @select="$emit('equip', $event)"
                :selected="<CompendiumItem>selectedItem" />
            </div>
          </div>

          <div v-else-if="group === 'source'">
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

              <selector-table
                :headers="tableHeaders"
                :items="getItems(manufacturer)"
                :selectable="equippable"
                @select="$emit('equip', $event)"
                :selected="<CompendiumItem>selectedItem" />
            </div>
          </div>

          <div v-else-if="group === 'license'" cols="12">
            <div v-for="license in licenses">
              <div class="heading h2 text-accent mt-4" v-text="license" />

              <selector-table
                :headers="tableHeaders"
                :items="getLicenseItems(license)"
                :selectable="equippable"
                @select="$emit('equip', $event)"
                :selected="<CompendiumItem>selectedItem" />
            </div>
          </div>

          <div v-else-if="group === 'type'" cols="12">
            <div v-for="subtype in subtypes">
              <div class="heading h2 text-accent mt-4" v-text="subtype" />

              <selector-table
                :headers="getMultiHeader(subtype)"
                :items="getSubtypeItems(subtype)"
                :selectable="equippable"
                @select="$emit('equip', $event)"
                :selected="<CompendiumItem>selectedItem" />
            </div>
          </div>

          <div v-else-if="group === 'role'" cols="12">
            <div v-for="role in roles">
              <div class="heading h2 text-accent mt-4" v-text="role" />

              <selector-table
                :headers="tableHeaders"
                :items="getRoleItems(role)"
                :selectable="equippable"
                @select="$emit('equip', $event)"
                :selected="<CompendiumItem>selectedItem" />
            </div>
          </div>

          <div v-else-if="group === 'featureType'" cols="12">
            <div v-for="featureType in featureTypes">
              <div class="heading h2 text-accent mt-4" v-text="featureType" />

              <selector-table
                :headers="tableHeaders"
                :items="getFeatureItems(featureType)"
                :selectable="equippable"
                @select="$emit('equip', $event)"
                :selected="<CompendiumItem>selectedItem" />
            </div>
          </div>

          <div v-else-if="group === 'origin'" cols="12">
            <div v-for="origin in origins">
              <div class="heading h2 text-accent mt-4" v-text="origin" />

              <selector-table
                :headers="tableHeaders"
                :items="getOriginItems(origin)"
                :selectable="equippable"
                @select="$emit('equip', $event)"
                :selected="<CompendiumItem>selectedItem" />
            </div>
          </div>

          <div v-else cols="12">
            <selector-table
              :headers="tableHeaders"
              :items="shownItems"
              :selectable="equippable"
              @select="$emit('equip', $event)"
              :selected="<CompendiumItem>selectedItem" />
          </div>
        </div>

        <div v-else-if="view === 'cards'">
          <v-pagination
            v-model="page"
            total-visible="8"
            :length="Math.ceil(shownItems.length / itemsPerPage)" />
          <v-row>
            <selector-card-item
              v-for="item in shownItems.slice(minSliceIndex, maxSliceIndex)"
              :id="item.ID"
              :item="item"
              :highlighted="selectedItem ? selectedItem.ID === item.ID : false"
              :selectable="equippable"
              @select="$emit('equip', item)" />
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
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import ItemFilter from '@/classes/utility/ItemFilter';
import _ from 'lodash';

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

import LicenseExpandable from './components/_license-expandable.vue';

import { CompendiumItem, License, LicensedItem, Manufacturer } from '@/class';
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

const mfOrder = ['gms', 'ips-n', 'ssc', 'horus', 'ha'];

export const ManufacturerSort = (mArr: any[]) =>
  mArr.sort((a, b) => {
    const indexA = mfOrder.indexOf(a.Source.toLowerCase());
    const indexB = mfOrder.indexOf(b.Source.toLowerCase());

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else if (indexA !== -1) {
      return -1;
    } else if (indexB !== -1) {
      return 1;
    } else return a.Source.toLowerCase().localeCompare(b.Source.toLowerCase());
  });

const sortFn = (a: any, b: any): number => {
  const excl = ['exotic'];
  if (!a || excl.includes(a.toLowerCase())) return 1;
  if (!b || excl.includes(b.toLowerCase())) return -1;
  return a.localeCompare(b);
};

const manufacturerSortFn = (a: string, b: string): number => {
  const order = ['gms', 'ips-n', 'ssc', 'horus', 'ha'];
  const excl = ['exotic'];

  if (!a || excl.includes(a.toLowerCase())) return 1;
  if (!b || excl.includes(b.toLowerCase())) return -1;

  const indexA = order.indexOf(a.toLowerCase());
  const indexB = order.indexOf(b.toLowerCase());

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  } else if (indexA !== -1) {
    return -1;
  } else if (indexB !== -1) {
    return 1;
  } else return a.toLowerCase().localeCompare(b.toLowerCase());
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
    LicenseExpandable,
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
    showNav: null,
  }),
  watch: {
    group(val) {
      this.open = [
        ...this.lcps,
        ...this.manufacturers,
        ...this.subtypes,
        ...this.licenses,
        ...this.allOrigins,
        ...this.allRoles,
      ];
      UserStore().User.SetView(`compendium_${this.itemType.toLowerCase()}_group`, val);
    },
    comparisons() {
      const idx = this.comparisons.findIndex((x) => x.ID === this.selectedItem?.ID);
      if (idx > -1) this.comparisons.splice(idx, 1);
    },
    items() {
      this.lcpFilter = this.lcps;
      this.open = [
        ...this.lcps,
        ...this.manufacturers,
        ...this.subtypes,
        ...this.licenses,
        ...this.allOrigins,
        ...this.allRoles,
      ];
    },
    view(val) {
      this.$emit('view-change', val);
      UserStore().User.SetView(`compendium_${this.itemType.toLowerCase()}_view`, val);
    },
    search() {
      this.open = [
        ...this.lcps,
        ...this.manufacturers,
        ...this.subtypes,
        ...this.licenses,
        ...this.allOrigins,
        ...this.allRoles,
      ];
    },
  },

  created() {
    this.lcpFilter = this.lcps;

    const user = UserStore().User;
    this.view = user.View(
      `compendium_${this.itemType.toLowerCase()}_view`,
      this.options.initialView
    );

    this.group = user.View(
      `compendium_${this.itemType.toLowerCase()}_group`,
      this.options.initialView
    );
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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
      return _.uniq(this.shownItems.map((x: any) => x.Source)).sort((a, b) =>
        manufacturerSortFn(a, b)
      );
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
    allRoles() {
      if (this.itemType === 'NpcClass')
        return _.uniq(
          Object.entries(this.rolesByLcp).flatMap(([key, arr]) =>
            (arr as string[]).map((str) => str)
          )
        );
      return [];
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
    allOrigins() {
      if (this.itemType === 'NpcFeature')
        return _.uniq(
          Object.entries(this.originsByLcp).flatMap(([key, arr]) =>
            (arr as string[]).map((str) => `${key}_${str}`)
          )
        );
      return [];
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

      if (shown.some((x: any) => x.Source)) shown = ManufacturerSort(shown);

      return shown;
    },
    horizPadding() {
      if (this.view === 'table') return 12;
      if (this.$vuetify.display.xl) return 160;
      if (this.$vuetify.display.lg) return 90;
      if (this.$vuetify.display.md) return 24;
      return 24;
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
    handleEquip(item: CompendiumItem) {
      this.$emit('equip', item);

      if (this.selectedItem && this.selectedItem.ID === item.ID) {
        this.selectItem(null);
        this.selectedItem = null;
      }
    },
  },
};
</script>

<style scoped>
.side-fixed {
  overflow-y: scroll;
}

.img-hover {
  filter: brightness(80%) saturate(0.3);
  transition: all 0.15s ease-in-out;
}

.hover-parent:hover > .img-hover {
  filter: brightness(100%);
}
</style>
