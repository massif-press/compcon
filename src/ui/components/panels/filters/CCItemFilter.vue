<template>
  <component :is="componentLoader"
    v-if="componentLoader"
    ref="c"
    :active-filters="activeFilters"
    @set-filters="$emit('set-filters', $event)" />
  <v-card v-else
    variant="outlined">
    <v-card-text class="text center">
      <i>No filters available</i>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import logger from '@/user/logger';
import * as filters from './';

export default {
  name: 'CcItemFilter',
  props: {
    itemType: {
      type: String,
      required: true,
    },
    activeFilters: {
      type: Object,
      default: () => ({}),
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
        logger.error('No item type provided to CCItemFilter', this);
        return null;
      }

      const f = `${this.itemType.replace(' ', '')}Filter`;

      if (!filters[f]) {
        logger.error(`No filter found for item type ${this.itemType}`, this);
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
