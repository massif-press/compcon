<template>
  <v-row dense>
    <v-col>
      <simple-mini-panel v-if="item.StatController.MaxStats['hp']"
        v-model.number="item.StatController.CurrentStats['hp']"
        :max="item.StatController.MaxStats['hp']"
        title="Hit Points"
        color=hp
        icon="mdi-heart-outline" />
      <simple-mini-panel v-if="item.StatController.MaxStats['structure']"
        v-model.number="item.StatController.CurrentStats['structure']"
        :max="item.StatController.MaxStats['structure']"
        title="Structure"
        color=hp
        icon="cc:structure" />
    </v-col>
    <v-col cols="12"
      md="">
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['overshield']"
        title="Overshield"
        color=hp
        icon="mdi-hexagon-multiple-outline" />
      <simple-mini-panel title="armor"
        icon="mdi-shield-outline"
        color="armor"
        :base-value="item.StatController.MaxStats['armor']"
        v-model.number="item.StatController.CurrentStats['armor']" />
    </v-col>
  </v-row>

  <v-row v-if="item.StatController.MaxStats['heatcap']"
    dense>
    <v-col>
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['heatcap']"
        :max="item.StatController.MaxStats['heatcap']"
        title="Heat"
        color=heat
        icon="cc:heat" />
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['stress']"
        :max="item.StatController.CurrentStats['stress']"
        title="Stress"
        color=stress
        icon="cc:reactor" />

    </v-col>
    <v-col cols="12"
      md="">
      <simple-mini-panel title="Burn"
        icon="cc:burn"
        color="damage--burn"
        :base-value="item.StatController.MaxStats['burn']"
        v-model.number="item.StatController.CurrentStats['burn']" />

      <v-row v-if="item.StatController.MaxStats['overcharge']"
        no-gutters
        align="center"
        class="bg-panel p5-1">
        <v-col>
          <div class="heading mt-1 pb-1">
            <v-icon color="overcharge"
              icon="cc:overcharge"
              class="mx-1 mt-n1" />
            overcharge
          </div>
        </v-col>
        <v-col cols="auto"
          class="mb-n1">
          <v-rating v-model="item.StatController.CurrentStats['overcharge']"
            color=overcharge
            empty-icon="cc:overcharge"
            full-icon="mdi-hexagon"
            density="compact"
            :length="overchargeTrack.length"
            clearable
            hover />
        </v-col>
        <v-col cols="auto"
          class="heading">

          <cc-chip class="mr-2">
            {{ overchargeTrack[item.StatController.CurrentStats['overcharge'] - 1] || 0 }}
            <v-icon icon="cc:heat"
              class="mt-n1 ml-n1"
              color="heat" />
          </cc-chip>
        </v-col>
      </v-row>

    </v-col>
  </v-row>


  <v-row v-if="item.StatController.MaxStats['speed']"
    dense
    class="mb-3">
    <v-col cols="12"
      md="">
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['speed']"
        :max="item.StatController.MaxStats['speed']"
        title="Movement"
        color=primary
        icon="mdi-arrow-right-bold-hexagon-outline" />
    </v-col>
    <v-col v-if="item.StatController.MaxStats['repairCapacity']"
      cols="12"
      md="">
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['repairCapacity']"
        :max="item.StatController.MaxStats['repairCapacity']"
        title="Repair Cap."
        color=success
        icon="cc:repair" />
    </v-col>
  </v-row>
  <simple-mini-panel v-if="!item.StatController.MaxStats['heatcap']"
    v-model.number="item.StatController.CurrentStats['burn']"
    title="burn"
    icon="cc:burn"
    color="damage--burn" />


  <v-menu v-if="item.ItemType === 'mech'">
    <template #activator="{ props }">
      <cc-button block
        size="x-small"
        variant="outlined"
        :prepend-icon="currentIcon"
        :color="item.CombatController.CorePower ? 'core' : 'grey'"
        @click.stop="props.onClick($event)">
        Core Power {{ item.CombatController.CorePower ? 'Ready' : 'Unavailable' }}
      </cc-button>

    </template>
    <v-card flat
      tile
      class="pt-2 text-cc-overline text-center"
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
</template>

<script lang="ts">
import { Rules } from '@/class';
import StatMiniPanel from './StatMiniPanel.vue';
import SimpleMiniPanel from './SimpleMiniPanel.vue';


export default {
  name: 'trackable-stats-complex',
  components: {
    StatMiniPanel,
    SimpleMiniPanel,
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