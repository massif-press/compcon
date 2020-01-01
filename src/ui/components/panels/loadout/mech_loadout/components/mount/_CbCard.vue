<template>
  <v-alert dark prominent dense tile color="pilot" icon="cci-corebonus" class="mt-1 mb-n1 mx-2">
    <span class="heading h3">{{ bonus.Name }}</span>
    <br />
    <span class="flavor-text white--text">{{ bonus.MountedEffect }}</span>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cb-card',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
})
</script>
