<template>
  <v-card flat
    tile
    :max-width="fullWidth ? '' : '600px'">
    <v-card-text class="pa-2 flavor-text">
      <span class="text-cc-overline">{{ $t('ui.confirm.heading') }}</span>
      <br />
      <span v-if="!noCc"
        style="opacity: 0.4">>>{{ $t('common.appName') }}//&nbsp;</span>
      <span v-html-safe="content" />
      <v-divider class="my-2" />
      <v-card-actions class="my-n3">
        <cc-button v-if="cancellable"
          size="small"
          variant="text"
          color="error"
          @click="emit('cancel')">
          {{ $t('common.cancel') }}
        </cc-button>
        <v-spacer />
        <cc-button size="small"
          color="primary"
          @click="emit('confirm')">{{ $t('common.confirm') }}</cc-button>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  content: string;
  noCc?: boolean;
  cancellable?: boolean;
  fullWidth?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>
