<template>
  <v-row dense class="mb-1">
    <v-col cols="auto">
      <cc-tooltip simple inline content="Feature In Development">
        <v-icon color="grey lighten-1" class="mt-2">mdi-dice-multiple</v-icon>
      </cc-tooltip>
    </v-col>
    <v-col cols="11" class="pr-6">
      <v-btn outlined large block color="secondary" @click="$refs.dialog.show()">
        <slot />
      </v-btn>
    </v-col>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      :title="label"
      @confirm="save"
    >
      <v-textarea v-model="text" outlined class="mt-6" />
    </cc-solo-dialog>
  </v-row>
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