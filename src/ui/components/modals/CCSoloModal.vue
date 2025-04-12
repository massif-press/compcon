<template>
  <v-dialog
    v-model="modal"
    :fullscreen="mobile"
    :max-width="mobile ? '100vw' : maxWidth"
    :min-height="mobile ? '100vh' : shrink ? '' : '95vh'"
    :persistent="persistent"
    @keydown.esc="close">
    <v-card
      tile
      flat
      :min-height="mobile ? '100vh' : shrink ? '' : '95vh'"
      :class="!mobile && 'cc-panel-clip'"
      style="position: relative"
      :border="mobile ? false : 'sm'">
      <cc-toolbar
        :title="title"
        :icon="icon"
        :color="color"
        style="position: sticky; top: 0; z-index: 999"
        class="border-b-sm"
        :extended="extended"
        @close="close">
        <template #title>
          <slot name="title" />
        </template>
        <template #toolbar-items>
          <slot name="toolbar-items" />
        </template>
      </cc-toolbar>
      <v-card-text class="pa-0" :class="!mobile && 'px-4'">
        <slot v-bind="{ modal, close }" />
      </v-card-text>
      <div v-if="$slots.actions">
        <v-card-actions></v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'cc-modal',
  data: () => ({
    modal: false,
  }),
  props: {
    modelValue: Boolean,
    title: {
      type: String,
      default: 'Default Title',
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
      default: 'primary',
    },
    maxWidth: {
      type: [String, Number],
      default: '90vw',
    },
    extended: {
      type: Boolean,
      default: false,
    },
    shrink: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close'],
  watch: {
    modelValue: {
      handler(val) {
        this.modal = val;
      },
      immediate: true,
    },
    modal(val) {
      this.$emit('update:modelValue', val);
      if (!val) this.$emit('close');
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    open() {
      this.modal = true;
    },
    close() {
      this.modal = false;
    },
  },
};
</script>
