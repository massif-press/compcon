<template>
  <cc-dialog :color="item.Color" :icon="item.Icon" :title="item.Name" :width="600">
    <template #activator="{ open }">
      <cc-button :color="item.Color" :prepend-icon="item.Icon" @click="open()">
        {{ item.Name }}
      </cc-button>
    </template>
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
