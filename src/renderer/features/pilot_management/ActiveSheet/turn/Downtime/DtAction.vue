<template>
  <v-btn
    block
    large
    tile
    outlined
    color="action--downtime"
    class="my-2"
    dark
    :disabled="disabled"
    @click="dialog = true"
  >
    <div style="position: absolute; right: 0">
      <v-divider dark vertical class="ml-2 mr-1" />
      <v-icon class="fadeSelect" @click.stop="infoDialog = true">mdi-help-circle-outline</v-icon>
    </div>
    <span class="pl-4 pr-3">{{ action.name }}</span>
    <v-dialog v-model="dialog" width="80vw">
      <v-toolbar dense color="action--downtime" class="heading h2" dark>
        {{ action.name }}
      </v-toolbar>
      <v-card>
        <slot @close="dialog = false" />
      </v-card>
    </v-dialog>
    <v-dialog v-model="infoDialog" width="800">
      <v-card tile>
        <v-toolbar dense flat color="action--downtime" class="heading h2" dark>
          {{ action.name }}
        </v-toolbar>
        <v-card-text class="flavor-text text--text mt-2" v-html="action.detail" />
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { actions } from 'lancer-data'

export default Vue.extend({
  name: 'dt-action',
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
