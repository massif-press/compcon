<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="fullscreen"
    :width="small ? '30vw' : large ? '80vw' : '50vw'"
    :style="fullscreen ? `x-overflow: hidden` : ''"
  >
    <v-card tile class="background">
      <cc-titlebar :clipped="!noTitleClip" large :icon="icon" :color="color" :fixed="fullscreen">
        {{ title }}
        <v-btn slot="items" dark icon @click="dialog = false">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="fullscreen" class="titlebar-margin" />

      <v-card-text :style="noPad ? 'padding: 0!important' : ''">
        <slot />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions v-if="noConfirm">
        <v-spacer />
        <v-btn text @click="dialog = false">dismiss</v-btn>
      </v-card-actions>
      <v-card-actions v-else>
        <v-btn text @click="dialog = false">cancel</v-btn>
        <v-spacer />
        <cc-btn @click="confirm">confirm</cc-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-solo-dialog',
  props: {
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
      required: true,
    },
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
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    confirm() {
      this.$emit('confirm')
      this.dialog = false
    },
    show() {
      this.dialog = true
    },
    hide() {
      this.dialog = false
    },
  },
})
</script>

<style scoped>
.titlebar-margin {
  padding-top: 60px;
}
</style>