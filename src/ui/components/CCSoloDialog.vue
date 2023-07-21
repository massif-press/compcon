<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="fullscreen || $vuetify.display.mdAndDown"
    :width="fullscreen ? '' : small ? '30vw' : large ? '85vw' : '50vw'"
    :style="fullscreen || $vuetify.display.mdAndDown ? `x-overflow: hidden` : ''"
  >
    <v-card tile>
      <cc-titlebar :clipped="!noTitleClip" large :icon="icon" :color="color" :fixed="fullscreen">
        <template #title>
          {{ title }}
        </template>
        <template #title-items>
          <v-btn icon variant="plain" @click="hide">
            <v-icon size="40" icon="mdi-close" />
          </v-btn>
        </template>
      </cc-titlebar>

      <div :style="fullscreen ? 'margin-top: 64px' : ''">
        <slot />
      </div>
      <div v-if="!noActions">
        <v-divider />

        <v-card-actions v-if="noConfirm">
          <v-spacer />
          <v-btn @click="hide">dismiss</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-btn @click="hide">cancel</v-btn>
          <v-spacer />
          <cc-btn @click="confirm">confirm</cc-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'CCSoloDialog',
  emits: ['confirm', 'close'],
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
    small: {
      type: Boolean,
      required: false,
    },
    large: {
      type: Boolean,
      required: false,
    },
    fullscreen: {
      type: Boolean,
      required: false,
    },
    noConfirm: {
      type: Boolean,
      required: false,
    },
    noActions: {
      type: Boolean,
      required: false,
    },
    noTitleClip: {
      type: Boolean,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    noPad: {
      type: Boolean,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    confirm() {
      this.$emit('confirm');
      this.dialog = false;
    },
    show() {
      this.dialog = true;
    },
    hide() {
      this.$emit('close');
      this.dialog = false;
    },
  },
};
</script>
