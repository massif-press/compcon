<template>
  <v-dialog v-model="dialog" width="75vw">
    <cc-confirmation
      :content="
        `Lancer, please confirm deletion of Pilot Registration Information for:
          <span class='accent--text'>
            ${pilot.Callsign} (${pilot.Name}, LL${pilot.Level})
          </span>`
      "
      @confirm="remove()"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'delete-pilot-dialog',
  props: {
    pilot: {
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
    remove() {
      this.$emit('delete')
      this.hide()
    },
  },
})
</script>
