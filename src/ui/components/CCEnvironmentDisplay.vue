<template>
  <fieldset
    class="pb-2 px-2"
    style="border-radius: 4px; border: 1px solid rgb(var(--v-theme-panel))">
    <legend class="text-overline ml-3">
      <v-chip variant="outlined" size="small" style="border-color: rgb(var(--v-theme-panel))">
        <span class="text-disabled">{{ $t('ui.widget.environment') }}</span>
        <cc-slashes class="mx-1" />
        <b class="text-accent">{{ environment.Name }}</b>
      </v-chip>
    </legend>
    <div v-if="environment.Description">
      <div class="text-caption"><b class="text-accent">{{ $t('common.description') }}</b></div>
      <v-divider style="width: 150px" />
      {{ environment.Description }}
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import type { Environment } from '@/classes/Environment'
const props = defineProps<{
  environment: Environment
}>()
</script>
