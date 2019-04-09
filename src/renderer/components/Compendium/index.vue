<template>
  <div>   
    <sidebar />
    <router-view style="margin-left: 80px; width:96vw"></router-view>
    </div>    
</template>

<script>
  import {Sidebar} from './UI'

export default {
    name: 'compendium',
    components: { Sidebar },
  }
</script>
