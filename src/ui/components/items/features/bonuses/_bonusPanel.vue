<template>
  <v-alert outlined dense :color="bonus.Color">
    <bonus-base :bonus="bonus" />
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
import bonusBase from './_bonusBase.vue'

export default Vue.extend({
  name: 'bonus-panel',
  components: { bonusBase },
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
})
</script>
