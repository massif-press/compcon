<template>
  <div>
    <div class="primary white--text">
      <span class="heading h3">{{ talentRank.name }}</span>
    </div>
    <v-layout>
      <v-flex shrink>
        <v-icon size="120" color="primary">cci-rank-{{ rankIndex }}</v-icon>
      </v-flex>
      <v-flex class="ml-3">
        <p class="flavor-text pt-2" v-html="talentRank.description" />
      </v-flex>
    </v-layout>
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
