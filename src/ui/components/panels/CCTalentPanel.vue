<template>
  <cc-titled-panel :title="talent.Name" icon="cci-trait">
    <p class="flavor-text" v-html="talent.Description" />
    <div v-for="(r, i) in talent.Ranks" :key="r.Name">
      <div class="primary white--text">
        <span class="heading h3 pl-2">
          {{ r.Name }}
          <span class="overline white--text">&nbsp;//RANK {{ i + 1 }}</span>
        </span>
      </div>
      <div class="light-panel clipped mb-2">
        <cc-talent-rank-item :rank="i + 1" :talent-rank="r" />
      </div>
    </div>
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-talent-panel',
  props: {
    talent: {
      type: Object,
      required: true,
    },
  },
})
</script>
