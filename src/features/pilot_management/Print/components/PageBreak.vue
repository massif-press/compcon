<template>
  <v-row v-if="!silent"
    dense
    align="center"
    class="no-print">
    <v-col><v-divider /></v-col>
    <v-col cols="auto"><i class="text-grey"
        style="font-size: 11px">{{ $t('pm.print.pageBreak') }}</i></v-col>
    <v-col><v-divider /></v-col>
  </v-row>
  <div style="break-after: page; page-break-after: always; height: 0;" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  silent?: boolean
}>(), {
  silent: false
})
</script>
