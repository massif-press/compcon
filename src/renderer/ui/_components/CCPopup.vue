<template>
  <div>
    <v-bottom-sheet v-model="dialog">
      <template v-slot:activator="{ on }">
        <v-btn v-if="flat" flat v-on="on">
          <slot name="button"></slot>
        </v-btn>
        <cc-btn v-else v-on="on">
          <slot name="button"></slot>
        </cc-btn>
      </template>

      <v-sheet>
        <cc-titlebar>
          <slot name="title"></slot>
          <template v-slot:items>
              <v-btn text dark @click="dialog=false"><v-icon x-large>close</v-icon></v-btn>
          </template>
        </cc-titlebar>
        <v-card-text>
          <slot></slot>
        </v-card-text>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-popup',
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
