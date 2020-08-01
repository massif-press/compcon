<template>
  <v-alert dark prominent dense color="pilot" class="mt-1 mb-n1 mx-2">
    <v-icon slot="prepend" size="40" class="mr-3">cci-corebonus</v-icon>
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
