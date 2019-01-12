<template>
  <div>
    <topbar />
    
    <div class="wrapper">

    <!-- Sidebar -->
    <sidebar />

    <!-- Page Content -->
    <div id="content">
        <pilot-sheet :pilot_id="'cio'"/>
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
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      loadPilot (id) {
        // console.log(this.$store)
        // console.log(this.$store.state.Pilots, id)
        // console.log(this.$store.getters.pilot)
        console.log(this.$store.getters.pilot('cio'))
        return null // this.$store.getters.pilot(id)
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
