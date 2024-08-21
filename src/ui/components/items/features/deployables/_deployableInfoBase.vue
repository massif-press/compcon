<template>
  <div>
    <v-row justify="center" density="compact">
      <cc-statblock-panel
        v-if="deployable.Size"
        class="mx-1"
        :icon="`cc:size_${deployable.Size === 0.5 ? 'half' : deployable.Size}`"
        name="Size"
        inline
        color="primary"
        variant="tonal"
        :value="`${deployable.Size === 0.5 ? '½' : deployable.Size}`" />
      <cc-statblock-panel
        v-if="deployable.Armor"
        class="mx-1"
        icon="mdi-shield"
        name="Armor"
        inline
        color="primary"
        variant="tonal"
        :value="deployable.Armor" />
      <cc-statblock-panel
        v-if="deployable.HP || deployable.Size"
        class="mx-1"
        icon="mdi-heart"
        name="HP"
        inline
        color="primary"
        variant="tonal"
        :value="
          deployable.HP ? ByTierArray(deployable.HP) : parseFloat(deployable.Size || 0.5) * 10
        " />
      <cc-statblock-panel
        v-if="deployable.Size"
        icon="cc:evasion"
        class="mx-1"
        inline
        color="primary"
        variant="tonal"
        name="Evasion"
        :value="ByTierArray(deployable.evasion) || 5" />
      <cc-statblock-panel
        v-if="deployable.EDefense"
        class="mx-1"
        icon="cc:e_def"
        inline
        color="primary"
        variant="tonal"
        name="E-Def"
        :value="ByTierArray(deployable.EDefense)" />
      <cc-statblock-panel
        v-if="deployable.Heatcap"
        class="mx-1"
        icon="cc:heat"
        inline
        color="primary"
        variant="tonal"
        name="Heat Capacity"
        :value="ByTierArray(deployable.Heatcap)" />
      <cc-statblock-panel
        v-if="deployable.Sensors"
        class="mx-1"
        icon="cc:sensor"
        inline
        color="primary"
        variant="tonal"
        name="Sensor Range"
        :value="ByTierArray(deployable.Sensors)" />
      <cc-statblock-panel
        v-if="deployable.TechAttack"
        class="mx-1"
        icon="cc:full_tech"
        inline
        color="primary"
        variant="tonal"
        name="Tech Attack"
        :value="ByTierArray(deployable.TechAttack)" />
      <cc-statblock-panel
        v-if="deployable.Repcap"
        class="mx-1"
        icon="cc:repair"
        inline
        color="primary"
        variant="tonal"
        name="Repair Capacity"
        :value="ByTierArray(deployable.Repcap)" />
      <cc-statblock-panel
        v-if="deployable.Save"
        class="mx-1"
        icon="cc:save"
        inline
        color="primary"
        variant="tonal"
        name="Save Target"
        :value="ByTierArray(deployable.Save)" />
      <cc-statblock-panel
        v-if="deployable.Speed"
        class="mx-1"
        icon="mdi-arrow-right-bold-hexagon-outline"
        inline
        color="primary"
        variant="tonal"
        name="Speed"
        :value="ByTierArray(deployable.Speed)" />
    </v-row>
    <p v-html-safe="deployable.getDetail(tier)" class="body-text pa-2 pt-4" />
    <div v-if="deployable.Actions && deployable.Actions.length">
      <v-row no-gutters justify="center">
        <v-col v-for="a in deployable.Actions" cols="auto">
          <cc-action :action="a" :panel="$vuetify.display.lgAndUp" class="ma-2" :tier="tier" />
        </v-col>
      </v-row>
    </div>
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
