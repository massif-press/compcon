<template>
  <selector
    title="Pilot CORE Bonuses"
    height="60vh"
    :success="!pilot.CoreBonusController.IsMissingCBs"
  >
    <template #left-column>
      <v-row
        v-for="b in pilot.CoreBonusController.CoreBonuses"
        dense
        align="center"
        color="panel"
        style="width: 100%"
        class="px-1"
        @click="scroll(b.ID)"
      >
        <v-col cols="auto">
          <v-icon color="accent" icon="cc:corebonus" />
        </v-col>
        <v-col class="mb-n1">
          <b>{{ b.Name }}</b>
        </v-col>
        <v-col cols="auto">
          <v-btn icon size="x-small" variant="plain" @click="scroll(b.ID)">
            <v-icon size="25" icon="mdi-menu-right" />
          </v-btn>
        </v-col>
      </v-row>
      <v-divider v-if="pilot.CoreBonusController.CoreBonuses.length" class="ma-2" />
      <v-row>
        <v-col class="ma-1">
          <v-alert
            v-show="!pilot.CoreBonusController.IsMissingCBs"
            variant="outlined"
            color="success"
            icon="check_circle"
            class="stat-text"
            style="width: 95%"
          >
            CORE Bonus Selection Complete
          </v-alert>

          <v-alert
            v-show="pilot.CoreBonusController.IsMissingCBs"
            variant="outlined"
            color="accent"
            icon="warning"
            class="stat-text"
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
        </v-col>
      </v-row>
    </template>

    <template #right-column>
      <v-expansion-panels class="pr-4 pt-2">
        <v-expansion-panel
          v-for="{ manufacturer, coreBonuses } in manufacturersWithCBs"
          class="no-shadow"
        >
          <v-expansion-panel-title color="panel" class="px-1">
            <div>
              <v-row
                align="center"
                class="heading h1"
                :style="`color: ${manufacturer.GetColor($vuetify.theme.current.dark)}`"
              >
                <v-col cols="auto">
                  <v-icon :icon="manufacturer.Icon" />
                </v-col>
                <v-col cols="auto">
                  {{ manufacturer.Name }}
                </v-col>
              </v-row>
              <v-card
                variant="outlined"
                :color="manufacturer.GetColor($vuetify.theme.current.dark)"
                class="my-1 pa-3"
              >
                <div class="flavor-text text-text text-center" v-html="requirement(manufacturer)" />
              </v-card>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text color="panel">
            <core-bonus-select-item
              v-for="b in coreBonuses"
              :bonus="b"
              :is-selectable="isSelectable(b)"
              :is-selected="isSelected(b)"
              :color="manufacturer.GetColor($vuetify.theme.current.dark)"
              @add="pilot.CoreBonusController.AddCoreBonus(b)"
              @remove="pilot.CoreBonusController.RemoveCoreBonus(b)"
            />
          </v-expansion-panel-text>
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
  name: 'CoreBonusSelector',
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
      const extraLicenses = Bonus.Int(0, 'cb_point', this.pilot as Pilot);
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
    scroll(id) {
      this.scrollTo(`talent_${id}`);
    },
    scrollTo(e: any): void {
      const el = document.getElementById(e);
      if (el) {
        const ce = document.getElementById('content-col');
        if (ce) {
          const yOffset = -70;
          const y = el.offsetTop + yOffset;

          ce.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          const yOffset = -60;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    },
  },
  mounted() {
    this.$emit('update:selectionComplete', this.selectionComplete);
  },
};
</script>
