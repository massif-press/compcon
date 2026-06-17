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
    @update:model-value="updateFilters()" />
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
    @update:model-value="updateFilters()" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { uniq } from 'lodash-es'
import { useCompendiumData } from '@/ui/providers'

const props = withDefaults(defineProps<{
  activeFilters?: Record<string, any>
}>(), { activeFilters: () => ({}) })

const compendium = useCompendiumData()

const emit = defineEmits<{ 'set-filters': [filters: Record<string, any>] }>()

const sourceFilter = ref<string[]>([])
const lcpFilter = ref<string[]>([])

const nameSort = (a: { title: string }, b: { title: string }) =>
  a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title.toUpperCase() > b.title.toUpperCase() ? 1 : 0

const manufacturers = computed(() =>
  compendium
    .getItemCollection('Manufacturers')
    .map((x: any) => ({ title: x.Name, value: x.ID }))
    .sort(nameSort)
)

const lcpNames = computed(() =>
  uniq(compendium.Frames.map((x: any) => x.LcpName))
)

onMounted(() => {
  const f = props.activeFilters
  if (!f || !Object.keys(f).length) return
  if (f.Source) sourceFilter.value = f.Source[0] ?? []
  if (f.LcpName) lcpFilter.value = f.LcpName[0] ?? []
})

function clear() {
  sourceFilter.value = []
  lcpFilter.value = []
}

function updateFilters() {
  const fObj = {} as any
  if (lcpFilter.value && lcpFilter.value.length) fObj.LcpName = [lcpFilter.value]
  if (sourceFilter.value && sourceFilter.value.length) fObj.Source = [sourceFilter.value]
  emit('set-filters', fObj)
}

defineExpose({ clear })
</script>
