<template>
  <div id='roster-index'>
    <topbar />
    
    <div class="wrapper">

    <!-- Sidebar -->
    <sidebar ref="sidebar" />

    <!-- Page Content -->
    <router-view class="pt-5 mt-3"></router-view>

    </div>    
  </div>
</template>

<script>
  import {Topbar, Sidebar} from './UI'
  // import PilotSheet from './PilotSheet/'
  // import ConfigSheet from './ConfigSheet/'

  export default {
    name: 'roster',
    components: { Topbar, Sidebar },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    created: function () {
      this.$store.dispatch('setDatapath', this.userDataPath)
      this.$store.dispatch('loadData')
      this.$store.dispatch('buildLicenses')
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { 
    font-family: 'Source Sans Pro', sans-serif; 
    overflow: hidden;
  }

  .wrapper {
    display: flex;
    width: 100%;
}
</style>

