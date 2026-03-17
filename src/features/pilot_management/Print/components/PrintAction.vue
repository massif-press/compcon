<template>
  <div v-if="actions?.length > 0" v-for="a in actions" class="no-print-break">
    <div>
      <v-icon
        :size="compact ? 'x-small' : 'small'"
        :icon="(a as Action).Icon"
        :color="(a as Action).Color" />
      <span
        :class="compact ? 'caption' : 'flavor-text text-black pl-1'"
        :style="compact ? '' : 'font-size: 13px'">
        <b>{{ (a as Action).Name }}</b>
        ({{ (a as Action).Activation }})
      </span>
    </div>

    <div class="ml-3">
      <div v-if="(a as Action).Init" v-html-safe="(a as Action).Init" class="caption" />
      <v-row :no-gutters="compact" :dense="!compact" v-if="(a as Action).Trigger">
        <v-col cols="auto" class="caption font-weight-bold">Trigger:&nbsp;</v-col>
        <v-col><div v-html-safe="(a as Action).Trigger" class="caption" /></v-col>
      </v-row>
      <v-row
        :no-gutters="compact"
        :dense="!compact"
        v-if="(a as Action).Detail"
        :class="compact ? '' : 'mt-n1'">
        <v-col v-if="(a as Action).Trigger" cols="auto" class="caption font-weight-bold">
          Effect:&nbsp;
        </v-col>
        <v-col><div v-html-safe="(a as Action).Detail" class="caption" /></v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Action } from '@/interface';

export default {
  name: 'print-action',
  props: {
    actions: {
      type: Array,
      required: true,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}
</style>
