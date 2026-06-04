<template>
  <v-col :cols="cols">
    <fieldset>
      <legend class="font-weight-bold caption text-primary px-2 text-center">{{ title }}</legend>
      <div v-if="showUpperSection"
        style="min-width: 12vw">
        <blank-line :height="60" />
      </div>
      <blank-line v-else
        :height="60" />

      <v-row v-if="showMaxLabel"
        dense
        align="center"
        class="mb-n2">
        <v-col><v-divider /></v-col>
        <v-col cols="auto"><span class="text-primary caption">{{ maxLabel }}</span></v-col>
        <v-col><v-divider /></v-col>
      </v-row>

      <div v-if="!blank && showValue"
        class="text-center heading h3"
        v-text="value" />
      <blank-line v-else-if="showValue"
        :height="26"
        :class="marginClass" />
    </fieldset>
  </v-col>
</template>

<script setup lang="ts">
import BlankLine from './blank/line.vue'

withDefaults(defineProps<{
  title: string
  value?: string | number | null
  maxLabel?: string
  cols?: string | number
  blank?: boolean
  showUpperSection?: boolean
  showMaxLabel?: boolean
  showValue?: boolean
  marginClass?: string
}>(), {
  value: null,
  maxLabel: '',
  cols: 4,
  blank: false,
  showUpperSection: true,
  showMaxLabel: true,
  showValue: true,
  marginClass: 'mb-1'
})
</script>