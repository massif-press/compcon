<template>
  <v-row density="compact"
    justify="space-around"
    class="mx-4">
    <v-col cols="12">
      <v-select v-model="roleFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:role_support"
        chips
        clearable
        variant="outlined"
        :label="$t('ui.fields.role')"
        :items="roles"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineOptions({ name: 'npc-class-filter' })

const props = withDefaults(defineProps<{
  activeFilters?: object
  roles?: any[]
}>(), {
  activeFilters: () => ({}),
  roles: () => []
})

const emit = defineEmits<{
  'set-filters': []
}>()

const roleFilter = ref([] as string[])

function clear() {
      roleFilter.value = [];
    }
function updateFilters() {
      const fObj = {} as any;
      if (roleFilter.value && roleFilter.value.length > 0) fObj.Role = roleFilter.value;
      emit('set-filters', fObj);
    }

onMounted(() => {
const f = props.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Role) roleFilter.value = f.Role;
})
</script>
