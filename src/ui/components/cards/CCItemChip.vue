<template>
  <v-chip :label="!isSmall" :variant="variant" :size="size" :color="item.Color">
    <v-menu open-on-hover open-delay="300" close-on-click close-on-content-click width="60vw">
      <template #activator="{ props }">
        <div v-bind="props">
          <v-icon :icon="item.Icon" start :class="isSmall ? '' : 'mt-n2'" />
          <span :class="isSmall ? '' : 'heading h3'">{{ item.Name }}</span>
        </div>
      </template>
      <v-card max-width="60vw">
        <v-toolbar density="compact" :color="item.Color">
          <v-icon size="x-large" :icon="item.Icon" />
          <span class="heading h3" v-text="item.Name" />
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
    size: {
      type: String,
    },
    variant: {
      type: String,
      default: 'outlined',
    },
    tier: {
      type: Number,
    },
  },
  computed: {
    isSmall() {
      return this.size?.includes('small');
    },
  },
};
</script>
