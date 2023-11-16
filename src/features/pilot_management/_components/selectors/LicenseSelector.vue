<template>
  <selector
    title="Pilot Licenses"
    height="60vh"
    :success="!pilot.LicenseController.IsMissingLicenses"
    :modal="modal"
  >
    <template #left-column>
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
            class="stat-text"
          >
            License Selection Complete
          </v-alert>
          <v-alert
            v-if="pilot.LicenseController.IsMissingLicenses"
            variant="outlined"
            color="accent"
            icon="mdi-alert"
            class="stat-text"
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
        </v-col>
      </v-row>
    </template>

    <template #right-column>
      <v-row v-for="m in Object.keys(licenses)">
        <v-col v-if="!!mf(m)" class="text-center pa-3">
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <cc-logo
                v-if="mf(m).LogoIsExternal"
                :source="mf(m)"
                :size="$vuetify.display.mdAndDown ? 'large' : 'xLarge'"
                class="pt-3 mb-n1"
              />
              <v-icon
                v-else
                size="60"
                :icon="mf(m).Icon"
                :color="mf(m).GetColor($vuetify.theme.current.dark)"
              />
            </v-col>
            <v-col
              cols="auto"
              :class="$vuetify.display.mdAndDown ? 'heading h2' : 'heading mech'"
              :style="`color: ${mf(m).GetColor($vuetify.theme.current.dark)}`"
            >
              {{ mf(m).Name }}
            </v-col>
          </v-row>
          <v-expansion-panels accordion focusable>
            <v-expansion-panel v-for="item in licenses[m]" :id="`license_${item.FrameID}`">
              <v-expansion-panel-title class="hover-parent py-0 pr-0 pl-3" hide-actions>
                <div>
                  <div>
                    <div class="caption">{{ (item as License).Frame.Source }}</div>
                    <div class="heading h2 font-weight-bold">
                      {{ (item as License).Frame.Name }}
                    </div>
                  </div>
                  <div style="min-width: 20vw">
                    <v-chip
                      v-for="f in (item as License).Frame.MechType"
                      size="small"
                      dark
                      variant="outlined"
                      color="accent"
                      class="ma-1"
                    >
                      {{ f }}
                    </v-chip>
                  </div>
                </div>
                <div
                  class="img-hover"
                  :style="`background-image: url('${(item as License).Frame.DefaultImage}'); height:110px;
                    width:100%;  background-position: top ${(item as License).Frame.YPosition}% left 0`"
                />
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <license-select-item
                  :license="item"
                  :is-selectable="item.CanSelect(pilot)"
                  :rank="pilot.LicenseController.getLicenseRank(item.Name)"
                  @add="pilot.LicenseController.AddLicense(item)"
                  @remove="pilot.LicenseController.RemoveLicense(item)"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
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
import LicenseSelectItem from './components/_LicenseSelectItem.vue';

import { CompendiumStore } from '@/stores';
import { Pilot, License } from '@/class';

export default {
  name: 'license-selector',
  components: { Selector, LicenseSelectItem, MissingItem },
  props: {
    pilot: { type: Pilot, required: true },
    levelUp: Boolean,
    modal: Boolean,
  },
  data: () => ({
    licenses: [] as any,
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
      this.scrollTo(`license_${id}`);
    },
    scrollTo(e: any): void {
      const el = document.getElementById(e);
      if (el) {
        const ce = document.getElementById('content-col');
        if (ce) {
          const yOffset = -60;
          const y = el.getBoundingClientRect().top + yOffset;

          ce.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          const yOffset = -60;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    },
    mf(id: string) {
      return CompendiumStore().referenceByID('Manufacturers', id.toUpperCase());
    },
  },
};
</script>
