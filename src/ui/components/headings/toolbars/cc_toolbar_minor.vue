<template>
  <v-toolbar
    flat
    density="compact"
    :color="color"
    class="ma-0 pa-0 parent"
    :extended="extended"
    :extension-height="extensionHeight">
    <v-toolbar-title style="margin-top: -6px; margin-left: 6px">
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
    <template v-if="extended" #extension>
      <slot name="extension" />
    </template>
  </v-toolbar>
</template>

<script lang="ts">
export default {
  name: 'cc-title',
  props: {
    color: { type: String, default: 'primary' },
    title: { type: String, default: '' },
    icon: { type: String },
    extended: { type: Boolean },
    hideClose: { type: Boolean, default: false },
    extensionHeight: { type: String, default: 'auto' },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    hasExtensionContent() {
      return this._hasContent('extension');
    },
    hexColor() {
      if (this.color[0] === '#') return this.color;
      return this.$vuetify.theme.themes[this.$vuetify.theme.global.name][this.color];
    },
  },
  methods: {
    _hasContent(prop) {
      const slot = this.$slots[prop];
      if (slot && slot()[0] && slot()[0].children) {
        return (slot()[0].children as any).length > 0;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.parent:deep(.v-toolbar__content) {
  height: fit-content !important;
}
</style>
