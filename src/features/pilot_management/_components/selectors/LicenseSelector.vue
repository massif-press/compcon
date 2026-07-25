<template>
  <cc-compendium-browser :items="baseLicenses"
    item-type="License"
    :options="options"
    :manufacturers="manufacturers"
    :controller="pilot.LicenseController"
    :active-ids="activeLicenseIds"
    view-key="sel-license"
    page-scroll>
    <template #header>
      <div class="text-right">
        <selector-options-menu :disabled="!pilot.LicenseController.Licenses.length"
          @reset="pilot.LicenseController.ClearLicenses()" />
      </div>
    </template>

    <template #top>
      <missing-item-alert v-if="pilot.LicenseController.MissingLicenses.length"
        :type="$t('common.licenses')"
        :items="pilot.LicenseController.MissingLicenses"
        @remove="removeMissing($event)" />

      <selector-header :current="pilot.LicenseController.CurrentLicensePoints"
        :max="pilot.LicenseController.MaxLicensePoints"
        :complete="complete"
        :complete-text="$t('pm.selectors.licenseSelectionComplete')">
        <selector-chip v-for="l in selectedLicenses"
          :key="l.License.ID"
          @remove="removeAll(l.License, l.Rank)">
          {{ l.License.Name }}&nbsp;<b>{{ 'I'.repeat(l.Rank) }}</b>
        </selector-chip>
      </selector-header>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CompendiumStore } from '@/stores'
import { Pilot } from '@/classes/pilot/Pilot'
import License from '@/classes/pilot/components/license/License'
import MissingItemAlert from './components/_MissingItemAlert.vue'
import SelectorHeader from './components/_SelectorHeader.vue'
import SelectorChip from './components/_SelectorChip.vue'
import SelectorOptionsMenu from './components/_SelectorOptionsMenu.vue'
import { filterByLcpConfig } from './useLcpFilter'

const props = defineProps<{ pilot: Pilot }>()

const options = {
  views: ['list'],
  initialView: 'list',
  groups: ['source', 'lcp', 'none'],
  initialGroup: 'source',
  noSource: true,
}

const manufacturers = computed(() => CompendiumStore().Manufacturers)

const baseLicenses = computed(() =>
  filterByLcpConfig(
    CompendiumStore().Licenses.filter((x: any) => !x.Hidden),
    props.pilot.LcpConfig
  ).sort((a: any, b: any) => License.LicenseSort(a, b))
)

const complete = computed(() => !props.pilot.LicenseController.IsMissingLicenses)

const selectedLicenses = computed<any[]>(() =>
  props.pilot.LicenseController.Licenses.filter((x: any) => x.License)
)

const activeLicenseIds = computed<string[]>(() =>
  selectedLicenses.value.map((l: any) => l.License.ID)
)

function removeAll(license: any, rank: number) {
  for (let i = 0; i < rank; i++) props.pilot.LicenseController.RemoveLicense(license)
}

function removeMissing(stub: any) {
  const missing = props.pilot.LicenseController.MissingLicenses.find(
    (x: any) => x.Stub.ID === stub.ID
  )
  if (!missing) return
  for (let i = 0; i < missing.Rank; i++)
    props.pilot.LicenseController.RemoveLicense({ FrameID: stub.ID } as any)
}
</script>
