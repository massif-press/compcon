<template>
  <v-col :cols="cols">
    <v-btn
      block
      :small="small"
      :large="large"
      class="ma-0"
      :color="actionColor"
      :disabled="disabled"
      @click="$emit('click')"
    >
      <v-icon style="position: absolute; left: 0">$vuetify.icons.{{ action.action_type }}</v-icon>
      <div style="position: absolute; right: 0">
        <v-divider dark vertical class="ml-2 mr-1" />
        <v-icon :small="!large" @click.stop="dialog = true">mdi-help-circle-outline</v-icon>
      </div>
      <span class="px-3">{{ nameOverride ? nameOverride : action.name }}</span>
    </v-btn>
    <v-dialog v-model="dialog" width="60vw">
      <v-toolbar dense :color="actionColor" class="heading h2" dark>{{ action.name }}</v-toolbar>
      <v-card dark>
        <v-card-text class="flavor" v-html="action.detail" />
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { actions } from 'lancer-data'

export default Vue.extend({
  name: 'action-button',
  props: {
    actionId: {
      type: String,
      required: true,
    },
    cols: {
      type: Number,
      required: false,
      default: 12,
    },
    small: {
      type: Boolean,
    },
    large: {
      type: Boolean,
    },
    colorOverride: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
    },
    nameOverride: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    action: {},
    dialog: false,
    actionColor: '',
  }),
  created() {
    this.action = actions.find(x => x.id === `action_${this.actionId}`)
    if (this.colorOverride) this.actionColor = this.colorOverride
    else this.actionColor = `action--${this.action.action_type}`
  },
})
</script>
