<template>
  <v-navigation-drawer :mini-variant.sync="mini" stateless :value="isVisible" dark fixed style="top:5vh" height="95vh">
    <v-toolbar flat class="transparent pt-2">
      <v-list>
        <v-list-tile v-if="!mini">
          <v-list-tile-action class="pt-2">
            <v-btn icon @click.stop="mini = !mini" class="mr-3">
              <v-icon large>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-content class="pt-2">
            <v-list-tile-title class="title">Pilots</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <div v-else>
          <v-toolbar-side-icon large class="ml-3 pl-1"></v-toolbar-side-icon>
        </div>

        <v-divider />
    
        <v-list>
          <div v-for="(pilot, index) in pilots" :key="pilot.title" >
            <sidebar-item :isMini="mini" :pilot="pilot" @set-active="setActivePilot(pilot, index)" @set-config="setActiveConfig" />
          </div>
        </v-list>

        <v-spacer />

        <v-divider />

        <v-list-tile @click="goToNew()">
          <v-list-tile-action>
            <v-icon large dark>add</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="title">Add New Pilot</v-list-tile-title>
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
    mini: true,
    isVisible: true,
    activeIndex: null
  }),
  computed: {
    pilots: function () {
      return this.$store.getters.getAllPilots
    }
  },
  methods: {
    setActivePilot (pilot, index) {
      this.activeIndex = index
      this.mini = true
      // TODO: async load with overlay
      this.$store.dispatch('loadPilot', pilot.id)
      this.$router.push('/roster')
    },
    setActiveConfig (config) {
      this.mini = true
      // TODO: async load with overlay
      this.$store.dispatch('loadConfig', config.id)
      this.$router.push('/config')
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