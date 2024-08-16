<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="fullscreen"
    :width="fullscreen ? '' : small ? '30vw' : large ? '85vw' : '50vw'"
    :style="fullscreen ? `x-overflow: hidden` : ''">
    <v-card tile>
      <cc-titlebar
        :clipped="!noTitleClip"
        :icon="icon"
        :color="color"
        :density="density"
        :fixed="fullscreen">
        <template #title>
          {{ title }}
        </template>
        <template #title-items>
          <v-btn icon variant="plain" @click="hide">
            <v-icon size="40" icon="mdi-close" />
          </v-btn>
        </template>
      </cc-titlebar>

      <div :style="fullscreen ? 'margin-top: 40px' : ''">
        <slot />
      </div>
      <div v-if="!noActions">
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
    noPad: {
      type: Boolean,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    dense() {
      return this.density === 'dense';
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
