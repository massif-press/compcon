<template>
  <div>
    <v-row justify="center" dense>
      <cc-statblock-panel
        v-if="deployable.Size"
        :icon="`cc:size_${deployable.Size === 0.5 ? 'half' : deployable.Size}`"
        name="Size"
        inline
        color="primary"
        :value="`${deployable.Size === 0.5 ? '½' : deployable.Size}`" />
      <cc-statblock-panel
        v-if="deployable.Armor"
        icon="mdi-shield"
        name="Armor"
        inline
        color="primary"
        :value="deployable.Armor" />
      <cc-statblock-panel
        v-if="deployable.HP || deployable.Size"
        icon="mdi-heart"
        name="HP"
        inline
        color="primary"
        :value="
          deployable.HP ? ByTierArray(deployable.HP) : parseFloat(deployable.Size || 0.5) * 10
        " />
      <cc-statblock-panel
        v-if="deployable.Size"
        icon="cc:evasion"
        inline
        color="primary"
        name="Evasion"
        :value="ByTierArray(deployable.evasion) || 5" />
      <cc-statblock-panel
        v-if="deployable.EDefense"
        icon="cc:e_def"
        inline
        color="primary"
        name="E-Def"
        :value="ByTierArray(deployable.EDefense)" />
      <cc-statblock-panel
        v-if="deployable.Heatcap"
        icon="cc:heat"
        inline
        color="primary"
        name="Heat Capacity"
        :value="ByTierArray(deployable.Heatcap)" />
      <cc-statblock-panel
        v-if="deployable.Sensors"
        icon="cc:sensor"
        inline
        color="primary"
        name="Sensor Range"
        :value="ByTierArray(deployable.Sensors)" />
      <cc-statblock-panel
        v-if="deployable.TechAttack"
        icon="cc:full_tech"
        inline
        color="primary"
        name="Tech Attack"
        :value="ByTierArray(deployable.TechAttack)" />
      <cc-statblock-panel
        v-if="deployable.Repcap"
        icon="cc:repair"
        inline
        color="primary"
        name="Repair Capacity"
        :value="ByTierArray(deployable.Repcap)" />
      <cc-statblock-panel
        v-if="deployable.Save"
        icon="cc:save"
        inline
        color="primary"
        name="Save Target"
        :value="ByTierArray(deployable.Save)" />
      <cc-statblock-panel
        v-if="deployable.Speed"
        icon="mdi-arrow-right-bold-hexagon-outline"
        inline
        color="primary"
        name="Speed"
        :value="ByTierArray(deployable.Speed)" />
    </v-row>
    <p v-html-safe="deployable.getDetail(tier)" class="pa-2" />

    <div v-if="deployable.Actions && deployable.Actions.length">
      <v-row no-gutters justify="center">
        <v-col v-for="a in deployable.Actions" cols="auto">
          <cc-action :action="a" :panel="$vuetify.display.lgAndUp" class="ma-2" :tier="tier" />
        </v-col>
      </v-row>
    </div>

    <cc-tags v-if="deployable.Tags && deployable.Tags.length" :tags="deployable.Tags" />
  </div>
</template>

<script lang="ts">
import { ByTier, ByTierArray } from '@/util/tierFormat';

export default {
  name: 'deployable-info-base',
  props: {
    deployable: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
  methods: {
    byTier(str: string) {
      return ByTier(str, this.tier);
    },
    ByTierArray(str: string) {
      return ByTierArray(str, this.tier);
    },
  },
};
</script>
