<template>
  <cc-sidebar-view>
    <div v-for="m in Object.keys(bonuses)" slot="sidebar">
      <v-list-item>
        <v-list-item-title class="ml-n5 mb-n2">
          <cc-logo :source="manufacturer(m)" style="margin-bottom: -6px" />
          <span
            class="heading sub"
            :style="`color: ${manufacturer(m).GetColor($vuetify.theme.dark)}`"
          >
            {{ m }}
          </span>
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        v-for="cb in bonuses[m]"
        link
        @click="
          $vuetify.goTo(`#e_${cb.ID}`, {
            duration: 150,
            easing: 'easeInOutQuad',
            offset: 25,
          })
        "
      >
        <v-list-item-title class="heading h3 text-text">{{
          cb.Name
        }}</v-list-item-title>
      </v-list-item>
    </div>

    <v-row no-gutters class="mt-3" align="center">
      <v-col cols="auto">
        <div class="heading h2">CORE BONUSES</div>
      </v-col>
      <v-col
        v-if="$vuetify.display.smAndDown"
        cols="auto"
        class="ml-auto"
        style="max-width: 30%"
      >
        <v-select
          v-model="manFilter"
          value="ALL"
          :items="['ALL', ...sources]"
          variant="outlined"
          density="compact"
          hide-details
          height="2px"
        />
      </v-col>
    </v-row>

    <v-divider class="my-2" />

    <div v-for="m in Object.keys(bonuses)">
      <v-row density="compact" align="center">
        <v-col cols="auto">
          <cc-logo
            :size="$vuetify.display.mdAndUp ? 'xLarge' : 'large'"
            :source="manufacturer(m)"
            class="mb-n2"
          />
        </v-col>
        <v-col>
          <div
            class="heading h2"
            :style="`color: ${manufacturer(m).GetColor($vuetify.theme.dark)}`"
          >
            {{ manufacturer(m).Name }}
          </div>
        </v-col>
      </v-row>
      <cc-core-bonus-item
        v-for="(b, i) in bonuses[m]"
        :id="`e_${b.ID}`"
        :bonus="b"
        class="mx-3 my-5"
      />
    </div>
  </cc-sidebar-view>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import _, { Dictionary } from 'lodash';
import { CoreBonus } from '@/class';
import { Manufacturer } from '@/classes/Manufacturer';

export default {
  name: 'CoreBonuses',
  data: () => ({
    manFilter: 'ALL',
  }),
  computed: {
    bonuses(): Dictionary<CoreBonus[]> {
      let bArr = this.$CompendiumStore['compendium/CoreBonuses'].filter(
        (x: CoreBonus) => !x.IsHidden
      );
      if (this.manFilter && this.manFilter.toLowerCase() !== 'all') {
        bArr = bArr.filter((x: CoreBonus) => x.Source === this.manFilter);
      }

      return _.groupBy(bArr, 'Source');
    },
    sources(): string[] {
      return this.$CompendiumStore['compendium/CoreBonuses']
        .filter((x: CoreBonus) => !x.IsHidden)
        .map((x: CoreBonus) => x.Source);
    },
    compendium(): CompendiumStore {
      return CompendiumStore();
    },
  },
  mounted(): void {
    this.manFilter = 'ALL';
  },
  methods: {
    manufacturer(id: string): Manufacturer {
      const compendium = CompendiumStore();
      return compendium.Manufacturers.find((x) => x.ID === id.toUpperCase());
    },
  },
};
</script>
