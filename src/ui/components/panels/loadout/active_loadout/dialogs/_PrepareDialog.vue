<template>
  <action-dialog-base
    ref="base"
    :action="action"
    :mech="mech"
    synergy-location="prepare"
    :log="['COMMAND QUEUED, STANDING BY.']"
  >
    <p class="text--text body-text mb-1">
      Ready a
      <b>QUICK ACTION</b>
      for a specific time or when a specific condition is met.
      <br />
      Specify a
      <b><u>trigger</u></b>
      <cc-tooltip
        inline
        content="The trigger for your prepared action must be phrased as “When
              X, then Y,” where X is a reaction, action or move taken by a hostile or allied
              character and Y is your action. For example, “when an allied character moves adjacent
              to me, I want to throw a smoke grenade,” or “when a hostile character moves adjacent
              to me, I want to ram them”"
      >
        <v-icon small class="fadeSelect">mdi-information-outline</v-icon>
        .
      </cc-tooltip>
      Until the start of your next turn, when it is triggered, you can take your prepared action as
      a reaction. Your preparation counts as taking the action, so it follows all usual restrictions
      on that action and on taking multiple actions.
    </p>
  </action-dialog-base>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionDialogBase from './_ActionDialogBase.vue'

export default Vue.extend({
  name: 'prepare-dialog',
  components: { ActionDialogBase },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  methods: {
    show(): void {
      this.$refs.base.show()
    },
  },
})
</script>
