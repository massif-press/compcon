<template>
  <v-dialog v-model="dialog" :width="small ? '30vw' : large ? '80vw' : '50vw'">
    <v-card tile>
      <cc-titlebar :icon="icon" :color="color">{{ title }}</cc-titlebar>

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions v-if="noConfirm">
        <v-spacer />
        <v-btn text @click="dialog = false">dismiss</v-btn>
      </v-card-actions>
      <v-card-actions v-else>
        <v-btn text @click="dialog = false">cancel</v-btn>
        <v-spacer />
        <cc-btn @click="$emit('confirm')">confirm</cc-btn>
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
    noConfirm: {
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
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    show() {
      this.dialog = true
    },
  },
})
</script>
