<template>
  <div>
    <topbar />
    
    <div class="wrapper">

    <!-- Sidebar -->
    <sidebar />

    <!-- Page Content -->
    <div id="content">
      <pilot-sheet :pilot_id="activePilotId"/>
      <config-sheet />
    </div>

    </div>    
  </div>
</template>

<script>
  import Topbar from './UI/Topbar'
  import Sidebar from './UI/Sidebar'
  import PilotSheet from './PilotSheet'
  import ConfigSheet from './ConfigSheet'

  export default {
    name: 'roster',
    components: { Topbar, Sidebar, PilotSheet, ConfigSheet },
    data: () => ({
      activePilotId: '',
      configOpen: false
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      toggleConfigSheet (bool) {
        this.configOpen = bool
      }
    },
    created: function () {
      this.$store.dispatch('loadAllPilots')
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
  }

  .wrapper {
    display: flex;
    width: 100%;
}

#content {
  margin-left: 6vw;
  margin-right: 1vw;
  width: 100%;
  height: 92.7vh;
  overflow-y: scroll;
}
</style>