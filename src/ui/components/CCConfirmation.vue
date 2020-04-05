<template>
  <v-card>
    <v-card-text class="text-center flavor-text">
      <span class="overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
      <br />
      //[COMP/CON:
      <b class="stark--text" v-html="content" />
      ]
      <v-divider class="my-2" />
      <v-row dense>
        <cc-btn small color="error" class="ml-auto" @click="$emit('confirm')">
          CONFIRM
        </cc-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-confirmation',
  props: {
    content: {
      type: String,
      required: true,
    },
  },
})
</script>
