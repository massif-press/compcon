<template>
  <v-card-text>
    <v-row dense
      align="center"
      justify="space-between">
      <v-col cols="auto"
        class="heading">
        Last Saved:
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
          class="text-disabled ml-1">Never</i>
      </v-col>
      <v-col cols="auto">
        <cc-button flat
          tile
          color="primary"
          prepend-icon="mdi-content-save"
          size="small"
          @click="$emit('manual-save')">
          Manual Save
        </cc-button>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-cc-overline mt-1 text-disabled">Autosave</div>
        <cc-switch v-model="context.Autosave"
          size="large"
          :label="context.Autosave ? 'On Round End' : 'Off (Manual Saves Only)'"
          :tooltip="autosaveTooltip" />
      </v-col>
      <v-col>
        <div class="text-cc-overline mt-1 text-disabled">Layout Options</div>
        <cc-switch v-model="context.SimpleTickbars"
          size="large"
          color="primary"
          :label="context.SimpleTickbars ? 'Simple Tickbars' : 'Standard Tickbars'"
          tooltip="Replace the thematic stat trackers for HP, Heat, etc. with straightforward number inputs." />
        <cc-switch v-model="context.LayoutColumns"
          size="large"
          label="Layout Columns"
          color="primary"
          tooltip="This controls if columns will be used when rendering a combatant's information in the encounter panel. This will only work on wide resolution screens." />
        <cc-checkbox v-model="context.ForceComplexTickbars"
          label="Force Standard Tickbars"
          class="my-1"
          tooltip="Simple tickbars are shown on mobile (tablet and lower) resolutions. Enabling this will force the standard tickbars to display regardless of screen size. This may cause layout issues on smaller screens." />
        <cc-number-field v-model="context.MaxMasonryColumns"
          size="large"
          label="Max Loadout / Feature Set Columns"
          color="primary"
          tooltip="This controls how many columns will be used when rendering a combatant's loadouts or feature sets in the encounter panel. Higher values may cause layout issues on smaller screens." />
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup lang="ts">
defineProps<{
  context: any
  saveKey?: number
  autosaveTooltip?: string
}>()
defineEmits<{ 'manual-save': [] }>()
</script>
