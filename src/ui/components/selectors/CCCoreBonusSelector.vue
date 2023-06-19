<template>
  <selector
    title="Pilot CORE Bonuses"
    height="60vh"
    :success="!pilot.CoreBonusController.IsMissingCBs"
  >
    <template #left-column>
      <v-row v-for="b in pilot.CoreBonusController.CoreBonuses" class="my-2" style="width: 98%">
        <!-- <missing-item v-if="b.err" @remove="pilot.CoreBonusController.RemoveCoreBonus(b)" /> -->
        <div>
          <v-icon small color="accent">cc:corebonus</v-icon>
          <strong>{{ b.Name }}</strong>
          <span class="text-overline">{{ b.Source }}</span>
        </div>
      </v-row>
      <v-divider v-if="pilot.CoreBonusController.CoreBonuses.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-alert
          variant="outlined"
          color="success"
          icon="check_circle"
          class="stat-text"
          style="width: 95%"
          :value="!pilot.CoreBonusController.IsMissingCBs"
        >
          CORE Bonus Selection Complete
        </v-alert>
        <v-alert
          variant="outlined"
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
            @click="pilot.CoreBonusController.ClearCoreBonuses()"
          >
            Reset
          </v-btn>
        </div>
      </v-row>
    </template>

    <template #right-column>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="{ manufacturer, coreBonuses } in manufacturersWithCBs"
          class="no-shadow"
        >
          <v-expansion-panel-header color="panel" class="px-1">
            <div>
              <v-row
                no-gutters
                align="center"
                :class="`heading ${$vuetify.display.smAndDown ? 'h3' : 'h1'}`"
                :style="`color: ${manufacturer.GetColor($vuetify.theme.current.dark)}`"
              >
                <v-col cols="auto">
                  <cc-logo
                    :source="manufacturer"
                    :size="$vuetify.display.smAndDown ? 'large' : 'xLarge'"
                  />
                </v-col>
                <v-col cols="auto">
                  {{ manufacturer.Name }}
                </v-col>
              </v-row>
              <v-alert
                variant="outlined"
                :color="manufacturer.GetColor($vuetify.theme.current.dark)"
                class="py-3 my-2"
              >
                <v-row class="text-center">
                  <span
                    class="flavor-text text-text"
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
              :bonus="b"
              :is-selectable="isSelectable(b)"
              :is-selected="isSelected(b)"
              :color="manufacturer.GetColor($vuetify.theme.current.dark)"
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
import Selector from './components/_SelectorBase.vue';
import MissingItem from './components/_MissingItem.vue';
import CoreBonusSelectItem from './components/_CoreBonusSelectItem.vue';

import { CompendiumStore } from '@/stores';
import { Pilot, CoreBonus, Manufacturer } from '@/class';
import { Bonus } from '@/classes/components/feature/bonus/Bonus';

export default {
  name: 'CCCoreBonusSelector',
  components: { Selector, CoreBonusSelectItem, MissingItem },
  props: {
    pilot: { type: Object, required: true },
    levelUp: { type: Boolean, default: false },
  },
  computed: {
    coreBonuses(): CoreBonus[] {
      return CompendiumStore().CoreBonuses.filter((x) => !x.IsHidden);
    },
    manufacturersWithCBs(): {
      manufacturer: Manufacturer;
      coreBonuses: CoreBonus[];
    }[] {
      const manufacturers = CompendiumStore().Manufacturers;

      return manufacturers
        .filter((x) => !x.IsHidden)
        .map((manufacturer) => ({
          manufacturer,
          coreBonuses: this.coreBonuses.filter((cb) => cb.Manufacturer.ID === manufacturer.ID),
        }))
        .filter((x) => x.coreBonuses.length > 0);
    },
    selectionComplete(): boolean {
      return this.levelUp && !this.pilot.CoreBonusController.IsMissingCBs;
    },
  },
  watch: {
    'pilot.CoreBonusController.CoreBonuses': {
      handler: function () {
        this.$emit('update:selectionComplete', this.selectionComplete);
      },
      deep: true,
    },
  },
  methods: {
    requirement(m: Manufacturer): string {
      const br = this.$vuetify.display.smAndDown ? '<br>' : '&emsp;//&emsp;';
      const abbr = `<b>${m.ID}</b>`;
      const name = `<b>${m.Name}</b>`;
      if (m.ID === 'GMS')
        return `<b>${this.selectedCount(
          m.ID
        )}</b> ${abbr} CORE Bonuses Selected<br>${name} CORE Bonuses do not have a license requirement`;
      const lvl = `<b>${this.pilot.LicenseController.LicenseLevel(m.ID)}</b>`;
      let output = `${lvl} ${abbr} Licenses Acquired ${br} `;
      let remain = (3 % this.pilot.Level || 3) - this.pilot.LicenseController.LicenseLevel(m.ID);
      if (remain < 1) remain += 3;
      output += `<b>${this.availableCount(m.ID)}</b> ${abbr} CORE Bonuses Available ${br} `;
      output += `<b>${this.selectedCount(m.ID)}</b> ${abbr} CORE Bonuses Selected`;
      if (this.pilot.Level < 12)
        output += `<br>${
          this.pilot.Level < 3 ? 'First' : 'Next'
        } ${name} CORE Bonus available in <b>${remain}</b> License Level${remain === 1 ? '' : 's'}`;
      return output;
    },

    selectedCount(m: string): number {
      return this.pilot.CoreBonusController.CoreBonuses.filter((x: CoreBonus) => x.Source === m)
        .length;
    },
    availableCount(m: string): number {
      if (m.toUpperCase() === 'GMS') return Infinity;
      const extraLicenses = Bonus.Int(0, 'cb_point', this.pilot);
      return (
        Math.floor(this.pilot.LicenseController.LicenseLevel(m) / 3) +
        extraLicenses -
        this.selectedCount(m)
      );
    },
    isSelectable(b: CoreBonus): boolean {
      return this.availableCount(b.Source) > 0 && this.pilot.CoreBonusController.IsMissingCBs;
    },
    isSelected(b: CoreBonus): boolean {
      return this.pilot.has('CoreBonus', b.ID);
    },
  },

  mounted() {
    this.$emit('update:selectionComplete', this.selectionComplete);
  },
};
</script>
