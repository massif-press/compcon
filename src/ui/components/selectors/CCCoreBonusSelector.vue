<template>
  <selector title="Pilot CORE Bonuses" height="60vh" :success="!pilot.IsMissingCBs">
    <template v-slot:left-column>
      <v-row v-for="b in pilot.CoreBonuses" :key="`summary_${b.ID}`">
        <missing-item v-if="b.err" @remove="remove(b)" />
        <span v-else>
          <v-icon small color="primary">cci-corebonus</v-icon>
          <strong>{{ b.Name }}</strong>
          <span class="overline">{{ b.Source }}</span>
        </span>
      </v-row>
      <v-divider v-if="pilot.CoreBonuses.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-alert
          outlined
          color="success"
          icon="check_circle"
          class="stat-text"
          :value="!pilot.IsMissingCBs"
        >
          CORE Bonus Selection Complete
        </v-alert>
        <v-alert
          outlined
          color="primary"
          icon="warning"
          class="stat-text"
          :value="pilot.IsMissingCBs"
        >
          {{ pilot.CurrentCBPoints }} / {{ pilot.MaxCBPoints }} CORE Bonuses selected
        </v-alert>
        <v-btn
          block
          text
          small
          :disabled="!pilot.CoreBonuses.length"
          @click="pilot.ClearCoreBonuses()"
        >
          Reset
        </v-btn>
      </v-row>
    </template>

    <template v-slot:right-column>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="m in Object.keys(coreBonuses)"
          :key="`panel_m${m}`"
          class="no-shadow"
        >
          <v-expansion-panel-header>
            <div>
              <span class="heading mech" :style="`color: ${manufacturer(m).Color}`">
                <cc-logo :source="manufacturer(m)" size="xLarge" class="pt-4" />
                {{ manufacturer(m).Name }}
              </span>
              <br />
              <v-alert outlined :color="manufacturer(m).color" class="py-1 my-2">
                <v-row class="text-center">
                  <span
                    class="flavor-text text--text"
                    style="width: 100%"
                    v-html="requirement(m)"
                  />
                </v-row>
              </v-alert>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <core-bonus-select-item
              v-for="b in coreBonuses[m]"
              :key="b.ID"
              :bonus="b"
              :is-selectable="isSelectable(b)"
              :is-selected="isSelected(b)"
              :color="manufacturer(m).Color"
              @add="pilot.AddCoreBonus(b)"
              @remove="pilot.RemoveCoreBonus(b)"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import Selector from './components/_SelectorBase.vue'
import MissingItem from './components/_MissingItem.vue'
import CoreBonusSelectItem from './components/_CoreBonusSelectItem.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { CoreBonus } from '@/class'

export default Vue.extend({
  name: 'cc-core-bonus-selector',
  components: { Selector, CoreBonusSelectItem, MissingItem },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    levelUp: Boolean,
  },
  data: () => ({
    coreBonuses: [],
    panels: [],
  }),
  computed: {
    selectionComplete(): boolean {
      return this.levelUp && !this.pilot.IsMissingCBs
    },
  },
  watch: {
    selectionComplete() {
      window.scrollTo(0, document.body.scrollHeight)
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.coreBonuses = this.$_.groupBy(compendium.CoreBonuses, 'Source')
    compendium.Manufacturers.forEach(m => {
      this.panels.push(!!(this.availableCount(m.ID) || this.selectedCount(m.ID)))
    })
  },
  methods: {
    manufacturer(id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.Manufacturers.find(x => x.Short === id)
    },
    requirement(mID: string): string {
      const m = this.manufacturer(mID)
      const abbr = `<b>${m.Short}</b>`
      const name = `<b>${m.Name}</b>`
      if (m.Short === 'GMS')
        return `<b>${this.selectedCount(
          m.Short
        )}</b> ${abbr} CORE Bonuses Selected<br>${name} CORE Bonuses do not have a license requirement`
      var lvl = `<b>${this.pilot.LicenseLevel(m.Short)}</b>`
      var output = `${lvl} ${abbr} Licenses Acquired &emsp;//&emsp; `
      var remain = (3 % this.pilot.Level || 3) - this.pilot.LicenseLevel(m.Short)
      output += `<b>${this.availableCount(
        m.Short
      )}</b> ${abbr} CORE Bonuses Available &emsp;//&emsp; `
      output += `<b>${this.selectedCount(m.Short)}</b> ${abbr} CORE Bonuses Selected`
      if (this.pilot.Level < 12)
        output += `<br>${
          this.pilot.Level < 3 ? 'First' : 'Next'
        } ${name} CORE Bonus available in <b>${remain}</b> License Level${remain === 1 ? '' : 's'}`
      return output
    },
    selectedCount(m: string): number {
      return this.pilot.CoreBonuses.filter((x: CoreBonus) => x.Source === m).length
    },
    availableCount(m: string): number {
      if (m.toUpperCase() === 'GMS') return Infinity
      return Math.floor(this.pilot.LicenseLevel(m) / 3) - this.selectedCount(m)
    },
    isSelectable(b: CoreBonus): boolean {
      return this.availableCount(b.Source) > 0 && this.pilot.IsMissingCBs
    },
    isSelected(b: CoreBonus): boolean {
      return this.pilot.has('CoreBonus', b.ID)
    },
  },
})
</script>
