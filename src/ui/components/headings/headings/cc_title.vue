<template>
  <div v-if="small" class="text-cc-overline font-weight-bold">
    {{ text }}
    <cc-tooltip v-if="tooltip.length > 0" :text="tooltip" small />
  </div>
  <component :is="mobile ? 'h4' : 'h3'" v-else :class="`heading text-${textColor}`">
    {{ text }}
    <cc-tooltip v-if="tooltip.length > 0" :text="tooltip" small />
  </component>
</template>

<script lang="ts">
export default {
  name: 'cc-title',
  props: {
    textColor: { type: String, default: 'accent' },
    text: { type: String, default: '' },
    small: { type: Boolean, default: false },
    tooltip: { type: String, default: '' },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
