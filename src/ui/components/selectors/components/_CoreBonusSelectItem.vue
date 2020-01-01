<template>
  <v-row dense>
    <v-col cols="auto" dense class="pr-0">
      <v-btn
        tile
        block
        outlined
        min-height="calc(100% - 8px)"
        class="pa-0"
        :color="color"
        :disabled="!isSelected && !isSelectable"
        @click="$emit(isSelected ? 'remove' : 'add', bonus)"
      >
        <cc-tooltip simple inline :content="ttContent()">
          <v-icon v-if="isSelected" size="80" color="error">cci-difficulty</v-icon>
          <v-icon v-else-if="isSelectable" size="80" color="secondary">cci-accuracy</v-icon>
          <v-icon v-else size="80" color="grey">mdi-lock</v-icon>
        </cc-tooltip>
      </v-btn>
    </v-col>
    <v-col class="pl-0">
      <cc-core-bonus-item :bonus="bonus" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
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
      if (!this.isSelected && !this.isSelectable) return 'Locked'
      else if (this.isSelected) return `Remove ${this.bonus.Name}`
      return `Add ${this.bonus.Name}`
    },
  },
})
</script>
