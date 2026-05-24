<template>
  <div v-if="deployables?.length > 0" :class="`mb-3 mx-2 ${compact ? 'mt-1' : 'mt-2'}`">
    <div v-for="(d, index) in deployables" :key="`deployable-${index}`" class="py-1 no-print-break">
      <v-row dense class="mt-n4 pl-2">
        <v-col v-if="(d as any).Size" cols="auto">
          <div
            class="caption font-weight-bold"
            v-html-safe="`Size ${(d as any).Size === 0.5 ? '½' : (d as any).Size}`" />
        </v-col>
        <v-col v-if="(d as any).Armor" cols="auto">
          <div class="caption" v-html-safe="`<b>Armor</b>: ${(d as any).Armor}`" />
        </v-col>
        <v-col v-if="(d as any).MaxHP || (d as any).Size" cols="auto">
          <div
            class="caption"
            v-html-safe="
              `<b>HP</b>: ${
                (d as any).MaxHP
                  ? (d as any).MaxHP.toString().replace(/[{}]/gim, '')
                  : parseFloat((d as any).Size || 0.5) * 10
              }`
            " />
        </v-col>
        <v-col v-if="(d as any).Evasion" cols="auto">
          <div class="caption" v-html-safe="`<b>Evasion:</b> ${(d as any).Evasion || 10}`" />
        </v-col>
        <v-col v-if="(d as any).EDefense" cols="auto">
          <div class="caption" v-html-safe="`<b>E-Defense:</b> ${(d as any).EDefense}`" />
        </v-col>
        <v-col v-if="(d as any).Heatcap" cols="auto">
          <div class="caption" v-html-safe="`<b>Heat Capacity:</b> ${(d as any).Heatcap}`" />
        </v-col>
        <v-col v-if="(d as any).Sensors" cols="auto">
          <div class="caption" v-html-safe="`<b>Sensor Range:</b> ${(d as any).Sensors}`" />
        </v-col>
        <v-col v-if="(d as any).TechAttack" cols="auto">
          <div class="caption" v-html-safe="`<b>Tech Attack:</b> ${(d as any).TechAttack}`" />
        </v-col>
        <v-col v-if="(d as any).Repcap" cols="auto">
          <div class="caption" v-html-safe="`<b>Repair Capacity:</b> ${(d as any).Repcap}`" />
        </v-col>
        <v-col v-if="(d as any).Save" cols="auto">
          <div class="caption" v-html-safe="`<b>Save Target:</b> ${(d as any).Save}`" />
        </v-col>
        <v-col v-if="(d as any).Speed" cols="auto">
          <div class="caption" v-html-safe="`<b>Speed:</b> ${(d as any).Speed}`" />
        </v-col>
      </v-row>
      <div>
        <p class="caption mb-0 px-2" v-html-safe="(d as any).Detail" />
      </div>
      <v-card
        v-if="actions(d).length"
        variant="outlined"
        :class="`mt-1${compact ? '' : ' ml-3'}`"
        style="border-color: rgba(0, 0, 0, 0.4)">
        <print-action :actions="actions(d)" :compact="compact" />
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import PrintAction from './PrintAction.vue';

export default {
  name: 'print-deployable',
  components: { PrintAction },
  props: {
    deployables: {
      type: Array,
      required: true,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    actions(deployable) {
      return deployable.Actions;
    },
  },
};
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
