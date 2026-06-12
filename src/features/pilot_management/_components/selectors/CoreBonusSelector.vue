<template>
  <missing-item-alert v-if="pilot.CoreBonusController.MissingCoreBonuses.length"
    type="core bonuses"
    :items="pilot.CoreBonusController.MissingCoreBonuses"
    @remove="pilot.CoreBonusController.RemoveCoreBonus($event)" />

  <selector title="Pilot Core Bonuses"
    :success="!pilot.CoreBonusController.IsMissingCBs"
    :selected="pilot.CoreBonusController.CurrentCBPoints"
    :total="pilot.CoreBonusController.MaxCBPoints">
    <template #float>
      <v-card v-if="!pilot.CoreBonusController.IsMissingCBs"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="success"
        v-text="$t('pm.selectors.coreBonusSelectionComplete')" />
      <v-card
        v-if="pilot.CoreBonusController.MaxCBPoints > pilot.CoreBonusController.CurrentCBPoints"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="accent"
        v-text="`${pilot.CoreBonusController.MaxCBPoints - pilot.CoreBonusController.CurrentCBPoints}
            Core Bonus Selections remaining`
          " />

      <cc-button variant="text"
        size="x-small"
        block
        :disabled="!pilot.CoreBonusController.CoreBonuses.length"
        @click="pilot.CoreBonusController.ClearCoreBonuses()">
        {{ $t('common.reset') }}
      </cc-button>
    </template>

    <template #jump>
      <div class="px-2">
        <cc-select v-model="jump"
          label="jump to"
          color="primary"
          variant="outlined"
          :items="jumpItems" />
      </div>
    </template>

    <template #right-column>
      <v-expansion-panels v-model="open"
        multiple
        flat
        tile>
        <v-expansion-panel v-for="{ manufacturer, coreBonuses } in manufacturersWithCBs"
          :key="`panel_${manufacturer.ID}`">
          <v-expansion-panel-title>
            <div class="pr-5">
              <div class="heading h1"
                :style="`color: ${manufacturer.Color}`"
                style="font-size: calc(20px + 1vw)">
                <v-icon :icon="manufacturer.Icon"
                  class="mt-n1" />
                {{ manufacturer.Name }}
              </div>
              <v-card variant="outlined"
                :color="manufacturer?.GetColor($vuetify.theme.current.dark) || 'panel'"
                class="my-1 pa-3">
                <div v-html-safe="requirement(manufacturer)"
                  class="flavor-text text-text text-center" />
              </v-card>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text color="panel">
            <core-bonus-select-item v-for="b in coreBonuses"
              :id="b.ID"
              :key="b.ID"
              :bonus="b"
              :is-selectable="isSelectable(b)"
              :is-selected="isSelected(b)"
              :color="manufacturer?.GetColor($vuetify.theme.current.dark) || 'panel'"
              @add="pilot.CoreBonusController.AddCoreBonus(b)"
              @remove="pilot.CoreBonusController.RemoveCoreBonus(b)" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </selector>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores'
import { Pilot } from '@/classes/pilot/Pilot'
import { CoreBonus } from '@/classes/pilot/components/corebonus/CoreBonus'
import { Manufacturer } from '@/classes/Manufacturer'
import { Bonus, BonusId } from '@/classes/components/feature/bonus/Bonus'
import logger from '@/user/logger'
import Selector from './components/_SelectorBase.vue'
import CoreBonusSelectItem from './components/_CoreBonusSelectItem.vue'
import MissingItemAlert from './components/_MissingItemAlert.vue'

const props = withDefaults(defineProps<{
  pilot: Record<string, any>
  levelUp?: boolean
  modal?: boolean
  flat?: boolean
}>(), { levelUp: false, modal: false, flat: false })

const emit = defineEmits<{ 'update:selectionComplete': [value: boolean] }>()

const { smAndDown: mobile, mdAndDown } = useDisplay()

const search = ref('')
const open = ref<number[]>([])
const jump = ref('')

const baseCoreBonuses = computed(() => {
  if (!props.pilot.LcpConfig) return CompendiumStore().CoreBonuses
  return CompendiumStore().CoreBonuses.filter(
    (x: any) =>
      !x.InLcp ||
      props.pilot.LcpConfig?.packList.some((y: any) => y.packID === x.Brew?.LcpId) ||
      props.pilot.LcpConfig?.packList.some((y: any) => y.packName === x.Brew?.LcpName)
  )
})

const coreBonuses = computed<CoreBonus[]>(() => {
  const cbs = baseCoreBonuses.value.filter((x: any) => !x.IsHidden)
  if (search.value) return cbs.filter((x: any) => x.Name.toLowerCase().includes(search.value.toLowerCase()))
  return cbs
})

const jumpItems = computed<{ title: string; value: string; subtitle?: string }[]>(() => [
  ...props.pilot.CoreBonusController.CoreBonuses.map((x: any) => ({
    title: x.Name,
    value: x.ID,
    subtitle: `// Unlocked`,
  })),
  ...coreBonuses.value
    .filter((x: any) => !props.pilot.has('CoreBonus', x.ID))
    .map((x: any) => ({ title: x.Name, value: x.ID })),
])

