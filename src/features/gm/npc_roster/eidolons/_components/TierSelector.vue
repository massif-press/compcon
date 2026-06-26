<template>
  <div class="text-overline mt-3">{{ $t('gm.eidolonTier.heading') }}</div>
  <v-row dense
    align="center">
    <v-col cols="auto">
      <v-btn v-for="i in 3"
        :key="`tier-${i}`"
        :variant="item.Tier === i ? 'tonal' : 'text'"
        :color="item.Tier === i ? 'accent' : ''"
        class="mx-1"
        @click="updateTier(i)">
        <v-icon start>cc:rank_1</v-icon>
        {{ $t('common.tierN', { n: i }) }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Eidolon } from '@/classes/npc/eidolon/Eidolon'
import { ref } from 'vue'

defineOptions({ name: 'LayerTierSelector' })

const props = defineProps<{
  item: Eidolon
}>()

const emit = defineEmits<{
  'update': []
}>()

const showConfirmation = ref(false)
const changed = ref([] as string[])
const stagedTier = ref(0)

function confirm() {
      showConfirmation.value = false;
      emit('update');
    }
function cancel() {
      changed.value = [];
      stagedTier.value = 0;
      showConfirmation.value = false;
    }
function updateTier(tier: number) {
      props.item.Tier = tier;
      props.item.SaveController.save();
    }
function overwrite() {
      props.item.Tier = stagedTier.value;
      stagedTier.value = 0;
      changed.value = [];
      confirm();
    }
</script>
