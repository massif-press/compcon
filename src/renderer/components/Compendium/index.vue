<template>
  <div>   
    <sidebar />
    <router-view style="margin-left: 80px; width:96vw"></router-view>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue'
import {Sidebar} from './UI'

export default Vue.extend({
    name: 'compendium',
    components: { Sidebar },
  })
</script>
