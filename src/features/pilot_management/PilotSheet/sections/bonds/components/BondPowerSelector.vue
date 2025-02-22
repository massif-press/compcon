<template>
  <cc-solo-modal v-model="dialog" color="blue-grey darken-4" title="Select Bond powers">
    <v-layout :style="!mobile && 'overflow-y: scroll; height: 89vh'">
      <div
        style="position: absolute; z-index: 999"
        :style="`left: ${showNav ? (mobile ? '322' : '238') : '0'}px; top: 6px`">
        <cc-button
          :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
          size="small"
          color="primary"
          @click="(showNav as any) = !showNav" />
      </div>
      <v-navigation-drawer
        v-model="showNav"
        :width="mobile ? 320 : 250"
        style="overflow-y: scroll"
        :style="[
          mobile ? 'height:95.5vh; top:30px' : 'height: 89vh; top: 40px',
          showNav && ' position: fixed',
        ]">
        <v-list density="compact" slim>
          <v-list-item color="accent" selectable @click="featureSet = 'all'">
            <template #title>
              <div class="text-button">
                <b class="text-accent">{{ pilot.BondController.Bond.Name }}</b>
                Powers
              </div>
            </template>
          </v-list-item>
          <v-list-item color="accent" selectable @click="featureSet = 'assigned'">
            <template #title>
              <div class="text-button">
                <b>All Selected Powers</b>
              </div>
            </template>
          </v-list-item>
          <v-divider />

          <v-divider />

          <v-list-group color="accent" class="pt-0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template #title>
                  <span class="text-button">
                    <b>Other Bonds</b>
                  </span>
                </template>
              </v-list-item>
            </template>

            <v-list-item v-for="b in Bonds" color="accent" class="pl-6" @click="featureSet = b.ID">
              <template #title>
                <b class="text-button">{{ b.Name }}</b>
              </template>
            </v-list-item>
          </v-list-group>
        </v-list>
        <div style="height: 20px" />
      </v-navigation-drawer>
      <v-main>
        <v-card-text class="py-2">
          <v-row density="compact" align="start" class="ml-4">
            <v-col>
              <span class="heading h3">
                <span class="text-accent">{{ currentSelection }}</span>
                Powers
              </span>
            </v-col>
            <v-col>
              <span class="heading h3">
                <b class="text-accent">{{ pilot.BondController.TotalPowerSelections }}</b>
                Selections Available
              </span>
            </v-col>
            <v-col cols="auto">
              <cc-switch
                v-model="ignoreLimit"
                inset
                density="compact"
                hide-details
                class="ma-0"
                color="accent"
                label="Ignore Limit" />
            </v-col>
          </v-row>
          <v-divider class="mt-2 mb-4" />
          <v-row>
            <masonry-wall
              :items="shownPowers"
              :column-width="400"
              :gap="16"
              :min-columns="1"
              :max-columns="widescreen ? 3 : 2">
              <template #default="{ item }">
                <cc-bond-power-card :power="item" />
                <cc-button
                  v-if="!(item as any).veteran && (!hasPower(item) || allowDupes)"
                  color="primary"
                  block
                  size="x-small"
                  @click="pilot.BondController.AddPower(item)">
                  <v-icon start>mdi-plus</v-icon>
                  Add {{ (item as any).name }}
                </cc-button>
                <cc-button
                  v-if="hasPower(item)"
                  color="warning darken-1"
                  block
                  size="x-small"
                  @click="pilot.BondController.RemovePower(item)">
                  <v-icon start>mdi-minus</v-icon>
                  Remove {{ (item as any).name }}
                </cc-button>
              </template>
            </masonry-wall>

            <v-col v-if="!shownPowers.length" cols="12">
              <v-alert v-if="featureSet === 'all'" variant="outlined" class="text-center">
                No Bond Power selections remaining
                <br />
                <span class="caption text--secondary">
                  Additional features beyond the recommended guidelines can be added by toggling the
                  "Ignore Limit" option above
                </span>
              </v-alert>
              <v-alert v-else-if="featureSet === 'assigned'" variant="outlined" class="text-center">
                No Bond Powers assigned
              </v-alert>
              <v-alert v-else variant="outlined" class="text-center">
                No Bond Powers available
                <br />
                <span class="caption text--secondary">
                  Additional features beyond the recommended guidelines can be added by toggling the
                  "Ignore Limit" option above
                </span>
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
      </v-main>
    </v-layout>
  </cc-solo-modal>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'bond-power-select-menu',
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    dialog: false,
    featureSet: 'all',
    ignoreLimit: false,
    allowDupes: false,
    showNav: true,
  }),
  mounted() {
    this.showNav = !this.mobile;
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    widescreen() {
      return this.$vuetify.display.lgAndUp;
    },
    currentSelection() {
      switch (this.featureSet) {
        case 'all':
          return this.pilot.BondController.Bond.Name;
        case 'assigned':
          return 'All Assigned';
        default:
          return this.Bonds.find((x) => x.ID === this.featureSet)?.Name;
      }
    },
    shownPowers() {
      if (!this.pilot.BondController.TotalPowerSelections && !this.ignoreLimit) {
        if (this.featureSet === 'all')
          return this.pilot.BondController.Bond.Powers.filter((x) =>
            this.pilot.BondController.BondPowers.some((y) => y.name === x.name)
          );
        if (this.featureSet === 'assigned') return this.pilot.BondController.BondPowers;
        return CompendiumStore()
          .Bonds.find((x) => x.ID === this.featureSet)
          ?.Powers.filter((x) =>
            this.pilot.BondController.BondPowers.some((y) => y.name === x.name)
          );
      }

      if (this.featureSet === 'all') return this.pilot.BondController.Bond.Powers;
      if (this.featureSet === 'assigned') return this.pilot.BondController.BondPowers;

      return CompendiumStore().Bonds.find((x) => x.ID === this.featureSet)?.Powers;
    },
    Bonds() {
      return CompendiumStore().Bonds.map((x) => ({
        Name: x.Name,
        ID: x.ID,
      }));
    },
  },
  methods: {
    hasPower(bond) {
      return this.pilot.BondController.BondPowers.some((y) => y.name === bond.name);
    },
    resetPowers() {
      this.pilot.BondController.BondPowers.splice(0, this.pilot.BondController.BondPowers.length);
    },
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
  },
};
</script>
