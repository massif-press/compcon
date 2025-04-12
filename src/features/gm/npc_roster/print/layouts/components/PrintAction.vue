<template>
  <div v-for="a in actions" class="mt-n1 mb-1 no-print-break">
    <div>
      <v-icon size="x-small" :icon="(a as Action).Icon" :color="(a as Action).Color" />
      <span class="caption">
        <b>{{ (a as Action).Name }}</b>
        ({{ (a as Action).Activation }})
      </span>
    </div>

    <div class="ml-3">
      <div v-if="(a as Action).Init" v-html-safe="(a as Action).Init" class="caption" />
      <v-row no-gutters v-if="(a as Action).Trigger">
        <v-col cols="auto" class="caption font-weight-bold">Trigger:&nbsp;</v-col>
        <v-col><div v-html-safe="(a as Action).Trigger" class="caption" /></v-col>
      </v-row>
      <v-row no-gutters v-if="(a as Action).Detail">
        <v-col v-if="(a as Action).Trigger" cols="auto" class="caption font-weight-bold">
          Effect:&nbsp;
        </v-col>
        <v-col>
          <div
            v-html-safe="(a as Action).Detail"
            class="caption mb-1 pl-2"
            style="margin-top: 2px" />
        </v-col>
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
    tier: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}
</style>
