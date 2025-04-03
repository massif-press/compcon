<template>
  <div v-if="deployables?.length > 0" class="mb-3 mx-2 mt-1">
    <div v-for="d in deployables" class="py-1">
      <v-row dense class="mt-n4 pl-2">
        <v-col v-if="(d as any).Size" cols="auto">
          <div
            class="caption font-weight-bold"
            v-html="`Size ${(d as any).Size === 0.5 ? '½' : (d as any).Size}`" />
        </v-col>
        <v-col v-if="(d as any).Armor" cols="auto">
          <div class="caption" v-html="`<b>Armor</b>: ${(d as any).Armor}`" />
        </v-col>
        <v-col v-if="(d as any).MaxHP || (d as any).Size" cols="auto">
          <div
            class="caption"
            v-html="
              `<b>HP</b>: ${
                (d as any).MaxHP
                  ? (d as any).MaxHP.toString().replace(/[{}]/gim, '')
                  : parseFloat((d as any).Size || 0.5) * 10
              }`
            " />
        </v-col>
        <v-col v-if="(d as any).Evasion" cols="auto">
          <div class="caption" v-html="`<b>Evasion:</b> ${(d as any).Evasion || 10}`" />
        </v-col>
        <v-col v-if="(d as any).EDefense" cols="auto">
          <div class="caption" v-html="`<b>E-Defense:</b> ${(d as any).EDefense}`" />
        </v-col>
        <v-col v-if="(d as any).Heatcap" cols="auto">
          <div class="caption" v-html="`<b>Heat Capacity:</b> ${(d as any).Heatcap}`" />
        </v-col>
        <v-col v-if="(d as any).Sensors" cols="auto">
          <div class="caption" v-html="`<b>Sensor Range:</b> ${(d as any).Sensors}`" />
        </v-col>
        <v-col v-if="(d as any).TechAttack" cols="auto">
          <div class="caption" v-html="`<b>Tech Attack:</b> ${(d as any).TechAttack}`" />
        </v-col>
        <v-col v-if="(d as any).Repcap" cols="auto">
          <div class="caption" v-html="`<b>Repair Capacity:</b> ${(d as any).Repcap}`" />
        </v-col>
        <v-col v-if="(d as any).Save" cols="auto">
          <div class="caption" v-html="`<b>Save Target:</b> ${(d as any).Save}`" />
        </v-col>
        <v-col v-if="(d as any).Speed" cols="auto">
          <div class="caption" v-html="`<b>Speed:</b> ${(d as any).Speed}`" />
        </v-col>
      </v-row>
      <div>
        <p class="caption mb-0 px-2" v-html="(d as any).Detail" />
      </div>
      <v-card
        v-if="actions(d).length"
        variant="outlined"
        class="mt-1"
        style="border-color: rgba(0, 0, 0, 0.4)">
        <print-action :actions="actions(d)" />
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
  },
  methods: {
    actions(deployable) {
      return deployable.Actions;
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}
</style>
