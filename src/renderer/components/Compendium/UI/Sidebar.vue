<template>
  <v-navigation-drawer :mini-variant.sync="mini" stateless touchless :value="true" dark fixed class="pt-5" disable-route-watcher v-click-outside="minimize">
    <v-toolbar flat class="transparent pt-2">
      <v-list>
        <v-list-tile @click="to('licenses')" class="mb-2">
          <v-list-tile-action >
            <v-icon>mdi-account-card-details</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Licenses</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider />

        <v-list-tile @click="to('manufacturers')">
          <v-list-tile-action>
            <v-icon>mdi-factory</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Manufacturers</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="to('frames')">
          <v-list-tile-action>
            <v-icon>mdi-hexagon-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Frames</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="to('weapons')">
          <v-list-tile-action>
            <v-icon>mdi-sword-cross</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Weapons</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="to('systems')">
          <v-list-tile-action>
            <v-icon>mdi-chip</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Systems</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="to('pilot_gear')">
          <v-list-tile-action>
            <v-icon>mdi-racing-helmet</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Pilot Gear</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider />

        <v-list-tile @click="to('statuses')">
          <v-list-tile-action>
            <v-icon>mdi-gauge</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Statuses</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="to('tags')">
          <v-list-tile-action>
            <v-icon>mdi-tag-multiple</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title">Tags</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>        

      </v-list>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'sidebar',
  data: () => ({
    mini: true
  }),
  methods: {
    to: function (loc) {
      this.$router.push(loc)
    },
    minimize () {
      setTimeout(() => {
        this.mini = true
      }, 5)
    }
  }
}
</script>