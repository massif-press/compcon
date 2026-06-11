<template>
  <v-col v-if="controller.CanActivate('protocol')"
    cols="auto">
    <v-chip color="protocol"
      class="ml-2"
      :size="large ? 'large' : 'small'"
      :tile="large"
      prepend-icon="cc:protocol"
      variant="flat">
      {{ $t('active.actionChips.protocol') }}
    </v-chip>
  </v-col>
  <v-col v-if="controller.CanActivate('full')"
    cols="auto">
    <v-chip color="action--full"
      prepend-icon="mdi-hexagon-slice-6"
      class="ml-2"
      :size="large ? 'large' : 'small'"
      :tile="large"
      variant="flat">
      {{ $t('active.actionChips.fullAction') }}
    </v-chip>
  </v-col>
  <v-col v-else-if="controller.CanActivate('quick')"
    cols="auto">
    <v-chip color="action--quick"
      prepend-icon="mdi-hexagon-slice-3"
      class="ml-2"
      :size="large ? 'large' : 'small'"
      :tile="large"
      variant="flat">
      {{ $t('active.actionChips.quickAction') }}
    </v-chip>
  </v-col>
</template>

<script setup lang="ts">
import type { CombatController } from '@/classes/components/combat/CombatController'

defineOptions({ name: 'EndRoundActionChips' })

defineProps<{
  controller: CombatController
  large?: boolean
}>()
</script>
