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

<script lang="ts">
export default {
  name: 'CcMasonryGrid',
  props: {
    items: {
      type: Array,
      required: true,
    },
    gap: {
      type: Number,
      default: 16,
    },
    keyMapper: {
      type: Function,
      default: null,
    },
    xlColumns: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    columns() {
      if (this.items.length <= 1) return 1
      if (this.$vuetify.display.mdAndDown) return 1
      if (this.$vuetify.display.lg) return 2
      if (this.$vuetify.display.xl) return this.xlColumns
      return 3
    },
    columnItems() {
      const cols: { item: unknown; index: number }[][] = Array.from({ length: this.columns }, () => [])
      this.items.forEach((item, i) => {
        cols[i % this.columns].push({ item, index: i })
      })
      return cols
    },
    gridStyle() {
      return {
        '--masonry-gap': `${this.gap}px`,
      }
    },
  },
}
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
