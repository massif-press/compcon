<template>
  <span>
    <v-tooltip v-if="item.LcpName" location="top" :close-delay="300" :max-width="300">
      <template #activator="{ props }">
        <v-icon v-bind="props" icon="cc:compendium" class="fade-select" color="primary" />
      </template>
      <v-icon v-if="item.InLcp" icon="cc:compendium" color="exotic" class="pb-1" start />
      <b>{{ item.LcpName }}</b>
    </v-tooltip>
  </span>
</template>

<script lang="ts">
export default {
  name: 'cc-brew-info',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
