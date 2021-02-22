<template>
  <v-card-text :class="$vuetify.breakpoint.smAndDown ? 'px-0' : ''">
    <div>
      <div v-if="action.Init" class="body-text stark--text mt-2" v-html="action.Init" />
      <div v-if="action.Trigger">
        <div class="subtle--text overline mb-n2">Trigger</div>
        <div class="body-text stark--text" v-html="action.Trigger" />
      </div>
      <div v-if="action.Detail">
        <div class="subtle--text overline mb-n2">Effect</div>
        <div class="body-text stark--text" v-html="action.Detail" />
      </div>
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
  },
})
</script>
