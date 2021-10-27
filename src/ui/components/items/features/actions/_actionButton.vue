<template>
  <div class="text-center">
    <v-btn
      :color="usable ? 'grey darken-2' : action.Color"
      block
      tile
      dark
      :small="$vuetify.breakpoint.smAndDown"
      :disabled="disabled"
      @click="$refs.dialog.show()"
    >
      <v-icon v-if="!noAction" dark left>{{ action.Icon }}</v-icon>
      {{ action.Name }}
      <v-menu v-if="!noAction" offset-y max-width="700px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn right icon v-bind="attrs" v-on="on">
            <v-icon class="fadeSelect">
              mdi-information-outline
            </v-icon>
          </v-btn>
        </template>
        <v-card>
          <div class="heading h3 ma-1 pl-3">
            {{ action.Name.toUpperCase() }} &mdash; {{ action.Activation.toUpperCase() }} ACTION
          </div>
          <v-divider v-if="action.Detail || displayFreq" />
          <v-card-text
            v-if="displayFreq"
            v-html-safe="action.Frequency.ToString()"
            class="body-text text--text mt-0 pt-1"
          />
          <v-card-text
            v-if="action.Detail"
            v-html-safe="action.Detail"
            class="body-text text--text mt-0 pt-1"
          />
        </v-card>
      </v-menu>
    </v-btn>
    <cc-combat-dialog
      ref="dialog"
      :no-action="noAction"
      :action="action"
      :mech="pilot.ActiveMech"
      @use="$emit('use', $event)"
      @undo="$emit('undo', $event)"
    />
  </div>
</template>

<script lang="ts">
import { ActivationType } from '@/classes/enums'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import ActionBase from './_actionBase.vue'

export default vueMixins(activePilot).extend({
  name: 'action-button',
  components: { ActionBase },
  props: {
    action: {
      type: Object,
      required: true,
    },
    activations: {
      type: Number,
      required: false,
      default: 2,
    },
    disabled: { type: Boolean },
    unusable: { type: Boolean },
    noAction: { type: Boolean },
  },
  computed: {
    cost() {
      if (this.action.Activation === ActivationType.Quick) return 1
      else if (this.action.Activation === ActivationType.Full) return 2
      return 0
    },
    usable() {
      return this.unusable || this.action.Used || this.activations < this.cost
    },
    displayFreq() {
      return this.action.Frequency.ToString() !== 'Unlimited'
    }
  },
})
</script>
