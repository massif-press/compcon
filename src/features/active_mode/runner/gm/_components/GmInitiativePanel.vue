<template>
  <div v-if="expanded"
    class="mb-1">
    <v-btn-group flat
      tile
      style="width: 100%; height: 20px"
      color="primary">
      <v-btn size="x-small"
        style="width: 25%"
        @click="itemSort('name')">
        <v-icon size="x-large"
          icon="mdi-format-text-variant" />
      </v-btn>
      <v-btn size="x-small"
        style="width: 25%"
        @click="itemSort('type')">
        <v-icon size="x-large"
          icon="cc:pilot" />
      </v-btn>
      <v-btn size="x-small"
        style="width: 25%"
        @click="itemSort('activations')">
        <v-icon size="x-large"
          icon="cc:activate" />
      </v-btn>
      <v-btn size="x-small"
        style="width: 25%"
        @click="itemSort('side')">
        <v-icon size="x-large"
          icon="mdi-flag" />
      </v-btn>
    </v-btn-group>
  </div>
  <sortable ref="sortableEl"
    :key="sortableKey"
    :sort="true"
    :list="activeCombatants"
    :options="{
      animation: 250,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      handle: '.handle',
    }"
    item-key="index">
    <template #item="{ element }">
      <div class="mb-1">
        <component :is="getComponent(element)"
          :combatant="element"
          :collapsed="!expanded"
          :selected="selected && selected.id === element.id"
          @select="$emit('select', $event)" />
      </div>
    </template>
  </sortable>

  <v-card v-if="reinforcements.length"
    class="ma-2"
    flat
    tile
    color="background">
    <div v-if="expanded"
      class="text-cc-overline pa-1 text-disabled d-flex align-center"
      style="cursor: pointer; user-select: none"
      @click="reinforcementsCollapsed = !reinforcementsCollapsed">
      <cc-slashes />
      {{ $t('active.initiative.reinforcementsN', { n: reinforcements.length }) }}
      <v-spacer />
      <v-icon size="small"
        :icon="reinforcementsCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up'" />
    </div>

    <v-scroll-y-reverse-transition>
      <div v-if="!reinforcementsCollapsed">
        <reinforcement-list-item v-for="r in reinforcements"
          :key="r.id"
          :combatant="r"
          :collapsed="!expanded"
          :selected="selected && selected.id === r.id"
          :round="encounterInstance.Round"
          is-reinforcement
          no-drag
          @activate="activateReinforcement(r)"
          @select="$emit('select', $event)" />
      </div>
    </v-scroll-y-reverse-transition>
  </v-card>

  <v-card v-for="group in statusGroups"
    :key="group.label"
    class="ma-2"
    flat
    tile
    color="background">
    <div v-if="expanded"
      class="text-cc-overline pa-1 text-disabled d-flex align-center"
      style="cursor: pointer; user-select: none"
      @click="collapsedGroups[group.label] = !collapsedGroups[group.label]">
      <cc-slashes />
      {{ $t('active.initiative.statusGroupN', { status: group.label, n: group.combatants.length }) }}
      <v-spacer />
      <v-icon size="small"
        :icon="collapsedGroups[group.label] ? 'mdi-chevron-down' : 'mdi-chevron-up'" />
    </div>
    <v-divider v-else
      class="my-2" />

    <v-scroll-y-reverse-transition>
      <div v-if="!collapsedGroups[group.label]">
        <destroyed-list-item v-for="r in group.combatants"
          :key="r.id"
          :combatant="r"
          :collapsed="!expanded"
          :selected="selected && selected.id === r.id"
          :icon="group.icon"
          no-drag
          @select="$emit('select', $event)" />
      </div>
    </v-scroll-y-reverse-transition>
  </v-card>

  <div style="height: 50px" />

  <div style="position: fixed; bottom: 35px; left: 0"
    :style="{ width: expanded ? '420px' : '92px' }">
    <v-menu>
      <template #activator="{ props }">
        <v-btn v-if="expanded"
          v-bind="props"
          block
          flat
          tile
          color="primary"
          prepend-icon="mdi-plus">
          {{ $t('mainMenu.collection.addItem') }}
        </v-btn>
        <v-btn v-else
          v-bind="props"
          icon
          block
          flat
          tile
          color="primary"
          height="36">
          <v-icon size="x-large"
            icon="mdi-plus" />
        </v-btn>
      </template>
      <v-card tile
        border
        color="background">
        <gm-add-from-roster-menu :encounter-instance="encounterInstance"
          item-type="npc" />
        <v-divider />
        <gm-add-from-roster-menu :encounter-instance="encounterInstance"
          item-type="pc" />
        <v-divider />
        <gm-add-other-menu :encounter-instance="encounterInstance" />
        <v-divider />
        <gm-add-stub-menu :encounter-instance="encounterInstance" />
        <v-divider />
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, ref } from 'vue'
import { Sortable } from 'sortablejs-vue3';
import UnitRunnerListItem from './ListItems/UnitRunnerListItem.vue';
import PilotRunnerListItem from './ListItems/PilotRunnerListItem.vue';
import DoodadRunnerListItem from './ListItems/DoodadRunnerListItem.vue';
import EidolonRunnerListItem from './ListItems/EidolonRunnerListItem.vue';
import GmAddFromRosterMenu from './ListItems/AddItems/GmAddFromRosterMenu.vue';
import GmAddOtherMenu from './ListItems/AddItems/GmAddOtherMenu.vue';
import GmAddStubMenu from './ListItems/AddItems/GmAddStubMenu.vue';
import PlaceholderRunnerListItem from './ListItems/PlaceholderRunnerListItem.vue';
import ReinforcementListItem from './ListItems/ReinforcementListItem.vue';
import DestroyedListItem from './ListItems/DestroyedListItem.vue';
import { CombatantData } from '@/classes/encounter/Encounter';
import { NpcStatus, PilotStatus, MechStatus } from '@/classes/enums';

