<template>
  <v-menu offset-y top :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn
        class="mx-1"
        small
        dark
        :fab="$vuetify.breakpoint.lgAndUp"
        elevation="0"
        :color="state.Move < 1 ? 'grey darken-1' : 'action--move'"
        v-on="on"
      >
        <v-icon color="white" size="30">mdi-arrow-right-bold-hexagon-outline</v-icon>
        <span v-if="$vuetify.breakpoint.mdAndDown" class="pl-2" v-html="'MOVEMENT'" />
      </v-btn>
    </template>
    <div>
      <v-card class="px-4 py-2" dense color="panel">
        <cc-tick-bar
          :key="state.Move"
          :current="state.Move"
          :max="state.MaxMove"
          large
          color="action--move"
          bg-color="panel lighten-1"
          full-icon="mdi-arrow-right-bold-hexagon-outline"
          empty-icon="mdi-hexagon-outline"
          @update="mech.Pilot.State.SetMove($event)"
        >
          <span class="heading h3">Movement</span>
        </cc-tick-bar>
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
    state() {
      return this.mech.Pilot.State
    },
  },
})
</script>
