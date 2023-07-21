<template>
  <v-row dense justify="space-around" class="mx-4">
    <v-col cols="12" md="4">
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
        v-model="licenseFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="cci-license"
        outlined
        label="From License"
        :items="licenses"
        multiple
        chips
        deletable-chips
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
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
    <v-col cols="12" md="4">
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
    <v-col cols="12" md="4">
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
    <v-col cols="12" md="4">
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
    <v-col cols="12" md="4">
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
    <v-col cols="12" md="4" class="text-center">
      <v-icon>cci-system-point</v-icon>
      <span class="text-button">SP Cost</span>
      <v-btn-toggle v-model="spType" color="accent" class="ml-1 py-1" @change="updateFilters()">
        <v-btn value="less" small text>Less Than</v-btn>
        <v-btn value="eq" small text>Equal To</v-btn>
        <v-btn value="greater" small text>Greater Than</v-btn>
      </v-btn-toggle>
      <v-row no-gutters justify="center">
        <v-col cols="auto">
          <v-text-field
            v-model="sp"
            type="number"
            outlined
            style="width: 150px;"
            dense
            hide-details
            class="hide-input-spinners"
            prepend-icon="mdi-minus"
            append-outer-icon="mdi-plus"
            @click:prepend="
              sp > 0 ? sp-- : sp
              updateFilters()
            "
            @click:append-outer="
              sp++
              updateFilters()
            "
            @change="updateFilters()"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="4" class="text-center">
      <v-icon>cci-license</v-icon>
      <span class="text-button">License Level</span>
      <v-btn-toggle v-model="licenseLevelType" color="accent" class="ml-1 py-1" @change="updateFilters()">
        <v-btn value="less" small text>Less Than</v-btn>
        <v-btn value="eq" small text>Equal To</v-btn>
        <v-btn value="greater" small text>Greater Than</v-btn>
      </v-btn-toggle>
      <v-row no-gutters justify="center">
        <v-col cols="auto">
          <v-text-field
            v-model="licenseLevel"
            type="number"
            outlined
            style="width: 150px;"
            dense
            hide-details
            class="hide-input-spinners"
            prepend-icon="mdi-minus"
            append-outer-icon="mdi-plus"
            @click:prepend="
              licenseLevel > 0 ? licenseLevel-- : licenseLevel
              updateFilters()
            "
            @click:append-outer="
              licenseLevel++
              updateFilters()
            "
            @change="updateFilters()"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tag, WeaponType, WeaponSize, RangeType, DamageType, Manufacturer, License } from '@/class'
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
    licenseFilter: [],
    tagFilter: [],
    weaponTypeFilter: [],
    weaponSizeFilter: [],
    attackTypeFilter: [],
    damageTypeFilter: [],
    sp: '',
    spType: '',
    lcpFilter: [],
    licenseLevel: '',
    licenseLevelType: '',
  }),
  computed: {
    manufacturers(): Manufacturer[] {
      return this.$store.getters
        .getItemCollection('Manufacturers')
        .map(x => ({ text: x.Name, value: x.ID }))
        .sort(nameSort)
    },
    licenses(): License[] {
      return this.$store.getters
        .getItemCollection('Licenses')
        .map(x => ({ text: x.Name.toUpperCase(), value: x.ID }))
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
    lcps(): string[] {
      return getModule(CompendiumStore).lcpNames
    },
  },
  methods: {
    clear() {
      this.sourceFilter = []
      this.licenseFilter = []
      this.tagFilter = []
      this.weaponTypeFilter = []
      this.weaponSizeFilter = []
      this.attackTypeFilter = []
      this.damageTypeFilter = []
      this.sp = ''
      this.spType = ''
      this.lcpFilter = []
      this.licenseLevel = ''
      this.licenseLevelType = ''
    },
    updateFilters() {
      const fObj = {} as any
      if (this.lcpFilter && this.lcpFilter.length) fObj.LcpName = [this.lcpFilter]
      if (this.spType && !isNaN(parseInt(this.sp))) fObj[`SP_${this.spType}`] = parseInt(this.sp)
      if (this.licenseLevelType && !isNaN(parseInt(this.licenseLevel))) fObj[`LL_${this.licenseLevelType}`] = parseInt(this.licenseLevel)
      if (this.sourceFilter && this.sourceFilter.length) fObj.Source = [this.sourceFilter]
      if (this.licenseFilter && this.licenseFilter.length) fObj.License = [this.licenseFilter]
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter
      if (this.weaponTypeFilter && this.weaponTypeFilter.length)
        fObj.WeaponType = [this.weaponTypeFilter]
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
