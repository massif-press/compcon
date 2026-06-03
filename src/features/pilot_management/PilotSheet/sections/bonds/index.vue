<template>
  <div :class="mobile ? 'px-4' : 'px-12'">
    <div v-if="underlevel"
      style="opacity: 0.5; position: absolute; top: 50%; left: 0; right: 0"
      class="text-center">
      <span class="heading h2"
        style="opacity: 0.4">
        Bonds available after License Level 1
      </span>
      <cc-button size="x-small"
        block
        @click="pilot.BondController.ForceBonds = true">
        [OVERRIDE]:// Allow LL0 Bond
      </cc-button>
    </div>

    <div v-else>
      <div v-if="hasBond"
        class="heading"
        :class="mobile ? 'h2' : 'h1'">
        {{ pilot.BondController.Bond.Name }}
        <v-btn size="x-small"
          icon
          variant="plain"
          class="mb-n3 ml-n3"
          @click="bondModal = true">
          <v-icon icon="mdi-circle-edit-outline" />
        </v-btn>
      </div>
      <div v-else
        style="position: absolute; top: 50%; left: 0; right: 0"
        class="text-center">
        <cc-button size="x-large"
          block
          color="primary"
          prepend-icon="mdi-vector-link"
          @click="bondModal = true">
          Select Bond
        </cc-button>
      </div>

      <div v-if="pilot.BondController.Bond">
        <v-row class="flavor-text"
          :style="$vuetify.display.lgAndUp ? 'width: calc(100vw - 300px)' : ''">
          <v-col cols="12"
            md="6">
            <cc-heading line>Major Ideals</cc-heading>
            <ul>
              <li v-for="(m, index) in pilot.BondController.Bond.MajorIdeals"
                :key="`ideal-${index}`"
                v-text="m" />
            </ul>
          </v-col>
          <v-col md="6"
            cols="12">
            <cc-heading line>Minor Ideal</cc-heading>
            <cc-select v-model="pilot.BondController.MinorIdeal"
              combobox
              :items="pilot.BondController.Bond.MinorIdeals"
              density="compact"
              hide-details
              variant="outlined" />
          </v-col>
          <v-col v-for="(q, i) in pilot.BondController.Bond.Questions"
            :key="`question-${i}`"
            md="6"
            cols="12">
            <cc-heading line>{{ q.question }}</cc-heading>
            <cc-select v-model="pilot.BondController.Answers[i]"
              combobox
              :items="pilot.BondController.Bond.Questions[i].options"
              density="compact"
              hide-details
              variant="outlined" />
          </v-col>
        </v-row>
      </div>

      <v-card v-if="hasBond"
        flat
        tile
        class="pa-2 my-5">
        <v-row align="start"
          justify="space-around">
          <v-col cols="12"
            md="auto"
            class="text-center"
            style="min-width: 350px">
            <cc-tickbar v-model="pilot.BondController.XP"
              :ticks="8"
              :size="mobile ? 'small' : 'default'"
              class="mt-4"
              color="secondary"
              label="pilot xp" />
            <v-menu v-model="resetXpMenu"
              offset-y
              offset-x
              bottom
              left>
              <template #activator="{ props }">
                <cc-button size="x-small"
                  color="primary"
                  block
                  class="mt-2 ml-2"
                  :disabled="pilot.BondController.XP < 8"
                  v-bind="props">
                  <v-icon start>mdi-plus</v-icon>
                  Gain Bond Power
                </cc-button>
              </template>
              <v-card border
                tile
                max-width="600px">
                <v-card-text>
                  <cc-confirmation
                    content="This will reset your XP to zero and add a new Bond Power selection. This can only be done during <b>Downtime</b>. Continue?"
                    @confirm="bondConfirm()" />
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12"
            md="auto"
            class="text-center">
            <fieldset class="px-3"
              :style="pilot.BondController.TotalPowerSelections ? 'opacity: 1' : 'opacity: 0.4'">
              <legend>
                <span class="px-2 heading h4 text-accent">Bond Powers Available</span>
              </legend>
              <div class="heading h2 text-center mt-n2"
                style="font-size: 45px">
                {{ pilot.BondController.TotalPowerSelections }}
              </div>
              <div class="mt-n6 mr-n3 text-right">
                <v-btn size="x-small"
                  variant="plain"
                  @click="pilot.BondController.PowerSelections = 0">
                  Reset
                </v-btn>
              </div>
            </fieldset>
          </v-col>

          <v-col cols="12"
            md="auto"
            class="text-center"
            style="min-width: 350px">
            <cc-tickbar v-model="pilot.BondController.Stress"
              :ticks="pilot.BondController.MaxStress"
              :size="mobile ? 'small' : 'default'"
              class="mt-4"
              color="overcharge"
              label="pilot stress" />
            <v-menu offset-y
              offset-x
              bottom
              left
              :close-on-content-click="false">
              <template #activator="{ props }">
                <cc-button size="x-small"
                  block
                  color="panel"
                  class="mt-2 ml-2"
                  v-bind="props">
                  Set Maximum Stress
                </cc-button>
              </template>
              <v-card max-width="400px"
                tile>
                <v-card-text class="text-center">
                  <i>
                    Set maximum pilot stress. Stress gains from sources like selected Bond Powers
                    are not automated
                  </i>
                  <v-text-field v-model.number="pilot.BondController.MaxStress"
                    density="compact"
                    hide-details
                    tile
                    type="number"
                    color="accent"
                    variant="outlined"
                    label="Maximum Stress"
                    class="my-3" />
                  <v-btn variant="plain"
                    small
                    @click="pilot.BondController.MaxStress = 8">
                    Reset
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12"
            md="auto"
            class="text-center"
            :style="pilot.BondController.AtMaxStress ? 'opacity: 1' : 'opacity: 0.7'">
            <div>
              <v-icon v-if="pilot.BondController.AtMaxStress"
                size="60"
                color="overcharge">
                mdi-heart-broken
              </v-icon>
              <v-icon v-else
                size="70"
                color="primary">
                cc:pilot
              </v-icon>
            </div>
            <div v-if="pilot.BondController.AtMaxStress"
              class="my-n1">
              <cc-slashes />
              <span class="heading h4 px-2">BROKEN</span>
              <cc-slashes />
            </div>
            <div v-else>
              <span class="flavor-text">Status Nominal</span>
            </div>
            <div v-if="pilot.BondController.AtMaxStress">
              <v-menu v-model="addBondMenu"
                offset-y
                offset-x
                bottom
                left>
                <template #activator="{ props }">
                  <v-btn size="x-small"
                    color="overcharge"
                    tile
                    :disabled="!pilot.BondController.AtMaxStress || pilot.BondController.AtMaxBurdens
                      "
                    prepend-icon="mdi-plus"
                    v-bind="props">
                    <span v-if="pilot.BondController.AtMaxBurdens">Burden Limit Reached</span>
                    <span v-else>Add Burden</span>
                  </v-btn>
                </template>
                <v-card flat
                  tile>
                  <v-card-text>
                    <cc-confirmation
                      content="This will reset your Stress to zero and add a new Burden. Continue?"
                      @confirm="confirmBurden()" />
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <div v-if="hasBond">
        <section-header title="Bond Powers">
          <section-edit-chip :highlight="pilot.BondController.PowerSelectionsRemaining >= 0"
            :current="pilot.BondController.BondPowers.length"
            :max="pilot.BondController.MaxPowerSelections"
            label="Edit Pilot Bonds"
            @open-selector="($refs.powerSelector as any).show()" />
        </section-header>

        <div v-if="hasBond"
          class="my-4">
          <cc-masonry-grid :items="masonryBondItems"
            class="my-4">
            <template #default="{ item }">
              <cc-bond-power-card :power="item" />
            </template>
          </cc-masonry-grid>
        </div>

        <section-header title="Burdens" />
        <div>
          <div v-for="(b, i) in pilot.BondController.Burdens"
            :key="`burden-${i}`">
            <cc-clock :clock="b"
              class="mx-1 my-2"
              color="overcharge"
              @delete="pilot.BondController.Burdens.splice(i, 1)"
              @change="pilot.SaveController.save()" />
          </div>
          <v-row justify="end">
            <v-col cols="auto">
              <cc-button size="small"
                color="primary"
                @click="pilot.BondController.AddNewBurden()">
                Add New Burden
              </cc-button>
            </v-col>
          </v-row>
        </div>

        <section-header title="Other Clocks" />

        <div>
          <div v-for="(b, i) in pilot.BondController.Clocks"
            :key="`clock-${i}`">
            <cc-clock :clock="b"
              class="mx-1 my-2"
              color="overcharge"
              @delete="pilot.BondController.Clocks.splice(i, 1)"
              @change="pilot.SaveController.save()" />
          </div>
          <v-row justify="end">
            <v-col cols="auto">
              <cc-button size="small"
                color="primary"
                @click="pilot.BondController.AddClock()">
                Add New Clock
              </cc-button>
            </v-col>
          </v-row>
        </div>
      </div>

      <bond-power-selector ref="powerSelector"
        :pilot="pilot"
        @set="setBond($event)" />

      <cc-modal v-model="bondModal"
        title="Select Pilot Bond"
        clip>
        <bond-selector :pilot="pilot"
          @set="setBond($event)" />
      </cc-modal>
    </div>
    <v-row justify="end"
      class="mt-12">
      <v-col cols="auto">
        <v-menu v-model=removeDialog
          max-width="500px">
          <template #activator="{ props }">
            <cc-button size="small"
              color="primary"
              variant="text"
              v-bind="props">
              Remove Bond
            </cc-button>
          </template>
          <v-card-text>
            <cc-confirmation
              content="This will remove this bond from the pilot and reset all related selections. This cannot be undone. Continue?"
              @confirm="removeBond()" />
          </v-card-text>
        </v-menu>

      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import { computed, ref, onMounted, watch } from 'vue'
