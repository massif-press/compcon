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
        :label="$t('ui.fields.fromManufacturer')"
        :items="manufacturers"
        clearable
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="typeFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:frame"
        chips
        clearable
        variant="outlined"
        :label="$t('ui.fields.role')"
        :items="mechTypes"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="mountFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:weapon"
        chips
        clearable
        variant="outlined"
        :label="$t('ui.fields.hasMount')"
        :items="mountTypes"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="sizeFilter"
        class="px-2"
        hide-details
        density="compact"
        chips
        clearable
        prepend-icon="cc:size_1"
        variant="outlined"
        :label="$t('ui.fields.size')"
        :items="frameSizes"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="licenseFilter"
        class="px-2"
        hide-details
        density="compact"
        chips
        clearable
        prepend-icon="cc:license"
        variant="outlined"
        :label="$t('ui.fields.license')"
        :items="frameLicenses"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Manufacturer } from '@/classes/Manufacturer'
import { computed, ref, onMounted } from 'vue'
import { MechType, MountType } from '@/classes/enums'

defineOptions({ name: 'frame-filter' })

const props = withDefaults(defineProps<{
  activeFilters?: object
  manufacturers?: Manufacturer[]
  frameSizes?: any[]
  frameLicenses?: any[]
}>(), {
  activeFilters: () => ({}),
  manufacturers: () => [],
  frameSizes: () => [],
  frameLicenses: () => []
})

const emit = defineEmits<{
  'set-filters': [payload: any]
}>()

const sourceFilter = ref([] as string[])
const typeFilter = ref([] as string[])
const mountFilter = ref([] as string[])
const sizeFilter = ref([] as string[])
const licenseFilter = ref([] as string[])

const mechTypes = computed(() => {
      return Object.keys(MechType).map((k) => MechType[k as any]).sort() as string[];
    })
const mountTypes = computed(() => {
      return Object.keys(MountType).map((k) => MountType[k as any]).filter((x) => x !== 'Integrated').sort() as string[];
    })

function clear() {
      typeFilter.value = [];
      sourceFilter.value = [];
      mountFilter.value = [];
      sizeFilter.value = [];
      licenseFilter.value = [];
    }
function updateFilters() {
      const fObj = {} as any;
      if (sourceFilter.value) fObj.Source = sourceFilter.value;
      if (sizeFilter.value && sizeFilter.value.length) fObj.MechSize = sizeFilter.value;
      if (typeFilter.value && typeFilter.value.length) fObj.MechType = typeFilter.value;
      if (mountFilter.value && mountFilter.value.length) fObj.Mounts = mountFilter.value;
      if (licenseFilter.value && licenseFilter.value.length) fObj.License = licenseFilter.value;
      emit('set-filters', fObj);
    }

onMounted(() => {
const f = props.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Source) sourceFilter.value = f.Source;
    if (f.MechType) typeFilter.value = f.MechType;
    if (f.Mounts) mountFilter.value = f.Mounts;
    if (f.MechSize) sizeFilter.value = f.MechSize;
    if (f.License) licenseFilter.value = f.License;
})
</script>
