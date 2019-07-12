<template>
  <div>
    <v-tooltip top style="width: 100%" open-delay="1200">
      <v-btn
        block
        slot="activator"
        :small="small"
        :large="large"
        class="ma-0"
        :color="actionColor"
        :disabled="disabled"
        @click="clicked"
      >
        <v-icon style="position: absolute; left: 0">$vuetify.icons.{{ action.action_type }}</v-icon>
        <div style="position: absolute; right: 0">
          <v-divider dark vertical class="ml-2 mr-1" />
          <v-icon small @click.stop="dialog = true">
            mdi-help-circle-outline
          </v-icon>
        </div>
        <span class="pl-4 pr-3">{{ action.name }}</span>
      </v-btn>
      <span>{{ action.description }}</span>
    </v-tooltip>
    <v-dialog v-model="dialog" width="700">
      <v-toolbar dense :color="actionColor" class="major-title" dark>
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
  name: 'action-button',
  props: {
    actionId: String,
    small: Boolean,
    large: Boolean,
    colorOverride: String,
    disabled: Boolean,
  },
  data: () => ({
    action: {},
    dialog: false,
    actionColor: '',
  }),
  methods: {
    clicked() {
      this.$emit('click')
    },
  },
  created() {
    this.action = actions.find(x => x.id === this.actionId)
    if (this.colorOverride) this.actionColor = this.colorOverride
    else {
      switch (this.action.action_type) {
        case 'move':
          this.actionColor = 'red darken-3'
          break
        case 'full':
          this.actionColor = 'indigo darken-1'
          break
        case 'quick':
          this.actionColor = 'info'
          break
        case 'overcharge':
          this.actionColor = 'pink accent-3'
          break
        case 'reaction':
          this.actionColor = 'purple darken-2'
          break
        default:
          this.actionColor = 'green darken-2'
          break
      }
    }
  },
})
</script>
