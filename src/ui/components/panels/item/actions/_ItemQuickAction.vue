<template>
  <action-base
    :action="action"
    color="action--quick"
    type="Quick Action"
    icon="mdi-hexagon-slice-3"
    :inset="inset"
    :transparent="transparent"
    :print="print"
  >
    <div class="body-text mb-1" v-html="action.detail" />
  </action-base>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionBase from '../_ItemActionBase.vue'

export default Vue.extend({
  name: 'cc-item-quick-action',
  components: { ActionBase },
  props: {
    action: {
      type: Object,
      required: true,
    },
    inset: { type: Boolean },
    transparent: { type: Boolean },
    print: { type: Boolean },
  },
})
</script>
