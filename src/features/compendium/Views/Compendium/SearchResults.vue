<template>
  <v-container>
    <v-row align="center">
      <v-col
        ><div class="heading h2">Search<cc-slashes />COMPENDIUM</div></v-col
      >
      <v-col cols="auto"
        ><v-btn
          color="primary"
          size="small"
          variant="outlined"
          :to="`/srd/reference/search?search=${searchText}`"
          >Switch to reference search</v-btn
        ></v-col
      >
    </v-row>
    <v-row justify="center">
      <v-col cols="8">
        <v-text-field
          ref="input"
          :value="searchText"
          class="search-field"
          prepend-icon="search"
          solo
          hide-details
          single-line
          placeholder="Search"
          @update:modelValue="setSearch($event)"
        />
      </v-col>
    </v-row>
    <v-row class="mx-3">
      <v-col>
        <i class="text-overline">
          {{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }}
        </i>
        <v-slide-y-reverse-transition mode="out-in">
          <v-row :key="searchText" fill-height>
            <v-col
              v-for="(item, index) in searchResults"
              :key="index"
              style="width: fit-content; min-width: 30vw; max-width: 60vw"
            >
              <cc-titled-panel
                :title="(item.ItemType === 'Frame' ? `${(item as Frame).Source} ` : '') + item.Name"
                :icon="item.Icon"
                :color="item.Color"
                clickable
                @click="onClick(item)"
              >
                <span
                  v-html-safe="item.Description || (item as any).Effect || `${(item as LicensedItem).Source} ${item.ItemType}`"
                  class="item-description"
                />
              </cc-titled-panel>
              <cc-search-result-modal :ref="`modal_${item.ID}`" :item="item" />
            </v-col>
          </v-row>
        </v-slide-y-reverse-transition>
      </v-col>
    </v-row>
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
    searchText: '',
    loaded: false,
  }),
  computed: {
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
    const input = this.$refs.input as HTMLInputElement;
    input.focus();
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
    onClick(item: CompendiumItem) {
      ((this.$refs[`modal_${item.ID}`] as any)[0] as any).show();
    },
  },
};
</script>

<style scoped>
.item-description {
  display: block;
  min-height: 65px;
  max-height: 65px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-style: italic;
  color: gray;
}
</style>
