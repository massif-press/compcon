<template>
  <selector
    title="Pilot CORE Bonuses"
    height="60vh"
    :success="!pilot.CoreBonusController.IsMissingCBs"
  >
    <template v-slot:left-column>
      <v-row
        v-for="b in pilot.CoreBonusController.CoreBonuses"
        :key="`summary_${b.ID}`"
        class="my-2"
        style="width: 98%"
      >
        <!-- <missing-item v-if="b.err" @remove="pilot.CoreBonusController.RemoveCoreBonus(b)" /> -->
        <div>
          <v-icon small color="accent">cci-corebonus</v-icon>
          <strong>{{ b.Name }}</strong>
          <span class="overline">{{ b.Source }}</span>
        </div>
      </v-row>
      <v-divider v-if="pilot.CoreBonusController.CoreBonuses.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-alert
          outlined
          color="success"
          icon="check_circle"
          class="stat-text"
          style="width: 95%"
          :value="!pilot.CoreBonusController.IsMissingCBs"
        >
          CORE Bonus Selection Complete
        </v-alert>
        <v-alert
          outlined
          color="accent"
          icon="warning"
          class="stat-text"
          :value="pilot.CoreBonusController.IsMissingCBs"
        >
          {{ pilot.CoreBonusController.CurrentCBPoints }} /
          {{ pilot.CoreBonusController.MaxCBPoints }} CORE Bonuses selected
        </v-alert>
        <div class="my-2">
          <v-btn
            block
            text
            small
            :disabled="!pilot.CoreBonusController.CoreBonuses.length"
            @click="pilot.ClearCoreBonuses()"
          >
            Reset
          </v-btn>
        </div>
      </v-row>
    </template>

    <template v-slot:right-column>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="{ manufacturer, coreBonuses } in manufacturersWithCBs"
          :key="`panel_m${manufacturer.ID}`"
          class="no-shadow"
        >
          <v-expansion-panel-header color="panel" class="px-1">
            <div>
              <v-row
                no-gutters
                align="center"
                :class="`heading ${$vuetify.breakpoint.smAndDown ? 'h3' : 'h1'}`"
                :style="`color: ${manufacturer.GetColor($vuetify.theme.dark)}`"
              >
                <v-col cols="auto">
                  <cc-logo
                    :source="manufacturer"
                    :size="$vuetify.breakpoint.smAndDown ? 'large' : 'xLarge'"
                  />
                </v-col>
                <v-col cols="auto">
                  {{ manufacturer.Name }}
                </v-col>
              </v-row>
              <v-alert
                outlined
                :color="manufacturer.GetColor($vuetify.theme.dark)"
                class="py-3 my-2"
              >
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

          <v-expansion-panel-content color="panel">
            <core-bonus-select-item
              v-for="b in coreBonuses"
              :key="b.ID"
              :bonus="b"
              :is-selectable="isSelectable(b)"
              :is-selected="isSelected(b)"
              :color="manufacturer.GetColor($vuetify.theme.dark)"
              @add="pilot.CoreBonusController.AddCoreBonus(b)"
              @remove="pilot.CoreBonusController.RemoveCoreBonus(b)"
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
import { Bonus } from '@/classes/Bonus'

@Component({
  components: { Selector, CoreBonusSelectItem, MissingItem },
})
export default class CCCoreBonusSelector extends Vue {
  @Prop({ type: Object, required: true }) pilot!: Pilot
  @Prop(Boolean) levelUp!: boolean

  get coreBonuses(): CoreBonus[] {
    return getModule(CompendiumStore, this.$store).CoreBonuses.filter(x => !x.IsHidden)
  }
  get manufacturersWithCBs(): {
    manufacturer: Manufacturer
    coreBonuses: CoreBonus[]
  }[] {
    const manufacturers = getModule(CompendiumStore, this.$store).Manufacturers

    return manufacturers
      .filter(x => !x.IsHidden)
      .map(manufacturer => ({
        manufacturer,
        coreBonuses: this.coreBonuses.filter(cb => cb.Manufacturer.ID === manufacturer.ID),
      }))
      .filter(x => x.coreBonuses.length > 0)
  }

  get selectionComplete(): boolean {
    return this.levelUp && !this.pilot.CoreBonusController.IsMissingCBs
  }

  @Watch('selectionComplete') onSelectionComplete(): void {
    window.scrollTo(0, document.body.scrollHeight)
  }

  requirement(m: Manufacturer): string {
    const br = this.$vuetify.breakpoint.smAndDown ? '<br>' : '&emsp;//&emsp;'
    const abbr = `<b>${m.ID}</b>`
    const name = `<b>${m.Name}</b>`
    if (m.ID === 'GMS')
      return `<b>${this.selectedCount(
        m.ID
      )}</b> ${abbr} CORE Bonuses Selected<br>${name} CORE Bonuses do not have a license requirement`
    const lvl = `<b>${this.pilot.LicenseController.LicenseLevel(m.ID)}</b>`
    let output = `${lvl} ${abbr} Licenses Acquired ${br} `
    let remain = (3 % this.pilot.Level || 3) - this.pilot.LicenseController.LicenseLevel(m.ID)
    if (remain < 1) remain += 3
    output += `<b>${this.availableCount(m.ID)}</b> ${abbr} CORE Bonuses Available ${br} `
    output += `<b>${this.selectedCount(m.ID)}</b> ${abbr} CORE Bonuses Selected`
    if (this.pilot.Level < 12)
      output += `<br>${
        this.pilot.Level < 3 ? 'First' : 'Next'
      } ${name} CORE Bonus available in <b>${remain}</b> License Level${remain === 1 ? '' : 's'}`
    return output
  }

  selectedCount(m: string): number {
    return this.pilot.CoreBonusController.CoreBonuses.filter((x: CoreBonus) => x.Source === m)
      .length
  }
  availableCount(m: string): number {
    if (m.toUpperCase() === 'GMS') return Infinity
    const extraLicenses = Bonus.IntPilot(0, 'cb_point', this.pilot)
    return (
      Math.floor(this.pilot.LicenseController.LicenseLevel(m) / 3) +
      extraLicenses -
      this.selectedCount(m)
    )
  }
  isSelectable(b: CoreBonus): boolean {
    return this.availableCount(b.Source) > 0 && this.pilot.CoreBonusController.IsMissingCBs
  }
  isSelected(b: CoreBonus): boolean {
    return this.pilot.has('CoreBonus', b.ID)
  }
}
</script>
