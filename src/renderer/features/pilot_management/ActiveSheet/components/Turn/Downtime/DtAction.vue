<template>
  <div>
    <v-tooltip top style="width: 100%" open-delay="1200">
      <v-btn
        block
        slot="activator"
        large
        class="ma-0"
        color="blue-grey darken-2"
        :disabled="disabled"
        @click="dialog = true"
      >
        <v-icon style="position: absolute; left: 0">mdi-weather-sunset-down</v-icon>
        <div style="position: absolute; right: 0">
          <v-divider dark vertical class="ml-2 mr-1" />
          <v-icon @click.stop="infoDialog = true">mdi-help-circle-outline</v-icon>
        </div>
        <span class="pl-4 pr-3">{{ action.name }}</span>
      </v-btn>
      <span>{{ action.description }}</span>
    </v-tooltip>
    <v-dialog v-model="dialog" width="80vw">
      <v-toolbar dense color="blue-grey darken-2" class="major-title" dark>
        {{ action.name }}
      </v-toolbar>
      <v-card>
        <slot @close="this.dialog = false"></slot>
      </v-card>
    </v-dialog>
    <v-dialog v-model="infoDialog" width="800">
      <v-toolbar dense color="blue-grey darken-2" class="major-title" dark>
        {{ action.name }}
      </v-toolbar>
      <v-card dark>
        <v-card-text v-html="action.detail" class="effect-text" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { actions } from 'lancer-data'

export default Vue.extend({
  name: 'dt-action',
  props: {
    actionId: String,
    disabled: Boolean,
  },
  data: () => ({
    action: {},
    infoDialog: false,
    dialog: false,
  }),
  methods: {
    close() {
      this.dialog = false
    },
  },
  created() {
    this.action = actions.find(x => x.id === this.actionId)
  },
})
</script>
