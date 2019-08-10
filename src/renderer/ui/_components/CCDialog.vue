<template>
  <div>
    <v-dialog v-model="dialog" :width="small ? '30vw' : large ? '80vw' : '50vw'">
      <template v-slot:activator="{ on }">
        <v-btn v-if="flat" flat v-on="on">
          <slot name="button"></slot>
        </v-btn>
        <cc-btn v-else v-on="on">
          <slot name="button"></slot>
        </cc-btn>
      </template>

      <v-card tile>
        <cc-titlebar>
          <slot name="title"></slot>
        </cc-titlebar>

        <v-card-text>
          <slot name="content"></slot>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
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
  data: () => ({
    dialog: false,
  }),
  props: {
    small: {
      type: Boolean,
      required: false,
    },
    large: {
      type: Boolean,
      required: false,
    },
    flat: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    confirm() {
      this.dialog = false
      this.$emit('confirm')
    },
  },
})
</script>
