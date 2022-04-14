<template>
  <div v-if="pilot.BondController.Bond">
    <div class="px-12">
      <v-btn block color="primary" @click="dialog = true">Select Bond Powers</v-btn>
      <v-row no-gutters justify="end">
        <v-col cols="auto">
          <v-btn x-small outlined color="warning" class="fadeSelect mt-1" @click="resetPowers()">
            Reset Powers
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="dialog" fullscreen style="overflow-y: hidden">
      <v-card>
        <v-toolbar flat tile dense color="blue-grey darken-4" class="white--text">
          Select Bond powers
          <v-spacer />
          <v-btn icon dark @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-row no-gutters>
          <v-col cols="3" style="max-width: 325px !important">
            <v-list dense nav class="side-fixed mt-n1" color="panel">
              <v-list-item color="accent" selectable @click="featureSet = 'all'">
                <v-list-item-content>
                  <v-list-item-title class="text-button">
                    <b>{{ pilot.BondController.Bond.Name }}</b>
                    Powers
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item color="accent" selectable @click="featureSet = 'assigned'">
                <v-list-item-content>
                  <v-list-item-title class="text-button">
                    <b>All Selected Powers</b>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />

              <v-divider />

              <v-list-group no-action color="accent">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title class="heading h6">Other Bonds</v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item
                  v-for="b in Bonds"
                  :key="`all_bonds_${b.ID}`"
                  color="accent"
                  class="pl-6"
                  @click="featureSet = b.ID"
                >
                  <v-list-item-content>
                    <v-list-item-title class="text-button">
                      <b>{{ b.Name }}</b>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
            <div style="height: 20px" />
          </v-col>

          <v-col class="pl-6 pr-8">
            <v-container style="height: calc(100vh - 35px) !important; overflow-y: scroll">
              <v-row dense align="start" class="mt-n3">
                <v-col>
                  <span class="heading h3">{{ currentSelection }} Powers</span>
                </v-col>
                <v-col>
                  <span class="heading h3">
                    <b class="accent--text">{{ pilot.BondController.TotalPowerSelections }}</b>
                    Selections Available
                  </span>
                </v-col>
                <v-col cols="auto">
                  <v-switch
                    v-model="ignoreLimit"
                    inset
                    dense
                    hide-details
                    class="ma-0"
                    color="accent"
                    label="Ignore Limit"
                  />
                </v-col>
              </v-row>
              <v-divider class="mt-2 mb-4" />
              <v-row>
                <v-col
                  v-for="(p, i) in shownPowers"
                  :key="`${p.name}_sel_${i}`"
                  xl="6"
                  lg="6"
                  cols="12"
                >
                  <cc-bond-power-card :power="p" />
                  <v-btn
                    v-if="!hasPower(p) || allowDupes"
                    color="primary"
                    block
                    tile
                    @click="pilot.BondController.AddPower(p)"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    Add {{ p.name }}
                  </v-btn>
                  <v-btn
                    v-if="hasPower(p)"
                    color="warning darken-1"
                    class="white--text"
                    block
                    tile
                    @click="pilot.BondController.RemovePower(p)"
                  >
                    <v-icon left>mdi-minus</v-icon>
                    Remove {{ p.name }}
                  </v-btn>
                </v-col>
                <v-col v-if="!shownPowers.length" cols="12">
                  <v-alert v-if="featureSet === 'all'" outlined class="text-center">
                    No Bond Power selections remaining
                    <br />
                    <span class="caption text--secondary">
                      Additional features beyond the reccommended guidelines can be added by
                      toggling the "Ignore Limit" option above
                    </span>
                  </v-alert>
                  <v-alert v-else-if="featureSet === 'assigned'" outlined class="text-center">
                    No Bond Powers assigned
                  </v-alert>
                  <v-alert v-else outlined class="text-center">
                    No Bond Powers available
                    <br />
                    <span class="caption text--secondary">
                      Additional features beyond the reccommended guidelines can be added by
                      toggling the "Ignore Limit" option above
                    </span>
                  </v-alert>
                </v-col>
              </v-row>
              <div style="height: 30px" />
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'npc-feature-select-menu',
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    dialog: false,
    featureSet: 'all',
    ignoreLimit: false,
    allowDupes: false,
  }),
  computed: {
    currentSelection() {
      switch (this.featureSet) {
        case 'all':
          return this.pilot.BondController.Bond.Name
        case 'assigned':
          return 'All Assigned'
        default:
          return this.Bonds.find(x => x.ID === this.featureSet).Name
      }
    },
    shownPowers() {
      if (!this.pilot.BondController.TotalPowerSelections && !this.ignoreLimit) {
        if (this.featureSet === 'all')
          return this.pilot.BondController.Bond.Powers.filter(x =>
            this.pilot.BondController.BondPowers.some(y => y.name === x.name)
          )
        if (this.featureSet === 'assigned') return this.pilot.BondController.BondPowers
        return getModule(CompendiumStore, this.$store)
          .Bonds.find(x => x.ID === this.featureSet)
          .Powers.filter(x => this.pilot.BondController.BondPowers.some(y => y.name === x.name))
      }

      if (this.featureSet === 'all') return this.pilot.BondController.Bond.Powers
      if (this.featureSet === 'assigned') return this.pilot.BondController.BondPowers

      return getModule(CompendiumStore, this.$store).Bonds.find(x => x.ID === this.featureSet)
        .Powers
    },
    Bonds() {
      return getModule(CompendiumStore, this.$store).Bonds.map(x => ({
        Name: x.Name,
        ID: x.ID,
      }))
    },
  },
  methods: {
    hasPower(bond) {
      return this.pilot.BondController.BondPowers.some(y => y.name === bond.name)
    },
    resetPowers() {
      this.pilot.BondController.BondPowers.splice(0, this.pilot.BondController.BondPowers.length)
    },
  },
})
</script>

<style scoped>
.side-fixed {
  height: calc(100vh - 45px);
  overflow-y: scroll;
  top: 51.5px;
  bottom: 0;
  /* padding-bottom: 35px; */
  position: fixed;
  width: 23vw;
  max-width: 325px !important;
}
</style>
