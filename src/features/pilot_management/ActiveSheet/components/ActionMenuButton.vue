<template>
  <v-menu offset-y top>
    <template v-slot:activator="{ on }">
      <v-btn class="mx-1" small fab elevation="0" :color="color" v-on="on">
        <slot name="icon" />
      </v-btn>
    </template>
    <div>
      <v-toolbar dense flat class="heading h3" style="min-width: 80px">
        {{ title }}
        <v-spacer />
        <v-btn small icon color="accent" class="ml-4"><v-icon>mdi-open-in-new</v-icon></v-btn>
      </v-toolbar>
      <v-list class="px-2 py-3">
        <v-list-item v-for="a in actions" :key="a">
          <v-list-item-title>{{ a }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-menu-button',
  props: {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    actions: {
      type: Array,
      required: true,
    },
  },
})
</script>
