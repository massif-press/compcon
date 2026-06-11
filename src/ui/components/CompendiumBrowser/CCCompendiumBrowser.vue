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

        <v-text-field v-model="searchRaw"
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
                v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
                :key="`role-${lcp}-${role}`"
                :parent="lcp"
                :collection="role"
                :role="role">
                <b-list-item v-for="item in (itemsByLcpByRole[lcp]?.[role] ?? [])"
                  v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
                :key="`origin-${lcp}-${origin}`"
                :parent="lcp"
                :collection="origin">
                <b-list-item v-for="item in (itemsByLcpByOrigin[lcp]?.[origin] ?? [])"
                  v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
                :key="`mf-${lcp}-${manufacturer}`"
                :parent="lcp"
                :collection="manufacturer"
                :manufacturer="mf(manufacturer)">
                <b-list-item v-for="item in (itemsByLcpBySource[lcp]?.[manufacturer] ?? [])"
                  v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
                    <b>{{ manufacturer ? manufacturer : $t('ui.widget.other') }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>

            <b-list-item v-for="item in itemsBySourceGroup[manufacturer]"
              v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
              v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
              v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
              v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
                    <b>{{ license ? license : $t('ui.widget.other') }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>
            <b-list-item v-for="item in itemsByLicenseGroup[license]"
              v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
              v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
            v-memo="[item.ID, selectedItem?.ID === item.ID, comparisons.includes(item), equippable && (!equipped || equipped?.ID !== item.ID), view]"
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
        :style="`height: calc(100vh - ${getHeight}px)!important; overflow-y: ${view === 'list' ? 'hidden' : 'scroll'}; padding-bottom: ${view === 'list' ? '0' : '40'}px`">
        <div :style="view === 'table' ? '' : 'max-width: 1200px'"
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

          <v-virtual-scroll v-else-if="view === 'list'"
            ref="listScroller"
            :items="navOrderedItems"
            :style="`height: calc(100vh - ${getHeight}px - 32px)`"
            class="vscroll-list">
            <template #default="{ item }">
              <div class="mb-4">
                <selector-list-item :hide-title="options.hideTitle"
                  :highlighted="selectedItem ? selectedItem.ID === item.ID : false"
                  :selectable="equippable"
                  :item="item"
                  @select="$emit('equip', $event)" />
              </div>
            </template>
          </v-virtual-scroll>

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
import { computed, ref, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import type { VVirtualScroll } from 'vuetify/components'
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
import { useCompendiumFacets } from './useCompendiumFacets'
import { useCompendiumViewState } from './useCompendiumViewState'

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

const display = useDisplay()
const mobile = display.smAndDown

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

const listScroller = ref<InstanceType<typeof VVirtualScroll> | null>(null)

const open = ref([] as string[])
const view = ref('list')
const group = ref('source')
const searchRaw = ref('')
const search = ref('')
const _debouncedSetSearch = _.debounce((val: string) => { search.value = val }, 200)
watch(searchRaw, _debouncedSetSearch)
const otherFilter = ref({} as Record<string, any>)
const lcpFilter = ref([] as string[])
const selectedItem = ref(null as CompendiumItem | License | null)
const comparisons = ref([] as CompendiumItem[])
const page = ref(1)
const itemsPerPage = ref(15)
const showNav = ref(true)

const showExotics = computed(() => props.options.showExotics ?? false)

const {
  itemsByLcp,
  shownItems,
  filteredItemsByLcp,
  itemsByType,
  itemsBySourceGroup,
  itemsByLicenseGroup,
  itemsByRoleGroup,
  itemsByFeatureTypeGroup,
  itemsByOriginGroup,
  itemsByLcpBySource,
  itemsByLcpByRole,
  itemsByLcpByOrigin,
  manufacturerSources,
  manufacturersByLcp,
  roles,
  rolesByLcp,
  featureTypes,
  origins,
  originsByLcp,
  lcps,
  filteredLcps,
  licenses,
  subtypes,
  navOrderedItems,
  getItems,
} = useCompendiumFacets({
  items: () => props.items,
  itemType: () => props.itemType,
  showExotics: () => showExotics.value,
  search,
  lcpFilter,
  otherFilter,
  group,
  open,
})

const { saveView, loadView } = useCompendiumViewState({
  viewKey: () => props.viewKey,
  view,
  group,
  showNav,
  otherFilter,
})

const minSliceIndex = computed(() => (page.value - 1) * itemsPerPage.value)
const maxSliceIndex = computed(() => page.value * itemsPerPage.value)
const isInModal = ref(false)
onMounted(() => {
  const scrim = document.querySelector('.v-overlay__scrim')
  isInModal.value = !!(scrim && window.getComputedStyle(scrim).display !== 'none')
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
watch(otherFilter, () => saveView())
watch(shownItems, () => {
  if (view.value === 'list') listScroller.value?.scrollToIndex(0)
})
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

function selectItem(item: CompendiumItem | License | null) {
  selectedItem.value = item;
  if (item) {
    const idx = navOrderedItems.value.findIndex((x: any) => x.ID === item.ID);
    if (view.value === 'list') {
      if (idx >= 0) listScroller.value?.scrollToIndex(idx);
    } else {
      page.value = Math.ceil((idx + 1) / itemsPerPage.value);
      scrollTo(item.ID);
    }
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
const _mfFallback = { GetColor: () => 'black', Name: 'err', LogoIsExternal: false, Icon: 'gms' }
const _mfMap = computed(() => new Map((props.manufacturers as Manufacturer[]).map((m) => [m.ID, m])))
function mf(id: string) {
  return _mfMap.value.get(id) ?? _mfFallback
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

.vscroll-list {
  overflow-y: auto;
}

.img-hover {
  filter: brightness(80%) saturate(0.3);
  transition: all 0.15s ease-in-out;
}

.hover-parent:hover>.img-hover {
  filter: brightness(100%);
}
</style>
