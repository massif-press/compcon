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
          :lcp-configs="lcpConfigs"
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
              <b-list-item v-for="item in filteredItemsByLcp[lcp]"
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
          <v-list-group v-for="manufacturer in manufacturerSources"
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
              :manufacturers="manufacturers"
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
            <v-row v-for="m in manufacturerSources"
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
                  :items="filteredItemsByLcp[lcp]"
                  :selectable="equippable"
                  :selected="<CompendiumItem>selectedItem"
                  @select="$emit('equip', $event)" />
              </div>
            </div>

            <div v-else-if="group === 'source'">
              <div v-for="manufacturer in manufacturerSources"
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
              <selector-card-item
                v-for="item in navOrderedItems.slice(minSliceIndex, maxSliceIndex)"
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

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
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

import { CompendiumItem } from '@/classes/CompendiumItem'
import License from '@/classes/pilot/components/license/License'
import { Manufacturer } from '@/classes/Manufacturer'
import { useMobile } from '@/composables/useMobile';
import { UserStore } from '@/stores';

defineOptions({ name: 'CCCompendiumBrowser' })

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

const ManufacturerSort = (mArr: any[]) =>
  mArr.sort((a, b) => {
    const indexA = mfOrder.indexOf(a.Source?.toLowerCase() || '');
    const indexB = mfOrder.indexOf(b.Source?.toLowerCase() || '');
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    else if (indexA !== -1) return -1;
    else if (indexB !== -1) return 1;
    else return (a.Source?.toLowerCase() || '').localeCompare(b.Source?.toLowerCase() || '');
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
  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
  else if (indexA !== -1) return -1;
  else if (indexB !== -1) return 1;
  else return a.toLowerCase().localeCompare(b.toLowerCase());
};

const display = useDisplay()
const { mobile } = useMobile()

const props = withDefaults(defineProps<{
  items: CompendiumItem[]
  itemType: string
  tableHeaders?: any[]
  multiHeaders?: Record<string, any>
  options: BrowserOptions
  equippable?: boolean
  equipped?: object
  tier?: number
  manufacturers?: Manufacturer[]
  lcpConfigs?: any[]
  viewKey?: string
}>(), {
  tableHeaders: () => [
    { title: 'Content Pack', key: 'LcpName' },
    { title: 'Name', key: 'Name' },
  ],
  tier: 1,
  manufacturers: () => [],
  lcpConfigs: () => [],
  viewKey: '',
})

const emit = defineEmits<{
  'equip': [item: CompendiumItem]
  'select': [item: CompendiumItem | License | null]
  'view-change': [val: string]
}>()

const open = ref([] as string[])
const view = ref('list')
const group = ref('source')
const search = ref('')
const otherFilter = ref({} as Record<string, any>)
const lcpFilter = ref([] as string[])
const selectedItem = ref(null as CompendiumItem | License | null)
const comparisons = ref([] as CompendiumItem[])
const page = ref(1)
const itemsPerPage = ref(15)
const showNav = ref(true)

const itemsByLcp = computed(() => _.groupBy(props.items as CompendiumItem[], 'LcpName'))
const shownItems = computed(() => {
  let shown = props.items as CompendiumItem[];
  shown = shown.filter((i: any) => lcpFilter.value.includes(i.LcpName));
  if (search.value) shown = shown.filter((i: any) => i.Name.toLowerCase().includes(search.value.toLowerCase()));
  if (Object.keys(otherFilter.value).length) shown = ItemFilter.Filter(shown, otherFilter.value);
  if (!showExotics.value) shown = shown.filter((i: CompendiumItem) => !i.IsExotic);
  if (shown.some((x: any) => x.Source)) shown = ManufacturerSort(shown);
  return shown;
})
const filteredItemsByLcp = computed(() => _.groupBy(shownItems.value, 'LcpName'))
const itemsByType = computed(() => _.groupBy(shownItems.value, (x: any) => x.Type))
const itemsBySourceGroup = computed(() => _.groupBy(shownItems.value, (x: any) => x.Source))
const itemsByLicenseGroup = computed(() => _.groupBy(shownItems.value, (x: any) => x.License))
const itemsByRoleGroup = computed(() => _.groupBy(shownItems.value, (x: any) => x.Role))
const itemsByFeatureTypeGroup = computed(() => _.groupBy(shownItems.value, (x: any) => x.FeatureType))
const itemsByOriginGroup = computed(() => _.groupBy(shownItems.value, (x: any) => x.Origin?.Name))
const itemsByLcpBySource = computed(() => {
  const out = {} as Record<string, Record<string, any[]>>;
  for (const lcp of open.value) {
    if (filteredItemsByLcp.value[lcp])
      out[lcp] = _.groupBy(filteredItemsByLcp.value[lcp], (x: any) => x.IsExotic ? 'exotic' : x.Source);
  }
  return out;
})
const itemsByLcpByRole = computed(() => {
  const out = {} as Record<string, Record<string, any[]>>;
  for (const lcp of open.value) {
    if (filteredItemsByLcp.value[lcp])
      out[lcp] = _.groupBy(filteredItemsByLcp.value[lcp].filter((x: any) => x.Role), (x: any) => x.Role);
  }
  return out;
})
const itemsByLcpByOrigin = computed(() => {
  const out = {} as Record<string, Record<string, any[]>>;
  for (const lcp of open.value) {
    if (filteredItemsByLcp.value[lcp])
      out[lcp] = _.groupBy(filteredItemsByLcp.value[lcp], (x: any) => x.Origin?.Name);
  }
  return out;
})
const manufacturerSources = computed(() =>
  _.uniq(shownItems.value.map((x: any) => x.Source)).sort((a, b) => manufacturerSortFn(a, b))
)
const manufacturersByLcp = computed(() => {
  const m = {} as any;
  for (const lcp of open.value) {
    if (filteredItemsByLcp.value[lcp])
      m[lcp] = _.uniq(filteredItemsByLcp.value[lcp].map((x: any) => x.IsExotic ? 'exotic' : x.Source)).sort(sortFn);
  }
  return m;
})
const roles = computed(() => _.uniq(shownItems.value.map((x: any) => x.Role)).sort(sortFn))
const rolesByLcp = computed(() => {
  const m = {} as any;
  for (const lcp of open.value) {
    if (filteredItemsByLcp.value[lcp])
      m[lcp] = _.uniq(filteredItemsByLcp.value[lcp].map((x: any) => x.Role)).sort(sortFn);
  }
  return m;
})
const featureTypes = computed(() => _.uniq(shownItems.value.map((x: any) => x.FeatureType)).sort(sortFn))
const origins = computed(() => _.uniq(shownItems.value.map((x: any) => x.Origin?.Name).filter(Boolean)).sort(sortFn))
const originsByLcp = computed(() => {
  const m = {} as any;
  for (const lcp of open.value) {
    if (filteredItemsByLcp.value[lcp])
      m[lcp] = _.uniq(filteredItemsByLcp.value[lcp].map((x: any) => x.Origin?.Name)).sort(sortFn);
  }
  return m;
})
const lcps = computed(() => Object.keys(itemsByLcp.value).sort(sortFn))
const filteredLcps = computed(() => Object.keys(filteredItemsByLcp.value).sort(sortFn))
const licenses = computed(() => _.uniq(shownItems.value.map((x: any) => x.License)).sort(sortFn))
const subtypes = computed(() => _.uniq(shownItems.value.map((x: any) => x.Type)).sort(sortFn))
const showExotics = computed(() => props.options.showExotics ?? false)
const navOrderedItems = computed((): any[] => {
  switch (group.value) {
    case 'source': return manufacturerSources.value.flatMap((m: string) => itemsBySourceGroup.value[m] || []);
    case 'role': return roles.value.flatMap((r: string) => itemsByRoleGroup.value[r] || []);
    case 'featureType': return featureTypes.value.flatMap((f: string) => itemsByFeatureTypeGroup.value[f] || []);
    case 'origin': return origins.value.flatMap((o: string) => itemsByOriginGroup.value[o] || []);
    case 'license': return licenses.value.flatMap((l: string) => itemsByLicenseGroup.value[l] || []);
    case 'type': return subtypes.value.flatMap((s: string) => itemsByType.value[s] || []);
    case 'lcp': return filteredLcps.value.flatMap((lcp: string) => filteredItemsByLcp.value[lcp] || []);
    default: return shownItems.value;
  }
})
const minSliceIndex = computed(() => (page.value - 1) * itemsPerPage.value)
const maxSliceIndex = computed(() => page.value * itemsPerPage.value)
const isInModal = computed(() => {
  const scrim = document.querySelector('.v-overlay__scrim');
  return scrim && window.getComputedStyle(scrim).display !== 'none';
})
const getHeight = computed(() => {
  if (display.xs.value) return 40;
  if (isInModal.value) return 98;
  return 50;
})

watch(group, () => { open.value = []; saveView(); })
watch(comparisons, () => {
  const idx = comparisons.value.findIndex((x) => x.ID === selectedItem.value?.ID);
  if (idx > -1) comparisons.value.splice(idx, 1);
})
watch(() => props.items, () => { lcpFilter.value = lcps.value; })
watch(view, (val) => { emit('view-change', val); saveView(); })
watch(showNav, () => saveView())
watch(otherFilter, () => saveView(), { deep: true })
watch(search, (val) => {
  if (val) {
    const curLcps = filteredLcps.value;
    const subGroups: string[] = [];
    for (const lcp of curLcps) {
      const lcpItems: any[] = itemsByLcp.value[lcp] || [];
      _.uniq(lcpItems.map((x: any) => x.IsExotic ? 'exotic' : x.Source).filter(Boolean))
        .forEach((mfId: string) => subGroups.push(`${lcp}_${mfId}`));
      _.uniq(lcpItems.filter((x: any) => x.Role).map((x: any) => x.Role))
        .forEach((role: string) => subGroups.push(`${lcp}_${role}`));
      _.uniq(lcpItems.filter((x: any) => x.Origin?.Name).map((x: any) => x.Origin.Name))
        .forEach((origin: string) => subGroups.push(`${lcp}_${origin}`));
    }
    open.value = [
      ...curLcps, ...subGroups,
      ...manufacturerSources.value, ...subtypes.value,
      ...licenses.value, ...roles.value, ...origins.value, ...featureTypes.value,
    ];
  }
})

lcpFilter.value = lcps.value
view.value = props.options.initialView
group.value = props.options.initialGroup
loadView()

function saveView() {
  if (!props.viewKey) return;
  UserStore().User.SetView(props.viewKey, {
    view: view.value, group: group.value,
    showNav: showNav.value, otherFilter: otherFilter.value,
  });
}
function loadView() {
  if (!props.viewKey) return;
  const saved = UserStore().User.View(props.viewKey, null);
  if (!saved) return;
  if (saved.view !== undefined) view.value = saved.view;
  if (saved.group !== undefined) group.value = saved.group;
  if (saved.showNav !== undefined) showNav.value = saved.showNav;
  if (saved.otherFilter !== undefined) otherFilter.value = saved.otherFilter;
}
function getItems(manufacturer: string, lcp?: string): CompendiumItem[] | License[] {
  if (lcp) return itemsByLcp.value[lcp].filter((i: any) => i.Source === manufacturer);
  return shownItems.value.filter((i: any) => i.Source === manufacturer);
}
function selectItem(item: CompendiumItem | License | null) {
  selectedItem.value = item;
  if (item) {
    page.value = Math.ceil(
      (navOrderedItems.value.findIndex((x: any) => x.ID === item.ID) + 1) / itemsPerPage.value
    );
    scrollTo(item.ID);
  }
  if (mobile.value && showNav.value) showNav.value = false;
  emit('select', item);
}
function scrollTo(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    const mEl = document.getElementById('content');
    if (!mEl) return;
    const rect = el.getBoundingClientRect();
    const y = rect.top + mEl.scrollTop - mEl.clientHeight / 2 + rect.height / 2;
    mEl.scrollTo({ top: y, behavior: 'smooth' });
  }
}
function mf(id: string) {
  return (
    (props.manufacturers as Manufacturer[]).find((x) => x.ID === id) || {
      GetColor: () => 'black',
      Name: 'err',
      LogoIsExternal: false,
      Icon: 'gms',
    }
  );
}
function setAllLcps() {
  if (lcpFilter.value.length === lcps.value.length) lcpFilter.value = [];
  else lcpFilter.value = lcps.value;
}
function getMultiHeader(subtype: string) {
  return props.multiHeaders && props.multiHeaders[subtype.replace(/\s/g, '')]
    ? props.multiHeaders[subtype.replace(/\s/g, '')]
    : props.tableHeaders;
}
function handleEquip(item: CompendiumItem) {
  emit('equip', item);
  if (selectedItem.value && selectedItem.value.ID === item.ID) {
    selectItem(null);
    selectedItem.value = null;
  }
}
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
