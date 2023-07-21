<template>
  <cc-title small color="pilot" :class="editable ? '' : 'py-2 pl-10'">
    <section-edit-icon v-if="editable" :label="tooltip" @open-selector="$emit('edit')" />
    <slot />
    <span>{{ title }}</span>
  </cc-title>
</template>

<script lang="ts">
import SectionEditIcon from './SectionEditIcon.vue';

export default {
  name: 'section-header',
  components: { SectionEditIcon },
  emits: ['edit'],
  props: {
    editable: {
      type: Boolean,
    },
    tooltip: {
      type: String,
      required: false,
      default: 'Edit',
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
