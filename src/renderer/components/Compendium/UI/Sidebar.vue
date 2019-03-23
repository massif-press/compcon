<template>
  <v-navigation-drawer :mini-variant.sync="mini" stateless touchless :value="isVisible" dark fixed class="pt-5" disable-route-watcher v-click-outside="minimize">
    <v-toolbar flat class="transparent pt-2">
      <v-list>
        <v-list-tile @click="to('/licenses')">
          <v-list-tile-action >
            <v-icon>ballot</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Licenses</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider />

        <v-list-tile @click="to('licenses')">
          <v-list-tile-action>
            <v-icon>group_work</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Manufacturers</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="to('licenses')">
          <v-list-tile-action>
            <v-icon>view_day</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Frames</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="to('licenses')">
          <v-list-tile-action>
            <v-icon>view_day</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Weapons</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="to('licenses')">
          <v-list-tile-action>
            <v-icon>view_day</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Systems</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="to('licenses')">
          <v-list-tile-action>
            <v-icon>view_day</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Pilot Gear</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>


      </v-list>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
// import io from '@/store/data_io'

export default {
  name: 'sidebar',
  data: () => ({
    mini: true,
    isVisible: true,
    activeIndex: null,
    addDialog: false
  }),
  computed: {
    pilots: function () {
      return this.$store.getters.getAllPilots
    }
  },
  methods: {
    to: function (loc) {
      this.$router.push(loc)
    },
    minimize () {
      setTimeout(() => {
        this.mini = true
      }, 5)
    },
    toggle () {
      this.mini = !this.mini
    }
  }
}
</script>