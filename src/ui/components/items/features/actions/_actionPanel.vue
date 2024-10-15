<template>
  <v-alert outlined dense :color="action.Color" class="pb-0 ma-1">
    <v-row no-gutters>
      <v-col cols="auto">
        <v-icon large dark class="mt-n2" color="stark">{{ action.Icon }}</v-icon>
        <span :class="`heading ${$vuetify.breakpoint.smAndDown ? 'h3' : 'h2'} text--text`">
          {{ action.Name }}
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto pl-5">
        <v-chip
          v-if="action.Frequency.ToString() !== 'Unlimited'"
          slot="title-items"
          color="stark"
          :small="!$vuetify.breakpoint.smAndDown"
          :x-small="$vuetify.breakpoint.smAndDown"
          class="stat-text mr-2"
          outlined
          label
        >
          {{ action.Frequency.ToString() }}
        </v-chip>
        <v-chip
          :small="!$vuetify.breakpoint.smAndDown"
          :x-small="$vuetify.breakpoint.smAndDown"
          label
          dark
          :color="`action--${action.Activation.toLowerCase()}`"
        >
          {{ action.Activation.toUpperCase() }}
        </v-chip>
      </v-col>
    </v-row>
    <action-base :action="action" :displayDescription="displayDescription" class="mt-n6 mb-n2" />
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionBase from './_actionBase.vue'

export default Vue.extend({
  name: 'action-panel',
  components: { ActionBase },
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
