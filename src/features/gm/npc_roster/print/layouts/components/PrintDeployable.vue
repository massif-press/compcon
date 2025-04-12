<template>
  <div class="mt-1 mx-2 no-print-break">
    <div v-for="d in deployables" style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 3px">
      <v-row justify="center" dense class="text-center">
        <v-col v-if="(d as any).getStat('Size', tier)" cols="auto">
          <div
            class="caption font-weight-bold"
            v-html="
              `Size ${
                (d as any).getStat('Size', tier) === 0.5 ? '½' : (d as any).getStat('Size', tier)
              }`
            " />
        </v-col>
        <v-col v-if="(d as any).Armor" cols="auto">
          <div class="caption" v-html="`<b>Armor</b>: ${(d as any).getStat('Armor', tier)}`" />
        </v-col>
        <v-col
          v-if="(d as any).getStat('HP', tier) || (d as any).getStat('Size', tier)"
          cols="auto">
          <div
            class="caption"
            v-html="
              `<b>HP</b>: ${
                (d as any).getStat('HP', tier)
                  ? (d as any).getStat('HP', tier).toString().replace(/[{}]/gim, '')
                  : parseFloat((d as any).getStat('Size', tier) || 0.5) * 10
              }`
            " />
        </v-col>
        <v-col v-if="(d as any).Evasion" cols="auto">
          <div
            class="caption"
            v-html="`<b>Evasion:</b> ${(d as any).getStat('Evasion', tier) || 10}`" />
        </v-col>
        <v-col v-if="(d as any).EDefense" cols="auto">
          <div
            class="caption"
            v-html="`<b>E-Defense:</b> ${(d as any).getStat('EDefense', tier)}`" />
        </v-col>
        <v-col v-if="(d as any).Heatcap" cols="auto">
          <div
            class="caption"
            v-html="`<b>Heat Capacity:</b> ${(d as any).getStat('Heatcap', tier)}`" />
        </v-col>
        <v-col v-if="(d as any).Sensor" cols="auto">
          <div
            class="caption"
            v-html="`<b>Sensor Range:</b> ${(d as any).getStat('Sensor', tier)}`" />
        </v-col>
        <v-col v-if="(d as any).TechAttack" cols="auto">
          <div
            class="caption"
            v-html="`<b>Tech Attack:</b> ${(d as any).getStat('TechAttack', tier)}`" />
        </v-col>
        <v-col v-if="(d as any).Repcap" cols="auto">
          <div
            class="caption"
            v-html="`<b>Repair Capacity:</b> ${(d as any).getStat('Repcap', tier)}`" />
        </v-col>
        <v-col v-if="(d as any).Save" cols="auto">
          <div class="caption" v-html="`<b>Save Target:</b> ${(d as any).getStat('Save', tier)}`" />
        </v-col>
        <v-col v-if="(d as any).Speed" cols="auto">
          <div class="caption" v-html="`<b>Speed:</b> ${(d as any).getStat('Speed', tier)}`" />
        </v-col>
      </v-row>
      <div>
        <p class="caption mb-0 px-2" v-html-safe="(d as any).getDetail(tier)" />
      </div>
      <div v-if="(d as any).Actions.length">
        <print-action :actions="(d as any).Actions" />
      </div>
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
