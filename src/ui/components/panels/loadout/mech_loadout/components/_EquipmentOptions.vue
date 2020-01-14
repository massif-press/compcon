<template>
  <span v-if="item">
    <v-menu offset-y top @click.stop>
      <template v-slot:activator="{ on: menu }">
        <v-btn dark small class="ml-n3 mt-n1 ml-0 fadeSelect" icon v-on="menu" @click.stop>
          <v-icon small>mdi-settings-outline</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item v-if="!item.Destroyed" @click="item.Destroy()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-image-broken-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mark as Destroyed</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else @click="item.Repair()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-wrench</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mark as Repaired</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div v-if="item.IsLoading">
          <v-list-item v-if="item.Loaded" @click="item.Loaded = false">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-progress-download</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mark as Unloaded</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else @click="item.Loaded = true">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-progress-upload</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mark as Loaded</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <div v-if="item.IsAI">
          <v-list-item v-if="!item.IsUnshackled" @click="item.Unshackle()">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-link-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mark as Unshackled</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else @click="item.Shackle()">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-link-variant-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Clear Unshackled Status</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'equipment-options-menu',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
