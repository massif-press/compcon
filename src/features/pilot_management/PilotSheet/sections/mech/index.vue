<template>
  <div v-if="mech.ID">
    <div class="mt-4 text-center text-white"
      :style="`background-color: ${color}`">
      <cc-short-string-editor :readonly="mech.Pilot.IsRemote"
        :placeholder="mech.Name"
        :max-width="mobile && '90vw'"
        justify="center"
        :absolute="mobile"
        @set="mech.Name = $event">
        <span class="heading"
          style="font-size: clamp(12px, 6.5vw, 50px)">
          {{ mech.Name }}
        </span>
      </cc-short-string-editor>
    </div>

    <div class="heading h3 text-center pt-1"
      style="line-height: 0">
      <v-icon start
        size="small"
        class="mb-1"
        :icon="mech.Frame.ManufacturerIcon" />
      <span :style="`color: ${color}`">
        {{ mech.Frame.Manufacturer?.Name || '' }}
      </span>
      <br v-if="mobile" />
      <span class="text-text pl-2">{{ mech.Frame.Name }}</span>
      <cc-dialog ref="frameInfoDialog"
        icon="cc:frame"
        :color="color"
        no-actions
        large
        :title="`${mech.Frame.Manufacturer?.Name || ''} ${mech.Frame.Name}`">
        <template #activator="{ open }">
          <v-btn icon
            size="x-small"
            variant="plain"
            @click="open">
            <v-icon size="large"
              icon="mdi-information-outline" />
          </v-btn>
        </template>

        <p v-html-safe="mech.Frame.Description"
          class="pa-2" />
      </cc-dialog>
      <cc-broken-reference :item="mech.Frame" />
    </div>

    <div v-if="mobile"
      class="mb-2">
      <cc-img :src="mech.Portrait"
        style="max-height: 80vh" />
      <div class="text-right mt-n3">
        <cc-modal v-if="!mech.Pilot.IsRemote"
          :title="$t('pm.titles.setMechImage')"
          icon="cc:frame">
          <template #activator="{ open }">
            <cc-button variant="tonal"
              color="secondary"
              size="small"
              prepend-icon="mdi-circle-edit-outline"
              @click="open">
              {{ $t('pm.sheet.setMechImage') }}
            </cc-button>
          </template>
          <cc-image-selector ref="imageSelector"
            :item="mech"
            type="mech" />
        </cc-modal>
      </div>
    </div>

    <cc-dialog :close-on-click="false"
      :title="$t('pm.titles.deleteMech')"
      color="error"
      icon="mdi-delete">
      <template #activator="{ open }">
        <mech-nav :selected="0"
          :pilot="pilot"
          :mech="mech"
          @delete="open()" />
      </template>
      <template #default="{ close }">
        <cc-confirmation full-width
          :content="`Lancer, please confirm deletion of Mech Configuration:
          <span class='text-accent'>
            ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
          </span>`"
          @cancel="close()"
          @confirm="deleteMech" />
      </template>
    </cc-dialog>


    <v-container>
      <v-row align="start">
        <v-col>
          <section-header :title="$t('pm.titles.operatorNotes')" />
          <cc-rich-text-area v-model="mech.Notes"
            :readonly="mech.Pilot.IsRemote"
            class="mb-3 mt-2" />

          <section-header :title="$t('pm.titles.licensesRequired')" />
          <div class="pt-1">
            <requirement-item v-for="l in reqLicenses.filter(x => x.source)"
              :key="l.source"
              :license-requirement="l" />
          </div>

          <status-alerts :mech="mech" />

          <section-header :title="`${mech.Frame.Source} ${mech.Frame.Name} Frame Traits`"
            class="mt-2" />
          <cc-trait-item v-for="t in mech.Frame.Traits"
            :key="t.Name"
            :trait="t"
            :color="color"
            :mech="mech"
            class="ma-3" />
        </v-col>

        <v-col v-if="!mobile"
          cols="auto">
          <cc-img :src="mech.Portrait"
            width="22vw"
            position="top center" />
          <div class="text-right mt-n3">
            <cc-modal v-if="!mech.Pilot.IsRemote"
              :title="$t('pm.titles.setMechImage')"
              icon="cc:frame">
              <template #activator="{ open }">
                <cc-button variant="tonal"
                  color="secondary"
                  size="small"
                  prepend-icon="mdi-circle-edit-outline"
                  @click="open">
                  {{ $t('pm.sheet.setMechImage') }}
                </cc-button>
              </template>
              <cc-image-selector ref="imageSelector"
                :item="mech"
                type="mech" />
            </cc-modal>
          </div>
        </v-col>
      </v-row>

      <attributes-block :color="color"
        :mech="mech"
        :pilot="pilot" />

      <section-header :title="`${mech.Frame.Source} ${mech.Frame.Name} Core System`"
        class="mt-6 mb-1" />
      <cc-core-system-panel :frame="mech.Frame"
        :small="!!mobile"
        terse
        :color="color"
        :owner="mech" />

      <loadout-block :mech="mech" />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MechNav from './components/MechNav.vue'
import RequirementItem from './components/RequirementItem.vue'
import AttributesBlock from './sections/attributes/index.vue'
import { Pilot } from '@/classes/pilot/Pilot'
import { Mech } from '@/classes/mech/Mech'
import { PilotStore } from '@/stores'
import LoadoutBlock from './sections/LoadoutBlock.vue'
import SectionHeader from '../components/SectionHeader.vue'
import StatusAlerts from './components/StatusAlerts.vue'
import { useDisplay } from 'vuetify'

defineOptions({ name: 'MechSheet' })

const props = defineProps<{
  pilotID: string
  mechID: string
}>()

const router = useRouter()
const { smAndDown: mobile, xs: portrait } = useDisplay()

const frameInfoDialog = ref<any>(null)
const imageSelector = ref<any>(null)

const pilot = computed((): Pilot =>
  PilotStore().Pilots.find((p) => p.ID === props.pilotID) as Pilot
)

const mech = computed((): Mech => {
  if (!pilot.value) return {} as Mech
  return pilot.value.Mechs.find((m: Mech) => m.ID === props.mechID) as Mech
})

const color = computed(() => mech.value.Frame.ManufacturerColor)

const reqLicenses = computed(() => mech.value.RequiredLicenses)

onMounted(() => {
  if (mech.value && mech.value.Frame)
    document.title = `${mech.value.Name} (${mech.value.Frame.Source} ${mech.value.Frame.Name})`
})

function deleteMech() {
  router.push({ name: 'pilot_sheet_redirect', params: { pilotID: pilot.value.ID } })
  pilot.value.RemoveMech(mech.value)
}
</script>
