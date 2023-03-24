<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="fullscreen || $vuetify.display.mdAndDown"
    :width="small ? '30vw' : large ? '85vw' : '50vw'"
    :style="
      fullscreen || $vuetify.display.mdAndDown ? `x-overflow: hidden` : ''
    "
  >
    <v-card tile class="background">
      <cc-titlebar
        :clipped="!noTitleClip"
        large
        :icon="icon"
        :color="color"
        :fixed="fullscreen"
      >
        {{ title }}
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="fullscreen" class="titlebar-margin" />

      <v-card-text
        :style="
          noPad || $vuetify.display.mdAndDown ? 'padding: 0!important' : ''
        "
      >
        <slot />
      </v-card-text>
      <div v-if="!noActions">
        <v-divider></v-divider>

        <v-card-actions v-if="noConfirm">
          <v-spacer />
          <v-btn text @click="hide">dismiss</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-btn text @click="hide">cancel</v-btn>
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
    noPad: {
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
  methods: {
    confirm() {
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

<style scoped>
.titlebar-margin {
  padding-top: 60px;
}
</style>
