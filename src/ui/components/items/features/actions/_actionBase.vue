<template>
  <v-card-text style="height: 100%" :class="$vuetify.breakpoint.smAndDown ? 'px-0' : ''">
    <div class="my-2">
      <v-row v-if="action.Damage || action.Range" dense align="center">
        <v-col cols="auto">
          <cc-range-element :range="action.Range" />
        </v-col>
        <v-col cols="auto">
          <cc-damage-element :damage="action.Damage" />
        </v-col>
      </v-row>
      <v-divider v-if="action.Init || action.Trigger || action.Detail" class="my-1" />
    </div>
    <div v-if="action.Init" v-html-safe="action.Init" class="body-text stark--text mt-2" />
    <div v-if="action.Frequency.ToString() !== 'Unlimited'">
      <div class="subtle--text overline mb-n2">Frequency</div>
      <div v-html-safe="action.Frequency.ToString()" class="body-text stark--text" />
    </div>
    <div v-if="action.Trigger">
      <div class="subtle--text overline mb-n2">Trigger</div>
      <div v-html-safe="action.Trigger" class="body-text stark--text" />
    </div>
    <div v-if="action.Detail">
      <div class="subtle--text overline mb-n2">Effect</div>
      <div v-html-safe="action.Detail" class="body-text stark--text" />
    </div>
    <div v-if="action.Description && displayDescription">
      <div class="subtle--text overline mb-n2">Compendium Entry</div>
      <div v-html-safe="action.Description" class="flavor-text" />
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-base',
  props: {
    action: {
      type: Object,
      required: true,
    },
    displayDescription: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
})
</script>
