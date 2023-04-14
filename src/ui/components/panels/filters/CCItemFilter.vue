<template>
  <component
    :is="componentLoader"
    v-if="componentLoader"
    ref="c"
    @set-filters="$emit('set-filters', $event)"
  />
</template>

<script lang="ts">
import * as filters from './';

export default {
  name: 'cc-item-filter',
  props: {
    itemType: {
      type: String,
      required: true,
    },
  },
  emits: ['set-filters'],
  data() {
    return {
      component: null,
    };
  },
  computed: {
    componentLoader() {
      if (!this.itemType) {
        console.error('No item type provided to CCItemFilter');
        return null;
      }

      const f = `${this.itemType.replace(' ', '')}Filter`;

      if (!filters[f]) {
        console.log(filters);
        console.error(`No filter found for item type ${this.itemType}`);
        return null;
      }

      return filters[f];
    },
  },
  methods: {
    clear() {
      (this.$refs.c as any).clear();
    },
  },
};
</script>
