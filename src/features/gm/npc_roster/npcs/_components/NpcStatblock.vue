<template>
  <v-card-text>
    <div class="text-right mb-2">
      <cc-switch v-model="narrativeElements"
        label="Include Narrative Elements" />
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
        Copy to Clipboard
      </cc-button>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { Unit } from '@/classes/npc/unit/Unit';
import Statblock from '@/classes/Statblock';

defineOptions({ name: 'StatblockDialog' })

const props = defineProps<{
  item: Unit
}>()

const narrativeElements = ref(false)

const statblock = computed(() => {
      return Statblock.GenerateNPC(props.item, narrativeElements.value);
    })

function copy() {
      navigator.clipboard
        .writeText(statblock.value)
        .then(() =>
          notify({
            title: 'Statblock Copied to Clipboard',
            text: 'Copy Success',
            data: { icon: 'mdi-clipboard-text-outline' },
          })
        )
        .catch(() =>
          notify({
            title: 'Error',
            text: 'Unable to copy statblock',
            data: { icon: 'mdi-clipboard-text-outline', color: 'error' },
          })
        );
    }
</script>
