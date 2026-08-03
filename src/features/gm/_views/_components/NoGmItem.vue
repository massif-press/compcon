<template>
  <v-row style="height: 85vh">
    <v-col cols="auto" class="mx-auto text-center my-auto text-disabled">
      <div v-if="!canAddNpc">
        <v-icon size="100" class="">mdi-book-off-outline</v-icon>
        <div class="heading h4">{{ $t('gm.noItem.missingContent') }}</div>
        <cc-missing-gm-lcp-text />
      </div>
      <div v-else>
        <v-icon size="100" class="mb-2">mdi-square-off-outline</v-icon>
        <div class="heading h4 mb-4">{{ $t('gm.noItem.noItemSelected') }}</div>
        <cc-button
          v-if="showCreateButton"
          color="primary"
          size="large"
          prepend-icon="mdi-account-plus"
          class="mt-2 text-none px-6"
          @click="$emit('add-new')">
          <span>{{ customLabel || (itemType ? $t('gm.split.createNewType', { type: itemType }) : $t('common.add')) }}</span>
        </cc-button>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CompendiumStore } from '@/stores';

defineOptions({ name: 'no-gm-item' })

withDefaults(
  defineProps<{
    itemType?: string
    customLabel?: string
    showCreateButton?: boolean
  }>(),
  {
    itemType: undefined,
    customLabel: undefined,
    showCreateButton: true
  }
)

defineEmits<{
  'add-new': []
}>()

const canAddNpc = computed(() => {
  return CompendiumStore().hasNpcAccess;
})
</script>
