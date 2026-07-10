<template>
  <cc-modal v-model="dialog"
    :title="$t('pm.titles.selectBondPowers')">
    <cc-compendium-browser :items="shownItems"
      item-type="BondPower"
      :options="options"
      :active-ids="activeIds"
      outline-selected
      view-key="sel-bond-power"
      @group-change="currentGroup = $event">
      <template #nav-list>
        <template v-if="currentGroup === 'bond'">
          <template v-for="s in navSections"
            :key="s.key">
            <v-divider v-if="s.divider"
              class="my-2" />
            <v-list-item :active="selected === s.key"
              color="accent"
              @click="selected = s.key">
              <template #title>
                <span class="text-button"
                  :class="s.accent ? 'text-accent' : ''">
                  <b>{{ s.label }}</b>
                </span>
              </template>
            </v-list-item>
          </template>
        </template>
      </template>

      <template #top>
        <v-row align="center"
          no-gutters>
          <v-col cols="auto"
            class="pr-4">
            <span class="heading h4">
              <b class="text-accent">{{ pilot.BondController.TotalPowerSelections }}</b>
              {{ $t('pm.sheet.selectionsAvailable') }}
            </span>
          </v-col>
          <v-col cols="auto">
            <cc-switch v-model="ignoreLimit"
              inset
              density="compact"
              hide-details
              class="ma-0"
              color="accent"
              :label="$t('common.ignoreLimit')" />
          </v-col>
        </v-row>
      </template>

      <template #item="{ item }">
        <cc-bond-power-card :power="item._p" />
        <cc-button v-if="allowAdd(item._p)"
          color="success"
          block
          size="x-small"
          @click="pilot.BondController.AddPower(item._p)">
          <v-icon start>mdi-plus</v-icon>
          {{ $t('common.addName', { name: item._p.name }) }}
        </cc-button>
        <cc-button v-if="hasPower(item._p)"
          color="warning darken-1"
          block
          size="x-small"
          @click="pilot.BondController.RemovePower(item._p)">
          <v-icon start>mdi-minus</v-icon>
          {{ $t('common.removeName', { name: item._p.name }) }}
        </cc-button>
      </template>
    </cc-compendium-browser>
  </cc-modal>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import type { BondPower } from '@/classes/pilot/components/bond/Bond'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CompendiumStore } from '@/stores'
import { sortBy } from 'lodash-es'

const { t } = useI18n()

defineOptions({ name: 'BondPowerSelectMenu' })

const props = defineProps<{
  pilot: Pilot
}>()

const dialog = ref(false)
const ignoreLimit = ref(false)
const selected = ref(props.pilot.BondController.Bond ? 'sel-bond' : 'selected')
const currentGroup = ref('bond')

const options = {
  views: ['list'],
  initialView: 'list',
  groups: ['bond', 'none'],
  initialGroup: 'bond',
}

function shim(p: BondPower, bond: { LcpName: string }) {
  return { ID: `${p.origin}:${p.name}`, Name: p.name, LcpName: bond.LcpName, IsExotic: false, _p: p }
}

const allBonds = computed(() => {
  const list = [...CompendiumStore().Bonds]
  const pb = props.pilot.BondController.Bond
  if (pb && !list.some(b => b.ID === pb.ID)) list.unshift(pb)
  return list
})

const browserItems = computed(() => {
  const bondId = props.pilot.BondController.Bond?.ID
  const all = allBonds.value.flatMap(bond => bond.Powers.map(p => shim(p, bond)))
  return sortBy(all, i => (i._p.origin === bondId ? 0 : 1))
})

const navSections = computed(() => {
  const bond = props.pilot.BondController.Bond
  const byBond = (id?: string) => browserItems.value.filter(i => i._p.origin === id)
  const sections: { key: string; label: string; accent?: boolean; divider?: boolean; items: any[] }[] = []
  if (bond) sections.push({ key: 'sel-bond', label: `${bond.Name} ${t('pm.sheet.powers')}`, accent: true, items: byBond(bond.ID) })
  sections.push({ key: 'selected', label: t('pm.sheet.allSelectedPowers'), items: browserItems.value.filter(i => hasPower(i._p)) })
  allBonds.value.filter(b => b.ID !== bond?.ID).forEach((b, idx) =>
    sections.push({ key: b.ID, label: b.Name, divider: idx === 0, items: byBond(b.ID) })
  )
  return sections
})

const shownItems = computed(() =>
  currentGroup.value === 'none'
    ? browserItems.value
    : navSections.value.find(s => s.key === selected.value)?.items ?? []
)

const activeIds = computed(() =>
  props.pilot.BondController.BondPowers.map(p => `${p.origin}:${p.name}`)
)

function allowAdd(power: BondPower) {
  if (hasPower(power)) return false
  if (ignoreLimit.value) return true
  if (power.veteran) return false
  if (power.master) {
    const bond = power.origin
    return !!bond && props.pilot.BondController.BondPowers.filter(x => x.origin === bond).length >= 4
  }
  return props.pilot.BondController.TotalPowerSelections > 0
}

function hasPower(power: BondPower) {
  return props.pilot.BondController.BondPowers.some(y => y.name === power.name)
}

function show() {
  dialog.value = true
}
function hide() {
  dialog.value = false
}

defineExpose({ show, hide })
</script>
