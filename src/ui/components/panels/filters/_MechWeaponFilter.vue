<template>
  <v-row density="compact" justify="space-around" class="mx-4">
    <v-col cols="12">
      <v-select
        v-model="sourceFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:manufacturer"
        variant="outlined"
        label="From Manufacturer"
        :items="manufacturers"
        chips
        clearable
        multiple
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12">
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
        item-title="Name"
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12">
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
    <v-col cols="12">
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
    <v-col cols="12">
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
    <v-col cols="12">
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
  </v-row>
  <v-divider class="my-4" />
  <v-row dense align="center" justify="center">
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
        border
        divided
        density="compact"
        style="height: 30px"
        @update:modelValue="updateFilters()"
      >
        <v-btn value="less" size="small">Less Than</v-btn>
        <v-btn value="eq" size="small">Equal To</v-btn>
        <v-btn value="greater" size="small">Greater Than</v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
  <v-row dense align="center" justify="center">
    <v-col cols="auto" class="text-center">
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
      <v-btn
        size="x-small"
        variant="plain"
        @click="
          sp = 0;
          spType = '';
          updateFilters();
        "
        >Reset</v-btn
      >
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Tag, WeaponType, WeaponSize, RangeType, DamageType, Manufacturer } from '@/class';
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
    sourceFilter: [] as any[],
    tagFilter: [],
    weaponTypeFilter: [] as WeaponType[],
    weaponSizeFilter: [] as WeaponSize[],
    attackTypeFilter: [] as RangeType[],
    damageTypeFilter: [] as DamageType[],
    sp: 0,
    spType: '',
  }),
  emits: ['set-filters'],
  computed: {
    manufacturers(): any[] {
      return CompendiumStore()
        .getItemCollection('Manufacturers')
        .map((x) => ({ title: x.Name, value: x.ID }))
        .sort(nameSort);
    },
    weaponTypes(): any[] {
      return Object.keys(WeaponType)
        .map((k) => WeaponType[k as any])
        .filter((k) => k !== 'Integrated')
        .sort();
    },
    weaponSizes(): any[] {
      return Object.keys(WeaponSize)
        .map((k) => WeaponSize[k as any])
        .sort();
    },
    attackTypes(): any[] {
      return Object.keys(RangeType)
        .map((k) => RangeType[k as any])
        .sort();
    },
    damageTypes(): any[] {
      return Object.keys(DamageType)
        .map((k) => DamageType[k as any])
        .sort();
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
      this.sourceFilter = this.manufacturers.map((x) => x.value);
      this.tagFilter = [];
      this.weaponTypeFilter = [];
      this.weaponSizeFilter = [];
      this.attackTypeFilter = [];
      this.damageTypeFilter = [];
      this.sp = 0;
      this.spType = '';
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.sourceFilter) fObj.Source = this.sourceFilter;
      if (this.spType && this.sp) fObj[`SP_${this.spType}`] = this.sp;
      fObj[`SP_${this.spType}`] = this.sp;
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
