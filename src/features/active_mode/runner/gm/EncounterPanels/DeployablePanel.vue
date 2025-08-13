<template>
  <panel-base v-if="isDeployable" :encounter-instance="encounterInstance" :item="combatant" />

  <div v-else>
    <cc-alert
      v-if="combatant.CombatController.IsDestroyed"
      class="ma-2"
      color="error"
      prominent
      outlined>
      <v-icon icon="cc:destroyed" size="large" start />
      <span class="text-cc-overline">{{ combatant.ItemType }} DESTROYED</span>
    </cc-alert>
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

          <v-row class="mt-n1">
            <v-col
              cols="auto"
              v-for="(stat, index) in combatant.StatController.GetStatCollection([
                'hull',
                'agi',
                'sys',
                'eng',
              ])">
              <v-tooltip :text="stat.title" location="top" open-delay="400">
                <template #activator="{ props }">
                  <v-icon v-bind="props" size="x-large" class="mt-n2 mr-1" :icon="stat.icon" />
                  <span class="heading h2 text-accent">
                    {{ combatant.StatController.CurrentStats[stat.key] }}
                  </span>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="1" />
            <v-col
              cols="auto"
              v-for="(stat, index) in combatant.StatController.GetStatCollection([
                'evasion',
                'edef',
                'techattack',
                'sensorRange',
                'saveTarget',
              ])">
              <v-tooltip :text="stat.title" location="top" open-delay="400">
                <template #activator="{ props }">
                  <v-icon v-bind="props" size="x-large" class="mt-n2 mr-1" :icon="stat.icon" />
                  <span class="heading h2 text-accent">
                    {{ combatant.StatController.CurrentStats[stat.key] }}
                  </span>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <cc-tickbar
                v-model="combatant.StatController.CurrentStats['hp']"
                v-model:secondary="combatant.StatController.CurrentStats['structure']"
                v-model:tertiary="combatant.StatController.CurrentStats['overshield']"
                primary-label="Hit Points"
                :secondary-label="combatant.StatController.MaxStats['structure'] && 'Structure'"
                tertiary-label="Overshield"
                color="hp"
                secondary-color="structure"
                tertiary-color="overshield"
                icon="mdi-heart-outline"
                secondary-icon="cc:structure"
                tertiary-icon="mdi-hexagon-multiple-outline"
                :ticks="combatant.StatController.MaxStats['hp']"
                :secondary-ticks="combatant.StatController.MaxStats['structure']"
                editable />
            </v-col>
            <v-col cols="auto">
              <stat-mini-panel
                title="armor"
                icon="mdi-shield-outline"
                color="armor"
                v-model="combatant.StatController.CurrentStats['armor']" />
            </v-col>
          </v-row>

          <v-row>
            <v-col align-self="center">
              <cc-tickbar
                v-model="combatant.StatController.CurrentStats['heatcap']"
                v-model:secondary="combatant.StatController.CurrentStats['stress']"
                :value-atlas="overchargeTrack"
                :secondary-label="combatant.StatController.MaxStats['stress'] && 'Reactor Stress'"
                :color="combatant.CombatController.IsInDangerZone ? 'dangerzone' : 'heat'"
                secondary-color="stress"
                icon="cc:heat"
                secondary-icon="cc:reactor"
                :ticks="combatant.StatController.MaxStats['heatcap']"
                :secondary-ticks="combatant.StatController.MaxStats['stress']" />
            </v-col>
            <v-col cols="auto">
              <stat-mini-panel
                title="burn"
                icon="cc:burn"
                color="damage--burn"
                v-model="combatant.StatController.CurrentStats['burn']" />
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <cc-tickbar
                v-if="combatant.StatController.MaxStats['speed']"
                v-model="combatant.StatController.CurrentStats['speed']"
                color="primary"
                min-width="150px"
                space
                icon="mdi-arrow-right-bold-hexagon-outline"
                class="mb-1"
                :ticks="combatant.StatController.MaxStats['speed']" />
              <cc-tickbar
                v-if="combatant.StatController.MaxStats['repairCapacity']"
                v-model="combatant.StatController.CurrentStats['repairCapacity']"
                color="success"
                icon="cc:repair"
                min-width="150px"
                space
                reverse
                :ticks="combatant.StatController.MaxStats['repairCapacity']" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-row>
      <v-col>
        <cc-button block color="primary" size="small" @click="remove">Remove Deployable</cc-button>
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
  },
  methods: {
    remove() {
      const combatant = this.encounterInstance.Combatants.find(
        (c) => c.ID === this.combatant.Owner.ID
      );
      combatant.deployables.splice(
        combatant.deployables.findIndex((d) => d.ID === this.combatant.ID),
        1
      );
      this.$emit('deselect', combatant);
    },
  },
};
</script>
