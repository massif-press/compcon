<template>
  <v-bottom-navigation fixed grow horizontal color="primary" class="no-print">
    <v-btn @click="$router.go(-1)">
      <span>Close Preview</span>
      <v-icon icon="mdi-close" />
    </v-btn>
    <v-spacer />
    <v-btn @click="($refs as any).options.show()">
      <span>Options</span>
      <v-icon icon="mdi-cog" />
    </v-btn>
    <options-dialog ref="options" @set="setOptions($event)" />
    <v-btn @click="print()">
      <span>Print</span>
      <v-icon icon="print" />
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import OptionsDialog from './OptionsDialog.vue';

export default {
  name: 'print-footer',
  components: { OptionsDialog },
  methods: {
    print() {
      window.print();
    },
    setOptions(options) {
      console.log(options);
    },
  },
};
</script>
