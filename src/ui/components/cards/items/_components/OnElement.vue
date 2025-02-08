<template>
  <cc-panel
    v-if="profile[`On${capitalizeAction}`]"
    density="compact"
    icon="cc:weapon"
    class="my-1"
    :title="`On ${namedAction}`">
    <div v-html-safe="profile[`On${capitalizeAction}`]" />
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'ProfileOnElement',
  props: {
    profile: {
      type: Object,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  computed: {
    capitalizeAction() {
      return this.action.charAt(0).toUpperCase() + this.action.slice(1);
    },
    namedAction() {
      return this.action === 'crit' ? 'critical hit' : this.action;
    },
  },
};
</script>
