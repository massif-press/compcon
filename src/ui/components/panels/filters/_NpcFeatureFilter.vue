<template>
  <v-row density="compact"
    justify="space-around"
    class="mx-4">
    <v-col cols="12">
      <v-select v-model="typeFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:trait"
        chips
        clearable
        variant="outlined"
        :label="$t('ui.fields.itemType')"
        :items="featureTypes"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="originFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:npc_class"
        chips
        clearable
        variant="outlined"
        :label="$t('ui.fields.origin')"
        :items="origins"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineOptions({ name: 'npc-feature-filter' })

const props = withDefaults(defineProps<{
  activeFilters?: object
  origins?: any[]
  featureTypes?: any[]
}>(), {
  activeFilters: () => ({}),
  origins: () => [],
  featureTypes: () => []
})

const emit = defineEmits<{
  'set-filters': [payload: any]
}>()

const originFilter = ref([] as string[])
const typeFilter = ref([] as string[])

function clear() {
      originFilter.value = [];
      typeFilter.value = [];
      updateFilters();
    }
function updateFilters() {
      const fObj = {} as any;
      if (originFilter.value && originFilter.value.length > 0) fObj.Origin = originFilter.value;
      if (typeFilter.value && typeFilter.value.length > 0) fObj.FeatureType = typeFilter.value;
      emit('set-filters', fObj);
    }

onMounted(() => {
const f = props.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Origin) originFilter.value = f.Origin;
    if (f.FeatureType) typeFilter.value = f.FeatureType;
})
</script>
