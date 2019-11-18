<template>
  <v-row justify-space-around class="mx-4">
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
        v-model="typeFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="cci-frame"
        chips
        deletable-chips
        outlined
        label="Role"
        :items="mechTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="mountFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="cci-weapon"
        chips
        deletable-chips
        outlined
        label="Has Mount"
        :items="mountTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { MechType, MountType, Manufacturer } from '@/class'

const nameSort = function(a, b) {
  if (a.text.toUpperCase() < b.text.toUpperCase()) return -1
  if (a.text.toUpperCase() > b.text.toUpperCase()) return 1
  return 0
}

export default Vue.extend({
  name: 'frame-filter',
  data: () => ({
    sourceFilter: '',
    typeFilter: [],
    mountFilter: [],
  }),
  computed: {
    manufacturers(): Manufacturer[] {
      return this.$store.getters
        .getItemCollection('Manufacturers')
        .map(x => ({ text: x.Name, value: x.ID }))
        .sort(nameSort)
    },
    mechTypes(): MechType[] {
      return Object.keys(MechType)
        .map(k => MechType[k as any])
        .sort() as MechType[]
    },
    mountTypes(): MountType[] {
      return Object.keys(MountType)
        .map(k => MountType[k as any])
        .sort() as MountType[]
    },
  },
  methods: {
    clear() {
      this.sourceFilter = []
      this.typeFilter = []
      this.mountFilter = []
    },
    updateFilters() {
      let fObj = {} as any
      if (this.sourceFilter) fObj.Source = [this.sourceFilter]
      if (this.typeFilter.length) fObj.Mechtype = this.typeFilter
      if (this.mountFilter.length) fObj.Mounts = this.mountFilter
      this.$emit('set-filters', fObj)
    },
  },
})
</script>
