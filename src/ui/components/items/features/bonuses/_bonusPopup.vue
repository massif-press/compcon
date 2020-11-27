<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">cci-accuracy</v-icon>
    </template>
    <bonus-base :bonus="bonus" />
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import bonusBase from './_bonusBase.vue'

export default Vue.extend({
  name: 'bonus-popup',
  components: { bonusBase },
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
})
</script>
