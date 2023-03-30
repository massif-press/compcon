<template>
  <cc-dialog no-dismiss :color="item.Color">
    <span slot="button" class="text-white" style="width: 100%">
      <v-icon start dark>{{ item.Icon }}</v-icon>
      {{ item.Name }}
    </span>
    <span slot="title">
      <v-icon start large dark>{{ item.Icon }}</v-icon>
      {{ item.Name }}
    </span>
    <integrated-info-base :item="item" />
  </cc-dialog>
</template>

<script lang="ts">
import integratedInfoBase from './_integratedInfoBase.vue';

export default {
  name: 'integrated-info-popup',
  components: { integratedInfoBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
