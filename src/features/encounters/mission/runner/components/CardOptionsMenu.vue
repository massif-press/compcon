<template>
  <v-menu offset-x right>
    <template v-slot:activator="{ on }">
      <v-btn large icon v-on="on">
        <v-icon large>mdi-settings</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item @click.stop>
        <v-list-item-icon class="ma-0 mr-2 mt-2">
          <v-icon>mdi-redo-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Stage Custom Reaction</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click.stop>
        <v-list-item-icon class="ma-0 mr-2 mt-2">
          <v-icon>mdi-close</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Remove from Battle</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click.stop>
        <v-list-item-icon class="ma-0 mr-2 mt-2">
          <v-icon>cci-repair</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Full Repair</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list-item @click.stop>
        <v-list-item-icon class="ma-0 mr-2 mt-2">
          <v-icon color="error">mdi-delete</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Delete from Encounter</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'card-options-menu',
})
</script>
