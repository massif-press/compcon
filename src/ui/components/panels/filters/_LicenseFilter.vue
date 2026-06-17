<template>
  <v-select v-model="sourceFilter"
    density="compact"
    hide-details
    class="px-2 mb-2"
    prepend-icon="mdi-factory"
    variant="outlined"
    :label="$t('ui.fields.fromManufacturer')"
    :items="manufacturers"
    chips
    clearable
    @update:modelValue="updateFilters()" />
  <v-select v-model="lcpFilter"
    class="px-2"
    hide-details
    density="compact"
    prepend-icon="cc:compendium"
    chips
    clearable
    variant="outlined"
    :label="$t('ui.fields.fromContentPack')"
    :items="lcpNames"
    multiple
    @update:modelValue="updateFilters()" />
</template>

<script setup lang="ts">
import type { Manufacturer } from '@/classes/Manufacturer'
import { ref, onMounted } from 'vue'

defineOptions({ name: 'license-filter' })

const props = withDefaults(defineProps<{
  activeFilters?: object
  manufacturers?: Manufacturer[]
  lcpNames?: any[]
}>(), {
  activeFilters: () => ({}),
  manufacturers: () => [],
  lcpNames: () => []
})

const emit = defineEmits<{
  'set-filters': []
}>()

const sourceFilter = ref([] as string[])
const lcpFilter = ref([] as string[])

function clear() {
      sourceFilter.value = [];
      lcpFilter.value = [];
    }
function updateFilters() {
      const fObj = {} as any;
      if (lcpFilter.value && lcpFilter.value.length) fObj.LcpName = [lcpFilter.value];
      if (sourceFilter.value && sourceFilter.value.length) fObj.Source = [sourceFilter.value];
      emit('set-filters', fObj);
    }

onMounted(() => {
const f = props.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Source) sourceFilter.value = f.Source[0] ?? [];
    if (f.LcpName) lcpFilter.value = f.LcpName[0] ?? [];
})
</script>
