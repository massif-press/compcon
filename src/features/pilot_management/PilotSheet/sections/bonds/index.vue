<template>
  <div class="mt-n10">
    <div v-if="underlevel">
      <v-card
        outlined
        height="100vh"
        width="100vw"
        style="opacity: 0.5; position: absolute; top: 0; left: 0"
      >
        <v-row justify="center" align="center" style="height: 100%">
          <v-col cols="auto">
            <span class="heading h2 text--disabled">Bonds available after License Level 1</span>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <div v-else>
      <div v-if="pilot.BondController.Bond" class="heading h1" style="font-size: 50px">
        {{ pilot.BondController.Bond.Name }}
        <v-btn x-small icon class="fadeSelect mb-n3 ml-n3" @click="$refs.choosebond.show()">
          <v-icon>mdi-circle-edit-outline</v-icon>
        </v-btn>
      </div>
      <div v-else class="heading h1">
        <v-btn x-large color="primary" @click="$refs.choosebond.show()">
          <v-icon large class="pr-3">mdi-vector-link</v-icon>
          Select Bond
        </v-btn>
      </div>
      <v-row
        v-if="pilot.BondController.Bond"
        class="flavor-text mr-3"
        :style="$vuetify.breakpoint.lgAndUp ? 'width: calc(100vw - 250px)' : ''"
      >
        <v-col md="6" sm="12">
          Major Ideal
          <v-textarea
            v-model="pilot.BondController.MajorIdeal"
            dense
            hide-details
            rows="2"
            filled
            auto-grow
          >
            <v-btn
              slot="prepend"
              small
              icon
              class="fadeSelect"
              @click="
                pilot.BondController.MajorIdeal = pilot.BondController.Bond.RandomIdeal('Major')
              "
            >
              <v-icon>mdi-dice-multiple-outline</v-icon>
            </v-btn>
          </v-textarea>
        </v-col>
        <v-col md="6" sm="12">
          Minor Ideal
          <v-textarea
            v-model="pilot.BondController.MinorIdeal"
            dense
            hide-details
            rows="2"
            filled
            auto-grow
          >
            <v-btn
              slot="prepend"
              small
              icon
              class="fadeSelect"
              @click="
                pilot.BondController.MinorIdeal = pilot.BondController.Bond.RandomIdeal('Minor')
              "
            >
              <v-icon>mdi-dice-multiple-outline</v-icon>
            </v-btn>
          </v-textarea>
        </v-col>
        <v-col
          md="6"
          sm="12"
          v-for="(q, i) in pilot.BondController.Bond.Questions"
          :key="`question_${i}`"
        >
          {{ q.question }}
          <v-textarea
            v-model="pilot.BondController.Answers[i]"
            dense
            hide-details
            rows="2"
            filled
            auto-grow
          >
            <v-btn
              slot="prepend"
              small
              icon
              class="fadeSelect"
              @click="
                $set(pilot.BondController.Answers, i, pilot.BondController.Bond.RandomOption(i))
              "
            >
              <v-icon>mdi-dice-multiple-outline</v-icon>
            </v-btn>
          </v-textarea>
        </v-col>
      </v-row>
      <v-divider class="mb-3 mt-6" />
      <v-row align="center" justify="space-around" class="mt-2">
        <v-col cols="auto">
          <v-row dense>
            <v-col cols="auto" class="text-center">
              <cc-tick-bar
                :key="pilot.BondController.XP"
                :current="pilot.BondController.XP"
                :max="8"
                large
                color="accent"
                @update="pilot.BondController.XP = $event"
              >
                <span class="heading h3">Pilot XP</span>
              </cc-tick-bar>
              <v-menu v-model="resetXpMenu" offset-y offset-x bottom left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    small
                    color="accent"
                    class="mt-2"
                    :disabled="pilot.BondController.XP < 8"
                    v-on="on"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    Gain Bond Power
                  </v-btn>
                </template>
                <cc-confirmation
                  content="This will reset your XP to zero and add a new Bond Power selection. This can only be done during <b>Downtime</b>. Continue?"
                  @confirm="
                    resetXpMenu = false
                    pilot.BondController.LevelUp()
                  "
                />
              </v-menu>
            </v-col>
            <v-col
              cols="auto"
              :style="pilot.BondController.TotalPowerSelections ? 'opacity: 1' : 'opacity: 0.4'"
            >
              <fieldset style="border-radius: 5px" class="px-3">
                <legend>
                  <span class="px-2 heading h4 accent--text">Bond Powers Available</span>
                </legend>
                <div class="heading h2 text-center mt-n2" style="font-size: 45px">
                  {{ pilot.BondController.TotalPowerSelections }}
                </div>
                <div class="mt-n6 mr-n3 text-right">
                  <v-btn
                    x-small
                    text
                    class="fadeSelect"
                    @click="pilot.BondController.PowerSelections = 0"
                  >
                    Reset
                  </v-btn>
                </div>
              </fieldset>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="text-center">
          <v-row dense align="center">
            <v-col cols="auto">
              <cc-tick-bar
                :key="pilot.BondController.Stress"
                :current="pilot.BondController.Stress"
                :max="pilot.BondController.MaxStress"
                large
                empty-icon="mdi-heart"
                full-icon="cci-eclipse"
                color="overcharge"
                @update="pilot.BondController.Stress = $event"
              >
                <span class="heading h3">Pilot Stress</span>
              </cc-tick-bar>
              <v-menu offset-y offset-x bottom left :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-btn x-small text class="mt-2 fadeSelect" v-on="on">Set Maximum Stress</v-btn>
                </template>
                <v-card width="400px">
                  <v-card-text class="text-center">
                    <i>
                      Set maximum pilot stress. Stress gains from sources like selected Bond Powers
                      are not automated
                    </i>
                    <v-text-field
                      v-model="pilot.BondController.MaxStress"
                      dense
                      hide-details
                      type="number"
                      color="accent"
                      outlined
                      label="Maximum Stress"
                      class="my-3"
                    />
                    <v-btn text small @click="pilot.BondController.MaxStress = 8">Reset</v-btn>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
            <v-col
              cols="auto"
              class="text-center"
              :style="pilot.BondController.AtMaxStress ? 'opacity: 1' : 'opacity: 0.7'"
            >
              <div>
                <v-icon v-if="pilot.BondController.AtMaxStress" size="60" color="overcharge">
                  mdi-heart-broken
                </v-icon>
                <v-icon v-else size="70" color="primary">cci-pilot</v-icon>
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
                  <template v-slot:activator="{ on }">
                    <v-btn
                      small
                      color="overcharge"
                      class="mt-2"
                      :disabled="
                        !pilot.BondController.AtMaxStress || pilot.BondController.AtMaxBurdens
                      "
                      v-on="on"
                    >
                      <v-icon left>mdi-plus</v-icon>
                      <span v-if="pilot.BondController.AtMaxBurdens">Burden Limit Reached</span>
                      <span v-else>Add Burden</span>
                    </v-btn>
                  </template>
                  <cc-confirmation
                    content="This will reset your Stress to zero and add a new Burden. Continue?"
                    @confirm="
                      addBondMenu = false
                      pilot.BondController.AddNewBurden()
                    "
                  />
                </v-menu>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="caption">BURDENS</div>
      <div v-for="(b, i) in pilot.BondController.Burdens" :key="`burden${i}`">
        <cc-clock
          :clock="b"
          class="mx-1 my-2"
          color="overcharge"
          @delete="pilot.BondController.Burdens.splice(i, 1)"
          @change="pilot.SaveController.save()"
        />
      </div>
      <v-row justify="end">
        <v-col cols="auto">
          <v-btn text x-small class="fadeSelect" @click="pilot.BondController.AddNewBurden()">
            Add New Burden
          </v-btn>
        </v-col>
      </v-row>
      <div class="caption">OTHER CLOCKS</div>
      <div v-for="(b, i) in pilot.BondController.Clocks" :key="`playerclock${i}`">
        <cc-clock
          :clock="b"
          class="mx-1 my-2"
          color="overcharge"
          @delete="pilot.BondController.Clocks.splice(i, 1)"
          @change="pilot.SaveController.save()"
        />
      </div>
      <v-row class="mt-1 mb-3">
        <v-col cols="auto">
          <v-btn outlined small class="fadeSelect" @click="pilot.BondController.AddClock()">
            Add New Clock
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-3" />

      <div class="caption">BOND POWERS</div>
      <v-container>
        <v-row justify="center">
          <v-col
            v-for="(p, i) in pilot.BondController.BondPowers"
            :key="`${p.name}_sheet_${i}`"
            xl="6"
            lg="6"
            cols="12"
          >
            <cc-bond-power-card :power="p" flex-height />
          </v-col>
        </v-row>
      </v-container>

      <bond-power-selector :pilot="pilot" @set="setBond($event)" />

      <cc-solo-dialog ref="choosebond" fullscreen no-confirm title="Select Pilot Bond">
        <bond-selector @set="setBond($event)" />
      </cc-solo-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BondSelector from './components/BondSelector.vue'
import BondPowerSelector from './components/BondPowerSelector.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'bonds-view',
  components: { BondSelector, BondPowerSelector },
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
      return getModule(CompendiumStore, this.$store).Bonds
    },
    underlevel() {
      return this.pilot.Level < 1
    },
  },
  methods: {
    async setBond(bond) {
      this.$set(this.pilot.BondController, 'Bond', bond)
      await this.$forceUpdate()
      this.$refs.choosebond.hide()
    },
  },
})
</script>
