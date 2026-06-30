<template>
  <div v-for="(a, index) in actions"
    :key="`action-${index}`"
    class="mt-n1 mb-1 no-print-break">
    <div>
      <v-icon size="x-small"
        :icon="(a as Action).Icon"
        :color="(a as Action).Color" />
      <span class="caption">
        <b>{{ (a as Action).Name }}</b>
        ({{ $enum('activationType', (a as Action).Activation) }})
      </span>
    </div>

    <div class="ml-3">
      <div v-if="(a as Action).Init"
        v-html-safe="(a as Action).Init"
        class="caption" />
      <v-row v-if="(a as Action).Trigger"
        no-gutters>
        <v-col cols="auto"
          class="caption font-weight-bold">{{ $t('common.trigger') }}:&nbsp;</v-col>
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
          {{ $t('common.effect') }}:&nbsp;
        </v-col>
        <v-col>
          <div v-html-safe="(a as Action).Detail"
            class="caption mb-1 pl-2"
            style="margin-top: 2px" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Action } from '@/classes/Action';

const props = withDefaults(defineProps<{
  actions: Action[]
  tier?: number
}>(), {
  tier: 1
})
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
