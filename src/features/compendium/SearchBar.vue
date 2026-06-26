<template>
  <div class="top-element">
    <v-text-field ref="input"
      v-model="searchText"
      class="search-field"
      tile
      flat
      variant="solo"
      density="compact"
      :disabled="disabled"
      :placeholder="`Search the ${loc}`"
      @update:focused="isFocused = $event"
      @keyup.enter="search">
      <template #prepend>
        <div class="prepend bg-panel"
          :class="isFocused && 'color-rotate'"
          style="min-width: 42px">
          <v-icon icon="mdi-magnify"
            size="34"
            class="mt-1 ml-3 mr-2" />
        </div>
      </template>
      <template #append>
        <div :class="`bg-panel ${isFocused && 'color-rotate'}`"
          style="
            transition: filter 0.2s ease-in-out;
            width: 3px;
            height: 100%;
            margin-left: 4px;
            z-index: 1;
          " />
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

defineOptions({ name: 'CompendiumSearchBar' })

const props = defineProps<{
  reference?: boolean
  campaign?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'search': [payload: any]
}>()

const input = ref<any>(null)

const searchText = ref('')
const isHovering = ref(false)
const isFocused = ref(false)

const loc = computed(() => {
      return props.reference ? 'Reference' : 'Compendium';
    })

function search() {
      if (props.campaign) {
        emit('search', searchText.value);
        return;
      }
      router.push({ path: '/srd/compendium/search', query: { search: searchText.value } });
    }
</script>

<style scoped>
@import './search-bar.css';
</style>
