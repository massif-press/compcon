<template>
  <v-row>
    <v-col v-if="item.StatController.MaxStats['hp']">
      <cc-tickbar v-model="item.StatController.CurrentStats['hp']"
        v-model:secondary="item.StatController.CurrentStats['structure']"
        v-model:tertiary="item.StatController.CurrentStats['overshield']"
        primary-label="Hit Points"
        :secondary-label="item.StatController.MaxStats['structure'] ? 'Structure' : undefined"
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
    <v-col v-else>
      <cc-tickbar v-model="item.StatController.CurrentStats['overshield']"
        primary-label="Overshield"
        color="overshield"
        icon="mdi-hexagon-multiple-outline"
        :ticks="100"
        editable />
    </v-col>
    <v-col cols="12"
      md="auto">
      <stat-mini-panel v-model.number="item.StatController.CurrentStats['armor']"
        title="armor"
        icon="mdi-shield-outline"
        color="armor"
        :base-value="item.StatController.MaxStats['armor']" />
    </v-col>
  </v-row>
  <slot name="dmg" />
  <div class="mb-2" />


  <v-row v-if="item.StatController.MaxStats['heatcap']">
    <v-col>
      <cc-tickbar v-model="item.StatController.CurrentStats['heatcap']"
        v-model:secondary="item.StatController.CurrentStats['stress']"
        v-model:tertiary="item.StatController.CurrentStats['overcharge']"
        :value-atlas="overchargeTrack"
        :secondary-label="item.StatController.MaxStats['stress'] ? 'Reactor Stress' : undefined"
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
      <stat-mini-panel v-model.number="item.StatController.CurrentStats['burn']"
        title="burn"
        icon="cc:burn"
        color="damage--burn" />
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
    <v-col v-if="!item.StatController.MaxStats['heatcap']"
      cols="auto">
      <stat-mini-panel v-model.number="item.StatController.CurrentStats['burn']"
        title="burn"
        icon="cc:burn"
        color="damage--burn" />
    </v-col>
    <v-col v-if="item.ItemType === 'mech'"
      cols="12"
      md="auto">
      <v-menu>
        <template #activator="{ props }">
          <stat-mini-panel v-model="item.CombatController.CorePower"
            title="core"
            :icon="currentIcon"
            :color="item.CombatController.CorePower ? 'core' : 'grey'"
            boolean
            @click.stop="props.onClick($event)" />
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

<script setup lang="ts">
import { computed } from 'vue'
import StatMiniPanel from './StatMiniPanel.vue'
import { useTrackableStats } from './useTrackableStats'

const props = defineProps<{ item: object }>()

const { batteryIcons, batteryIndex, overchargeTrack, getIcon, drainBattery } = useTrackableStats(props)

const currentIcon = computed(() => !props.item.CombatController.CorePower ? 'mdi-battery-outline' : batteryIcons.value[batteryIndex.value])
</script>