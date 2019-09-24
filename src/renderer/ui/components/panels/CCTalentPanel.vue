<template>
  <cc-titled-panel :title="talent.Name" icon="cci-trait">
    <p class="flavor-text">{{ talent.Description }}</p>
    <talent-rank-item
      v-for="(r, i) in talent.Ranks"
      :key="r.name"
      :talent-rank="r"
      :rank-index="i + 1"
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
