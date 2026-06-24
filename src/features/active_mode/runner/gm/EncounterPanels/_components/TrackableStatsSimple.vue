<template>
  <v-row dense>
    <v-col v-if="item.StatController.MaxStats['hp']">
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['hp']"
        :max="item.StatController.MaxStats['hp']"
        :title="$t('active.stats.hitPoints')"
        color=hp
        icon="mdi-heart-outline" />
      <simple-mini-panel v-if="item.StatController.MaxStats['structure']"
        v-model.number="item.StatController.CurrentStats['structure']"
        :max="item.StatController.MaxStats['structure']"
        :title="$t('stats.structure')"
        color=hp
        icon="cc:structure" />
    </v-col>
    <v-col cols="12"
      md="">
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['overshield']"
        :title="$t('common.overshield')"
        color=hp
        icon="mdi-hexagon-multiple-outline" />
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['armor']"
        title="armor"
        icon="mdi-shield-outline"
        color="armor"
        :base-value="item.StatController.MaxStats['armor']" />
    </v-col>
  </v-row>
  <slot name="dmg" />

  <v-row v-if="item.StatController.MaxStats['heatcap']"
    dense>
    <v-col>
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['overcharge']"
        :max="3"
        :title="$t('common.overcharge')"
        color=overcharge
        icon="cc:overcharge" />
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['heatcap']"
        :max="item.StatController.MaxStats['heatcap']"
        :title="$t('pm.sheet.heat')"
        color=heat
        icon="cc:heat" />
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['stress']"
        :max="item.StatController.MaxStats['stress']"
        :title="$t('stats.stress')"
        color=stress
        icon="cc:reactor" />

    </v-col>
    <v-col cols="12"
      md="">
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['burn']"
        :title="$t('active.titles.burn')"
        icon="cc:burn"
        color="damage--burn"
        :base-value="item.StatController.MaxStats['burn']" />

      <v-row v-if="item.StatController.MaxStats['overcharge']"
        no-gutters
        align="center"
        class="bg-panel p5-1">
        <v-col>
          <div class="heading mt-1 pb-1">
            <v-icon color="overcharge"
              icon="cc:overcharge"
              class="mx-1 mt-n1" />
            {{ $t('common.overcharge') }}
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
        :title="$t('active.titles.movement')"
        color=primary
        icon="mdi-arrow-right-bold-hexagon-outline" />
    </v-col>
    <v-col v-if="item.StatController.MaxStats['repairCapacity']"
      cols="12"
      md="">
      <simple-mini-panel v-model.number="item.StatController.CurrentStats['repairCapacity']"
        :max="item.StatController.MaxStats['repairCapacity']"
        :title="$t('active.titles.repairCap')"
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
        {{ $t('active.trackable.corePower') }} {{ item.CombatController.CorePower ? $t('active.trackable.ready') : $t('pm.selectors.unavailable') }}
      </cc-button>

    </template>
    <v-card flat
      tile
      class="pt-2 text-cc-overline text-center"
      border="sm">
      <div v-if="item.CombatController.CorePower">{{ $t('active.trackable.clearMechCore') }}</div>
      <div v-else>{{ $t('active.trackable.restoreMechCore') }}</div>
      {{ $t('active.trackable.corePowerQ') }}
      <template #actions>
        <cc-button block
          :color="item.CombatController.CorePower ? 'error' : 'core'"
          size="x-small"
          :prepend-icon="currentIcon"
          @click="drainBattery">
          {{ $t('common.confirm') }} {{ item.CombatController.CorePower ? $t('common.clear') : $t('common.restore') }} {{ $t('common.core') }}
        </cc-button>
      </template>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SimpleMiniPanel from './SimpleMiniPanel.vue'
import { useTrackableStats } from './useTrackableStats'
import { ICombatant } from '@/classes/components/combat/ICombatant';

const props = defineProps<{ item: ICombatant }>()

const { batteryIcons, batteryIndex, overchargeTrack, drainBattery } = useTrackableStats(props)

const currentIcon = computed(() => batteryIcons.value[batteryIndex.value])
</script>