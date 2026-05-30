<template>
  <v-row justify="space-around"
    density="compact"
    class="mx-4">
    <v-col cols="4">
      <v-select v-model="sourceFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-factory"
        variant="outlined"
        label="From Manufacturer"
        :items="manufacturers"
        chips
        clearable
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12"
      md="4">
      <v-select v-model="lcpFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:compendium"
        chips
        clearable
        variant="outlined"
        label="From Content Pack"
        :items="lcpNames"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="4">
      <v-select v-model="tagFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        label="Tags"
        :items="modTags"
        item-value="ID"
        multiple
        item-text="Name"
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineOptions({ name: 'weapon-mod-filter' })

const props = withDefaults(defineProps<{
  activeFilters?: object
  manufacturers?: any[]
  modTags?: any[]
  lcpNames?: any[]
}>(), {
  activeFilters: () => ({}),
  manufacturers: () => [],
  modTags: () => [],
  lcpNames: () => []
})

const emit = defineEmits<{
  'set-filters': []
}>()

const sourceFilter = ref([] as string[])
const tagFilter = ref([] as string[])
const lcpFilter = ref([] as string[])
const weaponTypeFilter = ref([] as string[])

function clear() {
      sourceFilter.value = [];
      tagFilter.value = [];
      weaponTypeFilter.value = [];
      lcpFilter.value = [];
    }
function updateFilters() {
      const fObj = {} as any;
      if (lcpFilter.value && lcpFilter.value.length) fObj.LcpName = [lcpFilter.value];
      if (sourceFilter.value && sourceFilter.value.length) fObj.Source = [sourceFilter.value];
      if (tagFilter.value && tagFilter.value.length) fObj.Tags = tagFilter.value;
      emit('set-filters', fObj);
    }

onMounted(() => {
const f = props.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Source) sourceFilter.value = f.Source[0] ?? [];
    if (f.Tags) tagFilter.value = f.Tags;
    if (f.LcpName) lcpFilter.value = f.LcpName[0] ?? [];
})
</script>
