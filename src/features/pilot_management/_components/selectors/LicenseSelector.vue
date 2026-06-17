<template>
  <missing-item-alert v-if="pilot.LicenseController.MissingLicenses.length"
    :type="'licenses'"
    :items="pilot.LicenseController.MissingLicenses"
    @remove="pilot.LicenseController.RemoveLicense($event.Stub as any)" />

  <selector :title="$t('pm.titles.pilotLicenses')"
    :success="!pilot.LicenseController.IsMissingLicenses"
    :modal="modal"
    :selected="pilot.LicenseController.CurrentLicensePoints"
    :total="pilot.LicenseController.MaxLicensePoints">
    <template #float>
      <v-card v-if="!pilot.LicenseController.IsMissingLicenses"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="success"
        v-text="$t('pm.selectors.licenseSelectionComplete')" />
      <v-card v-if="
        pilot.LicenseController.MaxLicensePoints > pilot.LicenseController.CurrentLicensePoints
      "
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="accent"
        v-text="`${pilot.LicenseController.MaxLicensePoints - pilot.LicenseController.CurrentLicensePoints}
            License Selections remaining`
          " />

      <cc-button variant="text"
        size="x-small"
        block
        :disabled="!pilot.LicenseController.Licenses.length"
        @click="pilot.LicenseController.ClearLicenses()">
        {{ $t('common.reset') }}
      </cc-button>
    </template>

    <template #jump>
      <div class="px-2">
        <cc-select v-model="jump"
          :label="$t('pm.fields.jumpTo')"
          color="primary"
          variant="outlined"
          :items="jumpItems" />
      </div>
    </template>

    <template #right-column>
      <v-row v-for="m in mfSort(Object.keys(licenses))"
        :key="`${m.toLowerCase()}`">
        <v-col v-if="!!mf(m)"
          class="text-center pa-3">
          <v-row v-show="!search
            ? true
            : licenses[m].some(x => x.Name.toLowerCase().includes(search.toLowerCase()))
            "
            align="center"
            justify="center">
            <v-col cols="auto">
              <cc-logo v-if="mf(m).LogoIsExternal"
                :source="mf(m)"
                :size="$vuetify.display.mdAndDown ? 'large' : 'xLarge'"
                class="pt-3 mb-n1" />
              <v-icon v-else
                size="60"
                :icon="mf(m).Icon"
                :color="mf(m).GetColor($vuetify.theme.current.dark)" />
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
            <license-expandable :items="licenses[m].filter(x =>
              !search ? true : x.Name.toLowerCase().includes(search.toLowerCase())
            )
              "
              :controller="pilot.LicenseController"
              selectable
              @add="pilot.LicenseController.AddLicense($event)"
              @remove="pilot.LicenseController.RemoveLicense($event)" />
          </v-expansion-panels>
        </v-col>
      </v-row>
    </template>
  </selector>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { groupBy } from 'lodash-es'
import { CompendiumStore } from '@/stores'
import { Manufacturer } from '@/classes/Manufacturer'
import { Pilot } from '@/classes/pilot/Pilot'
import License from '@/classes/pilot/components/license/License'
import logger from '@/user/logger'
import Selector from './components/_SelectorBase.vue'
import LicenseExpandable from '@/ui/components/CompendiumBrowser/components/_license-expandable.vue'
import MissingItemAlert from './components/_MissingItemAlert.vue'

const props = withDefaults(defineProps<{
  pilot: Pilot
  levelUp?: boolean
  modal?: boolean
  flat?: boolean
}>(), { levelUp: false, modal: false, flat: false })

const { smAndDown: mobile } = useDisplay()

const search = ref('')
const jump = ref('')

const selectionComplete = computed(() => props.levelUp && !props.pilot.LicenseController.IsMissingLicenses)

const allLicenses = computed(() => {
  if (!props.pilot.LcpConfig) return CompendiumStore().Licenses
  return CompendiumStore().Licenses.filter(
    (x: any) =>
      !x.InLcp ||
      props.pilot.LcpConfig?.packList.some((y: any) => y.packID === x.LcpId) ||
      props.pilot.LcpConfig?.packList.some((y: any) => y.packName === x.LcpName)
  )
})

const licenses = computed(() =>
  groupBy(
    allLicenses.value.filter((x: any) => !x.Hidden).sort((a: any, b: any) => License.LicenseSort(a, b)),
    'Source'
  )
)

const jumpItems = computed(() => [
  ...props.pilot.LicenseController.Licenses.filter((l: any) => l.License).map((x: any) => ({
    title: x.License!.Name,
    value: x.License!.FrameID,
    subtitle: `// Pilot Rank: ${x.Rank}`,
  })),
  ...allLicenses.value.filter((x: any) => !x.Hidden)
    .filter((x: any) => !props.pilot.LicenseController.Licenses.some((y: any) => y.License && y.License.ID === x.ID))
    .map((x: any) => ({ title: x.Name, value: x.FrameID })),
])

watch(jump, (val) => scrollTo(val + '_License'))

function scrollTo(e: string): void {
  const el = document.getElementById(e)
  if (!el) {
    logger.warn(`Element with ID ${e} not found`, null)
    return
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function mf(id: string) {
  return CompendiumStore().referenceByID('Manufacturers', id.toUpperCase()) as Manufacturer
}

function mfSort(keys: string[]) {
  const mfOrder = ['gms', 'ips-n', 'ssc', 'horus', 'ha']
  const mfOrderMap = new Map(mfOrder.map((mf, index) => [mf, index]))
  return keys.sort((a, b) => {
    const aIndex = mfOrderMap.get(a.toLowerCase()) ?? mfOrder.length
    const bIndex = mfOrderMap.get(b.toLowerCase()) ?? mfOrder.length
    return aIndex - bIndex
  })
}
</script>
