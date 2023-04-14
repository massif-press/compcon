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
    <v-col cols="12" md="4">
      <v-select
        v-model="lcpFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="cci-compendium"
        chips
        deletable-chips
        outlined
        label="From Content Pack"
        :items="lcps"
        multiple
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
import { Tag, Manufacturer } from '@/class'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

const nameSort = function(a, b): number {
  if (a.text.toUpperCase() < b.text.toUpperCase()) return -1
  if (a.text.toUpperCase() > b.text.toUpperCase()) return 1
  return 0
}

export default Vue.extend({
  name: 'frame-filter',
  data: () => ({
    sourceFilter: [],
    tagFilter: [],
    lcpFilter: [],
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
    lcps(): string[] {
      return getModule(CompendiumStore).lcpNames
    },
  },
  methods: {
    clear() {
      this.sourceFilter = []
      this.tagFilter = []
      this.weaponTypeFilter = []
      this.lcpFilter = []
    },
    updateFilters() {
      const fObj = {} as any
      if (this.lcpFilter && this.lcpFilter.length) fObj.LcpName = [this.lcpFilter]
      if (this.sourceFilter && this.sourceFilter.length) fObj.Source = [this.sourceFilter]
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter
      this.$emit('set-filters', fObj)
    },
  },
})
</script>
