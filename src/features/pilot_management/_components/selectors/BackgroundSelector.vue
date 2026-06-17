<template>
  <cc-modal id="bs-dialog"
    ref="dialog"
    fullscreen
    no-confirm
    :title="$t('pm.titles.selectPilotBackground')"
    clip>
    <template #activator="{ open }">
      <v-icon :small="small"
        color="accent"
        variant="plain"
        class="ml-1"
        @click="open">
        cc:orbit
      </v-icon>
    </template>
    <template #default="{ close }">
      <cc-compendium-browser :items="backgrounds"
        item-type="Background"
        :options="options"
        view-key="sel-background"
        equippable
        @equip="setBg($event.Name, close)">
        <template #header>
          <div class="heading h4 text-center text-accent">{{ $t('pm.selectors.selectPilotBackground') }}</div>
        </template>
      </cc-compendium-browser>
    </template>
  </cc-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CompendiumStore } from '@/stores'

defineProps<{ small?: boolean }>()

const emit = defineEmits<{ select: [name: string] }>()

const options = {
  views: ['list', 'table'],
  initialView: 'list',
  groups: ['lcp'],
  initialGroup: 'lcp',
  noSource: true,
}

const backgrounds = computed(() => CompendiumStore().Backgrounds)

function setBg(name: string, close: () => void) {
  emit('select', name)
  close()
}
</script>
