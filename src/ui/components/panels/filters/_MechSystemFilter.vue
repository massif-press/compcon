<template>
  <v-row wrap justify-space-around class="mx-4">
    <v-col cols="4">
      <v-select
        v-model="sourceFilter"
        class="px-2"
        hide-details
        dense
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
        class="px-2"
        hide-details
        dense
        prepend-icon="mdi-tag"
        chips
        deletable-chips
        outlined
        label="Tags"
        :items="tags"
        multiple
        small-chips
        item-text="Name"
        item-value="ID"
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="systemTypeFilter"
        class="px-2"
        dense
        prepend-icon="cci-system"
        outlined
        label="System Type"
        :items="systemTypes"
        chips
        deletable-chips
        small-chips
        @change="updateFilters()"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tag, SystemType, Manufacturer } from '@/class'

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
    systemTypeFilter: [],
  }),
  computed: {
    manufacturers(): Manufacturer[] {
      return this.$store.getters
        .getItemCollection('Manufacturers')
        .map(x => ({ text: x.Name, value: x.ID }))
        .sort(nameSort)
    },
    systemTypes(): SystemType[] {
      return Object.keys(SystemType)
        .map(k => SystemType[k as any])
        .filter(k => k !== 'Integrated')
        .sort() as SystemType[]
    },
    tags(): Tag[] {
      return this.$_.uniqBy(
        [].concat(
          this.$store.getters
            .getItemCollection('MechSystems')
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
      this.systemTypeFilter = []
    },
    updateFilters() {
      let fObj = {} as any
      if (this.sourceFilter) fObj.Source = [this.sourceFilter]
      if (this.tagFilter.length) fObj.Tags = this.tagFilter
      if (this.systemTypeFilter) fObj.Type = [this.systemTypeFilter]
      this.$emit('set-filters', fObj)
    },
  },
})
</script>
