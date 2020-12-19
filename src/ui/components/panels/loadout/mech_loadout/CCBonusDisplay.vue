<template>
  <div v-show="!item.NoBonus">
    <cc-tooltip
      v-for="(b, i) in item.Bonuses"
      :key="`${i}_${b.ID}`"
      inline
      :title="`Bonus: ${b.Title}`"
      :content="b.Detail"
    >
      <v-icon large color="accent">
        cci-accuracy
      </v-icon>
    </cc-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-bonus-display',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
