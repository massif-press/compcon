<template>
  <div>
    <!-- <sidebar /> -->
      <!-- <router-view style="margin-left: 80px; width:96vw"></router-view> -->
      <v-slide-y-reverse-transition mode="out-in">
        <router-view style="width: 100vw;" />
      </v-slide-y-reverse-transition>
  </div>    
</template>

<script lang="ts">
import Vue from 'vue'
import Sidebar from './Sidebar.vue'

export default Vue.extend({
    name: 'compendium',
    components: { Sidebar },
  })
</script>
