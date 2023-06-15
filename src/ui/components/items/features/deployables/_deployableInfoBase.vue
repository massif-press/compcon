<template>
  <div>
    <v-row justify="center" density="compact">
      <cc-statblock-panel
        v-if="deployable.size"
        inline
        class="mx-1"
        :icon="`cc:size_${deployable.size === 0.5 ? 'half' : deployable.size}`"
        name="Size"
        :value="`${deployable.size === 0.5 ? '½' : deployable.size}`"
      />
      <cc-statblock-panel
        v-if="deployable.armor"
        inline
        class="mx-1"
        icon="mdi-shield"
        name="Armor"
        :value="deployable.armor"
      />
      <cc-statblock-panel
        v-if="deployable.hp || deployable.size"
        inline
        class="mx-1"
        icon="mdi-heart"
        name="HP"
        :value="
          deployable.hp
            ? deployable.hp.toString().replace(/[{}]/gim, '')
            : parseFloat(deployable.size || 0.5) * 10
        "
      />
      <cc-statblock-panel
        v-if="deployable.size"
        icon="cc:evasion"
        inline
        class="mx-1"
        name="Evasion"
        :value="deployable.evasion || 5"
      />
      <cc-statblock-panel
        v-if="deployable.edef"
        inline
        class="mx-1"
        icon="cc:e_def"
        name="E-Defense"
        :value="deployable.edef"
      />
      <cc-statblock-panel
        v-if="deployable.heatcap"
        inline
        class="mx-1"
        icon="cc:heat"
        name="Heat Capacity"
        :value="deployable.heatcap"
      />
      <cc-statblock-panel
        v-if="deployable.sensor"
        inline
        class="mx-1"
        icon="cc:sensor"
        name="Sensor Range"
        :value="deployable.sensor"
      />
      <cc-statblock-panel
        v-if="deployable.techattack"
        inline
        class="mx-1"
        icon="cc:full_tech"
        name="Tech Attack"
        :value="deployable.techattack"
      />
      <cc-statblock-panel
        v-if="deployable.repcap"
        inline
        class="mx-1"
        icon="cc:repair"
        name="Repair Capacity"
        :value="deployable.repcap"
      />
      <cc-statblock-panel
        v-if="deployable.save"
        inline
        class="mx-1"
        icon="cc:save"
        name="Save Target"
        :value="deployable.save"
      />
      <cc-statblock-panel
        v-if="deployable.speed"
        inline
        class="mx-1"
        icon="mdi-arrow-right-bold-hexagon-outline"
        name="Speed"
        :value="deployable.speed"
      />
    </v-row>
    <p v-html-safe="deployable.detail" class="body-text pa-2 pt-4" />
    <div v-if="actions.length">
      <v-row no-gutters justify="center">
        <v-col v-for="a in actions" cols="auto">
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
  computed: {
    actions() {
      return this.deployable.actions ? this.deployable.actions.map((x) => new Action(x)) : [];
    },
  },
};
</script>
