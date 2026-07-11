<template>
  <v-main ref="mainEl"
    class="mt-2 ml-2"
    :style="`height: ${contentHeight}px; overflow-y: ${useVirtualScroll ? 'hidden' : 'auto'}; overflow-x: ${view === 'table' ? 'auto' : 'hidden'}; min-height: 0`">
    <div id="content"
      :style="`height: 100%; padding-bottom: ${useVirtualScroll ? '0' : '40'}px`">
      <div :style="view === 'table' ? '' : 'max-width: 1200px'"
        class="pa-4 mx-auto">
        <v-alert v-show="hasSlotContent($slots.top)"
          ref="topEl"
          variant="outlined"
          class="mb-3 py-1"
          style="border-color: rgb(var(--v-theme-primary)); position: sticky; top: 0; z-index: 2; background: rgb(var(--v-theme-surface))">
          <slot name="top" />
        </v-alert>

        <div v-if="view === 'single'">
          <slot v-if="$slots.item && selectedItem"
            name="item"
            :item="selectedItem" />
          <selector-list-item v-else
            :hide-title="bprops.options.hideTitle"
            :selectable="bprops.equippable"
            :item="<CompendiumItem>selectedItem"
            @select="emitEquip($event)" />
        </div>

        <div v-else-if="view === 'scatter'">
          <selector-scatter :items="facets.shownItems.value"
            :selected="<CompendiumItem>selectedItem"
            :group="group"
            :tier="bprops.tier"
            :manufacturers="bprops.manufacturers"
            :short="hasSlotContent($slots.top)" />
        </div>

        <div v-else-if="view === 'bar'">
          <selector-bar :items="facets.shownItems.value"
            :group="group"
            :manufacturers="bprops.manufacturers"
            :licenses="facets.licenses.value"
            :lcp-filter="lcpFilter"
            :selected="<CompendiumItem>selectedItem"
            :tier="bprops.tier"
            :short="hasSlotContent($slots.top)" />
        </div>

        <div v-if="view === 'list' && bprops.itemType === 'License'">
          <v-row v-for="m in facets.manufacturerSources.value"
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
                <license-expandable :items="facets.getItems(m)"
                  :selected="<any>selectedItem"
                  :active-ids="activeIds"
                  :controller="bprops.controller"
                  :selectable="!!bprops.controller"
                  @add="bprops.controller.AddLicense($event)"
                  @remove="bprops.controller.RemoveLicense($event)" />
              </v-expansion-panels>
            </v-col>
          </v-row>
        </div>

        <v-virtual-scroll v-else-if="view === 'list'"
          ref="listScroller"
          :items="facets.navOrderedItems.value"
          :style="`height: ${listHeight}px`"
          class="vscroll-list">
          <template #default="{ item }">
            <div class="mb-4"
              :style="$slots.item ? [
                selectedItem && selectedItem.ID === item.ID ? { border: '2px solid rgb(var(--v-theme-accent))' } : {},
                activeIds.includes(item.ID) ? { backgroundColor: 'rgba(var(--v-theme-primary), 0.15)' } : {},
              ] : {}">
              <slot v-if="$slots.item"
                name="item"
                :item="item" />
              <selector-list-item v-else
                :hide-title="bprops.options.hideTitle"
                :highlighted="selectedItem ? selectedItem.ID === item.ID : false"
                :selectable="bprops.equippable"
                :item="item"
                @select="emitEquip($event)" />
            </div>
          </template>
        </v-virtual-scroll>

        <div v-else-if="view === 'table'">
          <div v-for="g in tableGroups"
            :key="`tbl-${g.key}`">
            <v-row v-if="g.logo"
              align="center">
              <v-col cols="auto">
                <cc-logo :source="g.logo"
                  width="60px" />
              </v-col>
              <v-col>
                <div class="heading mech"
                  v-text="g.label" />
              </v-col>
            </v-row>
            <div v-else-if="g.label"
              :class="g.headClass"
              v-text="g.label" />

            <selector-table :headers="g.headers"
              :items="g.items"
              :selectable="bprops.equippable"
              :selected="<CompendiumItem>selectedItem"
              @select="emitEquip($event)" />
          </div>
        </div>

        <div v-else-if="view === 'cards'">
          <v-pagination v-model="page"
            total-visible="8"
            :length="Math.ceil(facets.navOrderedItems.value.length / itemsPerPage)" />
          <v-row>
            <selector-card-item
              v-for="item in facets.navOrderedItems.value.slice(minSliceIndex, maxSliceIndex)"
              :id="item.ID"
              :key="item.ID"
              :item="item"
              :highlighted="selectedItem ? selectedItem.ID === item.ID : false"
              :selectable="bprops.equippable"
              @select="emitEquip(item)" />
          </v-row>
          <v-pagination v-model="page"
            total-visible="8"
            class="mt-8"
            :length="Math.ceil(facets.navOrderedItems.value.length / itemsPerPage)" />
        </div>

        <div v-else-if="view === 'compare'">
          <selector-compare :items="comparisons"
            :selected="<CompendiumItem>selectedItem"
            :tier="bprops.tier"
            @clear="comparisons = []" />
        </div>
        <div style="height: 30px" />
      </div>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { computed, ref, watch, inject, onMounted, onBeforeUnmount } from 'vue'
