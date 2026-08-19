<template>
  <v-window-item>
    <v-card-title
      v-html-safe="title"
      primary-title
      class="heading h2"
    />
    <v-card-text class="text-center flavor-text">
      <p
        v-if="content"
        v-html-safe="content"
        class="flavor-text"
      />
      <slot />
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="warning"
        @click="$emit('dismiss')"
      >
        {{ $t('common.dismiss') }}
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="!hidePrevious"
        text
        color="secondary"
        @click="$emit('previous')"
      >
        {{ $t('ui.table.previous') }}
      </v-btn>
      <slot
        v-if="otherBtn"
        name="confirm-button"
      />
      <v-btn
        v-else
        color="primary"
        large
        :disabled="disabled"
        @click="$emit('confirm')"
      >
        {{ $t('common.confirm') }}
      </v-btn>
    </v-card-actions>
  </v-window-item>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      title: string
      content?: string
      disabled?: boolean
      otherBtn?: boolean
      hidePrevious?: boolean
    }>(),
    {
      content: '',
    }
  )
</script>
