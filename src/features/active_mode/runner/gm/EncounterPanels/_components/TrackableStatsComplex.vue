<template>
  <v-row>
    <v-col>
      <cc-tickbar v-model="item.StatController.CurrentStats['hp']"
        v-model:secondary="item.StatController.CurrentStats['structure']"
        v-model:tertiary="item.StatController.CurrentStats['overshield']"
        primary-label="Hit Points"
        :secondary-label="item.StatController.MaxStats['structure'] && 'Structure'"
        tertiary-label="Overshield"
        color="hp"
        secondary-color="structure"
        tertiary-color="overshield"
        icon="mdi-heart-outline"
        secondary-icon="cc:structure"
        tertiary-icon="mdi-hexagon-multiple-outline"
        :ticks="item.StatController.MaxStats['hp']"
        :secondary-ticks="item.StatController.MaxStats['structure']"
        editable />
    </v-col>
    <v-col cols="12"
      md="auto">
      <stat-mini-panel title="armor"
        icon="mdi-shield-outline"
        color="armor"
        :base-value="item.StatController.MaxStats['armor']"
        v-model.number="item.StatController.CurrentStats['armor']" />
    </v-col>
  </v-row>

  <v-row v-if="item.StatController.MaxStats['heatcap']">
    <v-col>
      <cc-tickbar v-model="item.StatController.CurrentStats['heatcap']"
        v-model:secondary="item.StatController.CurrentStats['stress']"
        v-model:tertiary="item.StatController.CurrentStats['overcharge']"
        :value-atlas="overchargeTrack"
        :secondary-label="item.StatController.MaxStats['stress'] && 'Reactor Stress'"
        :tertiary-label="item.ItemType === 'mech' && 'Overcharge'"
        :color="item.CombatController.IsInDangerZone ? 'dangerzone' : 'heat'"
        secondary-color="stress"
        tertiary-color="overcharge"
        icon="cc:heat"
        secondary-icon="cc:reactor"
        tertiary-icon="mdi-decagram-outline"
        :ticks="item.StatController.MaxStats['heatcap']"
        :secondary-ticks="item.StatController.MaxStats['stress']"
        :tertiary-ticks="3" />
    </v-col>
    <v-col cols="12"
      md="auto">
      <stat-mini-panel title="burn"
        icon="cc:burn"
        color="damage--burn"
        v-model.number="item.StatController.CurrentStats['burn']" />
    </v-col>
  </v-row>
  <v-row class="mb-3">
    <v-col>
      <cc-tickbar v-if="item.StatController.MaxStats['speed']"
        v-model="item.StatController.CurrentStats['speed']"
        color="primary"
        min-width="150px"
        space
        icon="mdi-arrow-right-bold-hexagon-outline"
        class="mb-1"
        :ticks="item.StatController.MaxStats['speed']" />
      <cc-tickbar v-if="item.StatController.MaxStats['repairCapacity']"
        v-model="item.StatController.CurrentStats['repairCapacity']"
        color="success"
        icon="cc:repair"
        min-width="150px"
        space
        reverse
        :ticks="item.StatController.MaxStats['repairCapacity']" />
    </v-col>
    <v-col cols="auto"
      v-if="!item.StatController.MaxStats['heatcap']">
      <stat-mini-panel title="burn"
        icon="cc:burn"
        color="damage--burn"
        v-model.number="item.StatController.CurrentStats['burn']" />
    </v-col>
    <v-col cols="12"
      md="auto"
      v-if="item.ItemType === 'mech'">
      <v-menu>
        <template #activator="{ props }">
          <stat-mini-panel v-model="item.CombatController.CorePower"
            title="core"
            :icon="currentIcon"
            :color="item.CombatController.CorePower ? 'core' : 'grey'"
            @click.stop="props.onClick($event)"
            boolean />
        </template>
        <v-card flat
          tile
          class="pt-4 text-cc-overline text-center"
          border="sm">
          <div v-if="item.CombatController.CorePower">Clear this mech's</div>
          <div v-else>Restore this mech's</div>
          core power?
          <template #actions>
            <cc-button block
              :color="item.CombatController.CorePower ? 'error' : 'core'"
              size="x-small"
              :prepend-icon="currentIcon"
              @click="drainBattery">
              Confirm {{ item.CombatController.CorePower ? 'Clear' : 'Restore' }} Core
            </cc-button>
          </template>
        </v-card>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Rules } from '@/class';
import StatMiniPanel from './StatMiniPanel.vue';


export default {
  name: 'trackable-stats-complex',
  components: {
    StatMiniPanel,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    batteryIcons: [
      'mdi-battery-outline',
      'mdi-battery-low',
      'mdi-battery-medium',
      'mdi-battery-high',
    ],
    batteryIndex: 3,
  }),
  computed: {
    currentIcon() {
      return this.batteryIcons[this.batteryIndex];
    },
    overchargeTrack() {
      return this.item.OverchangeTrack ? this.item.OverchangeTrack : Rules.Overcharge;
    },
  },
  methods: {
    getIcon(stat) {
      const icons = {
        structure: 'cc:structure',
        armor: 'mdi-shield-outline',
        hp: 'mdi-heart-outline',
        reactor: 'cc:reactor',
        heat: 'cc:heat',
        repair: 'cc:repair',
        techattack: 'cc:tech_quick',
      };
      return icons[stat];
    },

    drainBattery() {
      if (this.batteryIndex > 0) {
        this.item.CombatController.CorePower = false;
        const interval = setInterval(() => {
          this.batteryIndex--;
          if (this.batteryIndex === 0) clearInterval(interval);
        }, 60);
      } else {
        this.item.CombatController.CorePower = true;
        this.batteryIndex = 3;
      }
    },
  },
};
</script>