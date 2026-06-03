<template>
  <div style="position: absolute; bottom: 10px; right: 11px">
    <v-tooltip location="top"
      open-delay="300">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          size="25"
          flat
          tile
          variant="outlined"
          class="fade-select"
          color="secondary"
          @click="copyToClipboard">
          <v-icon icon="mdi-share-variant" />
        </v-btn>
      </template>
      <span>Copy link</span>
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCompendiumData } from '@/ui/providers'
import { notify } from '@/util/notify'

const props = defineProps<{ item: Record<string, any> }>()

const compendium = useCompendiumData()
const link = computed(() => compendium.referenceLink(props.item as any))

function copyToClipboard() {
  navigator.clipboard.writeText(encodeURI(link.value))
  notify({
    type: 'success',
    title: 'Link Copied',
    text: `${props.item.Name} static link has been copied to the clipboard.`,
  })
}
</script>
