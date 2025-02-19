<template>
  <v-toolbar flat density="compact" :color="color" class="ma-0 pa-0 parent">
    <v-toolbar-title class="mt-n1">
      <span class="text-cc-overline">
        <v-icon v-if="icon" :icon="icon" start style="padding-bottom: 2px" />
        <span v-text="title" />
      </span>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <slot name="toolbar-items" />
      <v-icon v-if="!hideClose" class="fade-select mr-1" @click="$emit('close')">mdi-close</v-icon>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
export default {
  name: 'cc-title',
  props: {
    color: { type: String, default: 'primary' },
    title: { type: String, default: '' },
    icon: { type: String },
    hideClose: { type: Boolean },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style scoped>
.parent:deep(.v-toolbar__content) {
  height: fit-content !important;
}
</style>
