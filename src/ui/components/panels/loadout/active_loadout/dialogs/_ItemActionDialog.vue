<template>
  <action-dialog-base ref="base" :action="action" :mech="mech" @use="$emit('use', $event)" />
</template>

<script lang="ts">
import Vue from 'vue'
import ActionDialogBase from './_ActionDialogBase.vue'

export default Vue.extend({
  name: 'item-action-dialog',
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
