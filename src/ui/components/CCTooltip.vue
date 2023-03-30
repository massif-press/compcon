<template>
  <v-tooltip
    :top="isTop"
    :bottom="bottom"
    :left="left"
    :right="right"
    content-class="cc-tooltip"
    :open-delay="delayed ? 500 : 150"
  >
    <template v-slot:activator="{ props }">
      <div :class="{ 'd-inline': inline }" v-bind="props">
        <slot />
      </div>
    </template>
    <span v-if="err">
      Unable to load tooltip information. This may be due to malformed data or
      an unloaded content package.
    </span>
    <div v-else>
      <div v-if="simple">
        <p class="body-text text-stark mb-0" v-html="content" />
      </div>
      <div v-else>
        <span v-if="title" class="heading h3 text-stark">{{ title }}</span>
        <v-divider v-if="title" class="my-1" />
        <p class="body-text text-stark pb-0 mb-0" v-html="content" />
      </div>
    </div>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'CCTooltip',
  props: {
    err: {
      type: String,
      required: false,
      default: '',
    },
    simple: {
      type: Boolean,
      required: false,
    },
    top: {
      type: Boolean,
      required: false,
    },
    bottom: {
      type: Boolean,
      required: false,
    },
    left: {
      type: Boolean,
      required: false,
    },
    right: {
      type: Boolean,
      required: false,
    },
    inline: {
      type: Boolean,
      required: false,
    },
    delayed: {
      type: Boolean,
      required: false,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
  },
  computed: {
    isTop(): boolean {
      if (this.top) return true;
      return !this.bottom && !this.left && !this.right;
    },
  },
};
</script>

<style scoped>
.cc-tooltip {
  background: rgb(var(--v-theme-tooltip)) !important;
  background-color: rgb(var(--v-theme-tooltip)) !important;
  opacity: 1 !important;
  max-width: 50vw;
  border: 1px rgb(var(--v-theme-active)) solid;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
