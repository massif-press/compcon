<template>
  <v-bottom-navigation fixed grow horizontal color="primary" class="no-print">
    <v-btn @click="$router.go(-1)">
      <span>Close Preview</span>
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-spacer />
    <v-btn disabled>
      <span>Options</span>
      <v-icon>mdi-settings</v-icon>
    </v-btn>

    <v-btn @click="print()">
      <span>Print</span>
      <v-icon>print</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'print-footer',
  methods: {
    print() {
      window.print()
    },
  },
})
</script>
