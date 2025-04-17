<template>
  <cc-core-bonus-item :bonus="bonus" />
  <cc-button
    size="small"
    block
    :color="isSelected ? 'error' : 'success'"
    class="mb-6"
    :disabled="!isSelectable && !isSelected && !isSelectable"
    @click="$emit(isSelected ? 'remove' : 'add', bonus)">
    <span>
      <span v-if="isSelected">
        <v-icon start>cc:difficulty</v-icon>
        Remove {{ bonus.Name }}
      </span>
      <span v-else-if="isSelectable">
        <v-icon start>cc:accuracy</v-icon>
        Add {{ bonus.Name }}
      </span>
      <span v-else>
        <v-icon start>mdi-lock</v-icon>
        Unavailable
      </span>
    </span>
  </cc-button>
</template>

<script lang="ts">
export default {
  name: 'cb-item',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isSelected: {
      type: Boolean,
      required: true,
    },
    isSelectable: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    ttContent() {
      if (!this.isSelected && !this.isSelectable) return 'Locked';
      else if (this.isSelected) return `Remove ${this.bonus.Name}`;
      return `Add ${this.bonus.Name}`;
    },
  },
};
</script>