import { useDisplay } from 'vuetify'
import type { VVirtualScroll } from 'vuetify/components'

import SelectorListItem from '../views/_selectorListItem.vue'
import SelectorCardItem from '../views/_selectorCardItem.vue'
import SelectorTable from '../views/_selectorTable.vue'
import SelectorScatter from '../views/_selectorScatter.vue'
import SelectorBar from '../views/_selectorBar.vue'
import SelectorCompare from '../views/_selectorCompare.vue'
import LicenseExpandable from './_license-expandable.vue'

import { CompendiumItem } from '@/classes/CompendiumItem'
import type License from '@/classes/pilot/components/license/License'
import { CompendiumBrowserKey } from '../browserContext'
import { hasSlotContent } from '../hasSlotContent'

defineOptions({ name: 'BrowserContent' })

const ctx = inject(CompendiumBrowserKey)!
const { facets, selectedItem, comparisons, view, group, lcpFilter, emitEquip, mf } = ctx
const bprops = ctx.props

const { smAndDown: mobile } = useDisplay()

const listScroller = ref<InstanceType<typeof VVirtualScroll> | null>(null)
const mainEl = ref<any>(null)
const topEl = ref<any>(null)

const MOBILE_FOOTER_RESERVE = 12

const contentHeight = ref(window.innerHeight)
const listHeight = ref(window.innerHeight)
const page = ref(1)
const itemsPerPage = ref(15)

const activeIds = computed<string[]>(() => ctx.props.activeIds ?? [])

const minSliceIndex = computed(() => (page.value - 1) * itemsPerPage.value)
const maxSliceIndex = computed(() => page.value * itemsPerPage.value)

const useVirtualScroll = computed(() => view.value === 'list' && bprops.itemType !== 'License')

function getMultiHeader(subtype: string) {
  const key = subtype.replace(/\s/g, '')
  return bprops.multiHeaders && bprops.multiHeaders[key] ? bprops.multiHeaders[key] : bprops.tableHeaders
}

