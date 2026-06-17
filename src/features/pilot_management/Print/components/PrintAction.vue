<template>
  <div v-if="actions?.length > 0">
    <div v-for="(a, index) in actions"
      :key="`action-${index}`"
      class="no-print-break">
      <div>
        <v-icon :size="compact ? 'x-small' : 'small'"
          :icon="(a as Action).Icon"
          :color="(a as Action).Color" />
        <span :class="compact ? 'caption' : 'flavor-text text-black pl-1'"
          :style="compact ? '' : 'font-size: 13px'">
          <b>{{ (a as Action).Name }}</b>
          ({{ (a as Action).Activation }})
        </span>
      </div>

      <div class="ml-3">
        <div v-if="(a as Action).Init"
          v-html-safe="(a as Action).Init"
          class="caption" />
        <v-row v-if="(a as Action).Trigger"
          :no-gutters="compact"
          :dense="!compact">
          <v-col cols="auto"
            class="caption font-weight-bold">{{ $t('common.trigger') }}:&nbsp;</v-col>
          <v-col>
            <div v-html-safe="(a as Action).Trigger"
              class="caption" />
          </v-col>
        </v-row>
        <v-row v-if="(a as Action).Detail"
          :no-gutters="compact"
          :dense="!compact"
          :class="compact ? '' : 'mt-n1'">
          <v-col v-if="(a as Action).Trigger"
            cols="auto"
            class="caption font-weight-bold">
            {{ $t('common.effect') }}:&nbsp;
          </v-col>
          <v-col>
            <div v-html-safe="(a as Action).Detail"
              class="caption" />
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Action } from '@/classes/Action';

withDefaults(defineProps<{
  actions: Action[]
  compact?: boolean
}>(), {
  compact: false
})
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
