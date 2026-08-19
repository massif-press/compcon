<template>
  <div class="printable">
    <v-card
      tile
      flat
      class="print-card"
      :style="{ marginLeft: 'auto', marginRight: 'auto', width: previewWidth }"
    >
      <slot />
      <v-bottom-navigation
        fixed
        grow
        horizontal
        color="primary"
        class="no-print pa-2"
      >
        <v-btn
          stacked
          @click="router.go(-1)"
        >
          <span>{{ $t('common.closePreview') }}</span>
          <v-icon icon="mdi-close" />
        </v-btn>
        <slot name="selector" />
        <v-spacer />
        <cc-dialog
          :title="$t('ui.titles.printOptions')"
          :close-on-click="false"
          major
          full-height
          max-width="90vw"
        >
          <template #activator="{ open }">
            <v-btn @click="open">
              <span>{{ $t('common.options') }}</span>
              <v-icon icon="mdi-cog" />
            </v-btn>
          </template>
          <slot name="options-dialog" />
        </cc-dialog>
        <v-btn @click="print()">
          <span>{{ $t('common.print') }}</span>
          <v-icon icon="mdi-printer" />
        </v-btn>
      </v-bottom-navigation>
    </v-card>
    <div
      class="no-print"
      style="min-height: 70px !important"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { PAPER, ORIENTATION } from '@/ui/print/options'
  import type { PrintOption } from '@/ui/print/types'

  const PAGE_STYLE_ID = '__cc-print-page'

  const props = defineProps<{
    options?: { paper?: PrintOption; orientation?: PrintOption }
  }>()

  const router = useRouter()

  const paperKey = computed(() => props.options?.paper?.key ?? PAPER.letter.key)
  const orientationKey = computed(() => props.options?.orientation?.key ?? ORIENTATION.portrait.key)

  const previewWidth = computed(() => {
    const letter = paperKey.value === PAPER.letter.key
    if (orientationKey.value === ORIENTATION.portrait.key) return letter ? '216mm' : '210mm'
    return letter ? '279mm' : '297mm'
  })

  function removePageStyle() {
    document.getElementById(PAGE_STYLE_ID)?.remove()
  }

  function print() {
    removePageStyle()
    const style = document.createElement('style')
    style.id = PAGE_STYLE_ID
    const size = paperKey.value === PAPER.a4.key ? 'A4' : 'letter'
    style.textContent = `@page { size: ${size} ${orientationKey.value}; margin: 0; }`
    document.head.appendChild(style)
    window.print()
  }

  onUnmounted(removePageStyle)
</script>

<style scoped>
  .print-card {
    padding: 8px;
    background-color: white;
    color: black;
    margin-top: 16px;
  }

  @media print {
    .print-card {
      margin: 0;
      padding: 4px;
      width: 100% !important;
      overflow: visible;
    }

    .printable {
      width: 100% !important;
      max-width: 100% !important;
      background-color: white;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible;
    }
  }
</style>
