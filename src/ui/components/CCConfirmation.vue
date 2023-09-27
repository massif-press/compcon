<template>
  <v-card>
    <v-card-text class="text-center flavor-text">
      <span class="text-overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
      <br />
      <span v-if="!noCc">//[COMP/CON:</span>
      <b class="text-stark" v-html="content" />
      <span v-if="!noCc">]</span>
      <v-divider class="my-2" />
      <v-row justify="end">
        <v-col cols="auto">
          <v-btn size="small" color="error" class="ml-auto" @click="$emit('confirm')"
            >CONFIRM</v-btn
          >
        </v-col>
      </v-row>
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
  },
};
</script>
