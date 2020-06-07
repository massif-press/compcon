<template>
  <v-col sm="6" lg="2" class="effect-text text-center text-capitalize">
    {{ action }}
    <br />
    <v-card tile :color="`action--${action}`" class="pt-4 pb-4">
      <v-icon size="100" dark>{{ icon }}</v-icon>
    </v-card>
  </v-col>
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
    icon: {
      type: String,
      required: true,
    },
  },
})
</script>
