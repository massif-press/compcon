<template>
  <selector title="Pilot Core Bonuses" :success="!pilot.CoreBonusController.IsMissingCBs">
    <template #float>
      <v-card
        v-if="!pilot.CoreBonusController.IsMissingCBs"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="success"
        v-text="'Core Bonus Selection Complete'" />
      <v-card
        v-if="pilot.CoreBonusController.MaxCBPoints > pilot.CoreBonusController.CurrentCBPoints"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="accent"
        v-text="
          `${pilot.CoreBonusController.MaxCBPoints - pilot.CoreBonusController.CurrentCBPoints}
            Core Bonus Selections remaining`
        " />

      <cc-button
        variant="text"
        size="x-small"
        block
        :disabled="!pilot.CoreBonusController.CoreBonuses.length"
        @click="pilot.CoreBonusController.ClearCoreBonuses()">
        Reset
      </cc-button>
    </template>

    <template #jump>
      <div class="px-2">
        <cc-select
          v-model="jump"
          label="jump to"
          color="primary"
          variant="outlined"
          :items="jumpItems" />
      </div>
    </template>

    <template #right-column>
      <v-expansion-panels v-model="open" multiple flat tile>
        <v-expansion-panel v-for="{ manufacturer, coreBonuses } in manufacturersWithCBs">
          <v-expansion-panel-title>
            <div class="pr-5">
              <div
                class="heading h1"
                :style="`color: ${manufacturer.Color}`"
                style="font-size: calc(20px + 1vw)">
                <v-icon :icon="manufacturer.Icon" class="mt-n1" />
                {{ manufacturer.Name }}
              </div>
              <v-card
                variant="outlined"
                :color="manufacturer.GetColor($vuetify.theme.current.dark)"
                class="my-1 pa-3">
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
    jump: '',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    coreBonuses(): CoreBonus[] {
      const cbs = CompendiumStore().CoreBonuses.filter((x) => !x.IsHidden);
      if (this.search) {
        return cbs.filter((x) => x.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      return cbs;
    },
    jumpItems(): { title: string; value: string; subtitle?: string }[] {
      return [
        ...this.pilot.CoreBonusController.CoreBonuses.map((x) => ({
          title: x.Name,
          value: x.ID,
          subtitle: `// Unlocked`,
        })),
        ...this.coreBonuses
          .filter((x) => !this.pilot.has('CoreBonus', x.ID))
          .map((x) => ({
            title: x.Name,
            value: x.ID,
          })),
      ];
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
    jump(val) {
      this.scroll(val);
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
      if (!el) {
        console.warn(`Element with ID ${e} not found`);
        return;
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
  },
  mounted() {
    this.$emit('update:selectionComplete', this.selectionComplete);
  },
};
</script>
