<template>
  <v-flex xs2 class="effect-text text-center text-capitalize ml-2 mr-2">
    {{ action }}
    <br />
    <v-card tile :color="`action-${action}`" class="pt-4 pb-4">
      <v-icon size="100" dark>$vuetify.icons.{{ action }}</v-icon>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-type-card',
  props: {
    action: {
      type: String,
      required: true,
    },
  },
})
</script>
