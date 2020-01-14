<template>
  <v-window-item>
    <v-card-title primary-title class="heading h2" v-html="title" />
    <v-card-text class="text-center flavor-text">
      <p v-if="content" class="flavor-text" v-html="content" />
      <slot v-else />
    </v-card-text>
    <v-card-actions>
      <v-btn text color="warning" @click="$emit('dismiss')">dismiss</v-btn>
      <v-spacer />
      <v-btn text color="secondary" @click="$emit('previous')">previous</v-btn>
      <slot v-if="otherBtn" name="confirm-button" />
      <v-btn v-else color="primary" large :disabled="disabled" @click="$emit('confirm')">
        confirm
      </v-btn>
    </v-card-actions>
  </v-window-item>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'table-window-item',
  props: {
    title: { type: String, required: true },
    content: { type: String, required: false, default: '' },
    disabled: { type: Boolean },
    otherBtn: { type: Boolean },
  },
})
</script>
