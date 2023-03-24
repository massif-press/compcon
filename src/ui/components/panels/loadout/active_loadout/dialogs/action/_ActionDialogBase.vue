<template>
  <v-row justify="center" align="center">
    <v-col v-if="action.Detail" cols="12" md="">
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
import ActionActivationButtons from '../../components/_ActionActivationButtons.vue';
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue';

export default {
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
};
</script>
