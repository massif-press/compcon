<template>
  <v-row no-gutters>
    <v-col class="heading h2 text-accent">
      {{ combatant.actor.Callsign }}
      <span class="text-cc-overline text-text">
        <cc-slashes />
        {{ combatant.actor.Name }}
      </span>
    </v-col>
    <v-col v-if="combatant.actor.Player"
      cols="auto">
      <span class="text-cc-overline pr-1">{{ $t('active.common.playedBy') }}</span>
      <b class="text-accent">{{ combatant.actor.Player }}</b>
    </v-col>
  </v-row>

  <v-row dense
    class="mt-n1">
    <v-col v-if="mech"
      :order="mounted ? 0 : 1"
      :cols="view === 'mech' ? '' : 'auto'">
      <cc-button size="small"
        :color="view === 'mech' ? 'primary' : 'panel'"
        block
        @click="view = 'mech'">
        {{ mech.Name }}
        <template v-if="!mobile"
          #subtitle>
          <span v-if="mounted"
            class="text-disabled">
            <cc-slashes />
            {{ $t('active.pcPanel.pilotMounted') }}
          </span>
        </template>
      </cc-button>
    </v-col>
    <v-col :cols="view === 'pilot' ? '' : 'auto'">
      <cc-button size="small"
        :color="view === 'pilot' ? 'primary' : 'panel'"
        block
        @click="view = 'pilot'">
        {{ combatant.actor.Callsign }}
        <template v-if="!mobile"
          #subtitle>
          <span v-if="!mounted"
            class="text-disabled">
            <cc-slashes />
            {{ $t('active.pcPanel.pilotUnmounted') }}
          </span>
        </template>
      </cc-button>
    </v-col>
  </v-row>

  <v-window v-model="view">
    <v-window-item value="mech">
      <mech-panel v-if="mech"
        :encounter-instance="encounterInstance"
        :combatant="combatant" />
    </v-window-item>
    <v-window-item value="pilot">
      <pilot-panel :encounter-instance="encounterInstance"
        :combatant="combatant" />
    </v-window-item>
  </v-window>

  <v-card flat
    tile>
    <div class="pa-2 mt-2">
      <v-row dense
        align="center"
        class="mb-2">
        <v-col>
          <div class="text-cc-overline text-disabled">{{ $t('active.pcPanel.reserves') }}</div>
        </v-col>
        <v-col v-if="orderedReserves.length"
          cols="auto"
          class="ml-auto">
          <cc-switch v-model="unusedOnly"
            :label="!unusedOnly ? 'Unused Only' : 'All'"
            inset
            dense />
        </v-col>
      </v-row>
      <div v-if="!orderedReserves.length"
        class="mt-n4 mb-4">
        <i class="text-disabled text-caption">{{ $t('active.pcPanel.noReserves') }}</i>
      </div>
      <v-row v-for="r in orderedReserves"
        :key="r.ID"
        dense>
        <v-col>
          <cc-reserve-item :reserve="r"
            small />
        </v-col>
        <v-col cols="auto">
          <cc-checkbox v-model="r.Used"
            color="primary"
            inset
            dense />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { CombatantData, Encounter } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, onMounted, provide, ref } from 'vue'
import { ReserveType } from '@/classes/enums'
import { EncounterContextKey } from './encounterContext';
import MechPanel from './MechPanel.vue';
import PilotPanel from './PilotPanel.vue';
import { useDisplay } from 'vuetify';

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  combatant: CombatantData
  encounterInstance: EncounterInstance
  encounter?: Encounter
  selected?: string | boolean | number | object
  sheet?: object
  pc?: object | string
}>()

provide(EncounterContextKey, {
  owner: computed(() => props.combatant),
  encounterInstance: computed(() => props.encounterInstance),
})

const emit = defineEmits<{
  'deselect': []
}>()

const view = ref('mech')
const unusedOnly = ref(false)

const mech = computed(() => {
      return props.combatant.actor.ActiveMech;
    })
const mounted = computed(() => {
      if (!mech.value) return false;
      return mech.value.CombatController.Mounted;
    })
const orderedReserves = computed(() => {
      const r = props.combatant.actor.ReservesController.Reserves.filter(
        (x) => x.Type !== ReserveType.Organization && x.Type !== ReserveType.Project
      );
      if (!unusedOnly.value) {
        return r.filter((x) => !x.Used).sort((a, b) => a.ResourceLabel.localeCompare(b.Name));
      }
      return r.sort((a, b) => {
        if (a.Used && !b.Used) return 1;
        if (!a.Used && b.Used) return -1;
        return a.Name.localeCompare(b.Name);
      });
    })

onMounted(() => {
if (!mech.value) return false;
      return mech.value.CombatController.Mounted;
})
</script>
