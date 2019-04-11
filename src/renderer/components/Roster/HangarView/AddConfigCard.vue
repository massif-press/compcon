<template>
<v-hover>
  <v-card slot-scope="{ hover }" :class="`inactive elevation-${hover ? 12 : 0}`" @click="openConfigModal">
    <v-layout row>
      <v-flex class="ma-0 pb-0 pt-0 text-xs-center">
        <div style="height: 300px; display:table; width:100%; cursor: pointer;">
          <span class="pilot-letter white--text">+</span>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex class="pb-0">
        <v-card color="rgba(0, 0, 0, .55)" dark flat height="112px">
          <v-layout fill-height>
            <v-flex class="ma-2 text-xs-center" align-center align-content-center>
              <span class="font-weight-light" style="line-height:76px; letter-spacing:3px; font-size:28px">Add New Mech</span>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
      <v-dialog lazy v-model="newConfigModal" fullscreen hide-overlay transition="fade-transition">
        <v-card>
          <v-toolbar fixed dense flat>
            <v-toolbar-title>New Configuration</v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
              <v-btn icon large @click="newConfigModal = false; newConfigLoader = false"> <v-icon large>close</v-icon> </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-spacer class="ma-5" />
          <div v-if="newConfigLoader">
            <add-config-menu @close="goToConfig"/>
          </div>
        </v-card>
    </v-dialog>
  </v-card>
</v-hover>
</template>

<script>
import AddConfigMenu from './AddConfigMenu'

export default {
  name: 'add-config-card',
  components: {AddConfigMenu},
  data: () => ({
    newConfigModal: false,
    newConfigLoader: false
  }),
  methods: {
    openConfigModal () {
      // this.$store.dispatch('loadPilot', this.pilot.id)
      this.newConfigLoader = true
      this.newConfigModal = true
    },
    goToConfig () {
      this.newConfigModal = false
      this.newConfigLoader = false
      this.$emit('added')
    }
  }
}
</script>

<style scoped>
 .pilot-letter {
   display:table-cell; 
   vertical-align:middle; 
   text-align:center;
   font-size: 20vw;
   line-height: 0;
 }

 .active {
   background: linear-gradient(#283593, #424242 80%);
   background-color: #424242;
 }

  .inactive {
   background: linear-gradient(#616161, #424242 80%);
   background-color: #424242;
 }

  .inactive:hover {
   background: linear-gradient(#546E7A, #616161 80%);
   border: 0px
 }
</style>
