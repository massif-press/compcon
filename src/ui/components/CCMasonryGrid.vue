<template>
  <div class="cc-masonry-grid"
    :style="gridStyle">
    <div v-for="(col, colIndex) in columnItems"
      :key="colIndex"
      class="cc-masonry-column">
      <div v-for="entry in col"
        :key="keyMapper ? keyMapper(entry.item, entry.index) : entry.index"
        class="cc-masonry-item">
        <slot :item="entry.item"
          :index="entry.index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const _display = useDisplay()

const props = withDefaults(defineProps<{
  items: any[]
  gap?: number
  keyMapper?: Function
  xlColumns?: number
}>(), {
  gap: 16,
  keyMapper: null,
  xlColumns: 3
})

const columns = computed(() => {
      if (props.items.length <= 1) return 1
      if (_display.mdAndDown.value) return 1
      if (_display.lg.value) return 2
      if (_display.xl.value) return props.xlColumns
      return 3
    })
const columnItems = computed(() => {
      const cols: { item: unknown; index: number }[][] = Array.from({ length: columns.value }, () => [])
      props.items.forEach((item, i) => {
        cols[i % columns.value].push({ item, index: i })
      })
      return cols
    })
const gridStyle = computed(() => {
      return {
        '--masonry-gap': `${props.gap}px`,
      }
    })
</script>

<style scoped>
.cc-masonry-grid {
  display: flex;
  gap: var(--masonry-gap);
  align-items: flex-start;
  overflow: hidden;
}

.cc-masonry-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--masonry-gap);
}
</style>
