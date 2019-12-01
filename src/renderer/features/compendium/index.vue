<template>
  <div>
    <v-slide-y-reverse-transition mode="out-in">
      <router-view style="width: 100vw;" />
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { setupData } from '../_shared/store'

export default Vue.extend({
  name: 'compendium',
  created() {
    setupData(this.$store)
  },
})
</script>
