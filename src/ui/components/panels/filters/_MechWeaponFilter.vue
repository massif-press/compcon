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
    <v-col cols="4">
      <v-select
        v-model="weaponTypeFilter"
        dense
        hide-details
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
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="weaponSizeFilter"
        dense
        hide-details
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
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="attackTypeFilter"
        dense
        hide-details
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
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="damageTypeFilter"
        dense
        hide-details
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
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tag, WeaponType, WeaponSize, RangeType, DamageType, Manufacturer } from '@/class'

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
    manufacturers(): Manufacturer[] {
      return this.$store.getters
        .getItemCollection('Manufacturers')
        .map(x => ({ text: x.Name, value: x.ID }))
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
      const fObj = {} as any
      if (this.sourceFilter && this.sourceFilter.length) fObj.Source = [this.sourceFilter]
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter
      if (this.weaponTypeFilter && this.weaponTypeFilter.length) fObj.Type = [this.weaponTypeFilter]
      if (this.weaponSizeFilter && this.weaponSizeFilter.length) fObj.Size = [this.weaponSizeFilter]
      if (this.attackTypeFilter && this.attackTypeFilter.length)
        fObj.RangeType = this.attackTypeFilter
      if (this.damageTypeFilter && this.damageTypeFilter.length)
        fObj.DamageType = this.damageTypeFilter
      this.$emit('set-filters', fObj)
    },
  },
})
</script>
