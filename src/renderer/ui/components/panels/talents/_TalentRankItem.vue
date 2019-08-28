<template>
  <div>
    <div class="primary white--text">
      <span class="heading h3 pl-2">{{ talentRank.name }}</span>
    </div>
    <v-row>
      <v-col cols="auto">
        <v-icon size="120" color="primary">cci-rank-{{ rankIndex }}</v-icon>
      </v-col>
      <v-col>
        <p class="flavor-text pt-2" v-html="talentRank.description" />
      </v-col>
    </v-row>
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
