<template>
  <div>
    <cc-alert
      v-if="combatant.CombatController.IsDestroyed"
      class="ma-2"
      color="error"
      prominent
      outlined>
      <v-icon icon="cc:destroyed" size="large" start />
      <span class="text-cc-overline">{{ combatant.ItemType }} DESTROYED</span>
    </cc-alert>

    <cc-panel class="mb-4" :title="combatant.Base.Name" :icon="combatant.Base.Icon" outlined>
      <div v-html="combatant.Base.Detail" />
      <div v-html="combatant.Base.Description" />
    </cc-panel>

    <panel-base
      :encounter-instance="encounterInstance"
      :item="combatant"
      no-stats
      no-actions
      no-conditions
      hide-palette>
      <template #name-block>
        <v-card flat tile class="pa-2">
          <v-row class="pr-4">
            <v-col>
              <v-row no-gutters align="center">
                <v-col cols="auto" align-self="center" class="mr-2">
                  <v-icon :icon="combatant.Base.Icon" size="60" />
                </v-col>
                <v-col cols="auto">
                  <div class="heading h2">{{ combatant.Name }}</div>
                  <div class="text-cc-overline">
                    {{ combatant.Base.Type }}
                    <cc-slashes class="ml-1 mr-2" />
                    <span class="text-disabled">Owned by</span>
                    <b>&nbsp;{{ owner.Callsign || owner.Name || 'Unknown' }}</b>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </panel-base>

    <v-row class="mt-2">
      <v-col>
        <cc-button block color="error" size="small" @click="remove">
          Remove {{ combatant.Base.Type }}
        </cc-button>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { remove } from 'lodash';
import StatMiniPanel from './_components/StatMiniPanel.vue';
import PanelBase from './_PanelBase.vue';

export default {
  name: 'DeployablePanel',
  components: {
    PanelBase,
    StatMiniPanel,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isDeployable() {
      return this.combatant.Base.Type === 'Deployable';
    },
    owner() {
      return this.combatant.Owner.actor;
    },
    orderedStats() {
      const order = [
        'activations',
        'overshield',
        'hp',
        'structure',
        'overcharge',
        'heatcap',
        'stress',
        'speed',
        'repcap',
      ];
      const hide = ['activations', 'armor', 'burn', 'overshield'];

      return this.combatant.StatController.TrackableStats.filter((s) => !hide.includes(s.key)).sort(
        (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
      );
    },
  },
  methods: {
    remove() {
      const combatant = this.encounterInstance.Combatants.find(
        (c) => c.id === this.combatant.Owner.id
      );
      const idx = combatant.deployables.findIndex((d) => d.id === this.combatant.id);
      if (idx === -1) return;
      combatant.deployables.splice(idx, 1);
      this.$emit('deselect', combatant);
    },
  },
};
</script>
