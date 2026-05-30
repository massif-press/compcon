<template>
  <v-window-item>
    <v-card-title primary-title class="heading h2" v-html-safe="title" />
    <v-card-text class="text-center flavor-text">
      <p v-if="content" class="flavor-text" v-html-safe="content" />
      <slot />
    </v-card-text>
    <v-card-actions>
      <v-btn text color="warning" @click="$emit('dismiss')">dismiss</v-btn>
      <v-spacer />
      <v-btn
        v-if="!hidePrevious"
        text
        color="secondary"
        @click="$emit('previous')"
        >previous</v-btn
      >
      <slot v-if="otherBtn" name="confirm-button" />
      <v-btn
        v-else
        color="primary"
        large
        :disabled="disabled"
        @click="$emit('confirm')"
      >
        confirm
      </v-btn>
    </v-card-actions>
  </v-window-item>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  content?: string
  disabled?: boolean
  otherBtn?: boolean
  hidePrevious?: boolean
}>(), {
  content: ''
})
</script>
