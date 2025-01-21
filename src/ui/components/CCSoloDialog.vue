<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="isFullscreen"
    :width="isFullscreen ? '' : small ? '30vw' : large ? '85vw' : '50vw'"
    :height="isFullscreen ? '' : small ? '30vh' : large ? '85vh' : '50vh'"
    :style="isFullscreen ? `x-overflow: hidden` : ''">
    <v-card tile :height="isFullscreen ? '' : small ? '30vh' : large ? '85vh' : '50vh'">
      <cc-titlebar :clipped="!noTitleClip" :icon="icon" :color="color" :density="density" fixed>
        <template #title>
          {{ title }}
        </template>
        <template #title-items>
          <v-btn icon variant="plain" @click="hide">
            <v-icon size="40" icon="mdi-close" />
          </v-btn>
        </template>
      </cc-titlebar>

      <div style="margin-top: 50px">
        <slot />
      </div>
      <div v-if="!hideActions">
        <v-divider />

        <v-card-actions v-if="noConfirm">
          <v-spacer />
          <v-btn @click="hide">dismiss</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-btn variant="plain" @click="hide">cancel</v-btn>
          <v-spacer />
          <v-btn color="accent" variant="tonal" @click="confirm">confirm</v-btn>
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
    density: {
      type: String,
      required: false,
      default: 'compact',
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
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    dense() {
      return this.density === 'dense';
    },
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    isFullscreen() {
      return this.fullscreen || this.mobile;
    },
    hideActions() {
      return this.noActions || (this.noConfirm && this.mobile);
    },
  },
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
