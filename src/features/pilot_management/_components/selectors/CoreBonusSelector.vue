<template>
  <selector title="Pilot Core Bonuses" :success="!pilot.CoreBonusController.IsMissingCBs">
    <template #left-column>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="outlined"
        clearable
        hide-details
        class="ma-1" />
      <v-divider class="ma-2" />
      <v-row
        v-for="b in pilot.CoreBonusController.CoreBonuses"
        dense
        align="center"
        color="panel"
        style="width: 100%"
        class="px-1"
        @click="scroll(b.ID)">
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
            style="width: 95%">
            CORE Bonus Selection Complete
          </v-alert>

          <v-alert
            v-show="pilot.CoreBonusController.IsMissingCBs"
            variant="outlined"
            color="accent"
            icon="warning"
            class="stat-text">
            {{ pilot.CoreBonusController.CurrentCBPoints }} /
            {{ pilot.CoreBonusController.MaxCBPoints }} CORE Bonuses selected
          </v-alert>
          <div class="my-2">
            <v-btn
              block
              variant="text"
              small
              :disabled="!pilot.CoreBonusController.CoreBonuses.length"
              @click="pilot.CoreBonusController.ClearCoreBonuses()">
              Reset
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>

    <template #right-column>
      <v-expansion-panels v-model="open" multiple class="pt-2">
        <v-expansion-panel v-for="{ manufacturer, coreBonuses } in manufacturersWithCBs">
          <v-expansion-panel-title color="light-panel" class="px-1">
            <div>
              <v-row
                align="center"
                class="heading h1 px-4"
                :style="`color: ${manufacturer.GetColor($vuetify.theme.current.dark)}`">
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
                class="my-1 pa-3 ml-6">
                <div class="flavor-text text-text text-center" v-html="requirement(manufacturer)" />
              </v-card>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text color="panel">
            <core-bonus-select-item
              v-for="b in coreBonuses"
              :id="b.ID"
              :bonus="b"
              :is-selectable="isSelectable(b)"
              :is-selected="isSelected(b)"
              :color="manufacturer.GetColor($vuetify.theme.current.dark)"
              @add="pilot.CoreBonusController.AddCoreBonus(b)"
              @remove="pilot.CoreBonusController.RemoveCoreBonus(b)" />
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
import scrollTo from '@/util/scrollTo';

export default {
  name: 'CoreBonusSelector',
  components: { Selector, CoreBonusSelectItem, MissingItem },
  props: {
    pilot: { type: Object, required: true },
    levelUp: { type: Boolean, default: false },
    modal: { type: Boolean, default: false },
  },
  data: () => ({
    search: '',
    open: [] as number[],
  }),
  computed: {
    coreBonuses(): CoreBonus[] {
      const cbs = CompendiumStore().CoreBonuses.filter((x) => !x.IsHidden);
      if (this.search) {
        return cbs.filter((x) => x.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      return cbs;
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
    selectionComplete(bool) {
      if (bool) window.scrollTo(0, document.body.scrollHeight);
    },
    search(newval: string) {
      if (!newval) this.open = [];
      else this.open = this.manufacturersWithCBs.map((x, i) => i);
    },
  },
  methods: {
    requirement(m: Manufacturer): string {
      const br = this.$vuetify.display.mdAndDown ? '<br>' : '&emsp;//&emsp;';
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
      this.scrollTo(`${id}`);
    },
    scrollTo(e: any): void {
      const el = document.getElementById(e);
      if (el) scrollTo(el, this.modal);
    },
  },
  mounted() {
    this.$emit('update:selectionComplete', this.selectionComplete);
  },
};
</script>
