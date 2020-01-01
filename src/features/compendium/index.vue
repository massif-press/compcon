<template>
  <div>
    <v-slide-y-reverse-transition mode="out-in">
      <router-view style="width: 100vw; padding-top: 50px" />
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'compendium',
})
</script>
