<template>
  <div class="cc-masonry-grid"
    :style="gridStyle">
    <div v-for="(item, index) in items"
      :key="keyMapper ? keyMapper(item, index) : index"
      class="cc-masonry-item">
      <slot :item="item"
        :index="index" />
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
    gridStyle() {
      return {
        '--masonry-gap': `${this.gap}px`,
        '--masonry-columns': `repeat(${this.columns}, 1fr)`,
        '--masonry-max-columns': this.columns,
      }
    },
  },
}
</script>

<style scoped>
.cc-masonry-grid {
  display: grid;
  grid-template-columns: var(--masonry-columns);
  grid-template-rows: masonry;
  gap: var(--masonry-gap);
}

@supports not (grid-template-rows: masonry) {
  .cc-masonry-grid {
    display: block;
    column-gap: var(--masonry-gap);
    columns: var(--masonry-max-columns);
  }

  .cc-masonry-item {
    break-inside: avoid;
    margin-bottom: var(--masonry-gap);
  }
}
</style>
