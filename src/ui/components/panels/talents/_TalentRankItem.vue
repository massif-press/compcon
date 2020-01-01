<template>
  <div>
    <div class="primary white--text">
      <span class="heading h3 pl-2">
        {{ talentRank.name }}
        <span
          class="overline primary--text text--lighten-3"
        >&nbsp;RANK {{ rankIndex }}</span>
      </span>
    </div>
    <cc-talent-rank-item :rank="rankIndex" :description="talentRank.description" />
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
