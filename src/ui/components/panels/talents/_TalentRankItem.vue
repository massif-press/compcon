<template>
  <div>
    <div class="primary white--text">
      <span class="heading h3 pl-2">
        {{ talentRank.name }}
        <span class="overline white--text">&nbsp;//RANK {{ rankIndex }}</span>
      </span>
    </div>
    <div class="light-panel clipped mb-2">
      <cc-talent-rank-item :rank="rankIndex" :description="talentRank.description" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'talent-rank-item',
  props: {
    talentRank: {
      type: Object,
      required: true,
    },
    rankIndex: {
      type: Number,
      required: true,
    },
  },
})
</script>
