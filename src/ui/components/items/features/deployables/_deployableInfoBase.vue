<template>
  <div>
    <v-row justify="center" density="compact">
      <cc-statblock-panel
        v-if="deployable.Size"
        inline
        class="mx-1"
        :icon="`cc:size_${deployable.Size === 0.5 ? 'half' : deployable.Size}`"
        name="Size"
        :value="`${deployable.Size === 0.5 ? '½' : deployable.Size}`" />
      <cc-statblock-panel
        v-if="deployable.Armor"
        inline
        class="mx-1"
        icon="mdi-shield"
        name="Armor"
        :value="deployable.Armor" />
      <cc-statblock-panel
        v-if="deployable.HP || deployable.Size"
        inline
        class="mx-1"
        icon="mdi-heart"
        name="HP"
        :value="
          deployable.HP
            ? deployable.HP.toString().replace(/[{}]/gim, '')
            : parseFloat(deployable.Size || 0.5) * 10
        " />
      <cc-statblock-panel
        v-if="deployable.Size"
        icon="cc:evasion"
        inline
        class="mx-1"
        name="Evasion"
        :value="deployable.evasion || 5" />
      <cc-statblock-panel
        v-if="deployable.EDefense"
        inline
        class="mx-1"
        icon="cc:e_def"
        name="E-Defense"
        :value="deployable.EDefense" />
      <cc-statblock-panel
        v-if="deployable.Heatcap"
        inline
        class="mx-1"
        icon="cc:heat"
        name="Heat Capacity"
        :value="deployable.Heatcap" />
      <cc-statblock-panel
        v-if="deployable.Sensors"
        inline
        class="mx-1"
        icon="cc:sensor"
        name="Sensor Range"
        :value="deployable.Sensors" />
      <cc-statblock-panel
        v-if="deployable.TechAttack"
        inline
        class="mx-1"
        icon="cc:full_tech"
        name="Tech Attack"
        :value="deployable.TechAttack" />
      <cc-statblock-panel
        v-if="deployable.Repcap"
        inline
        class="mx-1"
        icon="cc:repair"
        name="Repair Capacity"
        :value="deployable.Repcap" />
      <cc-statblock-panel
        v-if="deployable.Save"
        inline
        class="mx-1"
        icon="cc:save"
        name="Save Target"
        :value="deployable.Save" />
      <cc-statblock-panel
        v-if="deployable.Speed"
        inline
        class="mx-1"
        icon="mdi-arrow-right-bold-hexagon-outline"
        name="Speed"
        :value="deployable.Speed" />
    </v-row>
    <p v-html-safe="deployable.Detail" class="body-text pa-2 pt-4" />
    <div v-if="deployable.Actions && deployable.Actions.length">
      <v-row no-gutters justify="center">
        <v-col v-for="a in deployable.Actions" cols="auto">
          <cc-action :action="a" :panel="$vuetify.display.lgAndUp" class="ma-2" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Action } from '@/classes/Action';

export default {
  name: 'deployable-info-base',
  props: {
    deployable: {
      type: Object,
      required: true,
    },
  },
};
</script>
