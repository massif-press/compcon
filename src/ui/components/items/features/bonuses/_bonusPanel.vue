<template>
  <v-alert variant="outlined" dense :color="bonus.Color">
    <bonus-base :bonus="bonus" />
  </v-alert>
</template>

<script lang="ts">
import bonusBase from './_bonusBase.vue';

export default {
  name: 'bonus-panel',
  components: { bonusBase },
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
};
</script>
