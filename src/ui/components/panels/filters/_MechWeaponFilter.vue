<template>
  <v-row density="compact"
    justify="space-around"
    class="mx-4">
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
    <v-col cols="12">
      <v-select v-model="llFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="cc:pilot"
        clearable
        chips
        multiple
        variant="outlined"
        label="License Level"
        :items="[0, 1, 2, 3]"
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
  <v-divider class="my-4" />
  <v-row dense
    align="center"
    justify="center">
    <v-col cols="auto">
      <v-icon icon="cc:system_point" />
    </v-col>
    <v-col cols="auto">
      <span class="text-button">SP Cost</span>
    </v-col>
    <v-col cols="auto">
      <v-btn-toggle v-model="spType"
        color="accent"
        border
        divided
        density="compact"
        style="height: 30px"
        @update:modelValue="updateFilters()">
        <v-btn value="less"
          size="small">Less Than</v-btn>
        <v-btn value="eq"
          size="small">Equal To</v-btn>
        <v-btn value="greater"
          size="small">Greater Than</v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
  <v-row dense
    align="center"
    justify="center">
    <v-col cols="auto"
      class="text-center">
      <v-text-field v-model="sp"
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
        @update:modelValue="updateFilters()" />
      <v-btn size="x-small"
        variant="plain"
        @click="
          sp = 0;
        spType = '';
        updateFilters();
        ">
        Reset
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { WeaponType, WeaponSize, RangeType, DamageType } from '@/class';

export default {
  name: 'mech-weapon-filter',
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
    llFilter: [] as number[],
    sp: 0,
    spType: '',
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
    if (f.LicenseLevel) this.llFilter = f.LicenseLevel;
    const spKey = Object.keys(f).find(k => k.startsWith('SP_'));
    if (spKey) { this.spType = spKey.slice(3); this.sp = f[spKey]; }
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
    clear() {
      this.sourceFilter = (this.manufacturers as any[]).map((x) => x.value);
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
      if (this.weaponTypeFilter && this.weaponTypeFilter.length) fObj.WeaponType = [this.weaponTypeFilter];
      if (this.weaponSizeFilter && this.weaponSizeFilter.length) fObj.Size = [this.weaponSizeFilter];
      if (this.attackTypeFilter && this.attackTypeFilter.length) fObj.RangeType = this.attackTypeFilter;
      if (this.damageTypeFilter && this.damageTypeFilter.length) fObj.DamageType = this.damageTypeFilter;
      if (this.llFilter && this.llFilter.length) fObj.LicenseLevel = this.llFilter.map((x) => Number(x));
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
