<template>
  <div class="nav-body elevation-10">
    <div id="cap" />
    <v-btn
      tile
      depressed
      :color="selected === 0 ? 'white' : 'primary'"
      :dark="selected !== 0"
      @click="$emit('set-page', 0)"
    >
      <span class="unskew">DOSSIER</span>
    </v-btn>
    <v-btn
      tile
      depressed
      :color="selected === 1 ? 'white' : 'primary'"
      :dark="selected !== 1"
      @click="$emit('set-page', 1)"
    >
      <span class="unskew">NARRATIVE PROFILE</span>
    </v-btn>
    <v-btn
      tile
      depressed
      :color="selected === 2 ? 'white' : 'primary'"
      :dark="selected !== 2"
      @click="$emit('set-page', 2)"
    >
      <span class="unskew">TACTICAL PROFILE</span>
    </v-btn>
    <v-btn
      tile
      depressed
      :color="selected === 3 ? 'white' : 'primary'"
      :dark="selected !== 3"
      @click="$emit('set-page', 3)"
    >
      <span class="unskew">MECH HANGAR</span>
    </v-btn>
    <v-btn
      icon
      fab
      x-small
      outlined
      disabled
      class="mx-4 unskew"
      dark
      @click="$emit('set-page', 99)"
    >
      <v-icon large>cci-frame</v-icon>
    </v-btn>
    <v-divider vertical class="mx-2" />
    <div id="divider" />
    <v-menu offset-y top>
      <template v-slot:activator="{ on: menu }">
        <v-btn class="unskew ml-2" icon dark v-on="menu">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
      </template>
      <v-list two-line subheader>
        <v-subheader class="heading h2 white--text primary py-0 px-2">Print / Export / Cloud Options</v-subheader>
        <v-list-item @click="$emit('!')">
          <v-list-item-icon>
            <v-icon>mdi-printer</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Print</v-list-item-title>
            <v-list-item-subtitle>Print tabletop-ready character and mech sheets</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$emit('!')">
          <v-list-item-icon>
            <v-icon>mdi-file-document-box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Generate Statblock</v-list-item-title>
            <v-list-item-subtitle>Get a plaintext representation of this character's build</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$emit('!')">
          <v-list-item-icon>
            <v-icon>mdi-export-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Export Pilot</v-list-item-title>
            <v-list-item-subtitle>Open the pilot export menu</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$emit('!')">
          <v-list-item-icon>
            <v-icon>mdi-cloud</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Cloud Settings</v-list-item-title>
            <v-list-item-subtitle>Set this pilot's cloud save status and generate share codes</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item disabled>
          <v-list-item-icon>
            <v-icon>mdi-cloud-sync</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Quick Sync</v-list-item-title>
            <v-list-item-subtitle>Update pilot to/from cloud</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item @click="$emit('!')">
          <v-list-item-icon>
            <v-icon color="error">mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="error--text">Delete Pilot</v-list-item-title>
            <v-list-item-subtitle class="error--text">Remove this pilot from the roster</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu offset-y top>
      <template v-slot:activator="{ on: menu }">
        <v-btn class="unskew ml-2" icon dark v-on="menu">
          <v-icon>mdi-view-grid-plus</v-icon>
        </v-btn>
      </template>
      <v-list subheader>
        <v-subheader class="heading h2 white--text primary py-0 px-4">Layout Options</v-subheader>
        <v-list-item-group>
          <v-list-item @click="$emit('!')">
            <v-list-item-icon>
              <v-icon>mdi-view-array</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Array View</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item disabled @click="$emit('!')">
            <v-list-item-icon>
              <v-icon>mdi-view-sequential</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sheet View (Classic View)</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item disabled @click="$emit('!')">
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Custom View A</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item disabled @click="$emit('!')">
            <v-list-item-icon>
              <v-icon>mdi-playlist-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Manage Custom Views</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'pilot-nav',
  props: {
    selected: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style scoped>
.nav-body {
  position: fixed;
  bottom: 20px;
  left: 16px;
  min-height: 40px;
  padding: 5px 20px 5px 20px;
  transform: skew(-0.65rad);
  background-color: var(--v-primary-base);
  color: white;
  z-index: 10;
}

#cap {
  background-color: var(--v-primary-base);
  position: absolute;
  width: 70px;
  height: 45px;
  left: -50px;
  top: 0;
  z-index: 9;
}

#divider {
  width: 2px;
  min-width: 2px;
  height: 47px;
  right: 115px;
  top: 0;
  z-index: 11;
  background-color: white;
  position: absolute;
}

.unskew {
  transform: skew(0.65rad);
}
</style>