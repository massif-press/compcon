<template>
  <v-expansion-panel>
    <v-expansion-panel-header color="panel">
      <span class="heading h3">
        <v-icon large color="action--downtime">cci-downtime</v-icon>
        {{ action.name }}
      </span>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="panel lighten-1">
      <v-card flat color="transparent">
        <v-alert dense color="panel" class="my-2">
          <p class="text--text mb-0" v-html="action.detail" />
        </v-alert>
        <slot @close="dialog = false" />
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import { actions } from 'lancer-data'

export default Vue.extend({
  name: 'dt-menu-expander',
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
