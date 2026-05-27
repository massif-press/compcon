<template>
  <mech-item-filter-base
    ref="base"
    :active-filters="activeFilters"
    show-reset
    @sp-ll-change="onSpLlChange">
    <v-col cols="12">
      <v-select v-model="sourceFilter"
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
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="tagFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        label="Tags"
        :items="weaponTags"
        item-value="ID"
        multiple
        item-title="Name"
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="weaponTypeFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="cc:weapon"
        chips
        clearable
        variant="outlined"
        label="Weapon Type"
        :items="weaponTypes"
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="weaponSizeFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-relative-scale"
        chips
        clearable
        variant="outlined"
        label="Required Mount"
        :items="weaponSizes"
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="attackTypeFilter"
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
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="damageTypeFilter"
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
        @update:modelValue="updateFilters()" />
    </v-col>
  </mech-item-filter-base>
</template>

<script lang="ts">
import { WeaponType, WeaponSize, RangeType, DamageType } from '@/classes/enums'
import MechItemFilterBase from './MechItemFilterBase.vue'

export default {
  name: 'mech-weapon-filter',
  components: { MechItemFilterBase },
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    manufacturers: { type: Array, default: () => [] },
    weaponTags: { type: Array, default: () => [] },
    lcpNames: { type: Array, default: () => [] },
  },
  data: () => ({
    sourceFilter: [] as any[],
    tagFilter: [] as string[],
    weaponTypeFilter: [] as WeaponType[],
    weaponSizeFilter: [] as WeaponSize[],
    attackTypeFilter: [] as RangeType[],
    damageTypeFilter: [] as DamageType[],
    spLlFilters: {} as any,
  }),
  emits: ['set-filters'],
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Source) this.sourceFilter = f.Source;
    if (f.Tags) this.tagFilter = f.Tags;
    if (f.WeaponType) this.weaponTypeFilter = f.WeaponType[0];
    if (f.Size) this.weaponSizeFilter = f.Size[0];
    if (f.RangeType) this.attackTypeFilter = f.RangeType;
    if (f.DamageType) this.damageTypeFilter = f.DamageType;
  },
  computed: {
    weaponTypes(): string[] {
      return Object.keys(WeaponType).map((k) => WeaponType[k as any]).filter((k) => k !== 'Integrated').sort() as string[];
    },
    weaponSizes(): string[] {
      return Object.keys(WeaponSize).map((k) => WeaponSize[k as any]).sort() as string[];
    },
    attackTypes(): string[] {
      return Object.keys(RangeType).map((k) => RangeType[k as any]).sort() as string[];
    },
    damageTypes(): string[] {
      return Object.keys(DamageType).map((k) => DamageType[k as any]).sort() as string[];
    },
  },
  methods: {
    onSpLlChange(partial: any) {
      this.spLlFilters = partial;
      this.updateFilters();
    },
    clear() {
      this.sourceFilter = (this.manufacturers as any[]).map((x) => x.value);
      this.tagFilter = [];
      this.weaponTypeFilter = [];
      this.weaponSizeFilter = [];
      this.attackTypeFilter = [];
      this.damageTypeFilter = [];
      this.spLlFilters = {};
      (this.$refs.base as any)?.clear();
    },
    updateFilters() {
      const fObj = { ...this.spLlFilters } as any;
      if (this.sourceFilter) fObj.Source = this.sourceFilter;
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter;
      if (this.weaponTypeFilter && this.weaponTypeFilter.length) fObj.WeaponType = [this.weaponTypeFilter];
      if (this.weaponSizeFilter && this.weaponSizeFilter.length) fObj.Size = [this.weaponSizeFilter];
      if (this.attackTypeFilter && this.attackTypeFilter.length) fObj.RangeType = this.attackTypeFilter;
      if (this.damageTypeFilter && this.damageTypeFilter.length) fObj.DamageType = this.damageTypeFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
