<template>
  <cc-dialog
    v-model="open"
    :title="$t('gm.npcTierSelector.confirmTierChange')"
    icon="mdi-alert"
    min-width="600px"
    :close-on-click="false"
  >
    <div class="heading h3">{{ $t('gm.tier.changeTo', { n: tier }) }}</div>
    <v-card-text>{{ $t('gm.tier.detectedEdits') }}</v-card-text>
    <v-card-actions class="flex-column align-stretch pa-4 ga-2">
      <cc-button
        block
        size="small"
        prepend-icon="mdi-delta"
        color="accent"
        :tooltip="$t('gm.npcTierSelector.tierChangeAdjustEdited')"
        @click="$emit('keep', 'project')"
      >
        {{ $t('gm.tier.projectEdits') }}
      </cc-button>
      <cc-button
        block
        size="small"
        prepend-icon="mdi-pin"
        color="primary"
        :tooltip="$t('gm.npcTierSelector.tierChangeKeepEdited')"
        @click="$emit('keep', 'preserve')"
      >
        {{ $t('gm.tier.preserveEdits') }}
      </cc-button>
      <cc-button
        block
        size="small"
        prepend-icon="mdi-refresh"
        :tooltip="$t('gm.npcTierSelector.tierChangeDiscardEdited')"
        color="warning"
        @click="$emit('keep', 'reset')"
      >
        {{ $t('gm.tier.resetStats') }}
      </cc-button>
      <cc-button
        block
        size="small"
        color="panel"
        @click="open = false"
      >
        {{ $t('common.cancel') }}
      </cc-button>
    </v-card-actions>
  </cc-dialog>
</template>

<script setup lang="ts">
  import type { TierEdits } from '@/classes/npc/tierChange'

  const open = defineModel<boolean>()
  defineProps<{ tier: number }>()
  defineEmits<{ keep: [keep: TierEdits] }>()
</script>
