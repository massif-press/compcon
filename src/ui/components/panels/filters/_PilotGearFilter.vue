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
        :items="types"
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
        :label="$t('ui.fields.tags')"
        :items="gearTags"
        item-value="ID"
        multiple
        item-title="Name"
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { ItemFilters } from '@/ui/components/panels/filters/types'
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineOptions({ name: 'pilot-gear-filter' })

const props = withDefaults(defineProps<{
  activeFilters?: ItemFilters
  gearTags?: any[]
}>(), {
  activeFilters: () => ({}),
  gearTags: () => []
})

const emit = defineEmits<{
  'set-filters': [payload: any]
}>()

const tagFilter = ref([] as string[])
const typeFilter = ref([] as string[])

const types = computed(() => {
      return [
        { title: t('stats.armor'), value: 'PilotArmor' },
        { title: t('ui.titles.gear'), value: 'PilotGear' },
        { title: t('common.weapon'), value: 'PilotWeapon' },
      ];
    })

function clear() {
      tagFilter.value = [];
      typeFilter.value = [];
      updateFilters();
    }
function updateFilters() {
      const fObj = {} as any;
      if (tagFilter.value && tagFilter.value.length > 0) fObj.Tags = tagFilter.value;
      if (typeFilter.value && typeFilter.value.length > 0) fObj.ItemType = typeFilter.value;
      emit('set-filters', fObj);
    }

onMounted(() => {
const f = props.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Tags) tagFilter.value = f.Tags;
    if (f.ItemType) typeFilter.value = f.ItemType;
})

defineExpose({ clear })
</script>
