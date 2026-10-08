<template>
  <div class="d-flex align-center justify-center bg-panel pa-1">
    <cc-button
      icon="mdi-undo"
      size="x-small"
      color="primary"
      class="mr-2"
      :disabled="!undoMeta.canUndo"
      :tooltip="
        undoMeta.canUndo
          ? $t('active.gmRunner.undoTooltip', { label: undoMeta.undoLabel })
          : $t('active.gmRunner.undo')
      "
      @click="doUndo"
    />
    <div class="text-center heading h3 mx-3">
      <slot />
    </div>
    <cc-button
      icon="mdi-redo"
      size="x-small"
      color="primary"
      class="ml-2"
      :disabled="!undoMeta.canRedo"
      :tooltip="
        undoMeta.canRedo
          ? $t('active.gmRunner.redoTooltip', { label: undoMeta.redoLabel })
          : $t('active.gmRunner.redo')
      "
      @click="doRedo"
    />
  </div>
</template>

<script setup lang="ts">
  import { injectRunnerUndo } from './useRunnerUndo'

  defineOptions({ name: 'RunnerUndoBar' })

  const { undoMeta, doUndo, doRedo } = injectRunnerUndo()
</script>
