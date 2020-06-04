<template>
  <v-col xl="4" :lg="downtime ? '4' : '3'" md="6" xs="12">
    <cc-titled-panel
      clickable
      :title="action.name + (action.pilot ? ' (Pilot Only)' : '')"
      :icon="`$vuetify.icons.${action.action_type}`"
      :color="`action--${action.action_type}`"
      @click="$refs.dialog.show()"
    >
      <v-card-text class="text-xs-left py-2">
        <p class="flavor-text py-0" v-html="action.description" />
      </v-card-text>
    </cc-titled-panel>
    <cc-solo-dialog
      ref="dialog"
      :icon="`$vuetify.icons.${action.action_type}`"
      :color="`action--${action.action_type}`"
      no-confirm
      :title="action.name + (action.pilot ? ' (Pilot Only)' : '')"
      width="80vw"
    >
      <p class="body-text text--text" v-html="action.detail" />
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-card',
  props: {
    action: {
      type: Object,
      required: true,
    },
    downtime: {
      type: Boolean,
      required: false,
    },
  },
})
</script>
