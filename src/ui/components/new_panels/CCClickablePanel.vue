<template>
  <div class="top-element" style="position: relative">
    <div :class="`${disabled && 'disabled'} light bg-${titleColor}`" />
    <v-card
      class="parent cc-panel-clip"
      :color="color"
      flat
      tile
      :border="border"
      :height="height"
      style="clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)"
      @click.stop="$emit('click', $event)">
      <slot name="toolbar" />
      <v-toolbar
        v-if="hasTitle"
        flat
        density="compact"
        :color="titleColor"
        class="ma-0 pa-0 pl-1 pt-1"
        style="clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)">
        <div class="mt-n1 px-2 pt-2 pb-1">
          <div class="text-cc-overline">
            <v-icon v-if="icon" :icon="icon" start class="mt-n1" />
            <span v-if="title" v-text="title" />
            <slot v-else-if="$slots.title" name="title" />
          </div>
        </div>
        <v-spacer />
        <v-toolbar-items>
          <slot name="toolbar-items" />
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text
        :class="[densityClass, variantClass]"
        :style="height && `height: ${height}`"
        style="opacity: 0.8; overflow-y: scroll">
        <slot>Default Content</slot>
      </v-card-text>
      <div v-if="border" class="clip-fix" />
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'cc-clickable-panel',
  props: {
    color: {
      type: String,
      default: 'light-panel',
    },
    titleColor: {
      type: String,
      default: 'panel',
    },
    border: {
      type: Boolean,
      default: false,
    },
    density: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    height: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  computed: {
    hasTitle() {
      return this.$slots.title || this.title || this.icon || this.$slots['toolbar-items'];
    },
    densityClass() {
      switch (this.density) {
        case 'no-gutters':
          return 'pa-0';
        case 'compact':
          return 'pa-2';
        case 'comfortable':
          return 'py-3 px-8';
        default:
          return 'py-2 px-5';
      }
    },
    variantClass() {
      switch (this.variant) {
        case 'flavor':
          return 'text-cc-flavor';
        case 'fluff':
          return 'text-cc-fluff';
        case 'admin':
          return 'text-cc-overline';
        case 'emphasis':
          return 'text-cc-emphasis';
        case 'subtle':
          return 'text-cc-subtle';
        case 'effect':
          return 'text-cc-effect';
        default:
          return '';
      }
    },
  },
};
</script>

<style scoped>
.cc-panel-clip {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%);
}

.clip-fix {
  position: absolute;
  width: 38px;
  height: 2px;
  background-color: rgba(126, 126, 126, 0.3);
  transform-origin: 10 0;
  bottom: 8px;
  right: -6px;
  transform: rotate(-45deg);
}

.parent:deep(.v-toolbar__content) {
  height: fit-content !important;
}

.disabled {
  filter: grayscale(100%);
  opacity: 0.4 !important;
}

.light {
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}
</style>
