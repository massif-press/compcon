<template>
  <action-dialog-base
    ref="base"
    :used="used"
    :action="action"
    :mech="mech"
    @use="$emit('use', $event)"
    @undo="$emit('undo')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import ActionDialogBase from './_ActionDialogBase.vue'

export default Vue.extend({
  name: 'item-action-dialog',
  components: { ActionDialogBase },
  props: {
    used: { type: Boolean },
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
