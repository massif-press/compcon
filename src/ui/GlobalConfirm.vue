<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar dark :color="options.color" dense flat>
        <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4">{{ message }}</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="accent darken-1" text @click.native="agree">Yes</v-btn>
        <v-btn color="grey" text @click.native="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class CCConfirmDialog extends Vue {
  private dialog = false
  private resolve = null
  private reject = null
  private message = null
  private title = null

  private options = {
    color: 'primary',
    width: 500,
    zIndex: 200,
  }

  open(
    title: string,
    message: string,
    options: {
      color?: string
      width?: number
      zIndex?: number
    } = {}
  ) {
    this.dialog = true
    this.title = title
    this.message = message
    this.options = Object.assign({}, this.options, options)
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  agree() {
    this.resolve(true)
    this.dialog = false
  }

  cancel() {
    this.resolve(false)
    this.dialog = false
  }
}
</script>
