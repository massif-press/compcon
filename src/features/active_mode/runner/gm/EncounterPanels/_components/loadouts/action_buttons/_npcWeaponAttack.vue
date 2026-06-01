<template>
  <div>
    <div>
      <cc-alert v-if="weapon.Used"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This weapon has already been activated.
        <span v-if="weapon.Used && weapon.IsRecharging">
          It must be recharged before it can be used again.
        </span>
      </cc-alert>
      <cc-alert v-if="ordnanceWarning"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This unit has taken non-Protocol actions this turn. This ordnance weapon cannot be
        activated.
      </cc-alert>
    </div>

    <div v-if="mods"
      class="mt-3"
      style="font-size: 14px;">
      <npc-mod-inset v-for="mod in mods"
        :key="mod.ID"
        :mod="mod"
        :tier="owner.actor.NpcClassController?.Tier || 1" />
    </div>

    <effect-applicator :event="event.BaseEvent" />

    <cc-panel v-for="(e, index) in event.TargetEvents"
      :key="`target-${index}`"
      :title="e.Effect.Name"
      density="compact"
      variant="tonal"
      class="mt-n2">
      <div class="text-text">
        {{ e.Effect.Detail }}
        <effect-applicator :event="e" />
      </div>
    </cc-panel>
  </div>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { CombatantData } from '@/classes/encounter/Encounter'
import { computed } from 'vue'
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon';
import NpcModInset from '@/features/gm/npc_roster/npcs/_components/NpcModInset.vue';
import EffectApplicator from '@/ui/components/chips/_activeeffect/EffectApplicator.vue';

defineOptions({ name: 'MechWeaponAttack' })

const props = withDefaults(defineProps<{
  event: WeaponAttackEvent
  weapon: NpcWeapon
  owner: CombatantData
  encounterInstance: EncounterInstance
  isAdditionalAux?: boolean
}>(), {
  isAdditionalAux: false
})

const mods = computed(() => {
      if (!props.weapon) return null;
      return props.owner.actor.NpcFeatureController?.GetModifiers(props.weapon) || [];
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
