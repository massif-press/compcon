<template>
  <div v-for="(a, index) in actions"
    :key="`action-${index}`"
    class="no-print-break">
    <div>
      <v-icon size="x-small"
        :icon="(a as Action).Icon" />
      <span class="caption">
        <b>{{ (a as Action).Name }}</b>
        ({{ (a as Action).Activation }})
      </span>
    </div>

    <div class="ml-3 mt-n1">
      <div v-if="(a as Action).Init"
        v-html-safe="(a as Action).Init"
        class="caption" />
      <v-row v-if="(a as Action).Trigger"
        no-gutters>
        <v-col cols="auto"
          class="caption font-weight-bold">Trigger:&nbsp;</v-col>
        <v-col>
          <div v-html-safe="(a as Action).Trigger"
            class="caption" />
        </v-col>
      </v-row>
      <v-row v-if="(a as Action).Detail"
        no-gutters>
        <v-col v-if="(a as Action).Trigger"
          cols="auto"
          class="caption font-weight-bold">
          Effect:&nbsp;
        </v-col>
        <v-col>
          <div v-html-safe="(a as Action).Detail"
            class="caption" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Action } from '@/classes/Action'

defineProps<{ actions: any[] }>()
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