import BondSelector from './components/BondSelector.vue'
import BondPowerSelector from './components/BondPowerSelector.vue'
import SectionHeader from '../components/SectionHeader.vue'
import SectionEditChip from '../components/SectionEditChip.vue'
import { CompendiumStore } from '@/stores'
import { useDisplay } from 'vuetify';
import { remove } from 'jszip'
import { sortBy } from 'lodash-es'

defineOptions({ name: 'BondsView' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  pilot: Pilot
}>()

const powerSelector = ref<any>(null)

const resetXpMenu = ref(false)
const addBondMenu = ref(false)
const masonryBondItems = ref([] as any[])
const bondModal = ref(false)
const removeDialog = ref(false)

const bonds = computed(() => {
      return CompendiumStore().Bonds
    })
const hasBond = computed(() => {
      return !!props.pilot.BondController.Bond
    })
const bid = computed(() => {
      return props.pilot.BondController.Bond ? props.pilot.BondController.Bond.ID : 'none'
    })
const underlevel = computed(() => {
      return props.pilot.Level < 1 && !props.pilot.BondController.ForceBonds
    })
const boon = computed(() => {
      return props.pilot.BondController.Bond.Boon
    })

async function setBond(bond) {
      props.pilot.BondController.Bond = bond
      await _forceUpdate()
      bondModal.value = false
    }
function bondConfirm() {
      resetXpMenu.value = false
      props.pilot.BondController.LevelUp()
    }
function confirmBurden() {
      addBondMenu.value = false
      props.pilot.BondController.AddNewBurden()
    }
function removeBond() {
      props.pilot.BondController.Bond = null
      props.pilot.BondController.PowerSelections = 0
      props.pilot.BondController.XP = 0
      props.pilot.BondController.Stress = 0
      props.pilot.BondController.MaxStress = 8
      removeDialog.value = false
    }

onMounted(() => {
masonryBondItems.value = sortBy([...props.pilot.BondController.BondPowers], ['master', 'veteran', 'origin', 'name']).reverse()
})
</script>
