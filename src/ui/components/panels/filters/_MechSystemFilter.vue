<template>
  <mech-item-filter-base ref="base"
    :active-filters="activeFilters"
    @sp-ll-change="onSpLlChange">
    <v-col cols="12">
      <v-select v-model="tagFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        :label="$t('ui.fields.tags')"
        :items="systemTags"
        multiple
        item-title="Name"
        item-value="ID"
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="<any>systemTypeFilter"
        class="px-2"
        density="compact"
        prepend-icon="cc:system"
        variant="outlined"
        hide-details
        :label="$t('ui.fields.systemType')"
        :items="systemTypes"
        chips
        clearable
        @update:modelValue="updateFilters()" />
    </v-col>
  </mech-item-filter-base>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { SystemType } from '@/classes/enums'
import MechItemFilterBase from './MechItemFilterBase.vue'

defineOptions({ name: 'mech-system-filter' })

const props = withDefaults(defineProps<{
  activeFilters?: object
  systemTags?: any[]
}>(), {
  activeFilters: () => ({}),
  systemTags: () => []
})

const emit = defineEmits<{
  'set-filters': [payload: any]
}>()

const base = ref<any>(null)

const tagFilter = ref([] as string[])
const systemTypeFilter = ref([] as SystemType[])
const spLlFilters = ref({} as any)

const systemTypes = computed(() => {
  return Object.keys(SystemType).map((k) => SystemType[k as any]).filter((k) => k !== 'Integrated').sort() as string[];
})

function onSpLlChange(partial: any) {
  spLlFilters.value = partial;
  updateFilters();
}

function updateFilters() {
  const fObj = { ...spLlFilters.value } as any;
  if (tagFilter.value && tagFilter.value.length) fObj.Tags = tagFilter.value;
  if (systemTypeFilter.value && systemTypeFilter.value.length) {
    const types = systemTypeFilter.value === SystemType.Tech ? [SystemType.Tech, SystemType.Invade] : [systemTypeFilter.value];
    fObj.Type = types;
  }
  emit('set-filters', fObj);
}

onMounted(() => {
  const f = props.activeFilters;
  if (!f || !Object.keys(f).length) return;
  if (f.Tags) tagFilter.value = f.Tags;
  if (f.Type) systemTypeFilter.value = f.Type[0] ?? [];
})
</script>
