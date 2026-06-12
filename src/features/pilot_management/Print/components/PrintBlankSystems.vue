<template>
  <div>
    <fieldset>
      <legend class="heading h4 ml-1 px-2 py-1 text-primary">{{ $t('stats.systems') }}</legend>
      <div v-for="n in extraSystemSpace ? 8 : 6"
        :key="`sys-${n}`"
        class="no-print-break">
        <v-row dense>
          <v-col>
            <div class="caption text-grey">{{ $t('pm.print.system') }}</div>
            <blank-line :height="lineHeight" />
          </v-col>
          <v-col cols="1">
            <div class="caption text-grey">{{ $t('pm.print.uses') }}</div>
            <blank-line :height="lineHeight" />
          </v-col>
          <v-col cols="1">
            <div class="caption text-grey">{{ $t('pm.print.spCOST') }}</div>
            <blank-line :height="lineHeight" />
          </v-col>
        </v-row>
        <blank-line :height="slotHeight"
          class="my-2" />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import BlankLine from './blank/line.vue';

withDefaults(defineProps<{
  extraSystemSpace?: boolean
  lineHeight?: number
  slotHeight?: number
}>(), {
  extraSystemSpace: false,
  lineHeight: 28,
  slotHeight: 80
})
</script>
