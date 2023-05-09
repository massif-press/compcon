<template>
  <selector
    title="Pilot Licenses"
    height="60vh"
    :success="!pilot.LicenseController.IsMissingLicenses"
  >
    <template #left-column>
      <v-row v-for="pl in pilot.LicenseController.Licenses" class="my-2" style="width: 98%">
        <missing-item v-if="pl.License.err" @remove="remove(pl)" />
        <div v-else>
          <v-icon :color="manufacturer(pl.License.Source).Color">cc:rank_{{ pl.Rank }}</v-icon>
          <strong>{{ pl.License.Name }}</strong>
          <v-icon end class="fade-select" @click="scroll(pl.License.FrameID)">
            mdi-chevron-right
          </v-icon>
        </div>
      </v-row>
      <v-divider v-if="pilot.LicenseController.Licenses.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-alert
          variant="outlined"
          color="success"
          icon="check_circle"
          class="stat-text"
          style="width: 95%"
          :value="!pilot.LicenseController.IsMissingLicenses"
        >
          License Selection Complete
        </v-alert>
        <v-alert
          variant="outlined"
          color="accent"
          icon="warning"
          class="stat-text"
          :value="pilot.LicenseController.IsMissingLicenses"
        >
          {{ pilot.LicenseController.CurrentLicensePoints }} /
          {{ pilot.LicenseController.MaxLicensePoints }} Licenses selected
        </v-alert>
        <div class="my-2">
          <v-btn
            block
            text
            small
            :disabled="!pilot.LicenseController.Licenses.length"
            @click="pilot.LicenseController.ClearLicenses()"
          >
            Reset
          </v-btn>
        </div>
      </v-row>
    </template>

    <template #right-column>
      <v-row v-for="m in Object.keys(licenses)">
        <v-col class="text-center pa-3">
          <span
            class="heading mech"
            :style="`color: ${manufacturer(m).GetColor($vuetify.theme.current.dark)}`"
          >
            <cc-logo :source="manufacturer(m)" size="xLarge" class="pt-4" />
            {{ manufacturer(m).Name }}
          </span>
          <v-expansion-panels accordion focusable active-class="border-primary">
            <license-select-item
              v-for="l in licenses[m]"
              :id="`e_${l.FrameID}`"
              :license="l"
              :is-selectable="l.CanSelect(pilot)"
              :rank="pilot.LicenseController.getLicenseRank(l.Name)"
              @add="pilot.LicenseController.AddLicense(l)"
              @remove="pilot.LicenseController.RemoveLicense(l)"
            />
          </v-expansion-panels>
          <v-divider class="mt-5 mb-0" />
        </v-col>
      </v-row>
    </template>
  </selector>
</template>

<script lang="ts">
import Selector from './components/_SelectorBase.vue';
import MissingItem from './components/_MissingItem.vue';
import LicenseSelectItem from './components/_LicenseSelectItem.vue';

import { CompendiumStore } from '@/stores';
import { Pilot } from '@/class';

export default {
  name: 'cc-license-selector',
  components: { Selector, LicenseSelectItem, MissingItem },
  props: {
    pilot: Pilot,
    levelUp: Boolean,
  },
  data: () => ({
    licenses: [],
  }),
  computed: {
    selectionComplete(): boolean {
      return this.levelUp && !this.pilot.LicenseController.IsMissingLicenses;
    },
  },
  watch: {
    selectionComplete(bool) {
      if (bool) window.scrollTo(0, document.body.scrollHeight);
    },
  },
  created() {
    const compendium = CompendiumStore();
    this.licenses = _.groupBy(
      compendium.Licenses.filter((x) => !x.Hidden),
      'Source'
    );
  },
  methods: {
    scroll(id) {
      if (this.levelUp)
        this.$vuetify.goTo(`#e_${id}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        });
      else
        this.$vuetify.goTo(`#e_${id}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
          container: '.v-dialog--active',
        });
    },
    manufacturer(id: string) {
      const compendium = CompendiumStore();
      return compendium.referenceByID('Manufacturers', id.toUpperCase());
    },
  },
};
</script>
