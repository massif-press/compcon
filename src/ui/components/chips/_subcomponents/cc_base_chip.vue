<template>
  <div class="d-inline-block" style="position: relative">
    <v-tooltip
      :open-on-hover="!mobile"
      :open-on-click="mobile"
      :disabled="!hasTooltipContent"
      max-width="350">
      <template #activator="{ props }">
        <v-chip
          v-bind="props"
          :color="bgColor"
          :variant="<any>variant"
          :size="size"
          class="pa-0"
          :class="hasTooltipContent ? 'chip-interactive' : 'chip-readonly'"
          tile>
          <slot name="content" />
        </v-chip>
      </template>
      <slot name="tooltip" />
    </v-tooltip>
    <div v-if="variant === 'outlined'" :class="`bg-${bgColor}`" class="clip-fix" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-base-chip',
  props: {
    color: {
      type: String,
      required: false,
    },
    bgColor: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
      default: 'small',
    },
    variant: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    hasTooltipContent() {
      const slot = this.$slots['tooltip'];
      if (slot && slot()[0] && slot()[0].children) {
        return (slot()[0].children as any).length > 0;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.chip-interactive {
  clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
  cursor: pointer;
}

.chip-readonly {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%);

  cursor: default;
}

.clip-fix {
  position: absolute;
  width: 9px;
  height: 1px;
  background-color: rgba(126, 126, 126, 0.3);
  bottom: 3px;
  right: 0px;
  transform: rotate(-45deg);
}
</style>
