<template>
  <v-container>
    <v-layout wrap justify-center class="mt-5 px-5">
      <v-flex xs8 px-2 pb-3>
        <v-text-field
          ref="input"
          class="search-field"
          prepend-icon="search"
          @input="$_.debounce(setSearch($event), 500)"
          :value="this.searchText"
          solo
          hide-details
          single-line
          placeholder="Search"
        />
      </v-flex>
      <v-flex>
        <v-subheader>
          {{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }}
        </v-subheader>
        <v-slide-y-reverse-transition mode="out-in">
          <v-layout wrap fill-height :key="searchText">
            <v-flex grow xs4 class="px-2 py-2" :key="index" v-for="(item, index) in searchResults">
              <cc-titled-panel
                :title="(item.ItemType === 'Frame' ? `${item.Source} ` : '') + item.Name"
                :icon="'cci-' + $_.kebabCase(item.ItemType)"
                :color="$_.kebabCase(item.ItemType)"
                clickable
                @click="$refs[`modal_${item.ID}`][0].show()"
              >
                <span
                  v-html="item.Description ? item.Description : item.Effect ? item.Effect : ''"
                  class="item-description"
                />
              </cc-titled-panel>
              <search-result-modal :item="item" :ref="`modal_${item.ID}`" />
            </v-flex>
            <v-flex xs12><br /></v-flex>
          </v-layout>
        </v-slide-y-reverse-transition>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchResultModal from '../UI/SearchResultModal.vue'
import { CompendiumItem, ItemType } from '@/class'
import { includesIgnoringAccentsCase } from '@/features/_shared/utility/accent_fold';

export default Vue.extend({
  name: 'search-results',
  components: { SearchResultModal },
  data: () => ({
    searchText: '',
    loaded: false,
  }),
  mounted() {
    this.searchText = this.$route.query.search as string
    const input = this.$refs.input as HTMLInputElement
    input.focus()
  },
  computed: {
    validResults(): CompendiumItem[] {
      return this.$_.flatten(
        this.$_.values(
          this.$_.pick(this.$store.state.datastore as object, [
            'Frames',
            'MechSystems',
            'MechWeapons',
            'WeaponMods',
          ])
        )
      )
    },
    searchResults(): CompendiumItem[] {
      if (!this.searchText) {
        return []
      }
      const results = this.validResults.filter(r => includesIgnoringAccentsCase(r.Name, this.searchText))
      return results
    },
  },
  methods: {
    setSearch(value: string) {
      if (value === this.searchText) {
        return
      }
      this.searchText = value
      this.$router.replace(`/compendium/search?search=${value}`)
    },
    forceInput() {
      this.setSearch((this.$refs.input as HTMLInputElement).value)
    },

    onClick(item: CompendiumItem) {
      alert(item.Name)
    },
  },
})
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
