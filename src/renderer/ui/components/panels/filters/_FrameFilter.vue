<template>
  <v-layout row justify-space-around class="mx-4">
    <v-flex xs4>
      <v-select
        class="px-2"
        v-model="sourceFilter"
        prepend-icon="mdi-factory"
        chips
        deletable-chips
        outlined
        label="From Manufacturer"
        :items="manufacturers"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-flex>
    <v-flex xs4>
      <v-select
        class="px-2"
        v-model="typeFilter"
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
    </v-flex>
    <v-flex xs4>
      <v-select
        class="px-2"
        v-model="mountFilter"
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
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { MechType, MountType } from '@/class'

const nameSort = function(a, b) {
  if (a.text.toUpperCase() < b.text.toUpperCase()) return -1
  if (a.text.toUpperCase() > b.text.toUpperCase()) return 1
  return 0
}

export default Vue.extend({
  name: 'frame-filter',
  data: () => ({
    sourceFilter: [],
    typeFilter: [],
    mountFilter: [],
  }),
  computed: {
    manufacturers(): any[] {
      return this.$store.getters
        .getItemCollection('Manufacturers')
        .map(x => ({ text: x.name, value: x.id }))
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
    updateFilters() {
      this.$emit('set-filters', {
        source: this.sourceFilter,
        mechType: this.typeFilter,
        mounts: this.mountFilter,
      })
    },
  },
})
</script>