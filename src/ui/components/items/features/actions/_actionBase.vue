<template>
  <v-card-text>
    <div style="width: 50vw">
      <div v-if="action.Init">
        {{ action.Init }}
      </div>
      <div v-if="action.Trigger">
        <div class="subtle--text overline mb-n2">Trigger</div>
        <div class="body-text stark--text">{{ action.Trigger }}</div>
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
