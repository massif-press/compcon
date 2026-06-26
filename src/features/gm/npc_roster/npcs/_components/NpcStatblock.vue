<template>
  <v-card-text>
    <div class="text-right mb-2">
      <cc-switch v-model="includeFeatureDetails"
        :label="$t('common.includeFeatureDetails')"
        color="primary" />
    </div>

    <v-textarea :value="statblock"
      auto-grow
      readonly
      rows="20"
      hide-details
      variant="outlined"
      class="flavor-text" />
    <div class="text-right my-4">
      <cc-button prepend-icon="mdi-clipboard-text-outline"
        color="accent"
        @click="copy()">
        {{ $t('common.copyToClipboard') }}
      </cc-button>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
const t = i18n.global.t
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { Unit } from '@/classes/npc/unit/Unit';
import Statblock from '@/classes/Statblock';

const props = defineProps<{
  item: Unit
}>()

const includeFeatureDetails = ref(false)

const statblock = computed(() => {
  return Statblock.GenerateNPC(props.item, false, includeFeatureDetails.value);
})

function copy() {
  navigator.clipboard
    .writeText(statblock.value)
    .then(() =>
      notify({
        title: t('notify.statblock.copiedTitle'),
        text: t('notify.statblock.copiedText'),
        icon: 'mdi-clipboard-text-outline',
      })
    )
    .catch(() =>
      notify({
        title: t('notify.common.error'),
        text: t('notify.statblock.errorText'),
        icon: 'mdi-clipboard-text-outline', color: 'error',
      })
    );
}
</script>
