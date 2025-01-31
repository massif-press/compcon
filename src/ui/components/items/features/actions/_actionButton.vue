<template>
  <div class="text-center">
    <v-btn
      :color="usable ? 'grey darken-2' : action.Color"
      block
      :small="$vuetify.display.mdAndDown"
      :disabled="disabled"
      @click="($refs.dialog as any).show()">
      <v-icon v-if="!noAction" dark left :icon="action.Icon" />
      {{ action.Name }}
      <v-menu v-if="!noAction" offset-y max-width="700px">
        <template #activator="{ on }">
          <v-btn right icon v-bind="on">
            <v-icon variant="plain" icon="mdi-information-outline" />
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
            class="body-text text-text mt-0 pt-1" />
          <v-card-text
            v-if="action.Detail"
            v-html-safe="byTier(action.Detail)"
            class="body-text text-text mt-0 pt-1" />
        </v-card>
      </v-menu>
    </v-btn>
    <cc-combat-dialog
      v-if="pilot"
      ref="dialog"
      :no-action="noAction"
      :action="action"
      :mech="pilot.ActiveMech"
      @use="$emit('use', $event)"
      @undo="$emit('undo', $event)" />
  </div>
</template>

<script lang="ts">
import { ByTier } from '@/util/tierFormat';
import { ActivationType } from '@/classes/enums';

import ActionBase from './_actionBase.vue';

export default {
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
    pilot: { type: Object },
    tier: {
      type: Number,
      required: false,
    },
  },
  computed: {
    cost() {
      if (this.action.Activation === ActivationType.Quick) return 1;
      else if (this.action.Activation === ActivationType.Full) return 2;
      return 0;
    },
    usable() {
      return this.unusable || this.action.Used || this.activations < this.cost;
    },
    displayFreq() {
      return this.action.Frequency.ToString() !== 'Unlimited';
    },
  },
  methods: {
    byTier(value: string) {
      return ByTier(value, this.tier);
    },
  },
};
</script>
