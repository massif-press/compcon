<template>
  <v-menu offset-y top :close-on-click="false" :close-on-content-click="false">
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
      <v-list class="px-2 py-3" dense color="panel">
        <cc-tick-bar
          :key="mech.CurrentMove"
          :current="mech.CurrentMove"
          :max="mech.MaxMove"
          large
          color="action--move"
          full-icon="mdi-arrow-right-bold-hexagon-outline"
          no-input
          @update="mech.CurrentMove = $event"
        />
      </v-list>
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
})
</script>
