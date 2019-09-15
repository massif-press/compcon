<template>
  <div class="mx-8 mb-1">
    <v-btn outlined large block color="grey darken-3" @click="$refs.dialog.show()">
      <slot />
    </v-btn>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      :title="label"
      @confirm="save"
    >
      <v-textarea v-model="text" outlined class="mt-6" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'text-entry-popup',
  props: {
    label: {
      type: String,
      required: true,
    },
    prepopulate: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    text: '',
  }),
  mounted() {
    if (this.prepopulate) this.text = this.prepopulate
  },
  methods: {
    save() {
      this.$emit('save', this.text)
    },
  },
})
</script>