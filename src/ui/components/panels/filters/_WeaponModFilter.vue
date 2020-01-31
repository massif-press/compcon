<template>
  <v-row justify="space-around" dense class="mx-4">
    <v-col cols="4">
      <v-select
        v-model="sourceFilter"
        dense
        hide-details
        class="px-2"
        prepend-icon="mdi-factory"
        outlined
        label="From Manufacturer"
        :items="manufacturers"
        chips
        deletable-chips
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="tagFilter"
        dense
        hide-details
        class="px-2"
        prepend-icon="mdi-tag"
        chips
        deletable-chips
        small-chips
        outlined
        label="Tags"
        :items="tags"
        item-value="ID"
        multiple
        item-text="Name"
        @change="updateFilters()"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tag, WeaponType, Manufacturer } from '@/class'

const nameSort = function(a, b) {
  if (a.text.toUpperCase() < b.text.toUpperCase()) return -1
  if (a.text.toUpperCase() > b.text.toUpperCase()) return 1
  return 0
}

export default Vue.extend({
  name: 'frame-filter',
  data: () => ({
    sourceFilter: [],
    tagFilter: [],
  }),
  computed: {
    manufacturers(): Manufacturer[] {
      return this.$store.getters
        .getItemCollection('Manufacturers')
        .map(x => ({ text: x.Name, value: x.ID }))
        .sort(nameSort)
    },
    tags(): Tag[] {
      return this.$_.uniqBy(
        [].concat(
          this.$store.getters
            .getItemCollection('WeaponMods')
            .flatMap(x => x.Tags)
            .filter(x => !x.FilterIgnore && !x.IsHidden)
        ),
        'ID'
      )
    },
  },
  methods: {
    clear() {
      this.sourceFilter = []
      this.tagFilter = []
      this.weaponTypeFilter = []
    },
    updateFilters() {
      let fObj = {} as any
      if (this.sourceFilter && this.sourceFilter.length) fObj.Source = [this.sourceFilter]
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter
      this.$emit('set-filters', fObj)
    },
  },
})
</script>
