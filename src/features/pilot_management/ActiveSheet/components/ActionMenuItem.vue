<template>
  <v-list-item color="active" @click.stop="$refs.dialog.show()">
    <v-list-item-content>
      <v-list-item-title class="title">
        <v-icon class="mt-n1" :style="!available && !action.Used ? 'opacity:0.3' : ''">
          {{ action.Used ? 'mdi-check-circle' : action.Icon }}
        </v-icon>
        <span :style="!available && !action.Used ? 'opacity:0.3' : ''">
          {{ action.Name.toUpperCase() }}
        </span>
      </v-list-item-title>
      <v-list-item-subtitle
        v-html-safe="terse"
        :style="!available && !action.Used ? 'opacity:0.3' : ''"
      />
    </v-list-item-content>
    <v-menu left width="80vw" offset-x open-on-hover open-delay="100">
      <template v-slot:activator="{ on }">
        <v-icon class="fadeSelect ml-4" style="cursor: help;" v-on="on">
          mdi-help-circle-outline
        </v-icon>
      </template>
      <v-card tile>
        <v-toolbar dense flat :color="action.Color" class="heading h2" dark>
          {{ action.Name }}
        </v-toolbar>
        <v-card-text v-html-safe="action.Detail" class="body-text text--text" />
      </v-card>
    </v-menu>
    <cc-combat-dialog ref="dialog" :action="action" :mech="mech" />
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'action-menu-item',
  props: {
    action: { type: Object, required: true },
    mech: { type: Object, required: true },
    available: { type: Boolean },
  },
  computed: {
    terse() {
      const txt = this.action.Terse || this.action.Detail
      return txt
    },
  },
})
</script>
