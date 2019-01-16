<template>
  <div>
    <topbar />
    
    <div class="wrapper">

    <!-- Sidebar -->
    <sidebar />

    <!-- Page Content -->
    <div id="content">
      <pilot-sheet :pilot_id="activePilotId"/>
    </div>

    </div>    
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import Topbar from './UI/Topbar'
  import Sidebar from './UI/Sidebar'
  import PilotSheet from './PilotSheet'

  export default {
    name: 'roster',
    components: { Topbar, Sidebar, PilotSheet },
    data: () => ({
      activePilotId: 'cio'
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    computed: {
      ...mapState([
        'Pilots'
      ]),
      ...mapGetters([
        'Pilots'
      ])
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
