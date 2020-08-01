<template>
  <action-base
    :action="action"
    color="action--reaction"
    :type="`Reaction${action.frequency ? `::${action.frequency}` : ''}`"
    icon="cci-reaction"
    :inset="inset"
    :transparent="transparent"
    :print="print"
  >
    <div class="body-text stark--text mb-1" v-html="action.init" />
    <div class="body-text">
      <b class="action--reaction--text">TRIGGER:</b>
      &nbsp;{{ action.trigger }}
    </div>
    <div class="body-text">
      <b class="action--reaction--text">EFFECT:</b>
      &nbsp;{{ action.detail }}
    </div>
  </action-base>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionBase from '../_ItemActionBase.vue'

export default Vue.extend({
  name: 'cc-item-reaction-action',
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
