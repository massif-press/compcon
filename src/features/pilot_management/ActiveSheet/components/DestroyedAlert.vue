<template>
  <v-alert v-if="mech.Destroyed" prominent dense color="error" outlined class="text-center">
    <v-icon slot="prepend" color="error" size="70" class="mr-3">
      {{ mech.ReactorDestroyed ? 'mdi-nuke' : 'cci-eclipse' }}
    </v-icon>
    <span class="heading h1">
      MECH DESTROYED
      <span v-if="mech.ReactorDestroyed">
        <cc-slashes />
        REACTOR DESTROYED
      </span>
    </span>
    <div class="heading mt-n4 subtle--text">
      {{
        mech.ReactorDestroyed
          ? 'ERR ERR ERR ERR ERR ERR ERR'
          : 'FRAME.CRITICAL//: CATASTROPHIC DAMAGE'
      }}
    </div>
    <div class="flavor-text text--text">
      The currently active mech ({{ mech.Name }}
      <cc-slashes />
      {{ mech.Frame.Source }} {{ mech.Frame.Name }}) has been destroyed.
      <span v-if="!mech.ReactorDestroyed"></span>
      <span v-if="mech.ReactorDestroyed">
        The reactor has gone critical and the frame is unrecoverable. This mech must be reprinted.
      </span>
    </div>
    <div style="position: relative">
      <cc-tooltip
        v-if="!mech.ReactorDestroyed"
        content="Certain actions and equipment allow for battlefield repairs. Clicking here will restore your mech to 1 Structure Point and 1 HP."
      >
        <v-btn x-small color="primary" class="fadeSelect" @click="restore(false)">
          <v-icon small left>cci-repair</v-icon>
          REPAIR
        </v-btn>
      </cc-tooltip>
      <cc-tooltip
        v-else-if="mech.ReactorDestroyed"
        content="Revert this state and restore your mech to 1 Structure Point and 1 HP."
      >
        <v-btn x-small color="primary" class="fadeSelect" @click="restore(true)">
          <v-icon small left>mdi-reload</v-icon>
          RESTORE
        </v-btn>
      </cc-tooltip>
    </div>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'destroyed-alert',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  methods: {
    restore(restoreReactor: boolean): void {
      this.mech.Pilot.State.CancelSelfDestruct()
      this.$emit('restore', restoreReactor)
    }
  }
})
</script>
