<template>
  <slot name="activator" v-bind="{ modal, open, close }"></slot>

  <v-dialog
    v-model="modal"
    :id="id"
    :fullscreen="fullscreen || mobile"
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
      :style="clip ? 'overflow: clip' : ''"
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
      <v-card-text class="pa-0" :class="!mobile && !tabs ? 'px-4' : ''">
        <slot v-bind="{ modal, close }" />
      </v-card-text>

      <div v-if="cancelAction || confirmAction">
        <v-divider />
        <v-card-actions style="min-height: 36px !important; height: 36px !important">
          <v-btn
            v-if="cancelAction"
            @click="
              $emit('cancel');
              modal = false;
            "
            color="error"
            text>
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="confirmAction"
            @click="
              $emit('confirm');
              modal = false;
            "
            color="primary"
            text>
            Confirm
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { useMobile } from '@/mixins/useMobile';
export default {
  mixins: [useMobile],
  name: 'cc-modal',
  data: () => ({
    modal: false,
  }),
  props: {
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
    cancelAction: {
      type: Boolean,
    },
    confirmAction: {
      type: Boolean,
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
    clip: {
      type: Boolean,
      default: false,
    },
    tabs: {
      type: Boolean,
      default: false,
    },
    id: { type: String },
    fullscreen: { type: Boolean, default: false },
    noConfirm: { type: Boolean, default: false },
    class: { type: [String, Array, Object] },
    modelValue: { type: Boolean },
    minWidth: { type: [String, Number] },
  },
  emits: ['cancel', 'confirm'],
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
