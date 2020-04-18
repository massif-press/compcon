<template>
  <selector title="Pilot CORE Bonuses" height="60vh" :success="!pilot.IsMissingCBs">
    <template v-slot:left-column>
      <v-row v-for="b in pilot.CoreBonuses" :key="`summary_${b.ID}`">
        <!-- <missing-item v-if="b.err" @remove="pilot.RemoveCoreBonus(b)" /> -->
        <span>
          <v-icon small color="accent">cci-corebonus</v-icon>
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
          color="accent"
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
          v-for="{ manufacturer, coreBonuses } in manufacturersWithCBs"
          :key="`panel_m${manufacturer.ID}`"
          class="no-shadow"
        >
          <v-expansion-panel-header>
            <div>
              <span class="heading mech" :style="`color: ${manufacturer.Color}`">
                <cc-logo :source="manufacturer" size="xLarge" class="pt-4" />
                {{ manufacturer.Name }}
              </span>
              <br />
              <v-alert outlined :color="manufacturer.Color" class="py-1 my-2">
                <v-row class="text-center">
                  <span
                    class="flavor-text text--text"
                    style="width: 100%"
                    v-html="requirement(manufacturer)"
                  />
                </v-row>
              </v-alert>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <core-bonus-select-item
              v-for="b in coreBonuses"
              :key="b.ID"
              :bonus="b"
              :is-selectable="isSelectable(b)"
              :is-selected="isSelected(b)"
              :color="manufacturer.Color"
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
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import Selector from './components/_SelectorBase.vue'
import MissingItem from './components/_MissingItem.vue'
import CoreBonusSelectItem from './components/_CoreBonusSelectItem.vue'

import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Pilot, CoreBonus, Manufacturer } from '@/class'

@Component({
  components: { Selector, CoreBonusSelectItem, MissingItem },
})
export default class CCCoreBonusSelector extends Vue {
  @Prop({ type: Object, required: true }) pilot!: Pilot
  @Prop(Boolean) levelUp!: boolean

  get coreBonuses(): CoreBonus[] {
    return getModule(CompendiumStore, this.$store).CoreBonuses
  }
  get manufacturersWithCBs(): {
    manufacturer: Manufacturer
    coreBonuses: CoreBonus[]
  }[] {
    const manufacturers = getModule(CompendiumStore, this.$store).Manufacturers

    return manufacturers
      .map(manufacturer => ({
        manufacturer,
        coreBonuses: this.coreBonuses.filter(cb => cb.Manufacturer === manufacturer),
      }))
      .filter(x => x.coreBonuses.length > 0)
  }

  get selectionComplete(): boolean {
    return this.levelUp && !this.pilot.IsMissingCBs
  }
  @Watch('selectionComplete') onSelectionComplete() {
    window.scrollTo(0, document.body.scrollHeight)
  }

  requirement(m: Manufacturer): string {
    const abbr = `<b>${m.ID}</b>`
    const name = `<b>${m.Name}</b>`
    if (m.ID === 'GMS')
      return `<b>${this.selectedCount(
        m.ID
      )}</b> ${abbr} CORE Bonuses Selected<br>${name} CORE Bonuses do not have a license requirement`
    const lvl = `<b>${this.pilot.LicenseLevel(m.ID)}</b>`
    let output = `${lvl} ${abbr} Licenses Acquired &emsp;//&emsp; `
    const remain = (3 % this.pilot.Level || 3) - this.pilot.LicenseLevel(m.ID)
    output += `<b>${this.availableCount(m.ID)}</b> ${abbr} CORE Bonuses Available &emsp;//&emsp; `
    output += `<b>${this.selectedCount(m.ID)}</b> ${abbr} CORE Bonuses Selected`
    if (this.pilot.Level < 12)
      output += `<br>${
        this.pilot.Level < 3 ? 'First' : 'Next'
      } ${name} CORE Bonus available in <b>${remain}</b> License Level${remain === 1 ? '' : 's'}`
    return output
  }

  selectedCount(m: string): number {
    return this.pilot.CoreBonuses.filter((x: CoreBonus) => x.Source === m).length
  }
  availableCount(m: string): number {
    if (m.toUpperCase() === 'GMS') return Infinity
    return Math.floor(this.pilot.LicenseLevel(m) / 3) - this.selectedCount(m)
  }
  isSelectable(b: CoreBonus): boolean {
    return this.availableCount(b.Source) > 0 && this.pilot.IsMissingCBs
  }
  isSelected(b: CoreBonus): boolean {
    return this.pilot.has('CoreBonus', b.ID)
  }
}
</script>
