<template>
  <cc-modal v-model="dialog"
    color="blue-grey darken-4"
    title="Select Bond powers">
    <v-layout :style="!mobile && 'overflow-y: scroll; height: 89vh'">
      <div style="position: absolute; z-index: 999"
        :style="`left: ${showNav ? (mobile ? '322' : '238') : '0'}px; top: 6px`">
        <cc-button :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
          size="small"
          color="primary"
          @click="(showNav as any) = !showNav" />
      </div>
      <v-navigation-drawer v-model="showNav"
        :width="mobile ? 320 : 250"
        style="overflow-y: scroll"
        :style="[
          mobile ? 'height:95.5vh; top:30px' : 'height: 89vh; top: 40px',
          showNav && ' position: fixed',
        ]">
        <v-list density="compact"
          slim>
          <v-list-item color="accent"
            selectable
            @click="featureSet = 'all'">
            <template #title>
              <div class="text-button">
                <b class="text-accent">{{ pilot.BondController.Bond.Name }}</b>
                {{ $t('pm.sheet.powers') }}
              </div>
            </template>
          </v-list-item>
          <v-list-item color="accent"
            selectable
            @click="featureSet = 'assigned'">
            <template #title>
              <div class="text-button">
                <b>{{ $t('pm.sheet.allSelectedPowers') }}</b>
              </div>
            </template>
          </v-list-item>
          <v-divider />

          <v-divider />

          <v-list-group color="accent"
            class="pt-0">
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <span class="text-button">
                    <b>{{ $t('pm.sheet.otherBonds') }}</b>
                  </span>
                </template>
              </v-list-item>
            </template>

            <v-list-item v-for="b in Bonds"
              :key="b.ID"
              color="accent"
              class="pl-6"
              @click="featureSet = b.ID">
              <template #title>
                <b class="text-button">{{ b.Name }}</b>
              </template>
            </v-list-item>
          </v-list-group>
        </v-list>
        <div style="height: 20px" />
      </v-navigation-drawer>
      <v-main>
        <v-card-text class="py-2">
          <v-row density="compact"
            align="start"
            class="ml-4">
            <v-col>
              <span class="heading h3">
                <span class="text-accent">{{ currentSelection }}</span>
                {{ $t('pm.sheet.powers') }}
              </span>
            </v-col>
            <v-col>
              <span class="heading h3">
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
                label="Ignore Limit" />
            </v-col>
          </v-row>
          <v-divider class="mt-2 mb-4" />
          <v-row>
            <cc-masonry-grid :items="shownPowers">
              <template #default="
                {
                  item
                }">
                <div v-if="item">
                  <cc-bond-power-card :power="item" />
                  <cc-button v-if="allowAdd(item)"
                    color="success"
                    block
                    size="x-small"
                    @click="pilot.BondController.AddPower(item)">
                    <v-icon start>mdi-plus</v-icon>
                    {{ $t('pm.common.addName', { name: (item as any).name }) }}
                  </cc-button>
                  <cc-button v-if="hasPower(item)"
                    color="warning darken-1"
                    block
                    size="x-small"
                    @click="pilot.BondController.RemovePower(item)">
                    <v-icon start>mdi-minus</v-icon>
                    {{ $t('pm.common.removeName', { name: (item as any).name }) }}
                  </cc-button>
                </div>
              </template>
            </cc-masonry-grid>

            <v-col v-if="!shownPowers.length"
              cols="12">
              <v-alert v-if="featureSet === 'all'"
                variant="outlined"
                class="text-center">
                {{ $t('pm.sheet.noBondPowerSelectionsRemaining') }}
                <br />
                <span class="caption text--secondary">
                  {{ $t('pm.sheet.additionalFeaturesBeyondTheRecommendedGuidelines') }}
                </span>
              </v-alert>
              <v-alert v-else-if="featureSet === 'assigned'"
                variant="outlined"
                class="text-center">
                {{ $t('pm.sheet.noBondPowersAssigned') }}
              </v-alert>
              <v-alert v-else
                variant="outlined"
                class="text-center">
                {{ $t('pm.sheet.noBondPowersAvailable') }}
                <br />
                <span class="caption text--secondary">
                  {{ $t('pm.sheet.additionalFeaturesBeyondTheRecommendedGuidelines') }}
                </span>
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
      </v-main>
    </v-layout>
  </cc-modal>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import { computed, ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore } from '@/stores'
import { sortBy } from 'lodash-es';

const _display = useDisplay()

defineOptions({ name: 'BondPowerSelectMenu' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  pilot: Pilot
}>()

const dialog = ref(false)
const featureSet = ref('all')
const ignoreLimit = ref(false)
const allowDupes = ref(false)
const showNav = ref(true)

const widescreen = computed(() => {
      return _display.lgAndUp.value
    })
const currentSelection = computed(() => {
      switch (featureSet.value) {
        case 'all':
          return props.pilot.BondController.Bond.Name
        case 'assigned':
          return 'All Assigned'
        default:
          return Bonds.value.find(x => x.ID === featureSet.value)?.Name
      }
    })
const shownPowers = computed(() => {
      let out;
      if (!props.pilot.BondController.TotalPowerSelections && !ignoreLimit.value) {
        if (featureSet.value === 'all')
          out = props.pilot.BondController.Bond.Powers.filter(x =>
            props.pilot.BondController.BondPowers.some(y => y.name === x.name)
          )
        else if (featureSet.value === 'assigned') out = props.pilot.BondController.BondPowers
        else out = CompendiumStore()
          .Bonds.find(x => x.ID === featureSet.value)
          ?.Powers.filter(x => props.pilot.BondController.BondPowers.some(y => y.name === x.name))
      }

      else if (featureSet.value === 'all') out = props.pilot.BondController.Bond.Powers
      else if (featureSet.value === 'assigned') out = props.pilot.BondController.BondPowers

      else out = CompendiumStore().Bonds.find(x => x.ID === featureSet.value)?.Powers

      return sortBy(out, ['master', 'veteran', 'origin', 'name']).reverse()
    })
const Bonds = computed(() => {
      return CompendiumStore().Bonds.map(x => ({
        Name: x.Name,
        ID: x.ID,
      }))
    })

function allowAdd(power) {
      if (hasPower(power)) return false
      if (ignoreLimit.value) return true
      if (power.veteran) return false
      if (power.master) {
        let bond;
        if (featureSet.value === 'all')
          bond = props.pilot.BondController.Bond.ID
        else bond = featureSet.value
        if (bond && (props.pilot.BondController.BondPowers.filter(x => x.origin === bond).length >= 4)) return true
        return false
      }
      if (!props.pilot.BondController.TotalPowerSelections) return true
      return props.pilot.BondController.TotalPowerSelections > 0
    }
function hasPower(power) {
      return props.pilot.BondController.BondPowers.some(y => y.name === power.name)
    }
function resetPowers() {
      props.pilot.BondController.BondPowers.splice(0, props.pilot.BondController.BondPowers.length)
    }
function show() {
      dialog.value = true
    }
function hide() {
      dialog.value = false
    }

onMounted(() => {
showNav.value = !mobile.value
})
</script>
