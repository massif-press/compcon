<template>
  <card>
    <div
      v-if="header"
      class="caption text-center mt-n1"
      style="letter-spacing: 4px; font-size: 10px"
    >
      {{ header }} // <b>ACTION</b>
    </div>
    <action-internal :action="action" />
    <div style="position: absolute; bottom: 1px; right: 1px">
      <v-icon
        v-if="action.IsPilotAction"
        icon="cc:pilot"
        color="grey"
        size="30"
        class="mr-n2 mb-n2"
      />
      <v-icon :icon="action.Icon" :color="action.Color" size="40" />
    </div>
  </card>
</template>

<script lang="ts">
import Card from './PrintCard.vue';
import ActionInternal from './_actionInternal.vue';

export default {
  name: 'print-action',
  components: {
    Card,
    ActionInternal,
  },
  props: {
    action: {
      type: Object,
      required: true,
    },
    header: {
      type: String,
      required: false,
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 11px;
}
</style>
