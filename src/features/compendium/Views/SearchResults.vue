<template>
  <v-container fluid class="mt-5">
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
          @input="setSearch($event)"
        />
      </v-col>
    </v-row>
    <v-row class="mx-3">
      <v-col>
        <div>
          {{ searchResults.length }} result{{
            searchResults.length === 1 ? '' : 's'
          }}
        </div>
        <v-slide-y-reverse-transition mode="out-in">
          <v-row fill-height>
            <v-col v-for="(item, index) in searchResults">
              <cc-titled-panel
                :title="
                  (item.ItemType === 'Frame' ? `${item.Source} ` : '') +
                  item.Name
                "
                :icon="'cc:' + $_.kebabCase(item.ItemType)"
                :color="$_.kebabCase(item.ItemType)"
                clickable
                @click="$refs[`modal_${item.ID}`][0].show()"
              >
                <span
                  v-html-safe="
                    item.Description ||
                    item.Effect ||
                    `${item.Source} ${item.ItemType}`
                  "
                  class="item-description"
                />
              </cc-titled-panel>
              <cc-search-result-modal :ref="`modal_${item.ID}`" :item="item" />
            </v-col>
            <v-col cols="12">
              <br />
            </v-col>
          </v-row>
        </v-slide-y-reverse-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { CompendiumItem } from '@/class';
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
      // const compendium =CompendiumStore();
      // return this.$_.flatten(
      //   this.$_.values(
      //     this.$_.pick(compendium, [
      //       'Frames',
      //       'MechSystems',
      //       'MechWeapons',
      //       'WeaponMods',
      //     ])
      //   )
      // );
    },
    searchResults(): CompendiumItem[] {
      if (!this.searchText) {
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
      this.$router.replace(`/compendium/search?search=${value}`);
    },
    forceInput() {
      this.setSearch((this.$refs.input as HTMLInputElement as any).value);
    },

    onClick(item: CompendiumItem) {
      alert(item.Name);
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
