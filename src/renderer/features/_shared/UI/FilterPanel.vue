<template>
  <div class="text-center">
    <v-bottom-sheet>
      <v-badge overlap slot="activator" dark @click="
          ''


        ">
        <template v-if="filterCount" v-slot:badge>
          <span>{{ filterCount }}</span>
        </template>
        <v-tooltip left>
          <v-avatar slot="activator" color="purple darken-3 orange--after">
            <v-icon dark>mdi-filter-variant</v-icon>
          </v-avatar>
          <span>Filter Items</span>
        </v-tooltip>
      </v-badge>
      <v-toolbar dense color="purple darken-3" dark>
        <v-toolbar-title>Filter {{ system ? 'Mech Systems' : 'Mech Weapons' }}</v-toolbar-title>
        <v-spacer />
        <v-btn color="error" @click="reset()">Clear Selected Filters</v-btn>
      </v-toolbar>
      <v-card flat>
        <v-card-text>
          <v-row>
            <v-col cols="4" class="ml-2 mr-2">
              <v-row>
                <v-select
                  v-model="filters.source"
                  prepend-icon="mdi-factory"
                  chips
                  deletable-chips
                  dense
                  label="From Manufacturer"
                  :items="manufacturers"
                  multiple
                  small-chips
                  @change="updateFilters()"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="filters.license"
                  prepend-icon="cci-frame"
                  chips
                  deletable-chips
                  dense
                  label="In License"
                  :items="licenses"
                  multiple
                  small-chips
                  @change="updateFilters()"
                />
              </v-row>
            </v-col>
            <v-col cols="4" class="ml-2 mr-2">
              <v-row wrap>
                <v-select
                  v-model="filters.include"
                  prepend-icon="mdi-tag"
                  chips
                  deletable-chips
                  dense
                  label="Includes Tag"
                  :items="includeTags"
                  multiple
                  small-chips
                  @change="updateFilters()"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="filters.exclude"
                  prepend-icon="block"
                  chips
                  deletable-chips
                  dense
                  label="Excludes Tag"
                  color="error"
                  :items="excludeTags"
                  multiple
                  small-chips
                  @change="updateFilters()"
                />
              </v-row>
            </v-col>
            <v-col v-if="system" cols="4" class="ml-2 mr-2">
              <v-row>
                <v-select
                  v-model="filters.systemType"
                  prepend-icon="mdi-chip"
                  chips
                  deletable-chips
                  dense
                  label="System Type"
                  :items="systemTypes"
                  multiple
                  small-chips
                  @change="updateFilters()"
                />
              </v-row>
            </v-col>
            <v-col v-if="weapon" cols="4" class="ml-2 mr-2">
              <v-row>
                <v-select
                  v-model="filters.weaponType"
                  prepend-icon="mdi-sword"
                  chips
                  deletable-chips
                  dense
                  label="Weapon Type"
                  :items="weaponTypes"
                  multiple
                  small-chips
                  @change="updateFilters()"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="filters.weaponSize"
                  prepend-icon="mdi-relative-scale"
                  chips
                  deletable-chips
                  dense
                  label="Weapon Size"
                  :items="weaponSizes"
                  multiple
                  small-chips
                  @change="updateFilters()"
                />
              </v-row>
            </v-col>
            <v-col v-if="weapon" cols="4" class="ml-2 mr-2">
              <v-row>
                <v-select
                  v-model="filters.attackType"
                  prepend-icon="cci-range"
                  chips
                  deletable-chips
                  dense
                  label="Attack Type"
                  :items="attackTypes"
                  multiple
                  small-chips
                  @change="updateFilters()"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="filters.damageType"
                  prepend-icon="cci-kinetic-damage"
                  chips
                  deletable-chips
                  dense
                  label="Damage Type"
                  :items="damageTypes"
                  multiple
                  small-chips
                  @change="updateFilters()"
                />
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  License,
  SystemType,
  WeaponType,
  WeaponSize,
  DamageType,
  RangeType,
  Manufacturer,
} from '@/class'
import { rules } from 'lancer-data'

const nameSort = function(a, b) {
  if (a.text.toUpperCase() < b.text.toUpperCase()) return -1
  if (a.text.toUpperCase() > b.text.toUpperCase()) return 1
  return 0
}

export default Vue.extend({
  name: 'filter-panel',
  props: {
    system: Boolean,
    includeMods: Boolean,
    weapon: Boolean,
    size: String,
  },
  data: () => ({
    filters: {
      license: [],
      include: [],
      exclude: [],
      source: [],
      systemType: [],
      weaponType: [],
      weaponSize: [],
      attackType: [],
      damageType: [],
    },
  }),
  computed: {
    filterCount(): number {
      let sum = 0
      for (let arr in this.filters) {
        sum += this.filters[arr].length
      }
      return sum
    },
    includeTags(): { text: string; value: string }[] {
      return this.$store.getters
        .getItemCollection('Tags')
        .filter(x => !x.FilterIgnore)
        .map(x => ({ text: x.Name().replace('{VAL}', 'X'), value: x.ID }))
        .sort(nameSort)
    },
    excludeTags(): { text: string; value: string }[] {
      return this.$store.getters
        .getItemCollection('Tags')
        .filter(x => !x.FilterIgnore)
        .map(x => ({ text: x.Name().replace('{VAL}', 'X'), value: x.ID }))
        .sort(nameSort)
    },
    manufacturers(): Manufacturer[] {
      return this.$store.getters
        .getItemCollection('Manufacturers')
        .map(x => ({ text: x.Name, value: x.ID }))
        .sort(nameSort)
    },
    licenses(): License[] {
      return this.$store.getters
        .getItemCollection('Licenses')
        .map(x => ({ text: x.Name, value: x.FrameID }))
        .sort(nameSort)
    },
    systemTypes(): SystemType[] {
      return Object.keys(SystemType)
        .map(k => SystemType[k as any])
        .sort() as SystemType[]
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
    weaponTypes(): WeaponType[] {
      return Object.keys(WeaponType)
        .map(k => WeaponType[k as any])
        .sort() as WeaponType[]
    },
    weaponSizes(): WeaponSize[] {
      if (this.size)
        return rules.mount_fittings[this.size].map(k => WeaponSize[k as any]).sort() as WeaponSize[]
      return Object.keys(WeaponSize)
        .map(k => WeaponSize[k as any])
        .sort() as WeaponSize[]
    },
  },
  methods: {
    reset() {
      for (let arr in this.filters) {
        this.filters[arr].splice(0, this.filters[arr].length)
      }
    },
    updateFilters() {
      this.$emit('update', this.filters)
    },
  },
})
</script>
