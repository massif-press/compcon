<template>
  <v-container :class="mobile ? 'py-0 px-2' : 'px-12'"
    fluid>
    <v-row align="center">
      <v-col>
        <div class="heading h2">
          Search
          <cc-slashes />
          COMPENDIUM
        </div>
      </v-col>
      <v-col cols="auto">
        <cc-button color="accent"
          size="small"
          variant="outlined"
          :to="`/srd/reference/search?search=${searchText}`">
          Switch to reference search
        </cc-button>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12"
        sm="10"
        md="8">
        <cc-text-field ref="input"
          v-model="searchText"
          color="primary"
          class="search-field"
          icon="mdi-magnify"
          placeholder="Search" />
      </v-col>
    </v-row>
    <i class="text-overline">
      {{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }}
    </i>
    <v-card-text :style="!mobile && 'height: calc(100vh - 198px); overflow-y: scroll'">
      <v-slide-y-reverse-transition mode="out-in">
        <cc-masonry-grid :key="searchText"
          :items="searchResults">
          <template #default="{ item }">
            <cc-search-result-modal :item="item" />
          </template>
        </cc-masonry-grid>
      </v-slide-y-reverse-transition>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import { flatten, values, pick } from 'lodash-es';
import { CompendiumItem } from '@/classes/CompendiumItem'
import { accentInclude } from '@/classes/utility/accent_fold';
import { CompendiumStore } from '@/stores';
import { useMobile } from '@/composables/useMobile';


export default {
  setup() {
    return useMobile()
  },
  name: 'SearchResults',
  data: () => ({
    selected: null as any,
    searchText: '',
    loaded: false,
  }),
  computed: {
    widescreen() {
      return this.$vuetify.display.lgAndUp;
    },
    validResults(): CompendiumItem[] {
      return flatten(
        values(
          pick(CompendiumStore(), [
            'Frames',
            'MechSystems',
            'MechWeapons',
            'WeaponMods',
            'Talents',
            'PilotGear',
            'Reserves',
            'Actions',
            'CoreBonuses',
            'NpcFeatures',
            'NpcClasses',
            'NpcTemplates',
            'Backgrounds',
            'Bonds',
            'Skills',
          ])
        )
      ) as CompendiumItem[];
    },
    searchResults(): CompendiumItem[] {
      if (!this.searchText || this.searchText.length < 3) {
        return [];
      }
      const results = this.validResults.filter(
        (r) => !r.IsHidden && accentInclude(r.Name, this.searchText)
      );
      return results;
    },
  },
  watch: {
    searchText(newVal) {
      this.setSearch(newVal);
    },
  },
  mounted() {
    this.searchText = this.$route.query.search as string;
  },
  methods: {
    setSearch(value: string) {
      if (value === this.searchText) {
        return;
      }
      this.searchText = value;
      this.$router.replace(`search?search=${value}`);
    },
    forceInput() {
      this.setSearch((this.$refs.input as HTMLInputElement).value);
    },
  },
};
</script>
