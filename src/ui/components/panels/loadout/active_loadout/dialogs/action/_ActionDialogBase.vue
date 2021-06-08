<template>
  <v-row justify="center" align="center">
    <v-col v-if="action.Detail">
      <action-detail-expander :action="action" />
    </v-col>
    <action-activation-buttons
      :fulltech="fulltech"
      :used="used"
      :action="action"
      :mech="mech"
      @use="$emit('use', $event)"
    />
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionActivationButtons from '../../components/_ActionActivationButtons.vue'
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'

export default Vue.extend({
  name: 'action-dialog-base',
  components: { ActionDetailExpander, ActionActivationButtons },
  props: {
    used: { type: Boolean },
    fulltech: { type: Boolean, default: false },
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
})
</script>
