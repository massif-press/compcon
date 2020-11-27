<template>
  <div class="mt-2">
    <p class="flavor-text mx-2" v-html="talent.Description" />
    <v-alert v-for="(tr, i) in talent.Ranks" :key="`rank_${i}`" outlined dense class="my-2">
      <cc-title small>
        {{ tr.Name }}
        <span class="overline accent--text text--lighten-3">&nbsp;RANK {{ i + 1 }}</span>
      </cc-title>
      <cc-talent-rank-item :rank="i + 1" :talent-rank="tr" />
    </v-alert>
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
