<template>
  <div id='roster-index'>
    <topbar />
    
    <div class="wrapper">

    <!-- Sidebar -->
    <!-- <sidebar ref="sidebar" /> -->

    <!-- Page Content -->
    <router-view class="pt-5"></router-view>

    </div>    
  </div>
</template>

<script>
  import {Topbar} from './UI'
  import RosterView from './RosterView/'
  import PilotSheet from './PilotSheet/'
  import ConfigSheet from './ConfigSheet/'

  export default {
    name: 'roster',
    components: { Topbar, RosterView, PilotSheet, ConfigSheet },
    data: () => ({
      activePilotId: ''
    }),
    computed: {
      pilots: function () {
        return this.$store.getters.getAllPilots
      }
    },
    created: function () {
      this.$store.dispatch('setDatapath', this.userDataPath)
      this.$store.dispatch('loadAllPilots')
      this.$store.dispatch('loadData')
      this.$store.dispatch('loadBrews')
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

<style>
  .roster-content {
    margin-left: 0;
    margin-right: 0;
    width: 100vw;
    overflow-y: scroll;
  }
</style>

