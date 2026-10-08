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

    <v-select
      v-model="turnWizardClose"
      :items="turnWizardCloseItems"
      :label="$t('nav.settingsPage.turnWizardClosePolicyLabel')"
      density="compact"
      variant="outlined"
      hide-details
      class="mb-6"
      style="max-width: 400px"
    />

    <cc-heading
      is-title
      :text="$t('active.layout.title')"
    />
    <div class="text-caption text-disabled mb-4">{{ $t('active.layout.description') }}</div>

    <div class="text-cc-overline text-disabled">{{ $t('active.layout.layoutFor') }}</div>
    <v-btn-toggle
      v-model="layoutMode"
      mandatory
      color="primary"
      density="compact"
      class="mb-4"
    >
      <v-btn value="full">{{ $t('active.playMode.full') }}</v-btn>
      <v-btn value="simple">{{ $t('active.playMode.simple') }}</v-btn>
    </v-btn-toggle>

    <layout-options-controls />

    <div class="mt-6">
      <cc-button
        color="primary"
        size="small"
        prepend-icon="mdi-backup-restore"
        @click="applyPreset('default', layoutMode)"
      >
        {{ $t('active.layout.resetToDefault') }}
      </cc-button>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'
  import LayoutOptionsControls from '@/features/active_mode/_components/LayoutOptionsControls.vue'
  import { applyPreset, LayoutModeKey } from '@/features/active_mode/layoutOptions'
  import type { PlayMode } from '@/classes/encounter/EncounterInstance'
  import PlayModeSelect from '@/features/active_mode/_components/PlayModeSelect.vue'
  import { defaultPlayMode, setDefaultPlayMode } from '@/features/active_mode/playMode'
  import {
    TURN_WIZARD_CLOSE_POLICIES,
    setTurnWizardClosePolicy,
    turnWizardClosePolicy,
  } from '@/features/active_mode/turnWizard'
  import { computed, provide, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  defineOptions({ name: 'ActiveModeOptions' })

  const { mobile } = useDisplay()
  const { t } = useI18n()

  const playMode = computed({
    get: () => defaultPlayMode(),
    set: setDefaultPlayMode,
  })

  const turnWizardClose = computed({
    get: () => turnWizardClosePolicy(),
    set: setTurnWizardClosePolicy,
  })
  const turnWizardCloseItems = computed(() =>
    TURN_WIZARD_CLOSE_POLICIES.map(value => ({
      value,
      title: t(`nav.settingsPage.turnWizardClosePolicy.${value}`),
    }))
  )

  const layoutMode = ref<PlayMode>('full')
  provide(
    LayoutModeKey,
    computed(() => layoutMode.value)
  )
</script>