defineOptions({ name: 'GmEncounterRunnerInitiativePanel' })

const ACTIVE_STATUSES = new Set<string>([
  NpcStatus.Operational,
  PilotStatus.Active,
  PilotStatus.Injured,
  MechStatus.Operational,
  MechStatus.Cascade,
])

// null == still in combat; otherwise the out-of-combat group key (a status label).
// A destroyed or reactor-melted actor (both zero structure => IsDestroyed) groups as Destroyed.
function statusGroupKey(c: CombatantData): string | null {
  const cc = c.actor.CombatController
  const isPilot = c.actor.ItemType === 'Pilot'
  if (isPilot && cc.IsDead) return PilotStatus.KIA
  if (cc.IsDestroyed) return NpcStatus.Destroyed
  const label = isPilot ? c.pilotStatus : c.status
  if (!label || ACTIVE_STATUSES.has(label)) return null
  return label
}

function isOutOfCombat(c: CombatantData): boolean {
  return statusGroupKey(c) !== null
}

const props = withDefaults(defineProps<{
  encounterInstance: EncounterInstance
  expanded?: boolean
  selected?: object
}>(), {
  expanded: true,
  selected: null
})

const emit = defineEmits<{
  'select': [payload: any]
}>()

const sortableEl = ref<any>(null)

const sort = ref('')
const sortAsc = ref(true)
const sortableKey = ref(`sk-0`)
const reinforcementsCollapsed = ref(false)
const collapsedGroups = ref<Record<string, boolean>>({})

const combatants = computed(() => {
  if (!props.encounterInstance || !props.encounterInstance.Combatants) {
    return [];
  }
  return props.encounterInstance.Combatants.filter((c) => !isOutOfCombat(c));
})
const activeCombatants = computed(() => {
  let list = combatants.value.filter((c) => !c.reinforcement);
  if (!sort.value) return list;
  list = [...list];
  if (sort.value === 'name') {
    list.sort((a, b) =>
      (a.actor.Callsign || a.actor.Name).localeCompare(b.actor.Callsign || b.actor.Name)
    );
  } else if (sort.value === 'type') {
    list.sort((a, b) => {
      if (a.actor.ItemType === 'Pilot') return -1;
      if (b.actor.ItemType === 'Pilot') return 1;
      if (a.actor.ItemType === b.actor.ItemType) {
        return (a.actor.Callsign || a.actor.Name).localeCompare(
          b.actor.Callsign || b.actor.Name
        );
      }
      return a.actor.ItemType.localeCompare(b.actor.ItemType);
    });
  } else if (sort.value === 'activations') {
    list.sort((a, b) => {
      const aVal = a.actor.CombatController?.StatController?.CurrentStats?.activations || -1;
      const bVal = b.actor.CombatController?.StatController?.CurrentStats?.activations || -1;
      return aVal - bVal;
    });
  } else if (sort.value === 'side') {
    list.sort((a, b) => a.side.localeCompare(b.side));
  }
  if (!sortAsc.value) list.reverse();
  return list;
})
const reinforcements = computed(() => {
  return combatants.value.filter((c) => c.reinforcement);
})
const statusGroups = computed(() => {
  const map = new Map<string, CombatantData[]>();
  for (const c of props.encounterInstance?.Combatants ?? []) {
    const key = statusGroupKey(c);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(c);
  }
  // Destroyed first, then remaining groups alphabetically.
  return [...map.entries()]
    .sort((a, b) => {
      if (a[0] === NpcStatus.Destroyed) return -1;
      if (b[0] === NpcStatus.Destroyed) return 1;
      return a[0].localeCompare(b[0]);
    })
    .map(([label, combatants]) => ({
      label,
      combatants,
      icon: label === NpcStatus.Destroyed ? 'cc:destroyed_outline' : 'mdi-exit-run',
    }));
})

function itemSort(key) {
  if (sort.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sort.value = key;
    sortAsc.value = true;
  }
  sortableKey.value = `sk-${Math.floor(Math.random() * 1000)}`;
}
function getItem(combatant) {
  if (combatant.type === 'unit') {
    return combatant.npc;
  }
  return null;
}
function activateReinforcement(combatant) {
  combatant.reinforcement = false;
}
const listItemMap: Record<string, any> = {
  pilot: PilotRunnerListItem,
  unit: UnitRunnerListItem,
  doodad: DoodadRunnerListItem,
  eidolon: EidolonRunnerListItem,
  placeholder: PlaceholderRunnerListItem,
};
function getComponent(combatant: CombatantData) {
  return listItemMap[combatant.type] || UnitRunnerListItem;
}
</script>
