<template>
  <selector
    title="Pilot Licenses"
    :success="!pilot.LicenseController.IsMissingLicenses"
    :modal="modal">
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
      <v-row v-for="pl in pilot.LicenseController.Licenses" dense align="center" class="px-2">
        <v-col cols="auto">
          <v-icon :color="mf(pl.License.Source).Color" :icon="`cc:rank_${pl.Rank}`" />
        </v-col>
        <v-col>
          <strong>{{ pl.License.Name }}</strong>
        </v-col>
        <v-col cols="auto">
          <v-btn icon size="x-small" variant="plain" @click="scroll(pl.License.FrameID)">
            <v-icon size="25" icon="mdi-menu-right" />
          </v-btn>
        </v-col>
      </v-row>
      <v-divider v-if="pilot.LicenseController.Licenses.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-col class="ma-1">
          <v-alert
            v-if="!pilot.LicenseController.IsMissingLicenses"
            variant="outlined"
            color="success"
            icon="mdi-check-circle"
            class="stat-text">
            License Selection Complete
          </v-alert>
          <v-alert
            v-if="pilot.LicenseController.IsMissingLicenses"
            variant="outlined"
            color="accent"
            icon="mdi-alert"
            class="stat-text">
            {{ pilot.LicenseController.CurrentLicensePoints }} /
            {{ pilot.LicenseController.MaxLicensePoints }} Licenses selected
          </v-alert>
          <div class="my-2">
            <v-btn
              block
              variant="text"
              small
              :disabled="!pilot.LicenseController.Licenses.length"
              @click="pilot.LicenseController.ClearLicenses()">
              Reset
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>

    <template #float>
      <v-card
        v-if="!pilot.LicenseController.IsMissingLicenses"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="success"
        v-text="'License Selection Complete'" />
      <v-card
        v-if="
          pilot.LicenseController.MaxLicensePoints > pilot.LicenseController.CurrentLicensePoints
        "
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="accent"
        v-text="
          `${pilot.LicenseController.MaxLicensePoints - pilot.LicenseController.CurrentLicensePoints}
            License Selections remaining`
        " />

      <cc-button
        variant="text"
        size="x-small"
        block
        :disabled="!pilot.LicenseController.Licenses.length"
        @click="pilot.LicenseController.ClearLicenses()">
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
      <v-row v-for="m in Object.keys(licenses)">
        <v-col v-if="!!mf(m)" class="text-center pa-3">
          <v-row
            v-show="
              !search
                ? true
                : licenses[m].some((x) => x.Name.toLowerCase().includes(search.toLowerCase()))
            "
            align="center"
            justify="center">
            <v-col cols="auto">
              <cc-logo
                v-if="mf(m).LogoIsExternal"
                :source="mf(m)"
                :size="$vuetify.display.mdAndDown ? 'large' : 'xLarge'"
                class="pt-3 mb-n1" />
              <v-icon
                v-else
                size="60"
                :icon="mf(m).Icon"
                :color="mf(m).GetColor($vuetify.theme.current.dark)" />
            </v-col>
            <v-col
              cols="auto"
              :class="$vuetify.display.mdAndDown ? 'heading h2' : 'heading mech'"
              :style="`color: ${mf(m).GetColor($vuetify.theme.current.dark)}`">
              {{ mf(m).Name }}
            </v-col>
          </v-row>
          <v-expansion-panels accordion focusable flat>
            <license-expandable
              :items="
                licenses[m].filter((x) =>
                  !search ? true : x.Name.toLowerCase().includes(search.toLowerCase())
                )
              "
              :controller="pilot.LicenseController"
              selectable
              @add="pilot.LicenseController.AddLicense($event)"
              @remove="pilot.LicenseController.RemoveLicense($event)" />
          </v-expansion-panels>
        </v-col>
      </v-row>
    </template>
  </selector>
</template>

<script lang="ts">
import _ from 'lodash';
import Selector from './components/_SelectorBase.vue';
import MissingItem from './components/_MissingItem.vue';
import LicenseExpandable from '@/ui/components/CompendiumBrowser/components/_license-expandable.vue';

import { CompendiumStore } from '@/stores';
import { Pilot, License } from '@/class';
import scrollTo from '@/util/scrollTo';

export default {
  name: 'license-selector',
  components: { Selector, MissingItem, LicenseExpandable },
  props: {
    pilot: { type: Pilot, required: true },
    levelUp: Boolean,
    modal: Boolean,
  },
  data: () => ({
    search: '',
    jump: '',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    selectionComplete(): boolean {
      return this.levelUp && !this.pilot.LicenseController.IsMissingLicenses;
    },
    licenses() {
      return _.groupBy(
        CompendiumStore().Licenses.filter((x) => !x.Hidden),
        'Source'
      );
    },
    jumpItems() {
      return [
        ...this.pilot.LicenseController.Licenses.map((x) => ({
          title: x.License.Name,
          value: x.License.FrameID,
          subtitle: `// Pilot Rank: ${x.Rank}`,
        })),
        ...CompendiumStore()
          .Licenses.filter((x) => !x.Hidden)
          .filter((x) => !this.pilot.LicenseController.Licenses.some((y) => y.License.ID === x.ID))
          .map((x) => ({
            title: x.Name,
            value: x.FrameID,
          })),
      ];
    },
  },
  watch: {
    jump(val) {
      this.scroll(val);
    },
  },
  methods: {
    scroll(id) {
      this.scrollTo(id);
    },
    scrollTo(e: any): void {
      const el = document.getElementById(e);
      if (el) scrollTo(el, this.modal);
    },
    mf(id: string) {
      return CompendiumStore().referenceByID('Manufacturers', id.toUpperCase());
    },
  },
};
</script>
