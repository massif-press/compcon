<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn v-if="big" large block color="primary" v-on="on">Change Mech</v-btn>
      <v-btn v-else outlined small v-on="on">Change Mech</v-btn>
    </template>
    <v-list two-line subheader>
      <v-subheader class="heading h2 white--text primary py-0 px-2">
        Available Mechs
      </v-subheader>
      <v-list-item
        v-for="mech in mechs"
        :key="`mech-select-${mech.ID}`"
        @click="$emit('select', mech)"
      >
        <v-list-item-icon class="ma-0 mr-2 mt-3">
          <cc-logo size="large" :source="mech.Frame.Manufacturer" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ mech.Name }}</v-list-item-title>
          <v-list-item-subtitle>{{ mech.Frame.Source }} {{ mech.Frame.Name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'mech-select-button',
  props: {
    mechs: {
      type: Array,
      required: true,
    },
    big: {
      type: Boolean,
    },
  },
})
</script>
