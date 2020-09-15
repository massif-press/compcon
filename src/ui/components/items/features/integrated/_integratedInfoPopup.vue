<template>
  <cc-dialog no-dismiss small-btn :color="item.Color">
    <span slot="button" class="white--text" style="width: 100%">
      <v-icon left dark>{{ item.Icon }}</v-icon>
      {{ item.Name }}
    </span>
    <integrated-info-base :item="item" />
  </cc-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import integratedInfoBase from './_integratedInfoBase.vue'

export default Vue.extend({
  name: 'integrated-info-popup',
  components: { integratedInfoBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
