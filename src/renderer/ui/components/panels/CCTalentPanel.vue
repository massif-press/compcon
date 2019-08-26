<template>
  <cc-titled-panel :title="talent.Name" icon="cci-trait">
    <talent-rank-item
      v-for="(r, i) in talent.Ranks"
      :talent-rank="r"
      :rank-index="i + 1"
      :key="r.name"
    />
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import TalentRankItem from './talents/_TalentRankItem.vue'

export default Vue.extend({
  name: 'cc-talent-panel',
  components: { TalentRankItem },
  props: {
    talent: {
      type: Object,
      required: true,
    },
  },
})
</script>