const manufacturersWithCBs = computed<{ manufacturer: Manufacturer; coreBonuses: CoreBonus[] }[]>(() =>
  CompendiumStore().Manufacturers
    .filter((x: any) => !x.IsHidden)
    .map((manufacturer: any) => ({
      manufacturer,
      coreBonuses: coreBonuses.value.filter((cb: any) => cb.Manufacturer.ID === manufacturer.ID),
    }))
    .filter((x: any) => x.coreBonuses.length > 0)
)

const selectionComplete = computed(() => props.levelUp && !props.pilot.CoreBonusController.IsMissingCBs)

watch(selectionComplete, (val) => {
  emit('update:selectionComplete', val)
})

watch(jump, (val) => scrollTo(String(val)))

watch(search, (newval) => {
  if (!newval) open.value = []
  else open.value = manufacturersWithCBs.value.map((_, i) => i)
})

onMounted(() => {
  emit('update:selectionComplete', selectionComplete.value)
})

function requirement(m: Manufacturer): string {
  const br = mdAndDown.value ? '<br>' : '&emsp;//&emsp;'
  const abbr = `<b>${m.ID}</b>`
  const name = `<b>${m.Name}</b>`
  if (m.ID === 'GMS')
    return `<b>${selectedCount(m.ID)}</b> ${abbr} CORE Bonuses Selected<br>${name} CORE Bonuses do not have a license requirement`
  const lvl = `<b>${props.pilot.LicenseController.LicenseLevel(m.ID)}</b>`
  let output = `${lvl} ${abbr} Licenses Acquired ${br} `
  let remain = (3 % props.pilot.Level || 3) - props.pilot.LicenseController.LicenseLevel(m.ID)
  if (remain < 1) remain += 3
  output += `<b>${availableCount(m.ID)}</b> ${abbr} CORE Bonuses Available ${br} `
  output += `<b>${selectedCount(m.ID)}</b> ${abbr} CORE Bonuses Selected`
  if (props.pilot.Level < 12)
    output += `<br>${props.pilot.Level < 3 ? 'First' : 'Next'} ${name} CORE Bonus available in <b>${remain}</b> License Level${remain === 1 ? '' : 's'}`
  return output
}

function selectedCount(m: string): number {
  return props.pilot.CoreBonusController.CoreBonuses.filter((x: CoreBonus) => x.Source === m).length
}

function availableCount(m: string): number {
  if (m.toUpperCase() === 'GMS') return Infinity
  const extraLicenses = Bonus.Int(0, BonusId.CB_POINT, props.pilot as unknown as Pilot)
  return (
    Math.floor(props.pilot.LicenseController.LicenseLevel(m) / 3) +
    extraLicenses -
    selectedCount(m)
  )
}

function isSelectable(b: CoreBonus): boolean {
  return availableCount(b.Source) > 0 && props.pilot.CoreBonusController.IsMissingCBs
}

function isSelected(b: CoreBonus): boolean {
  return props.pilot.has('CoreBonus', b.ID)
}

function scrollTo(e: string): void {
  const el = document.getElementById(e)
  if (!el) {
    logger.warn(`Element with ID ${e} not found`, null)
    return
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
