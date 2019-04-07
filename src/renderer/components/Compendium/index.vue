<template>
  <div>   
    <!-- Sidebar -->
    <sidebar />

    <!-- Page Content -->
    <router-view style="margin-left: 80px; width:96vw"></router-view>

    </div>    
</template>

<script>
  import {Sidebar} from './UI'

export default {
    name: 'compendium',
    components: { Sidebar },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>
