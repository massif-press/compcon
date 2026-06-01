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

<script setup lang="ts">
import type { Manufacturer } from '@/classes/Manufacturer'
import { computed, ref, onMounted } from 'vue'
import { WeaponType, WeaponSize, RangeType, DamageType } from '@/classes/enums'
import MechItemFilterBase from './MechItemFilterBase.vue'

defineOptions({ name: 'mech-weapon-filter' })

const props = withDefaults(defineProps<{
  activeFilters?: object
  manufacturers?: Manufacturer[]
  weaponTags?: any[]
  lcpNames?: any[]
}>(), {
  activeFilters: () => ({}),
  manufacturers: () => [],
  weaponTags: () => [],
  lcpNames: () => []
})

const emit = defineEmits<{
  'set-filters': []
}>()

const base = ref<any>(null)

const sourceFilter = ref([] as any[])
const tagFilter = ref([] as string[])
const weaponTypeFilter = ref([] as WeaponType[])
const weaponSizeFilter = ref([] as WeaponSize[])
const attackTypeFilter = ref([] as RangeType[])
const damageTypeFilter = ref([] as DamageType[])
const spLlFilters = ref({} as any)

const weaponTypes = computed(() => {
      return Object.keys(WeaponType).map((k) => WeaponType[k as any]).filter((k) => k !== 'Integrated').sort() as string[];
    })
const weaponSizes = computed(() => {
      return Object.keys(WeaponSize).map((k) => WeaponSize[k as any]).sort() as string[];
    })
const attackTypes = computed(() => {
      return Object.keys(RangeType).map((k) => RangeType[k as any]).sort() as string[];
    })
const damageTypes = computed(() => {
      return Object.keys(DamageType).map((k) => DamageType[k as any]).sort() as string[];
    })

function onSpLlChange(partial: any) {
      spLlFilters.value = partial;
      updateFilters();
    }
function clear() {
      sourceFilter.value = (props.manufacturers as any[]).map((x) => x.value);
      tagFilter.value = [];
      weaponTypeFilter.value = [];
      weaponSizeFilter.value = [];
      attackTypeFilter.value = [];
      damageTypeFilter.value = [];
      spLlFilters.value = {};
      (base.value as any)?.clear();
    }
function updateFilters() {
      const fObj = { ...spLlFilters.value } as any;
      if (sourceFilter.value) fObj.Source = sourceFilter.value;
      if (tagFilter.value && tagFilter.value.length) fObj.Tags = tagFilter.value;
      if (weaponTypeFilter.value && weaponTypeFilter.value.length) fObj.WeaponType = [weaponTypeFilter.value];
      if (weaponSizeFilter.value && weaponSizeFilter.value.length) fObj.Size = [weaponSizeFilter.value];
      if (attackTypeFilter.value && attackTypeFilter.value.length) fObj.RangeType = attackTypeFilter.value;
      if (damageTypeFilter.value && damageTypeFilter.value.length) fObj.DamageType = damageTypeFilter.value;
      emit('set-filters', fObj);
    }

onMounted(() => {
const f = props.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Source) sourceFilter.value = f.Source;
    if (f.Tags) tagFilter.value = f.Tags;
    if (f.WeaponType) weaponTypeFilter.value = f.WeaponType[0];
    if (f.Size) weaponSizeFilter.value = f.Size[0];
    if (f.RangeType) attackTypeFilter.value = f.RangeType;
    if (f.DamageType) damageTypeFilter.value = f.DamageType;
})
</script>
