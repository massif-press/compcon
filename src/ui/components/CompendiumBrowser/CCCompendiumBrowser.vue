<template>
  <v-layout>
    <div style="position: absolute; z-index: 999"
      :style="`left: ${showNav ? (mobile ? '322' : '352') : '3'}px; top: 6px`">
      <cc-button :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
        size="small"
        color="primary"
        @click="(showNav as any) = !showNav" />
    </div>
    <v-navigation-drawer v-model="showNav"
      :width="mobile ? 320 : 350">
      <v-list v-model:opened="open"
        density="compact"
        style="padding-bottom: 60px"
        tile
        nav>
        <v-alert v-show="!!$slots.header"
          variant="outlined"
          class="mb-3 py-1"
          tile
          style="border-color: rgb(var(--v-theme-primary))">
          <slot name="header"></slot>
        </v-alert>

        <b-view-toggle v-model="view"
          :options="options" />
        <b-group-toggle v-model="group"
          :options="options" />

        <b-filter-set v-model="lcpFilter"
          :lcp-filter="lcpFilter"
          :lcps="lcps"
          :other-filter="otherFilter"
          :item-type="itemType"
          @set-all="setAllLcps()"
          @set-filters="otherFilter = $event" />

        <v-text-field v-model="search"
          item-title="Name"
          prepend-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mt-2" />
        <v-divider class="mt-2" />

        <div v-if="group === 'lcp'">
          <v-list-group v-for="lcp in filteredLcps"
            :key="`lcp-${lcp}`"
            :value="lcp"
            color="accent"
            class="pt-0">
            <template #activator="{ props }">
              <v-list-item v-bind="props"
                tile>
                <template #title>
                  <span class="text-button">
                    <b>{{ lcp }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>

            <template v-if="open.includes(lcp)">
              <b-list-item v-for="item in itemsByLcp[lcp].filter((i) =>
                search ? i.Name.toLowerCase().includes(search.toLowerCase()) : true
              )"
                v-if="options.noSource"
                :key="item.ID"
                :selected="!!selectedItem && selectedItem.ID === item.ID"
                :compare="view === 'compare'"
                :item="<CompendiumItem>item"
                :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
                @equip="handleEquip(item)"
                @clicked="
                  selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                  ">
                <template #checkbox>
                  <v-checkbox-btn v-model="comparisons"
                    density="compact"
                    class="d-inline ml-3"
                    :value="item"
                    @click.stop />
                </template>
              </b-list-item>

              <b-list-group v-for="role in rolesByLcp[lcp]"
                v-else-if="itemType === 'NpcClass'"
                v-show="search
                  ? (itemsByLcpByRole[lcp]?.[role] ?? []).some((i) =>
                    i.Name.toLowerCase().includes(search.toLowerCase())
                  )
                  : true
                  "
                :key="`role-${lcp}-${role}`"
                :parent="lcp"
                :collection="role"
                :role="role">
                <b-list-item v-for="item in (itemsByLcpByRole[lcp]?.[role] ?? []).filter((i) =>
                  search ? i.Name.toLowerCase().includes(search.toLowerCase()) : true
                )"
                  :key="item.ID"
                  :selected="!!selectedItem && selectedItem.ID === item.ID"
                  :compare="view === 'compare'"
                  :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
                  :item="<CompendiumItem>item"
                  @equip="handleEquip(item)"
                  @clicked="
                    selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                    ">
                  <template #checkbox>
                    <v-checkbox-btn v-model="comparisons"
                      density="compact"
                      class="d-inline ml-3"
                      :value="item"
                      @click.stop />
                  </template>
                </b-list-item>
              </b-list-group>

              <b-list-group v-for="origin in originsByLcp[lcp]"
                v-else-if="itemType === 'NpcFeature'"
                v-show="search
                  ? (itemsByLcpByOrigin[lcp]?.[origin] ?? []).some((i) =>
                    i.Name.toLowerCase().includes(search.toLowerCase())
                  )
                  : true
                  "
                :key="`origin-${lcp}-${origin}`"
                :parent="lcp"
                :collection="origin">
                <b-list-item v-for="item in (itemsByLcpByOrigin[lcp]?.[origin] ?? []).filter((i) =>
                  search ? i.Name.toLowerCase().includes(search.toLowerCase()) : true
                )"
                  :key="item.ID"
                  :selected="!!selectedItem && selectedItem.ID === item.ID"
                  :compare="view === 'compare'"
                  :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
                  :item="<CompendiumItem>item"
                  @equip="handleEquip(item)"
                  @clicked="
                    selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                    ">
                  <template #checkbox>
                    <v-checkbox-btn v-model="comparisons"
                      density="compact"
                      class="d-inline ml-3"
                      :value="item"
                      @click.stop />
                  </template>
                </b-list-item>
              </b-list-group>

              <b-list-group v-for="manufacturer in manufacturersByLcp[lcp]"
                v-else
                v-show="search
                  ? (itemsByLcpBySource[lcp]?.[manufacturer] ?? []).some((i) =>
                    i.Name.toLowerCase().includes(search.toLowerCase())
                  )
                  : true
                  "
                :key="`mf-${lcp}-${manufacturer}`"
                :parent="lcp"
                :collection="manufacturer"
                :manufacturer="mf(manufacturer)">
                <b-list-item v-for="item in (itemsByLcpBySource[lcp]?.[manufacturer] ?? []).filter((i) =>
                  search ? i.Name.toLowerCase().includes(search.toLowerCase()) : true
                )"
                  :key="item.ID"
                  :selected="!!selectedItem && selectedItem.ID === item.ID"
                  :compare="view === 'compare'"
                  :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
                  :item="<CompendiumItem>item"
                  @equip="handleEquip(item as any)"
                  @clicked="
                    selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                    ">
                  <template #checkbox>
                    <v-checkbox-btn v-model="comparisons"
                      density="compact"
                      class="d-inline ml-3"
                      :value="item"
                      @click.stop />
                  </template>
                </b-list-item>
              </b-list-group>
            </template>
          </v-list-group>
        </div>

        <div v-else-if="group === 'source'">
          <v-list-group v-for="manufacturer in manufacturers"
            :key="`mf-${manufacturer}`"
            :value="manufacturer"
            color="accent"
            class="pt-0">
            <template #activator="{ props }">
              <v-list-item tile
                v-bind="props"
                slim>
                <template #prepend>
                  <cc-logo :source="mf(manufacturer)" />
                  &nbsp;
                </template>
                <template #title>
                  <span class="text-button">
                    <b>{{ manufacturer ? manufacturer : 'Other' }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>

            <b-list-item v-for="item in itemsBySourceGroup[manufacturer]"
              :key="item.ID"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :item="<CompendiumItem>item"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="handleEquip(item as any)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                ">
              <template #checkbox>
                <v-checkbox-btn v-model="comparisons"
                  density="compact"
                  class="d-inline ml-3"
                  :value="item"
                  @click.stop />
              </template>
            </b-list-item>
          </v-list-group>
        </div>

        <div v-else-if="group === 'role'">
          <b-list-group v-for="role in roles"
            :key="`role-${role}`"
            no-indent
            :collection="role"
            :role="role">
            <b-list-item v-for="item in itemsByRoleGroup[role]"
              :key="item.ID"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              :item="<CompendiumItem>item"
              @equip="handleEquip(item)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                ">
              <template #checkbox>
                <v-checkbox-btn v-model="comparisons"
                  density="compact"
                  class="d-inline ml-3"
                  :value="item"
                  @click.stop />
              </template>
            </b-list-item>
          </b-list-group>
        </div>

        <div v-else-if="group === 'featureType'">
          <b-list-group v-for="featureType in featureTypes"
            :key="`feat-${featureType}`"
            :collection="featureType"
            :feature="featureType">
            <b-list-item v-for="item in itemsByFeatureTypeGroup[featureType]"
              :key="item.ID"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              :item="<CompendiumItem>item"
              @equip="handleEquip(item)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                ">
              <template #checkbox>
                <v-checkbox-btn v-model="comparisons"
                  density="compact"
                  class="d-inline ml-3"
                  :value="item"
                  @click.stop />
              </template>
            </b-list-item>
          </b-list-group>
        </div>

        <div v-else-if="group === 'origin'">
          <b-list-group v-for="origin in origins"
            :key="`origin-${origin}`"
            :collection="origin">
            <b-list-item v-for="item in itemsByOriginGroup[origin]"
              :key="item.ID"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              :item="<CompendiumItem>item"
              @equip="handleEquip(item)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                ">
              <template #checkbox>
                <v-checkbox-btn v-model="comparisons"
                  density="compact"
                  class="d-inline ml-3"
                  :value="item"
                  @click.stop />
              </template>
            </b-list-item>
          </b-list-group>
        </div>

        <div v-else-if="group === 'license'">
          <v-list-group v-for="license in licenses"
            :key="`lic-${license}`"
            :value="license"
            color="accent"
            class="pt-0">
            <template #activator="{ props }">
              <v-list-item tile
                v-bind="props">
                <template #title>
                  <span class="text-button">
                    <b>{{ license ? license : 'Other' }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>
            <b-list-item v-for="item in itemsByLicenseGroup[license]"
              :key="item.ID"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :item="<CompendiumItem>item"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="handleEquip(item)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                ">
              <template #checkbox>
                <v-checkbox-btn v-model="comparisons"
                  density="compact"
                  class="d-inline ml-3"
                  :value="item"
                  @click.stop />
              </template>
            </b-list-item>
          </v-list-group>
        </div>

        <div v-else-if="group === 'type'">
          <v-list-group v-for="subtype in subtypes"
            :key="`subtype-${subtype}`"
            :value="subtype"
            color="accent"
            class="pt-0">
            <template #activator="{ props }">
              <v-list-item tile
                v-bind="props">
                <template #title>
                  <span class="text-button">
                    <b>{{ subtype }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>
            <b-list-item v-for="item in itemsByType[subtype]"
              :key="item.ID"
              :selected="!!selectedItem && selectedItem.ID === item.ID"
              :compare="view === 'compare'"
              :item="<CompendiumItem>item"
              :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
              @equip="handleEquip(item)"
              @clicked="
                selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
                ">
              <template #checkbox>
                <v-checkbox-btn v-model="comparisons"
                  density="compact"
                  class="d-inline ml-3"
                  :value="item"
                  @click.stop />
              </template>
            </b-list-item>
          </v-list-group>
        </div>

        <div v-else>
          <b-list-item v-for="item in shownItems"
            :key="item.ID"
            :selected="!!selectedItem && selectedItem.ID === item.ID"
            :compare="view === 'compare'"
            :equippable="equippable && (!equipped || equipped.ID !== item.ID)"
            :item="<CompendiumItem>item"
            @equip="handleEquip(item)"
            @clicked="
              selectedItem && selectedItem.ID === item.ID ? selectItem(null) : selectItem(item)
              ">
            <template #checkbox>
              <v-checkbox-btn v-model="comparisons"
                density="compact"
                class="d-inline ml-3"
                :value="item"
                @click.stop />
            </template>
          </b-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-main class="mt-2">
      <div id="content"
        :style="`height: calc(100vh - ${getHeight}px)!important;`"
        style="overflow-y: scroll; padding-bottom: 40px">
        <div id="content"
          :style="view === 'table' ? '' : 'max-width: 1200px'"
          class="pa-4 mx-auto">
          <v-alert v-show="!!$slots.top"
            variant="outlined"
            class="mb-3 py-1"
            style="border-color: rgb(var(--v-theme-primary))">
            <slot name="top" />
          </v-alert>

          <div v-if="view === 'single'">
            <selector-list-item :hide-title="options.hideTitle"
              :selectable="equippable"
              :item="<CompendiumItem>selectedItem"
              @select="$emit('equip', $event)" />
          </div>

          <div v-else-if="view === 'scatter'">
            <selector-scatter :items="shownItems"
              :selected="<CompendiumItem>selectedItem"
              :group="group"
              :tier="tier"
              :short="!!$slots.top" />
          </div>

          <div v-else-if="view === 'bar'">
            <selector-bar :items="shownItems"
              :group="group"
              :manufacturers="manufacturers"
              :licenses="licenses"
              :lcp-filter="lcpFilter"
              :selected="<CompendiumItem>selectedItem"
              :tier="tier"
              :short="!!$slots.top" />
          </div>

          <div v-if="view === 'list' && itemType === 'License'">
            <v-row v-for="m in manufacturers"
              :key="`mf-list-${m}`">
              <v-col v-if="!!mf(m)"
                class="text-center pa-3">
                <v-row align="center"
                  justify="center">
                  <v-col cols="auto">
                    <cc-logo :source="mf(m)"
                      width="60px" />
                  </v-col>
                  <v-col cols="auto"
                    :class="$vuetify.display.mdAndDown ? 'heading h2' : 'heading mech'"
                    :style="`color: ${mf(m).GetColor($vuetify.theme.current.dark)}`">
                    {{ mf(m).Name }}
                  </v-col>
                </v-row>
                <v-expansion-panels accordion
                  focusable
                  flat>
                  <license-expandable :items="getItems(m)"
                    :selected="<any>selectedItem" />
                </v-expansion-panels>
              </v-col>
            </v-row>
          </div>

          <div v-for="item in <any[]>navOrderedItems"
            v-else-if="view === 'list'"
            :id="item.ID"
            :key="item.ID"
            class="mb-4">
            <selector-list-item :hide-title="options.hideTitle"
              :highlighted="selectedItem ? selectedItem.ID === item.ID : false"
              :selectable="equippable"
              :item="item"
              @select="$emit('equip', $event)" />
          </div>

          <div v-else-if="view === 'table'">
            <div v-if="group === 'lcp'">
              <div v-for="lcp in filteredLcps"
                :key="`lcp-table-${lcp}`">
                <div class="heading mech"
                  v-text="lcp" />
                <selector-table :headers="tableHeaders"
                  :items="searchFilter(itemsByLcp[lcp])"
                  :selectable="equippable"
                  :selected="<CompendiumItem>selectedItem"
                  @select="$emit('equip', $event)" />
              </div>
            </div>

            <div v-else-if="group === 'source'">
              <div v-for="manufacturer in manufacturers"
                :key="`mf-table-${manufacturer}`">
                <v-row align="center">
                  <v-col cols="auto">
                    <cc-logo :source="mf(manufacturer)"
                      width="60px" />
                  </v-col>
                  <v-col>
                    <div class="heading mech"
                      v-text="manufacturer" />
                  </v-col>
                </v-row>

                <selector-table :headers="tableHeaders"
                  :items="itemsBySourceGroup[manufacturer]"
                  :selectable="equippable"
                  :selected="<CompendiumItem>selectedItem"
                  @select="$emit('equip', $event)" />
              </div>
            </div>

            <div v-else-if="group === 'license'"
              cols="12">
              <div v-for="license in licenses"
                :key="`lic-table-${license}`">
                <div class="heading h2 text-accent mt-4"
                  v-text="license" />

                <selector-table :headers="tableHeaders"
                  :items="itemsByLicenseGroup[license]"
                  :selectable="equippable"
                  :selected="<CompendiumItem>selectedItem"
                  @select="$emit('equip', $event)" />
              </div>
            </div>

            <div v-else-if="group === 'type'"
              cols="12">
              <div v-for="subtype in subtypes"
                :key="`subtype-table-${subtype}`">
                <div class="heading h2 text-accent mt-4"
                  v-text="subtype" />

                <selector-table :headers="getMultiHeader(subtype)"
                  :items="itemsByType[subtype]"
                  :selectable="equippable"
                  :selected="<CompendiumItem>selectedItem"
                  @select="$emit('equip', $event)" />
              </div>
            </div>

            <div v-else-if="group === 'role'"
              cols="12">
              <div v-for="role in roles"
                :key="`role-table-${role}`">
                <div class="heading h2 text-accent mt-4"
                  v-text="role" />

                <selector-table :headers="tableHeaders"
                  :items="itemsByRoleGroup[role]"
                  :selectable="equippable"
                  :selected="<CompendiumItem>selectedItem"
                  @select="$emit('equip', $event)" />
              </div>
            </div>

            <div v-else-if="group === 'featureType'"
              cols="12">
              <div v-for="featureType in featureTypes"
                :key="`feat-table-${featureType}`">
                <div class="heading h2 text-accent mt-4"
                  v-text="featureType" />

                <selector-table :headers="tableHeaders"
                  :items="itemsByFeatureTypeGroup[featureType]"
                  :selectable="equippable"
                  :selected="<CompendiumItem>selectedItem"
                  @select="$emit('equip', $event)" />
              </div>
            </div>

            <div v-else-if="group === 'origin'"
              cols="12">
              <div v-for="origin in origins"
                :key="`origin-table-${origin}`">
                <div class="heading h2 text-accent mt-4"
                  v-text="origin" />

                <selector-table :headers="tableHeaders"
                  :items="itemsByOriginGroup[origin]"
                  :selectable="equippable"
                  :selected="<CompendiumItem>selectedItem"
                  @select="$emit('equip', $event)" />
              </div>
            </div>

            <div v-else
              cols="12">
              <selector-table :headers="tableHeaders"
                :items="shownItems"
                :selectable="equippable"
                :selected="<CompendiumItem>selectedItem"
                @select="$emit('equip', $event)" />
            </div>
          </div>

          <div v-else-if="view === 'cards'">
            <v-pagination v-model="page"
              total-visible="8"
              :length="Math.ceil(navOrderedItems.length / itemsPerPage)" />
            <v-row>
              <selector-card-item v-for="item in navOrderedItems.slice(minSliceIndex, maxSliceIndex)"
                :id="item.ID"
                :key="item.ID"
                :item="item"
                :highlighted="selectedItem ? selectedItem.ID === item.ID : false"
                :selectable="equippable"
                @select="$emit('equip', item)" />
            </v-row>
            <v-pagination v-model="page"
              total-visible="8"
              class="mt-8"
              :length="Math.ceil(navOrderedItems.length / itemsPerPage)" />
          </div>

          <div v-else-if="view === 'compare'">
            <selector-compare :items="comparisons"
              :selected="<CompendiumItem>selectedItem"
              :tier="tier"
              @clear="comparisons = []" />
          </div>
          <div style="height: 30px" />
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import ItemFilter from '@/classes/utility/ItemFilter';
import * as _ from 'lodash-es';

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

import { CompendiumItem, License } from '@/class';
import { CompendiumStore, UserStore } from '@/stores';
import { useMobile } from '@/mixins/useMobile';


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
    const indexA = mfOrder.indexOf(a.Source?.toLowerCase() || '');
    const indexB = mfOrder.indexOf(b.Source?.toLowerCase() || '');

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else if (indexA !== -1) {
      return -1;
    } else if (indexB !== -1) {
      return 1;
    } else return (a.Source?.toLowerCase() || '').localeCompare(b.Source?.toLowerCase() || '');
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
  name: 'CCCompendiumBrowser',
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
  mixins: [useMobile],
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
    }
  },
  emits: ['equip', 'select', 'view-change'],
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
    showNav: true,
  }),
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
    itemsByType() {
      return _.groupBy(this.shownItems, (x: any) => x.Type);
    },
    itemsBySourceGroup() {
      return _.groupBy(this.shownItems, (x: any) => x.Source);
    },
    itemsByLicenseGroup() {
      return _.groupBy(this.shownItems, (x: any) => x.License);
    },
    itemsByRoleGroup() {
      return _.groupBy(this.shownItems, (x: any) => x.Role);
    },
    itemsByFeatureTypeGroup() {
      return _.groupBy(this.shownItems, (x: any) => x.FeatureType);
    },
    itemsByOriginGroup() {
      return _.groupBy(this.shownItems, (x: any) => x.Origin?.Name);
    },
    itemsByLcpBySource() {
      const out = {} as Record<string, Record<string, any[]>>;
      for (const lcp of this.open) {
        if (this.itemsByLcp[lcp])
          out[lcp] = _.groupBy(this.itemsByLcp[lcp], (x: any) => x.IsExotic ? 'exotic' : x.Source);
      }
      return out;
    },
    itemsByLcpByRole() {
      const out = {} as Record<string, Record<string, any[]>>;
      for (const lcp of this.open) {
        if (this.itemsByLcp[lcp])
          out[lcp] = _.groupBy(
            this.itemsByLcp[lcp].filter((x: any) => x.Role),
            (x: any) => x.Role
          );
      }
      return out;
    },
    itemsByLcpByOrigin() {
      const out = {} as Record<string, Record<string, any[]>>;
      for (const lcp of this.open) {
        if (this.itemsByLcp[lcp])
          out[lcp] = _.groupBy(this.itemsByLcp[lcp], (x: any) => x.Origin?.Name);
      }
      return out;
    },
    manufacturers() {
      return _.uniq(this.shownItems.map((x: any) => x.Source)).sort((a, b) =>
        manufacturerSortFn(a, b)
      );
    },
    manufacturersByLcp() {
      const m = {} as any;
      for (const lcp of this.open) {
        if (this.itemsByLcp[lcp])
          m[lcp] = _.uniq(this.itemsByLcp[lcp].map((x: any) => x.IsExotic ? 'exotic' : x.Source)).sort((a, b) =>
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
      for (const lcp of this.open) {
        if (this.itemsByLcp[lcp])
          m[lcp] = _.uniq(this.itemsByLcp[lcp].map((x: any) => x.Role)).sort((a, b) => sortFn(a, b));
      }
      return m;
    },
    featureTypes() {
      return _.uniq(this.shownItems.map((x: any) => x.FeatureType)).sort((a, b) => sortFn(a, b));
    },
    featureTypesByLcp() {
      const m = {} as any;
      for (const lcp of this.open) {
        if (this.itemsByLcp[lcp])
          m[lcp] = _.uniq(this.itemsByLcp[lcp].map((x: any) => x.FeatureType)).sort((a, b) =>
            sortFn(a, b)
          );
      }
      return m;
    },
    origins() {
      return _.uniq(this.shownItems.map((x: any) => x.Origin?.Name).filter(Boolean)).sort((a, b) => sortFn(a, b));
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
      for (const lcp of this.open) {
        if (this.itemsByLcp[lcp])
          m[lcp] = _.uniq(this.itemsByLcp[lcp].map((x: any) => x.Origin?.Name)).sort((a, b) =>
            sortFn(a, b)
          );
      }
      return m;
    },
    lcps() {
      return Object.keys(this.itemsByLcp).sort((a, b) => sortFn(a, b));
    },
    filteredLcps() {
      const base = this.lcps.filter((l: string) => this.lcpFilter.includes(l));
      if (!this.search) return base;
      const s = this.search.toLowerCase();
      return base.filter((lcp: string) =>
        (this.itemsByLcp[lcp] || []).some((i: any) => i.Name.toLowerCase().includes(s))
      );
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
    navOrderedItems(): any[] {
      switch (this.group) {
        case 'source':
          return this.manufacturers.flatMap((m: string) => this.itemsBySourceGroup[m] || []);
        case 'role':
          return this.roles.flatMap((r: string) => this.itemsByRoleGroup[r] || []);
        case 'featureType':
          return this.featureTypes.flatMap((f: string) => this.itemsByFeatureTypeGroup[f] || []);
        case 'origin':
          return this.origins.flatMap((o: string) => this.itemsByOriginGroup[o] || []);
        case 'license':
          return this.licenses.flatMap((l: string) => this.itemsByLicenseGroup[l] || []);
        case 'type':
          return this.subtypes.flatMap((s: string) => this.itemsByType[s] || []);
        case 'lcp':
          return this.filteredLcps.flatMap((lcp: string) => this.searchFilter(this.itemsByLcp[lcp] || []));
        default:
          return this.shownItems;
      }
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
    isInModal() {
      //determine if we're in a modal
      const scrim = document.querySelector('.v-overlay__scrim');
      return scrim && window.getComputedStyle(scrim).display !== 'none';
    },
    horizPadding() {
      let pad = 24;
      if (this.view === 'table') pad = 12;
      if (this.$vuetify.display.xl) pad = 180;
      if (this.$vuetify.display.lg) pad = 60;
      if (this.$vuetify.display.md) pad = 24;
      if (this.$vuetify.display.sm) pad = 8;
      if (this.$vuetify.display.xs) pad = 8;

      if (this.isInModal) pad = pad / 1.6;

      return Math.round(pad);
    },
    getHeight() {
      if (this.$vuetify.display.xs) return 40;
      if (this.isInModal) return 98;
      return 50;
    },
  },
  watch: {
    group(val) {
      this.open = [];
      UserStore().User.SetView(`compendium_${this.itemType.toLowerCase()}_group`, val);
    },
    comparisons() {
      const idx = this.comparisons.findIndex((x) => x.ID === this.selectedItem?.ID);
      if (idx > -1) this.comparisons.splice(idx, 1);
    },
    items() {
      this.lcpFilter = this.lcps;
    },
    view(val) {
      this.$emit('view-change', val);
      UserStore().User.SetView(`compendium_${this.itemType.toLowerCase()}_view`, val);
    },
    search(val) {
      if (val) {
        const lcps = this.filteredLcps;
        const subGroups: string[] = [];
        for (const lcp of lcps) {
          const items: any[] = this.itemsByLcp[lcp] || [];
          _.uniq(items.map((x: any) => x.IsExotic ? 'exotic' : x.Source).filter(Boolean))
            .forEach((mf: string) => subGroups.push(`${lcp}_${mf}`));
          _.uniq(items.filter((x: any) => x.Role).map((x: any) => x.Role))
            .forEach((role: string) => subGroups.push(`${lcp}_${role}`));
          _.uniq(items.filter((x: any) => x.Origin?.Name).map((x: any) => x.Origin.Name))
            .forEach((origin: string) => subGroups.push(`${lcp}_${origin}`));
        }
        this.open = [
          ...lcps,
          ...subGroups,
          ...this.manufacturers,
          ...this.subtypes,
          ...this.licenses,
          ...this.roles,
          ...this.origins,
          ...this.featureTypes,
        ];
      }
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
      this.options.initialGroup
    );
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
          (this.navOrderedItems.findIndex((x: any) => x.ID === item.ID) + 1) / this.itemsPerPage
        );
        this.scrollTo(item.ID);
      }
      if (this.mobile && this.showNav) {
        this.showNav = false;
      }
      this.$emit('select', item);
    },
    scrollTo(id: string): void {
      const el = document.getElementById(id);
      if (el) {
        // const yOffset = -70;
        const mEl = document.getElementById('content');
        if (!mEl) return;
        // const y = el.getBoundingClientRect().top + mEl.scrollTop + yOffset;

        const rect = el.getBoundingClientRect();
        const y = rect.top + mEl.scrollTop - mEl.clientHeight / 2 + rect.height / 2;

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
    searchFilter(items: any[]) {
      if (!this.search) return items;
      const s = this.search.toLowerCase();
      return items.filter((i: any) => i.Name.toLowerCase().includes(s));
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

.hover-parent:hover>.img-hover {
  filter: brightness(100%);
}
</style>
