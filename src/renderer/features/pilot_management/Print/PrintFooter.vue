<template>
  <v-bottom-navigation fixed grow horizontal color="primary" class="no-print">
    <v-btn @click="$router.go(-1)">
      <span>Close Preview</span>
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-spacer />
    <v-btn @click="$refs.options.show()">
      <span>Options</span>
      <v-icon>mdi-settings</v-icon>
    </v-btn>
    <options-dialog ref="options" @set="setOptions($event)" />
    <v-btn @click="print()">
      <span>Print</span>
      <v-icon>print</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue'
import OptionsDialog from './OptionsDialog.vue'

export default Vue.extend({
  name: 'print-footer',
  components: { OptionsDialog },
  methods: {
    print() {
      window.print()
    },
    setOptions(options) {
      console.log(options)
    },
  },
})
</script>
