<template>
  <div>
    <div>
      <cc-alert v-if="weapon.Used"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This weapon has already been activated.
        <span v-if="weapon.Used && weapon.IsLoading">
          It must be reloaded before it can be used again.
        </span>
      </cc-alert>
      <cc-alert v-if="ordnanceWarning"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This pilot has taken non-Protocol actions this turn. This ordnance weapon cannot be
        activated.
      </cc-alert>
    </div>

    <effect-applicator :pc="isPilotSheet"
      :event="event.BaseEvent" />

    <cc-panel v-for="(e, index) in event.TargetEvents"
      :key="`target-${index}`"
      :title="e.Effect.Name"
      density="compact"
      variant="tonal"
      class="mt-n2">
      <div class="text-text">
        {{ e.Effect.Detail }}
        <effect-applicator :pc="isPilotSheet"
          :event="e" />
      </div>
    </cc-panel>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon'
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import EffectApplicator from '@/ui/components/chips/_activeeffect/EffectApplicator.vue';

defineOptions({ name: 'MechWeaponAttack' })

const props = withDefaults(defineProps<{
  event: WeaponAttackEvent
  weapon: PilotWeapon
  owner: object
  encounter: object
  isAdditionalAux?: boolean
}>(), {
  isAdditionalAux: false
})

const isPilotSheet = computed(() => {
      return props.encounter.ItemType === 'PilotSheet';
    })
const ordnanceWarning = computed(() => {
      if (!props.weapon) return false;
      if (props.weapon.Tags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return props.owner.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    })
const canUse = computed(() => {
      if (!props.weapon) return false;
      return !props.weapon.Used
    })
</script>
