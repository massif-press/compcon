<template>
  <v-container :class="!mobile && 'px-12'">
    <cc-heading
      is-title
      :text="$t('active.playMode.defaultTitle')"
    />
    <div class="text-caption text-disabled mb-4">
      {{ $t('active.playMode.defaultDescription') }}
    </div>

    <play-mode-select
      v-model="playMode"
      class="mb-6"
    />

    <cc-heading
      is-title
      :text="$t('active.layout.title')"
    />
    <div class="text-caption text-disabled mb-4">{{ $t('active.layout.description') }}</div>

    <layout-options-controls />

    <div class="mt-6">
      <cc-button
        color="primary"
        size="small"
        prepend-icon="mdi-backup-restore"
        @click="applyPreset('default')"
      >
        {{ $t('active.layout.resetToDefault') }}
      </cc-button>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'
  import LayoutOptionsControls from '@/features/active_mode/_components/LayoutOptionsControls.vue'
  import { applyPreset } from '@/features/active_mode/layoutOptions'
  import PlayModeSelect from '@/features/active_mode/_components/PlayModeSelect.vue'
  import { defaultPlayMode, setDefaultPlayMode } from '@/features/active_mode/playMode'
  import { computed } from 'vue'

  defineOptions({ name: 'ActiveModeOptions' })

  const { mobile } = useDisplay()

  const playMode = computed({
    get: () => defaultPlayMode(),
    set: setDefaultPlayMode,
  })
</script>
