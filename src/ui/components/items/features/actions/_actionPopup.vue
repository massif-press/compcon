<template>
  <cc-dialog no-dismiss small-btn :color="action.Color" large>
    <span slot="button" class="white--text" style="width: 100%">
      <v-icon dark>{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </span>

    <span slot="title">
      <v-icon left large dark>{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </span>
    <v-chip slot="title-items" color="white" class="stat-text mt-4 mr-6" outlined label>
      {{ action.Frequency.ToString() }}
    </v-chip>

    <action-base :action="action" />
  </cc-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionBase from './_actionBase.vue'

export default Vue.extend({
  name: 'action-popup',
  components: { ActionBase },
  props: {
    action: {
      type: Object,
      required: true,
    },
  },
})
</script>
