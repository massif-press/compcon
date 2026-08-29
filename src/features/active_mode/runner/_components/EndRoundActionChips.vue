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
      {{ $t('compendium.reference.fullAction') }}
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
  <v-col v-for="use in partialUses"
    :key="use.id"
    cols="auto">
    <v-chip color="text"
      prepend-icon="mdi-hexagon-multiple-outline"
      class="ml-2"
      :size="large ? 'large' : 'small'"
      :tile="large"
      variant="flat">
      {{ use.name }} {{ use.remaining }}/{{ use.max }}
    </v-chip>
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CombatController } from '@/classes/components/combat/CombatController'

const props = defineProps<{
  controller: CombatController
  large?: boolean
}>()

const partialUses = computed(() =>
  Object.entries(props.controller.ActionPoolController.ActionUses)
    .filter(([, record]) => record.max > 1 && record.used < record.max)
    .map(([id, record]) => ({
      id,
      name: props.controller.FindAction(id)?.Name || id,
      remaining: record.max - record.used,
      max: record.max,
    }))
)
</script>
