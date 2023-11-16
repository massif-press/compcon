<template>
  <card>
    <div class="caption text-center mt-n1" style="letter-spacing: 3px; font-size: 10px">
      {{ header }} // <b>DEPLOYABLE</b>
    </div>
    <v-row dense align="center">
      <v-col cols="auto" class="text-center heading caption my-1">
        {{ deployable.Name }}
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <div class="caption">
      <div class="text-center mb-2">
        <v-chip size="x-small"
          ><b>{{ (deployable as any).name }}</b></v-chip
        >
      </div>

      <v-row justify="center" dense class="text-center">
        <v-col v-if="(deployable as any).size" cols="auto">
          <div
            class="caption font-weight-bold"
            v-html="`Size ${(deployable as any).size === 0.5 ? '½' : (deployable as any).size}`"
          />
        </v-col>
        <v-col v-if="(deployable as any).armor" cols="auto">
          <div class="caption" v-html="`<b>Armor</b>: ${(deployable as any).armor}`" />
        </v-col>
        <v-col v-if="(deployable as any).hp || (deployable as any).size" cols="auto">
          <div
            class="caption"
            v-html="
              `<b>HP</b>: ${
                (deployable as any).hp
                  ? (deployable as any).hp.toString().replace(/[{}]/gim, '')
                  : parseFloat((deployable as any).size || 0.5) * 10
              }`
            "
          />
        </v-col>
        <v-col v-if="(deployable as any).size" cols="auto">
          <div class="caption" v-html="`<b>Evasion:</b> ${(deployable as any).evasion || 10}`" />
        </v-col>
        <v-col v-if="(deployable as any).edef" cols="auto">
          <div class="caption" v-html="`<b>E-Defense:</b> ${(deployable as any).edef}`" />
        </v-col>
        <v-col v-if="(deployable as any).heatcap" cols="auto">
          <div class="caption" v-html="`<b>Heat Capacity:</b> ${(deployable as any).heatcap}`" />
        </v-col>
        <v-col v-if="(deployable as any).sensor" cols="auto">
          <div class="caption" v-html="`<b>Sensor Range:</b> ${(deployable as any).sensor}`" />
        </v-col>
        <v-col v-if="(deployable as any).techattack" cols="auto">
          <div class="caption" v-html="`<b>Tech Attack:</b> ${(deployable as any).techattack}`" />
        </v-col>
        <v-col v-if="(deployable as any).repcap" cols="auto">
          <div class="caption" v-html="`<b>Repair Capacity:</b> ${(deployable as any).repcap}`" />
        </v-col>
        <v-col v-if="(deployable as any).save" cols="auto">
          <div class="caption" v-html="`<b>Save Target:</b> ${(deployable as any).save}`" />
        </v-col>
        <v-col v-if="(deployable as any).speed" cols="auto">
          <div class="caption" v-html="`<b>Speed:</b> ${(deployable as any).speed}`" />
        </v-col>
      </v-row>
      <div>
        <p class="caption mb-0 px-2" v-html="(deployable as any).detail" />
      </div>
    </div>
    <v-avatar style="position: absolute; bottom: 1px; right: 1px">
      <v-icon icon="cc:drone" color="primary" size="40" />
    </v-avatar>
  </card>
</template>

<script lang="ts">
import Card from './PrintCard.vue';

export default {
  name: 'print-deployable',
  components: {
    Card,
  },
  props: {
    deployable: {
      type: Object,
      required: true,
    },
    header: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 11px;
}
</style>
