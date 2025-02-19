<template>
  <v-card flat tile>
    <v-card-text class="pa-0 flavor-text">
      <span class="text-overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
      <br />
      <span v-if="!noCc" style="opacity: 0.4">>>COMP/CON//&nbsp;</span>
      <span v-html="content" />
      <v-divider class="my-2" />
      <v-card-actions class="my-n3">
        <cc-button
          v-if="cancellable"
          size="small"
          variant="text"
          color="error"
          @click="$emit('cancel')">
          CANCEL
        </cc-button>
        <v-spacer />
        <cc-button size="small" color="primary" @click="$emit('confirm')">CONFIRM</cc-button>
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
