<template>
  <div>
    <slot name="activator" @click="activate"></slot>
    <v-dialog v-model="display" width="80vw">
      <v-card>
        <v-card-title class="title">{{ title }}</v-card-title>
        <slot name="modal-content"></slot>
        <v-divider />
        <v-card-actions>
          <v-btn color="primary" flat @click="cancel">Cancel</v-btn>
          <v-spacer />
          <v-btn
            v-if="!hideConfirm"
            :color="acceptColor ? acceptColor : 'primary'"
            @click="accept"
            :disabled="disableCondition"
          >
            {{ acceptString || 'Confirm' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'lazy-dialog',
  props: {
    model: Boolean,
    title: String,
    acceptString: String,
    acceptColor: String,
    hideConfirm: Boolean,
    disableCondition: Boolean,
  },
  data: () => ({
    display: false,
    loader: false,
  }),
  methods: {
    activate() {
      this.$emit('activate')
      this.loader = true
    },
    cancel() {
      this.$emit('cancel')
      this.loader = false
    },
    accept() {
      this.$emit('accept'), (this.loader = false)
    },
  },
  watch: {
    model (val) {
      if (val) {
        this.display = true
      }
    },
    display (val) {
      if (!val) {
        this.cancel()
      }
    },
  },
})
</script>
