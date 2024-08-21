<template>
  <div v-if="underlevel">
    <v-card
      variant="flat"
      height="calc(100vh - 140px)"
      width="100vw"
      style="opacity: 0.5; position: absolute; top: 140px">
      <v-row justify="center" align="center" style="height: 100%">
        <v-col cols="auto">
          <span class="heading h2 text--disabled">Bonds available after License Level 1</span>
        </v-col>
      </v-row>
    </v-card>
  </div>

  <div v-else>
    <v-container style="padding-right: 230px">
      <div v-if="hasBond" class="heading h1" style="font-size: 50px">
        {{ pilot.BondController.Bond.Name }}
        <v-btn
          size="x-small"
          icon
          variant="plain"
          class="mb-n3 ml-n3"
          @click="($refs as any).chooseBond.show()">
          <v-icon icon="mdi-circle-edit-outline" />
        </v-btn>
      </div>
      <div v-else class="heading h1">
        <v-btn
          size="x-large"
          block
          color="primary"
          prepend-icon="mdi-vector-link"
          @click="($refs as any).chooseBond.show()">
          Select Bond
        </v-btn>
      </div>
    </v-container>

    <v-container v-if="pilot.BondController.Bond">
      <v-row
        class="flavor-text mr-3"
        :style="$vuetify.display.lgAndUp ? 'width: calc(100vw - 300px)' : ''">
        <v-col md="6" sm="12">
          Major Ideals
          <ul>
            <li v-for="m in pilot.BondController.Bond.MajorIdeals" v-text="m" />
          </ul>
        </v-col>
        <v-col md="6" sm="12">
          Minor Ideal
          <v-combobox
            v-model="pilot.BondController.MinorIdeal"
            :items="pilot.BondController.Bond.MinorIdeals"
            density="compact"
            hide-details
            variant="outlined" />
        </v-col>
        <v-col md="6" sm="12" v-for="(q, i) in pilot.BondController.Bond.Questions">
          {{ q.question }}
          <v-combobox
            v-model="pilot.BondController.Answers[i]"
            :items="pilot.BondController.Bond.Questions[i].options"
            density="compact"
            hide-details
            variant="outlined" />
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="hasBond">
      <v-alert variant="outlined" class="pt-0">
        <v-row align="start" justify="space-around" class="mt-2">
          <v-col cols="auto">
            <v-row density="compact">
              <v-col cols="auto" class="text-center">
                <cc-tick-bar v-model="pilot.BondController.XP" :max="8" color="accent">
                  <span class="heading h4">Pilot XP</span>
                </cc-tick-bar>
                <v-menu v-model="resetXpMenu" offset-y offset-x bottom left>
                  <template #activator="{ props }">
                    <v-btn
                      size="small"
                      color="accent"
                      variant="plain"
                      class="mt-2"
                      :disabled="pilot.BondController.XP < 8"
                      v-bind="props">
                      <v-icon start>mdi-plus</v-icon>
                      Gain Bond Power
                    </v-btn>
                  </template>
                  <cc-confirmation
                    content="This will reset your XP to zero and add a new Bond Power selection. This can only be done during <b>Downtime</b>. Continue?"
                    @confirm="
                      resetXpMenu = false;
                      pilot.BondController.LevelUp();
                    " />
                </v-menu>
              </v-col>
              <v-col
                cols="auto"
                :style="pilot.BondController.TotalPowerSelections ? 'opacity: 1' : 'opacity: 0.4'">
                <fieldset style="border-radius: 5px" class="px-3">
                  <legend>
                    <span class="px-2 heading h4 text-accent">Bond Powers Available</span>
                  </legend>
                  <div class="heading h2 text-center mt-n2" style="font-size: 45px">
                    {{ pilot.BondController.TotalPowerSelections }}
                  </div>
                  <div class="mt-n6 mr-n3 text-right">
                    <v-btn
                      size="x-small"
                      variant="plain"
                      @click="pilot.BondController.PowerSelections = 0">
                      Reset
                    </v-btn>
                  </div>
                </fieldset>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto" class="text-center">
            <v-row density="compact" align="center">
              <v-col cols="auto">
                <cc-tick-bar
                  v-model="pilot.BondController.Stress"
                  :max="pilot.BondController.MaxStress"
                  empty-icon="mdi-heart"
                  full-icon="cc:eclipse"
                  color="overcharge">
                  <span class="heading h4">Pilot Stress</span>
                </cc-tick-bar>
                <v-menu offset-y offset-x bottom left :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-btn size="small" variant="plain" class="mt-2" v-bind="props">
                      Set Maximum Stress
                    </v-btn>
                  </template>
                  <v-card width="400px">
                    <v-card-text class="text-center">
                      <i>
                        Set maximum pilot stress. Stress gains from sources like selected Bond
                        Powers are not automated
                      </i>
                      <v-text-field
                        v-model="pilot.BondController.MaxStress"
                        density="compact"
                        hide-details
                        type="number"
                        color="accent"
                        variant="outlined"
                        label="Maximum Stress"
                        class="my-3" />
                      <v-btn variant="plain" small @click="pilot.BondController.MaxStress = 8">
                        Reset
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col
                cols="auto"
                class="text-center"
                :style="pilot.BondController.AtMaxStress ? 'opacity: 1' : 'opacity: 0.7'">
                <div>
                  <v-icon v-if="pilot.BondController.AtMaxStress" size="60" color="overcharge">
                    mdi-heart-broken
                  </v-icon>
                  <v-icon v-else size="70" color="primary">cc:pilot</v-icon>
                </div>
                <div v-if="pilot.BondController.AtMaxStress">
                  <cc-slashes />
                  <span class="heading h4 px-2">BROKEN</span>
                  <cc-slashes />
                </div>
                <div v-else>
                  <span class="flavor-text">Status Nominal</span>
                </div>
                <div v-if="pilot.BondController.AtMaxStress">
                  <v-menu v-model="addBondMenu" offset-y offset-x bottom left>
                    <template #activator="{ props }">
                      <v-btn
                        size="x-small"
                        color="overcharge"
                        class="mt-2"
                        :disabled="
                          !pilot.BondController.AtMaxStress || pilot.BondController.AtMaxBurdens
                        "
                        prepend-icon="mdi-plus"
                        v-bind="props">
                        <span v-if="pilot.BondController.AtMaxBurdens">Burden Limit Reached</span>
                        <span v-else>Add Burden</span>
                      </v-btn>
                    </template>
                    <cc-confirmation
                      content="This will reset your Stress to zero and add a new Burden. Continue?"
                      @confirm="
                        addBondMenu = false;
                        pilot.BondController.AddNewBurden();
                      " />
                  </v-menu>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-alert>
    </v-container>

    <div v-if="hasBond">
      <section-header title="Bond Powers">
        <section-edit-chip
          :highlight="pilot.BondController.PowerSelections >= 0"
          :current="pilot.BondController.PowerSelections"
          :max="pilot.BondController.TotalPowerSelections"
          :label="`Edit Pilot Bonds (${pilot.SkillsController.CurrentSkillPoints}/${pilot.SkillsController.MaxSkillPoints})`"
          @open-selector="($refs.powerSelector as any).show()" />
      </section-header>
      <v-container v-if="hasBond">
        <v-row justify="center">
          <v-col v-for="p in pilot.BondController.BondPowers" xl="6" lg="6" sm="12">
            <cc-bond-power-card :power="p" flex-height />
          </v-col>

          <v-col v-if="boon" cols="12">
            <v-card
              variant="outlined"
              :style="!pilot.BondController.HasVeteranPower ? 'opacity: 0.4' : ''">
              <v-row no-gutters class="bg-deep-purple-darken-3 heading h4 py-1 px-3">
                <v-col>{{ boon.name }}</v-col>
                <v-col v-if="boon.frequency" cols="auto">
                  <v-chip small v-text="boon.frequency" />
                </v-col>
              </v-row>
              <v-card-text v-html="boon.description" class="pa-3" />
            </v-card>
            <div v-if="!pilot.BondController.HasVeteranPower" class="text-caption text-right">
              <i v-text="'Requires Veteran Power'" />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <section-header title="Burdens" />
      <v-container>
        <div v-for="(b, i) in pilot.BondController.Burdens">
          <cc-clock
            :clock="b"
            class="mx-1 my-2"
            color="overcharge"
            @delete="pilot.BondController.Burdens.splice(i, 1)"
            @change="pilot.SaveController.save()" />
        </div>
        <v-row justify="end">
          <v-col cols="auto">
            <v-btn
              size="small"
              color="accent"
              variant="plain"
              @click="pilot.BondController.AddNewBurden()">
              Add New Burden
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <section-header title="Other Clocks" />

      <v-container>
        <div v-for="(b, i) in pilot.BondController.Clocks">
          <cc-clock
            :clock="b"
            class="mx-1 my-2"
            color="overcharge"
            @delete="pilot.BondController.Clocks.splice(i, 1)"
            @change="pilot.SaveController.save()" />
        </div>
        <v-row justify="end">
          <v-col cols="auto">
            <v-btn
              size="small"
              color="accent"
              variant="plain"
              @click="pilot.BondController.AddClock()">
              Add New Clock
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <bond-power-selector ref="powerSelector" :pilot="pilot" @set="setBond($event)" />

    <cc-solo-dialog ref="chooseBond" fullscreen no-confirm title="Select Pilot Bond">
      <bond-selector @set="setBond($event)" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import BondSelector from './components/BondSelector.vue';
import BondPowerSelector from './components/BondPowerSelector.vue';
import SectionHeader from '../components/SectionHeader.vue';
import SectionEditChip from '../components/SectionEditChip.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'bonds-view',
  components: { BondSelector, BondPowerSelector, SectionHeader, SectionEditChip },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    resetXpMenu: false,
    addBondMenu: false,
  }),
  computed: {
    bonds() {
      return CompendiumStore().Bonds;
    },
    hasBond() {
      return !!this.pilot.BondController.Bond;
    },
    bid() {
      return this.pilot.BondController.Bond ? this.pilot.BondController.Bond.ID : 'none';
    },
    underlevel() {
      return this.pilot.Level < 1;
    },
    boon() {
      return this.pilot.BondController.Bond.Boon;
    },
  },
  methods: {
    async setBond(bond) {
      this.pilot.BondController.Bond = bond;
      await this.$forceUpdate();
      (this.$refs.chooseBond as any).hide();
    },
  },
};
</script>
