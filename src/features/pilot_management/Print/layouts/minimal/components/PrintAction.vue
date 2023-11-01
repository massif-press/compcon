<template>
  <div v-show="actions.length" v-for="a in actions">
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
        <v-col v-if="(a as Action).Trigger" cols="auto" class="caption font-weight-bold"
          >Effect:&nbsp;</v-col
        >
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
