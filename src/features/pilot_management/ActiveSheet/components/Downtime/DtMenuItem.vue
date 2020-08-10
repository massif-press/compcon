<template>
  <v-list-item color="active" @click.stop="dialog = true">
    <v-list-item-content>
      <v-list-item-title class="text-body-1 font-weight-bold mr-2">
        {{ action.name }}
      </v-list-item-title>
      <v-list-item-subtitle v-html="action.description" />
    </v-list-item-content>
    <v-dialog v-model="dialog" width="80vw">
      <v-toolbar dense color="action--downtime" class="heading h2" dark>
        {{ action.name }}
        <v-spacer />
        <v-menu left offset-x width="50vw" open-on-hover>
          <template v-slot:activator="{ on }">
            <v-icon class="fadeSelect" v-on="on" style="cursor: help;">
              mdi-help-circle-outline
            </v-icon>
          </template>
          <v-card tile>
            <v-card-text class="body-text text--text" v-html="action.detail" />
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-card>
        <slot @close="dialog = false" />
      </v-card>
    </v-dialog>
    <v-menu left width="80vw" offset-x open-on-hover open-delay="500">
      <template v-slot:activator="{ on }">
        <v-icon class="fadeSelect" style="cursor: help;" v-on="on">mdi-help-circle-outline</v-icon>
      </template>
      <v-card tile>
        <v-toolbar dense flat color="action--downtime darken-2" class="heading h2" dark>
          {{ action.name }}
        </v-toolbar>
        <v-card-text class="body-text text--text" v-html="action.detail" />
      </v-card>
    </v-menu>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { actions } from 'lancer-data'

export default Vue.extend({
  name: 'dt-menu-item',
  props: {
    actionId: { type: String, required: true, default: '' },
    disabled: { type: Boolean },
  },
  data: () => ({
    action: {},
    infoDialog: false,
    dialog: false,
  }),
  created() {
    this.action = actions.find(x => x.id === this.actionId)
  },
  methods: {
    close() {
      this.dialog = false
    },
  },
})
</script>
