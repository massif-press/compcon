<template>
  <v-card>
    <v-card-text class="text-center flavor-text">
      <span class="text-overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
      <br />
      <span v-if="!noCc">//[COMP/CON:</span>
      <b class="text-stark" v-html="content" />
      <span v-if="!noCc">]</span>
      <v-divider class="my-2" />
      <v-card-actions class="my-n2">
        <v-btn v-if="cancellable" @click="$emit('cancel')">CANCEL</v-btn>
        <v-spacer />
        <v-btn color="error" class="ml-auto" @click="$emit('confirm')">CONFIRM</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'cc-confirmation',
  props: {
    content: {
      type: String,
      required: true,
    },
    noCc: { type: Boolean },
    cancellable: { type: Boolean },
  },
  emits: ['confirm', 'cancel'],
};
</script>
