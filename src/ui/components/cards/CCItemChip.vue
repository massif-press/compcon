<template>
  <v-chip :label="!small" :variant="variant" :size="small ? 'small' : ''" :color="item.Color">
    <v-menu open-on-hover open-delay="300" close-on-click close-on-content-click width="60vw">
      <template #activator="{ props }">
        <div v-bind="props">
          <v-icon :icon="item.Icon" start :class="small ? '' : 'mt-n2'" />
          <span :class="small ? '' : 'heading h3'">{{ item.Name }}</span>
        </div>
      </template>
      <v-card max-width="60vw">
        <v-toolbar density="compact" :color="item.Color">
          <v-icon size="x-large" :icon="item.Icon" /><span class="heading h3" v-text="item.Name" />
        </v-toolbar>
        <div class="pa-2">
          <cc-item-card :item="item" :tier="tier" readonly active />
        </div>
      </v-card>
    </v-menu>
  </v-chip>
</template>

<script lang="ts">
export default {
  name: 'CCItemChip',
  props: {
    item: {
      type: Object,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'outlined',
    },
    tier: {
      type: Number,
    },
  },
};
</script>