const tableGroups = computed(() => {
  const th = bprops.tableHeaders
  const accent = 'heading h2 text-accent mt-4'
  const map = (keys: string[], get: (k: string) => any[], opts: any = {}) =>
    keys.map((k) => ({ key: k, label: k, headClass: accent, logo: null, headers: th, items: get(k), ...opts }))
  switch (group.value) {
    case 'lcp':
      return map(facets.filteredLcps.value, (k) => facets.filteredItemsByLcp.value[k], { headClass: 'heading mech' })
    case 'source':
      return facets.manufacturerSources.value.map((k) => ({
        key: k, label: k, headClass: 'heading mech', logo: mf(k), headers: th, items: facets.itemsBySourceGroup.value[k],
      }))
    case 'license':
      return map(facets.licenses.value, (k) => facets.itemsByLicenseGroup.value[k])
    case 'type':
      return facets.subtypes.value.map((k) => ({
        key: k, label: k, headClass: accent, logo: null, headers: getMultiHeader(k), items: facets.itemsByType.value[k],
      }))
    case 'role':
      return map(facets.roles.value, (k) => facets.itemsByRoleGroup.value[k])
    case 'featureType':
      return map(facets.featureTypes.value, (k) => facets.itemsByFeatureTypeGroup.value[k])
    case 'origin':
      return map(facets.origins.value, (k) => facets.itemsByOriginGroup.value[k])
    default:
      return [{ key: 'all', label: null, headClass: '', logo: null, headers: th, items: facets.shownItems.value }]
  }
})

function measureContentHeight() {
  const root: HTMLElement | undefined = mainEl.value?.$el ?? mainEl.value
  if (!root) return
  const rect = root.getBoundingClientRect()
  const overlay = root.closest('.v-overlay__content') as HTMLElement | null
  const bottom = bprops.pageScroll && mobile.value
    ? window.innerHeight - MOBILE_FOOTER_RESERVE
    : overlay ? overlay.getBoundingClientRect().bottom : window.innerHeight
  contentHeight.value = Math.max(0, Math.floor(bottom - rect.top))

  const listEl: HTMLElement | undefined = listScroller.value?.$el
  if (listEl) {
    const listTop = listEl.getBoundingClientRect().top
    listHeight.value = Math.max(0, Math.floor(bottom - listTop - 16))
  } else {
    listHeight.value = Math.max(0, contentHeight.value - 32)
  }
}

function scrollTo(id: string): void {
  const el = document.getElementById(id)
  const container: HTMLElement | undefined = mainEl.value?.$el ?? mainEl.value
  if (!el || !container) return
  const elRect = el.getBoundingClientRect()
  const cRect = container.getBoundingClientRect()
  const y = elRect.top - cRect.top + container.scrollTop - container.clientHeight / 2 + elRect.height / 2
  container.scrollTo({ top: y, behavior: 'smooth' })
}

function revealItem(item: CompendiumItem | License) {
  const idx = facets.navOrderedItems.value.findIndex((x: any) => x.ID === item.ID)
  if (view.value === 'list') {
    if (useVirtualScroll.value) {
      if (idx >= 0) listScroller.value?.scrollToIndex(idx)
    } else {
      scrollTo(item.ID)
    }
  } else {
    page.value = Math.ceil((idx + 1) / itemsPerPage.value)
    scrollTo(item.ID)
  }
}

defineExpose({ revealItem })

watch(facets.shownItems, () => {
  if (view.value === 'list') listScroller.value?.scrollToIndex(0)
})

let overlayObserver: ResizeObserver | null = null
let topObserver: ResizeObserver | null = null
let overlayEl: HTMLElement | null = null

function onOverlayTransition(e: TransitionEvent) {
  if (e.target === overlayEl) measureContentHeight()
}

onMounted(() => {
  measureContentHeight()
  requestAnimationFrame(measureContentHeight)
  window.addEventListener('resize', measureContentHeight)
  const root: HTMLElement | undefined = mainEl.value?.$el ?? mainEl.value
  const overlay = root?.closest('.v-overlay__content')
  if (overlay) {
    overlayObserver = new ResizeObserver(() => measureContentHeight())
    overlayObserver.observe(overlay)
    overlayEl = overlay as HTMLElement
    overlayEl.addEventListener('transitionend', onOverlayTransition)
  }
  const topRoot: HTMLElement | undefined = topEl.value?.$el ?? topEl.value
  if (topRoot) {
    topObserver = new ResizeObserver(() => measureContentHeight())
    topObserver.observe(topRoot)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', measureContentHeight)
  overlayObserver?.disconnect()
  topObserver?.disconnect()
  overlayEl?.removeEventListener('transitionend', onOverlayTransition)
})
</script>

<style scoped>
.vscroll-list {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
