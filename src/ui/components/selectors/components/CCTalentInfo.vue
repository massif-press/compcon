<template>
  <div class="mt-2">
    <p class="flavor-text mx-2" v-html="talent.Description" />
    <div v-for="(tr, i) in talent.Ranks" :key="`rank_${i}`">
      <cc-title small>
        {{ tr.name }}
        <span class="overline accent--text text--lighten-3">&nbsp;RANK {{ i + 1 }}</span>
      </cc-title>
      <cc-talent-rank-item :rank="i + 1" :description="tr.description" />
      <p class="body-text text--text" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'talent-info',
  props: {
    talent: {
      type: Object,
      required: true,
    },
  },
})
</script>
