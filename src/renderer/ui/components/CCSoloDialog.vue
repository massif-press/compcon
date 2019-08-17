<template>
  <div>
    <v-dialog v-model="model" :width="small ? '30vw' : large ? '80vw' : '50vw'">
      <v-card tile>
        <cc-titlebar>
          <slot name="title"></slot>
        </cc-titlebar>

        <v-card-text>
          <slot></slot>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions v-if="noConfirm">
          <v-spacer />
          <v-btn text @click="$emit('cancel')">dismiss</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-btn text @click="$emit('cancel')">cancel</v-btn>
          <v-spacer />
          <cc-btn @click="$emit('confirm')">confirm</cc-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-solo-dialog',
  props: {
    model: {
      type: Boolean,
      required: true,
    },
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
  },
})
</script>
