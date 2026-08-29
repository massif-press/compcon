<template>
  <v-chip
    class="ma-1"
    size="small"
    closable
    :model-value="true"
    :style="item ? 'cursor: pointer' : undefined"
    @update:model-value="() => {}"
    @click="item && browser?.revealItem(item)"
    @click:close="$emit('remove')"
  >
    <slot />
    <template #close>
      <v-icon
        size="small"
        color="error"
        icon="mdi-minus-circle-outline"
      />
    </template>
  </v-chip>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import { CompendiumBrowserKey } from '@/ui/components/CompendiumBrowser/browserContext'

  defineProps<{ item?: any }>()
  defineEmits<{ remove: [] }>()

  const browser = inject(CompendiumBrowserKey, null)
</script>
