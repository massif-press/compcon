<template>
  <div>
    <v-tabs
      v-model="selected"
      color="accent"
      background-color="primary"
      class="pa-0 ma-0 ml-n6"
      style="width: calc(85vw - 30px);"
    >
      <v-tab>Protocols</v-tab>
      <v-tab>Full Actions</v-tab>
      <v-tab>Quick Actions</v-tab>
      <v-tab>Free Actions</v-tab>
      <v-tab>Reactions</v-tab>
      <v-tab>Combat Log</v-tab>
      <v-tab>Other</v-tab>
    </v-tabs>
    <v-tabs-items v-model="selected">
      <v-tab-item>
        <v-card flat color="background">
          <v-card-text>List of all protocols</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-card-text>List of all full actions</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-card-text>List of all quick actions</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-card-text>List of all reactions}</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-card-text>List of free actions</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-card-text>combat log</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-card-text>List of other options</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'active-action-menu',
  props: {
    tab: { type: Number, required: true },
  },
  data: () => ({
    selected: 0,
  }),
  watch: {
    tab(newVal) {
      this.selected = newVal
    },
  },
})
</script>
