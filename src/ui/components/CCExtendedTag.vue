<template>
  <span v-if="tag.err">ERR: {{ tag.err.toUpperCase() }}</span>
  <cc-alert
    v-show="!tag.IsHidden"
    icon="mdi-label"
    :color="tag.isExotic ? 'exotic' : color"
    density="compact"
    :title="tag.GetName(bonus)"
    class="my-1">
    <div class="text-text" v-html="tag.GetDescription(bonus)" />
  </cc-alert>
</template>

<script lang="ts">
export default {
  name: 'CCExtendedTag',
  props: {
    tag: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>
