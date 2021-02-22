<template>
  <v-row dense>
    <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="auto" class="pr-0">
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
    <v-col cols="12" md="" class="pl-0">
      <cc-core-bonus-item :bonus="bonus" />
    </v-col>
    <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12" md="auto" class="mb-4 mt-n2">
      <v-btn
        tile
        block
        :dark="isSelectable || isSelected"
        :color="color"
        :disabled="!isSelected && !isSelectable"
        @click="$emit(isSelected ? 'remove' : 'add', bonus)"
      >
        <span>
          <span v-if="isSelected">
            <v-icon left>cci-difficulty</v-icon>
            Remove Bonus
          </span>
          <span v-else-if="isSelectable">
            <v-icon left>cci-accuracy</v-icon>
            Add Bonus
          </span>
          <span v-else>
            <v-icon left>mdi-lock</v-icon>
            Unavailable
          </span>
        </span>
      </v-btn>
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
