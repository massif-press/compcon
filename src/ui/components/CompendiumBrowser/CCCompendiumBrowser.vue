<template>
  <v-layout class="browser-layout">
    <div style="position: absolute; z-index: 999;"
      class="open-panel"
      role="button"
      tabindex="0"
      :aria-label="$t('common.a11y.toggleNavigation')"
      :aria-expanded="showNav"
      :style="`left: ${showNav ? (mobile ? '322' : '349') : '0'}px; top: 30%; bottom: 30%; width: ${showNav ? '14' : '22'}px; border-top-right-radius: 14px; border-bottom-right-radius: 14px; corner-shape: bevel;`"
      @click="toggleNav()"
      @keydown.enter="toggleNav()"
      @keydown.space.prevent="toggleNav()">
      <div class="open-panel-chevron"
        :style="`left: ${showNav ? '-9' : '2'}px;`">
        <cc-button :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
          color="primary"
          size="large"
          hide-light
          tabindex="-1"
          aria-hidden="true"
          @click="toggleNav()" />
      </div>
    </div>

    <v-navigation-drawer v-model="showNav"
      :width="mobile ? 320 : 350">
      <v-list v-model:opened="open"
        density="compact"
        style="padding-bottom: 60px"
        tile
        nav>
        <v-alert v-show="hasSlotContent($slots.header)"
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

        <slot name="nav-list"
          :select-item="selectItem"
          :selected-item="selectedItem"
          :shown-items="shownItems">
          <browser-nav-list />
        </slot>
      </v-list>
    </v-navigation-drawer>

    <browser-content ref="contentRef">
      <template #top>
        <slot name="top" />
      </template>
      <template v-if="$slots.item"
        #item="slotProps">
        <slot name="item"
          v-bind="slotProps" />
      </template>
    </browser-content>
  </v-layout>
</template>

<script setup lang="ts">
import { computed, ref, watch, provide } from 'vue'
import { useDisplay } from 'vuetify'
import * as _ from 'lodash-es';

import bViewToggle from './components/_b-view-toggle.vue';
import bGroupToggle from './components/_b-group-toggle.vue';
import bFilterSet from './components/_b-filter-set.vue';
import BrowserNavList from './components/_BrowserNavList.vue';
import BrowserContent from './components/_BrowserContent.vue';

import { CompendiumItem } from '@/classes/CompendiumItem'
import License from '@/classes/pilot/components/license/License'
import { Manufacturer } from '@/classes/Manufacturer'
import { useCompendiumFacets } from './useCompendiumFacets'
import { useCompendiumViewState } from './useCompendiumViewState'
import { CompendiumBrowserKey, type BrowserOptions } from './browserContext'
import { hasSlotContent } from './hasSlotContent'

defineOptions({ name: 'CCCompendiumBrowser' })

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
  activeIds?: string[]
  outlineSelected?: boolean
  controller?: any
  pageScroll?: boolean
}>(), {
  tableHeaders: () => [
    { title: 'Content Pack', key: 'LcpName' },
    { title: 'Name', key: 'Name' },
  ],
  tier: 1,
  manufacturers: () => [],
  lcpConfigs: () => [],
  viewKey: '',
  activeIds: () => [],
})

const emit = defineEmits<{
  'equip': [item: CompendiumItem]
  'select': [item: CompendiumItem | License | null]
  'view-change': [val: string]
  'group-change': [val: string]
}>()

const contentRef = ref<InstanceType<typeof BrowserContent> | null>(null)

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
const showNav = ref(true)

const facets = useCompendiumFacets({
  items: () => props.items,
  itemType: () => props.itemType,
  showExotics: () => props.options.showExotics ?? false,
  search,
  lcpFilter,
  otherFilter,
  group,
  open,
})
const {
  itemsByLcp,
  lcps,
  filteredLcps,
  manufacturerSources,
  roles,
  featureTypes,
  origins,
  licenses,
  subtypes,
  shownItems,
} = facets

const { saveView, loadView } = useCompendiumViewState({
  viewKey: () => props.viewKey,
  view,
  group,
  showNav,
  otherFilter,
})

watch(group, (val) => { open.value = []; saveView(); emit('group-change', val); })
watch(comparisons, () => {
  const idx = comparisons.value.findIndex((x) => x.ID === selectedItem.value?.ID);
  if (idx > -1) comparisons.value.splice(idx, 1);
})
watch(() => props.items, () => { lcpFilter.value = lcps.value; })
watch(view, (val) => { emit('view-change', val); saveView(); })
watch(showNav, () => saveView())
watch(otherFilter, () => saveView())
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

function toggleNav() {
  showNav.value = !showNav.value
}
function toggleItem(item: CompendiumItem | License) {
  selectItem(selectedItem.value?.ID === item.ID ? null : item)
}
function isEquippable(item: CompendiumItem) {
  return !!props.equippable && (!props.equipped || (props.equipped as any).ID !== item.ID)
}
function selectItem(item: CompendiumItem | License | null) {
  selectedItem.value = item;
  if (item) contentRef.value?.revealItem(item);
  if (mobile.value && showNav.value) showNav.value = false;
  emit('select', item);
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
function emitEquip(item: CompendiumItem) {
  emit('equip', item);
}
function handleEquip(item: CompendiumItem) {
  emit('equip', item);
  if (selectedItem.value?.ID === item.ID) selectItem(null);
}

provide(CompendiumBrowserKey, {
  props,
  facets,
  selectedItem,
  comparisons,
  view,
  group,
  open,
  lcpFilter,
  isEquippable,
  toggleItem,
  handleEquip,
  emitEquip,
  mf,
})
</script>

<style scoped>
.open-panel {
  cursor: pointer;
  background-color: rgb(var(--v-theme-primary));
  transition: background-color 0.3s ease;
}

.open-panel:hover {
  background-color: rgb(var(--v-theme-accent))
}

.open-panel-chevron {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.open-panel :deep(.v-btn) {
  transition: background-color 0.3s ease;
}

.open-panel:hover :deep(.v-btn) {
  background-color: rgb(var(--v-theme-accent)) !important;
}

/* Cancel cc-dialog's px-4 gutter so the browser (and its collapse strip) sits
   flush with the dialog edge. Desktop only; mobile modals have no px-4. */
@media (min-width: 960px) {
  .v-overlay__content .browser-layout {
    margin-left: -16px;
    margin-right: -16px;
  }
}
</style>
