<template>
  <div id='roster-index'>
    <topbar />
    
    <div class="wrapper">

    <!-- Sidebar -->
    <sidebar ref="sidebar" />

    <!-- Page Content -->
    <router-view class="pt-5"></router-view>

    </div>    
  </div>
</template>

<script>
  import {Topbar, Sidebar} from './UI'
  import PilotSheet from './PilotSheet/'
  import ConfigSheet from './ConfigSheet/'

  export default {
    name: 'roster',
    components: { Topbar, Sidebar, PilotSheet, ConfigSheet },
    data: () => ({
      activePilotId: ''
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    computed: {
      pilots: function () {
        return this.$store.getters.getAllPilots
      }
    },
    created: function () {
      this.$store.dispatch('loadAllPilots')
      this.$store.dispatch('loadData')
    },
    watch: {
      $route (to, from) {
        this.$refs.sidebar.mini = true
        this.$refs.sidebar.isVisible = !(to.path === '/level' || to.path === '/new')
      }
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

<style>
  .roster-content {
    margin-left: 80px;
    margin-right: 0;
    width: 100vw;
    overflow-y: scroll;
  }
</style>

