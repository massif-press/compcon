<template>
  <v-layout wrap justify-space-around class="mx-4">
    <v-flex xs4>
      <v-select
        class="px-2"
        v-model="sourceFilter"
        prepend-icon="mdi-factory"
        outlined
        label="From Manufacturer"
        :items="manufacturers"
        chips
        deletable-chips
        small-chips
        @change="updateFilters()"
      />
    </v-flex>
    <v-flex xs4>
      <v-select
        class="px-2"
        v-model="tagFilter"
        prepend-icon="mdi-tag"
        chips
        deletable-chips
        small-chips
        outlined
        label="Tags"
        :items="tags"
        multiple
        @change="updateFilters()"
        item-text="Name"
      />
    </v-flex>
    <v-flex xs4>
      <v-select
        v-model="weaponTypeFilter"
        class="px-2"
        prepend-icon="cci-weapon"
        chips
        deletable-chips
        small-chips
        outlined
        label="Weapon Type"
        :items="weaponTypes"
        @change="updateFilters()"
      />
    </v-flex>
    <v-flex xs4>
      <v-select
        v-model="weaponSizeFilter"
        class="px-2"
        prepend-icon="mdi-relative-scale"
        chips
        deletable-chips
        small-chips
        outlined
        label="Required Mount"
        :items="weaponSizes"
        @change="updateFilters()"
      />
    </v-flex>
    <v-flex xs4>
      <v-select
        v-model="attackTypeFilter"
        class="px-2"
        prepend-icon="cci-range"
        chips
        deletable-chips
        outlined
        label="Attack Type"
        :items="attackTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-flex>
    <v-flex xs4>
      <v-select
        v-model="damageTypeFilter"
        class="px-2"
        prepend-icon="cci-kinetic"
        chips
        deletable-chips
        outlined
        label="Damage Type"
        :items="damageTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { MechType, MountType, Tag, WeaponType, WeaponSize, RangeType, DamageType } from '@/class'

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
    weaponTypeFilter: [],
    weaponSizeFilter: [],
    attackTypeFilter: [],
    damageTypeFilter: [],
  }),
  computed: {
    manufacturers(): any[] {
      return this.$store.getters
        .getItemCollection('Manufacturers')
        .map(x => ({ text: x.name, value: x.id }))
        .sort(nameSort)
    },
    weaponTypes(): WeaponType[] {
      return Object.keys(WeaponType)
        .map(k => WeaponType[k as any])
        .filter(k => k !== 'Integrated')
        .sort() as WeaponType[]
    },
    weaponSizes(): WeaponSize[] {
      return Object.keys(WeaponSize)
        .map(k => WeaponSize[k as any])
        .sort() as WeaponSize[]
    },
    attackTypes(): RangeType[] {
      return Object.keys(RangeType)
        .map(k => RangeType[k as any])
        .sort() as RangeType[]
    },
    damageTypes(): DamageType[] {
      return Object.keys(DamageType)
        .map(k => DamageType[k as any])
        .sort() as DamageType[]
    },
    tags(): Tag[] {
      return this.$_.uniqBy(
        [].concat(
          this.$store.getters
            .getItemCollection('MechWeapons')
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
      this.weaponSizeFilter = []
      this.attackTypeFilter = []
      this.damageTypeFilter = []
    },
    updateFilters() {
      let fObj = {} as any
      if (this.sourceFilter) fObj.Source = [this.sourceFilter]
      if (this.tagFilter.length) fObj.Tags = this.tagFilter
      if (this.weaponTypeFilter) fObj.Type = [this.weaponTypeFilter]
      if (this.weaponSizeFilter) fObj.Size = [this.weaponSizeFilter]
      if (this.attackTypeFilter.length) fObj.RangeType = this.attackTypeFilter
      if (this.damageTypeFilter.length) fObj.DamageType = this.damageTypeFilter
      this.$emit('set-filters', fObj)
    },
  },
})
</script>
