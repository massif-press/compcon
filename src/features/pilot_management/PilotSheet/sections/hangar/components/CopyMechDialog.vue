<template>
  <v-dialog v-model="dialog" width="75vw">
    <cc-confirmation
      :content="
        `Lancer, please confirm intention to create a duplicate of Mech Configuration:
          <span class='accent--text'>
            ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
          </span>`
      "
      @confirm="dupe()"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'copy-mech-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    show() {
      this.dialog = true
    },
    hide() {
      this.dialog = false
    },
    dupe() {
      this.$emit('copy')
      this.hide()
    },
  },
})
</script>
