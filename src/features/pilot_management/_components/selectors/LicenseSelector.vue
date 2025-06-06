<template>
  <missing-item-alert
    v-if="pilot.LicenseController.IsMissingLicenses"
    :type="'licenses'"
    :items="pilot.LicenseController.MissingLicenses"
    @remove="pilot.LicenseController.RemoveLicense($event.Stub as any)" />

  <selector
    title="Pilot Licenses"
    :success="!pilot.LicenseController.IsMissingLicenses"
    :modal="modal"
    :selected="pilot.LicenseController.CurrentLicensePoints"
    :total="pilot.LicenseController.MaxLicensePoints">
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
      <v-row v-for="m in mfSort(Object.keys(licenses))">
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
import logger from '@/user/logger';
import MissingItemAlert from './components/_MissingItemAlert.vue';

export default {
  name: 'license-selector',
  components: { Selector, MissingItem, LicenseExpandable, MissingItemAlert },
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
        CompendiumStore()
          .Licenses.filter((x) => !x.Hidden)
          .sort((a, b) => License.LicenseSort(a, b)),
        'Source'
      );
    },
    jumpItems() {
      return [
        ...this.pilot.LicenseController.Licenses.filter((l) => l.License).map((x) => ({
          title: x.License!.Name,
          value: x.License!.FrameID,
          subtitle: `// Pilot Rank: ${x.Rank}`,
        })),
        ...CompendiumStore()
          .Licenses.filter((x) => !x.Hidden && x.License)
          .filter((x) => !this.pilot.LicenseController.Licenses.some((y) => y.License!.ID === x.ID))
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
      if (!el) {
        logger.warn(`Element with ID ${e} not found`, this);
        return;
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    mf(id: string) {
      return CompendiumStore().referenceByID('Manufacturers', id.toUpperCase());
    },
    mfSort(keys: string[]) {
      const mfOrder = ['gms', 'ips-n', 'ssc', 'horus', 'ha'];

      const mfOrderMap = new Map(mfOrder.map((mf, index) => [mf, index]));
      return keys.sort((a, b) => {
        const aIndex = mfOrderMap.get(a.toLowerCase()) ?? mfOrder.length;
        const bIndex = mfOrderMap.get(b.toLowerCase()) ?? mfOrder.length;
        return aIndex - bIndex;
      });
    },
  },
};
</script>
