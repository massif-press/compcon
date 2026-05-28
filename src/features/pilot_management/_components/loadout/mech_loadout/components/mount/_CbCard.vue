<template>
  <cc-panel class="mt-1 mb-2" :title="bonus.Name" icon="cc:corebonus" title-color="secondary">
    <div class="text-disabled" :class="mobile ? 'text-cc-overline' : 'flavor-text'">
      {{ bonus.MountedEffect }}
    </div>
  </cc-panel>
</template>

<script setup lang="ts">
import { useMobile } from '@/composables/useMobile'

const props = defineProps({
    bonus: {
      type: Object,
      required: true,
    },
  })

const { mobile, portrait } = useMobile()
</script>
