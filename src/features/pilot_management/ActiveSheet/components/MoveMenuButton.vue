<template>
  <v-menu offset-y top :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn class="mx-1" small fab elevation="0" color="action--move" v-on="on">
        <v-icon color="white" size="30">mdi-arrow-right-bold-hexagon-outline</v-icon>
      </v-btn>
    </template>
    <div>
      <v-toolbar dense flat class="heading h3" style="min-width: 80px">
        Movement
        <v-spacer />
        <v-btn small icon color="accent" class="ml-4" @click="$emit('open-menu')">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card class="px-4 py-2" dense color="panel">
        <cc-tick-bar
          :key="mech.CurrentMove"
          :current="mech.CurrentMove"
          :max="mech.MaxMove"
          large
          color="action--move"
          bg-color="panel lighten-1"
          full-icon="mdi-arrow-right-bold-hexagon-outline"
          empty-icon="mdi-hexagon-outline"
          @update="mech.CurrentMove = $event"
        >
          <span class="heading h3">Movement Remaining</span>
        </cc-tick-bar>
        <v-divider class="my-2" />
        <v-list dense color="panel">
          <v-list-item dense @click="$emit('open-dialog', boost)">
            <v-list-item-title class="text-button">
              <v-icon left>{{ boost.Icon }}</v-icon>
              {{ boost.Name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-menu-button',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    boost() {
      console.log()
      return this.mech.Pilot.State.BaseActions('Quick').find(x => x.ID === 'act_boost')
    },
  },
})
</script>
