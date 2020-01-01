<template>
  <v-snackbar
    v-if="model"
    v-model="model.visible"
    top
    :timeout="model.timeout"
    :multi-line="model.multiline"
    :color="model.color"
  >
    {{ model.text }}
    <v-btn text dark @click.native="closeSnackbar">Close</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { Global } from '@/store'

export default Vue.extend({
  name: 'cc-global-snackbar',
  data: () => ({
    module: {},
  }),
  computed: {
    model() {
      return (module as any).snackbar || false
    },
  },
  created() {
    this.module = getModule(Global, this.$store)
  },
  methods: {
    closeSnackbar() {
      getModule(Global, this.$store).closeSnackbar()
    },
  },
})
</script>
