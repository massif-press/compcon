<template>
  <div
    :class="[block ? '' : 'clip', offset && 'offset', `bg-${color}`]"
    style="height: fit-content"
    :style="`width: ${block ? '100%' : 'max-content'};`">
    <div class="pl-2 pr-8 heading">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCTitle',
  props: {
    block: {
      type: Boolean,
    },
    size: {
      type: String,
      required: false,
      default: '',
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    offset: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>

<style scoped>
.clip {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%);
}

.offset {
  padding-left: 600px !important;
  margin-left: -600px !important;
}
</style>
