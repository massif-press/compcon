<template>
  <div class="mt-1 mb-3 mx-2 no-print-break">
    <div v-for="d in deployables" style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 3px">
      <div class="text-center mb-1">
        <v-chip size="x-small">
          <b>{{ (d as any).name }}</b>
        </v-chip>
      </div>

      <v-row justify="center" dense class="text-center">
        <v-col v-if="(d as any).size" cols="auto">
          <div
            class="caption font-weight-bold"
            v-html="`Size ${(d as any).size === 0.5 ? '½' : (d as any).size}`" />
        </v-col>
        <v-col v-if="(d as any).armor" cols="auto">
          <div class="caption" v-html="`<b>Armor</b>: ${(d as any).armor}`" />
        </v-col>
        <v-col v-if="(d as any).hp || (d as any).size" cols="auto">
          <div
            class="caption"
            v-html="
              `<b>HP</b>: ${
                (d as any).hp
                  ? (d as any).hp.toString().replace(/[{}]/gim, '')
                  : parseFloat((d as any).size || 0.5) * 10
              }`
            " />
        </v-col>
        <v-col v-if="(d as any).size" cols="auto">
          <div class="caption" v-html="`<b>Evasion:</b> ${(d as any).evasion || 10}`" />
        </v-col>
        <v-col v-if="(d as any).edef" cols="auto">
          <div class="caption" v-html="`<b>E-Defense:</b> ${(d as any).edef}`" />
        </v-col>
        <v-col v-if="(d as any).heatcap" cols="auto">
          <div class="caption" v-html="`<b>Heat Capacity:</b> ${(d as any).heatcap}`" />
        </v-col>
        <v-col v-if="(d as any).sensor" cols="auto">
          <div class="caption" v-html="`<b>Sensor Range:</b> ${(d as any).sensor}`" />
        </v-col>
        <v-col v-if="(d as any).techattack" cols="auto">
          <div class="caption" v-html="`<b>Tech Attack:</b> ${(d as any).techattack}`" />
        </v-col>
        <v-col v-if="(d as any).repcap" cols="auto">
          <div class="caption" v-html="`<b>Repair Capacity:</b> ${(d as any).repcap}`" />
        </v-col>
        <v-col v-if="(d as any).save" cols="auto">
          <div class="caption" v-html="`<b>Save Target:</b> ${(d as any).save}`" />
        </v-col>
        <v-col v-if="(d as any).speed" cols="auto">
          <div class="caption" v-html="`<b>Speed:</b> ${(d as any).speed}`" />
        </v-col>
      </v-row>
      <div>
        <p class="caption mb-0 px-2" v-html="(d as any).detail" />
      </div>
      <div v-if="actions(d).length">
        <print-action :actions="actions(d)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Action } from '@/classes/Action';

import PrintAction from './PrintAction.vue';

export default {
  name: 'print-deployable',
  components: { PrintAction },
  props: {
    deployables: {
      type: Array,
      required: true,
    },
  },
  methods: {
    actions(deployable) {
      return deployable.actions ? deployable.actions.map((x) => new Action(x)) : [];
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}
</style>
