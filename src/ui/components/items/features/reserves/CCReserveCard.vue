<template>
  <cc-titled-panel :title="item.Name" :icon="item.Icon" :color="item.Color">
    <v-card-text class="text-xs-left mt-0 pt-0" style="min-height: 115px">
      <div class="overline subtle--text mt-n2 mb-n1">{{ item.Type }}</div>
      <p v-html-safe="item.Description" class="flavor-text mb-0" />
    </v-card-text>
  </cc-titled-panel>
</template>

<script lang="ts">
export default {
  name: 'cc-reserve-card',
  props: {
    item: { type: Object, required: true },
  },
};
</script>
