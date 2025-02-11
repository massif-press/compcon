<template>
  <v-container :class="mobile ? 'py-0 px-2' : 'px-12'" fluid>
    <v-row align="center">
      <v-col>
        <div class="heading h2">
          Search
          <cc-slashes />
          COMPENDIUM
        </div>
      </v-col>
      <v-col cols="auto">
        <cc-button
          color="accent"
          size="small"
          variant="outlined"
          :to="`/srd/reference/search?search=${searchText}`">
          Switch to reference search
        </cc-button>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <cc-text-field
          ref="input"
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
        <masonry-wall
          :key="searchText"
          :items="searchResults"
          :column-width="400"
          :gap="16"
          :min-columns="1"
          :max-columns="widescreen ? 3 : 2">
          <template #default="{ item }">
            <cc-search-result-modal :item="item" />
          </template>
        </masonry-wall>
      </v-slide-y-reverse-transition>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import { CompendiumItem, LicensedItem, Frame } from '@/class';
import { accentInclude } from '@/classes/utility/accent_fold';
import { CompendiumStore } from '@/stores';

export default {
  name: 'search-results',
  data: () => ({
    selected: null as any,
    searchText: '',
    loaded: false,
  }),
  watch: {
    searchText(newVal) {
      this.setSearch(newVal);
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    widescreen() {
      return this.$vuetify.display.lgAndUp;
    },
    validResults(): CompendiumItem[] {
      return _.flatten(
        _.values(
          _.pick(CompendiumStore(), [
            'Frames',
            'MechSystems',
            'MechWeapons',
            'WeaponMods',
            'Talents',
            'PilotGear',
            'Reserves',
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
