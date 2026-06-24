<template>
  <v-card-text>
    <v-row dense
      align="center"
      justify="space-between">
      <v-col cols="auto"
        class="heading">
        {{ $t('active.runnerHeader.lastSaved') }}:
        <b v-if="context.SaveController.LastModified > 0"
          :key="saveKey"
          class="text-accent ml-1">
          {{
            new Date(context.SaveController.LastModified).toLocaleString(undefined, {
              dateStyle: 'long',
              timeStyle: 'long',
            })
          }}
        </b>
        <i v-else
          class="text-disabled ml-1">{{ $t('active.runnerHeader.never') }}</i>
      </v-col>
      <v-col cols="auto">
        <cc-button flat
          tile
          color="primary"
          prepend-icon="mdi-content-save"
          size="small"
          @click="$emit('manual-save')">
          {{ $t('active.runnerHeader.manualSave') }}
        </cc-button>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-cc-overline mt-1 text-disabled">{{ $t('active.runnerHeader.autosave') }}
        </div>
        <cc-switch v-model="context.Autosave"
          size="large"
          :label="context.Autosave ? 'On Round End' : 'Off (Manual Saves Only)'"
          :tooltip="autosaveTooltip" />
      </v-col>
      <v-col>
        <div class="text-cc-overline mt-1 text-disabled">{{ $t('active.runnerHeader.layoutOptions')
          }}</div>
        <cc-switch v-model="context.SimpleTickbars"
          size="large"
          color="primary"
          :label="context.SimpleTickbars ? 'Simple Tickbars' : 'Standard Tickbars'"
          :tooltip="$t('active.tooltips.replaceTheThematicStatTrackers')" />
        <cc-switch v-model="context.LayoutColumns"
          size="large"
          :label="$t('active.fields.layoutColumns')"
          color="primary"
          :tooltip="$t('active.tooltips.thisControlsIfColumnsWill')" />
        <cc-checkbox v-model="context.ForceComplexTickbars"
          :label="$t('active.fields.forceStandardTickbars')"
          class="my-1"
          :tooltip="$t('active.tooltips.simpleTickbarsAreShownOn')" />
        <cc-number-field v-model="context.MaxMasonryColumns"
          size="large"
          :label="$t('active.fields.maxLoadoutFeatureSetColumns')"
          color="primary"
          :tooltip="$t('active.tooltips.thisControlsHowManyColumns')" />
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup lang="ts">
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import PilotSheet from '@/features/pilot_management/store/PilotSheet';

defineProps<{
  context: EncounterInstance | PilotSheet
  saveKey?: number
  autosaveTooltip?: string
}>()
defineEmits<{ 'manual-save': [] }>()
</script>
