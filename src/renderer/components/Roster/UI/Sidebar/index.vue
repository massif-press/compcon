<template>
  <v-navigation-drawer :mini-variant.sync="mini" height="93.7vh" :visible="isVisible">

    <v-toolbar flat class="transparent">
      <v-list class="pt-0">

        <v-list-tile v-if="!mini">
          <v-list-tile-content class="pt-2">
            <v-list-tile-title class="title">Pilots</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action class="pt-2">
            <v-btn icon @click.stop="mini = !mini" >
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <div v-else class="pa-2"></div>

    

    <v-list class="pt-0">
    <div v-for="pilot in pilots" :key="pilot.title" >
      <v-list-group value="true" >
        <v-list-tile slot="activator">
        <v-tooltip right :disabled="!mini">
          <v-list-tile-action slot="activator">
            <v-avatar size=40 color="blue darken-3">
              <img v-if="pilot.avatar" :src="pilot.avatar" alt="avatar">
              <b v-else class="white--text">{{pilot.callsign.substring(0, 1).toUpperCase()}}</b>
            </v-avatar>
          </v-list-tile-action>
          <span>{{pilot.callsign}}</span>
        </v-tooltip>
          <v-list-tile-title v-if="!mini">{{ pilot.callsign}}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="select(pilot.id)">
        <v-tooltip right :disabled="!mini">
          <v-list-tile-action slot="activator" >
            <v-icon large color="blue">pageview</v-icon>
          </v-list-tile-action>
          <span>View Pilot Sheet</span>
        </v-tooltip>
          <v-list-tile-content>
              <v-list-tile-title class="font-weight-bold">Pilot Sheet</v-list-tile-title>
              <v-list-tile-sub-title class="text-capitalize">level {{pilot.level}} {{item('Backgrounds', pilot.background).name}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-subheader style="height:20px; border-bottom: lightgrey 1px solid" class="mt-2 mb-2 ml-3 mr-3">Configurations</v-subheader>
          <div v-for="config in pilot.configs" :key="config.id">
          <v-list-tile @click="''">
          <v-tooltip right :disabled="!mini">
            <v-list-tile-action slot="activator" >
              <v-icon large color="blue">open_in_browser</v-icon>
            </v-list-tile-action>
            <span>View Configuration</span>
          </v-tooltip>
            <v-list-tile-content>
                <v-list-tile-title class="font-weight-bold">{{config.name}}</v-list-tile-title>
                <v-list-tile-sub-title class="text-capitalize">{{item('Frames', config.frame_id).name}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>

      </v-list-group>


    </div>
    </v-list>



  <v-spacer />

          <v-list-tile @click="goToNew()">
            <v-list-tile-action>
              <v-icon color="indigo">add</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>Add New Pilot</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

      </v-list>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
import SidebarItem from './SidebarItem'

export default {
  name: 'sidebar',
  components: { SidebarItem },
  data: () => ({
    expand: false,
    lockExpand: false,
    activeIndex: -1,
    activeID: '',
    isVisible: true,
    mini: true,
    drawer: true
  }),
  computed: {
    pilots: function () {
      return this.$store.getters.getAllPilots
    }
  },
  methods: {
    select (pilotID) {
      this.activeID = pilotID
      this.$store.dispatch('loadPilot', pilotID)
    },
    item: function (type, id) {
      return this.$store.getters.getItemById(type, id)
    },
    goToNew () {
      if (!this.mini) this.$router.push('/new')
    }
  }
}
</script>