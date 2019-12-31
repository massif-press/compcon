<template>
  <div>
    <v-dialog v-model="dialog" :width="small ? '30vw' : large ? '80vw' : '50vw'">
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="flat"
          :small="smallBtn"
          :large="large"
          :color="color"
          text
          :dark="dark"
          v-on="on"
        >
          <slot name="button"></slot>
        </v-btn>
        <cc-btn v-else :small="smallBtn" :large="large" :color="color" v-on="on">
          <slot name="button"></slot>
        </cc-btn>
      </template>

      <v-card tile>
        <cc-titlebar :color="color">
          <slot name="title"></slot>
          <slot slot="items" name="title-items"></slot>
        </cc-titlebar>

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
          <cc-btn @click="confirm">confirm</cc-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-dialog',
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    small: {
      type: Boolean,
      required: false,
    },
    smallBtn: {
      type: Boolean,
    },
    large: {
      type: Boolean,
      required: false,
    },
    flat: {
      type: Boolean,
      required: false,
    },
    dark: {
      type: Boolean,
      required: false,
    },
    noConfirm: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    confirm() {
      this.dialog = false
      this.$emit('confirm')
    },
  },
})
</script>
