<template>
  <div>
      <v-list-group v-model="group" :class="group ? 'grey darken-2' : ''" append-icon="">
     
      <v-list-tile id="pilot-tile" slot="activator" @click="isMini? '' : select(pilot.id)" avatar>
        <v-list-tile-avatar>
          <v-avatar size=40>
            <v-img v-if="pilot.avatar" :src="`file://${userDataPath}/img/avatar/${pilot.avatar}`" />
            <b v-else class="white--text">{{pilot.callsign.substring(0, 1).toUpperCase()}}</b>
          </v-avatar>
        </v-list-tile-avatar>

      <v-tooltip right>
        <v-list-tile-content slot="activator">
          <v-list-tile-title class="font-weight-bold">{{ pilot.callsign}}</v-list-tile-title>
          <v-list-tile-sub-title class="text-capitalize">level {{pilot.level}} {{item('Backgrounds', pilot.background).name}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <span>View Pilot Sheet</span>

      </v-tooltip>

      </v-list-tile>

      <div v-if="!isMini">
      <v-subheader style="height:20px; border-bottom: lightgrey 1px solid" class="mt-2 mb-2 ml-4 mr-5">Configurations</v-subheader>
        <div v-for="config in pilot.configs" :key="config.id">
        <v-tooltip right>
          <v-list-tile @click="selectConfig(config)" class="ml-2 mr-2" slot="activator">
              <v-list-tile-action  >
                <v-icon large dark>label_important</v-icon>
              </v-list-tile-action>
          <v-list-tile-content>
            
              <v-list-tile-title class="font-weight-bold">{{config.name}}</v-list-tile-title>
              <v-list-tile-sub-title class="text-capitalize">{{frameName(config.frame_id)}}</v-list-tile-sub-title>
          </v-list-tile-content>

        </v-list-tile>
            <span>View Configuration</span>
          </v-tooltip>
        </div>
       

          <v-dialog lazy v-model="newConfigModal" fullscreen hide-overlay transition="fade-transition">
            <v-list-tile slot="activator" class="mr-4 mb-2 mt-2" >
              <v-btn @click="openConfigModal" color="indigo darken-1"><v-icon>add</v-icon> Add New Configuration&emsp;</v-btn>
            </v-list-tile>

            <v-card>
              <v-toolbar fixed dense flat>
                <v-toolbar-title>New Configuration</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large @click="newConfigModal = false; newConfigLoader = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-spacer class="ma-5" />
              <div v-if="newConfigLoader">
                <new-config :pilot="pilot" @close="goToConfig"/>
              </div>
            </v-card>
        </v-dialog>

      </div>
    </v-list-group>
  </div>
</template>

<script>
  import NewConfig from '../../ConfigSheet/NewConfig'
  
  export default {
    name: 'sidebar-item',
    components: { NewConfig },
    props: {
      isMini: Boolean,
      pilot: Object
    },
    data: () => ({
      group: null,
      newConfigModal: false,
      newConfigLoader: false
    }),
    methods: {
      openConfigModal () {
        this.$store.dispatch('loadPilot', this.pilot.id)
        this.newConfigLoader = true
      },
      goToConfig () {
        this.newConfigModal = false
        this.newConfigLoader = false
        this.$emit('set-config', this.pilot.configs[this.pilot.configs.length - 1])
      },
      select () {
        this.$emit('set-active')
      },
      selectConfig (config) {
        this.$emit('set-config', config)
      },
      item: function (type, id) {
        return this.$store.getters.getItemById(type, id)
      },
      frameName: function (id) {
        return this.item('Frames', id).name
      }
    }
  }
</script>

<style>
 .nc-btn {
   background-color: #546E7A;
 }
</style>
