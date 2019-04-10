<template>
  <div>
    <sidebar />
    <div style="margin-left: 80px; width:96vw">
      <search-bar />
      <router-view></router-view>
    </div>
  </div>    
</template>

<script lang="ts">
import Vue from 'vue'
import { Sidebar, SearchBar } from './UI'

export default Vue.extend({
    name: 'compendium',
    components: { Sidebar, SearchBar },
  })
</script>
