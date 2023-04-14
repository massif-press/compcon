<template>
  <cc-sidebar-view>
    <template v-slot:sidebar>
      <div v-for="m in Object.keys(bonuses)" slot="sidebar">
        <v-list-item>
          <v-list-item-title>
            <v-row no-gutters align="center">
              <v-col cols="auto">
                <v-icon
                  size="30"
                  :icon="`cc:${manufacturer(m).Icon}`"
                  :color="manufacturer(m).Color"
                />
              </v-col>
              <v-col
                cols="auto"
                class="heading sub"
                :style="`color: ${manufacturer(m).GetColor(
                  $vuetify.theme.current.dark
                )}`"
              >
                {{ m }}
              </v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-for="cb in bonuses[m]"
          link
          :title="cb.Name"
          @click="scrollTo(cb)"
        >
        </v-list-item>
      </div>
    </template>

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
      <v-row dense align="center">
        <v-col cols="auto">
          <v-icon
            size="80"
            :icon="`cc:${manufacturer(m).Icon}`"
            :color="manufacturer(m).Color"
          />
        </v-col>
        <v-col>
          <div
            class="heading h2"
            :style="`color: ${manufacturer(m).GetColor(
              $vuetify.theme.current.dark
            )}`"
          >
            {{ manufacturer(m).Name }}
          </div>
        </v-col>
      </v-row>
      <cc-core-bonus-item
        v-for="b in bonuses[m]"
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

export default {
  name: 'CoreBonuses',
  data: () => ({
    manFilter: 'ALL',
  }),
  computed: {
    bonuses(): Dictionary<CoreBonus[]> {
      let bArr = CompendiumStore().CoreBonuses.filter(
        (x: CoreBonus) => !x.IsHidden
      );
      if (this.manFilter && this.manFilter.toLowerCase() !== 'all') {
        bArr = bArr.filter((x: CoreBonus) => x.Source === this.manFilter);
      }

      return _.groupBy(bArr, 'Source');
    },
    sources(): string[] {
      return CompendiumStore()
        .CoreBonuses.filter((x: CoreBonus) => !x.IsHidden)
        .map((x: CoreBonus) => x.Source);
    },
  },
  mounted(): void {
    this.manFilter = 'ALL';
  },
  methods: {
    scrollTo(bonus: CoreBonus): void {
      const el = document.getElementById(`e_${bonus.ID}`);
      if (el) {
        const yOffset = -60;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
    manufacturer(id: string): any {
      return CompendiumStore().Manufacturers.find(
        (x) => x.ID === id.toUpperCase()
      );
    },
  },
};
</script>
