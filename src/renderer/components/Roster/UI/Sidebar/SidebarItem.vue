<template>
<div>
      <v-list-group v-model="group" :class="group ? 'grey darken-2' : ''" append-icon="">
     
      <v-list-tile id="pilot-tile" slot="activator" @click="select(pilot.id)" avatar>
      <v-tooltip right :disabled="!isMini">
        <v-list-tile-avatar slot="activator">
          <v-avatar size=40>
            <img v-if="pilot.avatar" :src="pilot.avatar" alt="avatar">
            <b v-else class="white--text">{{pilot.callsign.substring(0, 1).toUpperCase()}}</b>
          </v-avatar>
        </v-list-tile-avatar>
        <span>{{pilot.callsign}}<br>({{pilot.name}})</span>

      </v-tooltip>
        <v-list-tile-content>
          <v-list-tile-title class="font-weight-bold">{{ pilot.callsign}}</v-list-tile-title>
          <v-list-tile-sub-title class="text-capitalize">level {{pilot.level}} {{item('Backgrounds', pilot.background).name}}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>

      <div v-if="!isMini">
      <v-subheader style="height:20px; border-bottom: lightgrey 1px solid" class="mt-2 mb-2 ml-4 mr-5">Configurations</v-subheader>
        <div v-for="config in pilot.configs" :key="config.id">
        <v-tooltip right>
          <v-list-tile @click="selectConfig(config)" class="ml-2 mr-2" slot="activator">

          <v-list-tile-content>
              <v-list-tile-title class="font-weight-bold">{{config.name}}</v-list-tile-title>
              <v-list-tile-sub-title class="text-capitalize">{{frameName(config.frame_id)}}</v-list-tile-sub-title>
          </v-list-tile-content>

        </v-list-tile>
            <span>View Configuration</span>
          </v-tooltip>
        </div>
       
        <v-list-tile @click="''" class="ml-2 mr-4 mb-3" >
          <v-list-tile-action  >
            <v-icon large dark>add</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title><em>Add New Configuration</em></v-list-tile-title>
          </v-list-tile-content>

          </v-list-tile>
      </div>
    </v-list-group>
  </div>
</template>

<script>
  export default {
    name: 'sidebar-item',
    props: [
      'isMini',
      'pilot'
    ],
    data: () => ({
      group: null
    }),
    methods: {
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