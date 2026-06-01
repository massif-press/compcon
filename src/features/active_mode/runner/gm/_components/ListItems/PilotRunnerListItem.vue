<template>
  <runner-list-item-base :actor="activeActor"
    :portrait="activeActor.Portrait"
    :deployed="combatant.deployables"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    @click="$emit('select', combatant)"
    @deployable-click="$emit('select', $event)">
    <div>
      <span class="heading h4">
        {{ combatant.actor.Callsign }}
      </span>
      <span class="text-caption text-disabled ml-2">
        <cc-slashes />
        {{ combatant.actor.Name }}
        <span v-if="combatant.actor.Player"
          v-text="`(${combatant.actor.Player})`"></span>
      </span>
    </div>
    <v-card v-if="mech.CombatController.IsAIControlled"
      flat
      tile
      class="mb-1">
      <div class="text-cc-overline text-center">
        <div class="text-disabled">Mech under AI Control</div>
        <v-divider />
        <div class="text-accent">{{aiSystems.map((x) => x.Name).join(' // ')}}</div>
      </div>
    </v-card>
    <div v-if="mech.CombatController.IsInSelfDestruct"
      class="sd-pulse">
      <div class="text-cc-overline text-center">
        <v-icon icon="mdi-alert-outline"
          size="15" />
        SELF DESTRUCT INITIATED
        <v-icon icon="mdi-alert-outline"
          size="15" />
      </div>
    </div>
  </runner-list-item-base>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import { computed, onMounted } from 'vue'
import RunnerListItemBase from './RunnerListItemBase.vue';

const props = withDefaults(defineProps<{
  combatant: CombatantData
  collapsed?: boolean
  selected?: boolean
}>(), {
  collapsed: false
})

const emit = defineEmits<{
  'select': []
}>()

const mech = computed(() => {
      return props.combatant.actor.ActiveMech;
    })
const activeActor = computed(() => {
      if (!mech.value) {
        return props.combatant.actor;
      } else if (mech.value.CombatController.Mounted) {
        return mech.value;
      }
      return props.combatant.actor;
    })
const aiSystems = computed(() => {
      if (!mech.value) return [];
      return mech.value.MechLoadoutController.ActiveLoadout.AISystems;
    })
const mounted = computed(() => {
      return mech.value && mech.value.CombatController.Mounted;
    })

onMounted(() => {
return mech.value && mech.value.CombatController.Mounted;
})
</script>

<style scoped>
.sd-pulse {
  animation: sd-pulse 3s infinite ease-in-out;
  padding: 2px;
  corner-shape: bevel;
  border-radius: 20px;
}

@keyframes sd-pulse {
  0% {
    background-color: rgb(145, 11, 50);
  }

  50% {
    background-color: rgb(230, 39, 39);
  }

  100% {
    background-color: rgb(145, 11, 50);
  }
}
</style>
