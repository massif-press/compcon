<template>
  <v-row density="compact" justify="space-around" class="mx-4">
    <v-col cols="12" md="4">
      <v-select
        v-model="sourceFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-factory"
        variant="outlined"
        label="From Manufacturer"
        :items="manufacturers"
        chips
        clearable
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="tagFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        label="Tags"
        :items="tags"
        item-value="ID"
        multiple
        item-text="Name"
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="weaponTypeFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="cc:weapon"
        chips
        clearable
        variant="outlined"
        label="Weapon Type"
        :items="weaponTypes"
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="weaponSizeFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-relative-scale"
        chips
        clearable
        variant="outlined"
        label="Required Mount"
        :items="weaponSizes"
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="attackTypeFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="cc:range"
        chips
        clearable
        variant="outlined"
        label="Attack Type"
        :items="attackTypes"
        multiple
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="damageTypeFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="cc:kinetic"
        chips
        clearable
        variant="outlined"
        label="Damage Type"
        :items="damageTypes"
        multiple
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="lcpFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:compendium"
        chips
        clearable
        variant="outlined"
        label="From Content Pack"
        :items="lcps"
        multiple
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="6" class="text-center">
      <v-row dense align="center">
        <v-col cols="auto">
          <v-icon icon="cc:system_point" />
        </v-col>
        <v-col cols="auto">
          <span class="text-button">SP Cost</span>
        </v-col>
        <v-col cols="auto">
          <v-btn-toggle
            v-model="spType"
            color="accent"
            class="ml-1 py-1"
            @update:modelValue="updateFilters()"
          >
            <v-btn value="less" size="small">Less Than</v-btn>
            <v-btn value="eq" size="small">Equal To</v-btn>
            <v-btn value="greater" size="small">Greater Than</v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="auto">
          <v-text-field
            v-model="sp"
            type="number"
            variant="outlined"
            style="width: 150px"
            density="compact"
            hide-details
            class="hide-input-spinners"
            prepend-icon="mdi-minus"
            append-icon="mdi-plus"
            @click:prepend="
              sp > 0 ? sp-- : sp;
              updateFilters();
            "
            @click:append="
              sp++;
              updateFilters();
            "
            @update:modelValue="updateFilters()"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  Tag,
  WeaponType,
  WeaponSize,
  RangeType,
  DamageType,
  Manufacturer,
} from '@/class';
import _ from 'lodash';

import { CompendiumStore } from '@/stores';

const nameSort = function (a, b): number {
  if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'frame-filter',
  data: () => ({
    sourceFilter: [],
    tagFilter: [],
    weaponTypeFilter: [] as WeaponType[],
    weaponSizeFilter: [] as WeaponSize[],
    attackTypeFilter: [] as RangeType[],
    damageTypeFilter: [] as DamageType[],
    sp: '',
    spType: '',
    lcpFilter: [],
  }),
  emits: ['set-filters'],
  computed: {
    manufacturers(): Manufacturer[] {
      return CompendiumStore()
        .getItemCollection('Manufacturers')
        .map((x) => ({ title: x.Name, value: x.ID }))
        .sort(nameSort);
    },
    weaponTypes(): WeaponType[] {
      return Object.keys(WeaponType)
        .map((k) => WeaponType[k as any])
        .filter((k) => k !== 'Integrated')
        .sort() as WeaponType[];
    },
    weaponSizes(): WeaponSize[] {
      return Object.keys(WeaponSize)
        .map((k) => WeaponSize[k as any])
        .sort() as WeaponSize[];
    },
    attackTypes(): RangeType[] {
      return Object.keys(RangeType)
        .map((k) => RangeType[k as any])
        .sort() as RangeType[];
    },
    damageTypes(): DamageType[] {
      return Object.keys(DamageType)
        .map((k) => DamageType[k as any])
        .sort() as DamageType[];
    },
    tags(): Tag[] {
      return _.uniqBy(
        [].concat(
          CompendiumStore()
            .getItemCollection('MechWeapons')
            .flatMap((x) => x.Tags)
            .filter((x) => !x.FilterIgnore && !x.IsHidden)
        ),
        'ID'
      );
    },
    lcps(): string[] {
      return CompendiumStore().lcpNames;
    },
  },
  methods: {
    clear() {
      this.sourceFilter = [];
      this.tagFilter = [];
      this.weaponTypeFilter = [];
      this.weaponSizeFilter = [];
      this.attackTypeFilter = [];
      this.damageTypeFilter = [];
      this.sp = '';
      this.spType = '';
      this.lcpFilter = [];
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.lcpFilter && this.lcpFilter.length)
        fObj.LcpName = [this.lcpFilter];
      if (this.spType && !isNaN(parseInt(this.sp)))
        fObj[`SP_${this.spType}`] = parseInt(this.sp);
      fObj[`SP_${this.spType}`] = parseInt(this.sp);
      if (this.sourceFilter && this.sourceFilter.length)
        fObj.Source = [this.sourceFilter];
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter;
      if (this.weaponTypeFilter && this.weaponTypeFilter.length)
        fObj.WeaponType = [this.weaponTypeFilter];
      if (this.weaponSizeFilter && this.weaponSizeFilter.length)
        fObj.Size = [this.weaponSizeFilter];
      if (this.attackTypeFilter && this.attackTypeFilter.length)
        fObj.RangeType = this.attackTypeFilter;
      if (this.damageTypeFilter && this.damageTypeFilter.length)
        fObj.DamageType = this.damageTypeFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
