<template>
  <div v-if="actions?.length > 0" v-for="a in actions" class="no-print-break">
    <div>
      <v-icon size="small" :icon="(a as Action).Icon" :color="(a as Action).Color" />
      <span class="flavor-text text-black pl-1" style="font-size: 13px">
        <b>{{ (a as Action).Name }}</b>
        ({{ (a as Action).Activation }})
      </span>
    </div>

    <div class="ml-3">
      <div v-if="(a as Action).Init" v-html-safe="(a as Action).Init" class="caption" />
      <v-row dense v-if="(a as Action).Trigger">
        <v-col cols="auto" class="caption font-weight-bold">Trigger:&nbsp;</v-col>
        <v-col><div v-html-safe="(a as Action).Trigger" class="caption" /></v-col>
      </v-row>
      <v-row dense v-if="(a as Action).Detail" class="mt-n1">
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
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}
</style>
