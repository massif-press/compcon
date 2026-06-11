<template>
  <div>
    <div>
      <cc-alert v-if="weapon.Used"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        {{ $t('active.weaponAttack.alreadyActivated') }}
        <span v-if="weapon.Used && weapon.IsRecharging">
          {{ $t('active.weaponAttack.mustRecharge') }}
        </span>
      </cc-alert>
      <cc-alert v-if="ordnanceWarning"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        {{ $t('active.weaponAttack.ordnanceUnit') }}
      </cc-alert>
    </div>
    <v-card v-if="attackCount > 1"
      color="panel"
      flat
      tile
      class="mt-2 text-center mx-n7 text-cc-overline pa-1">
      {{ $t('active.weaponAttack.canMake', { n: attackCount }) }}
    </v-card>

    <div v-html-safe="weapon.Effect"
      class="text-text mt-2" />


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
import { useEncounterContext } from '../../../encounterContext'
import { computed } from 'vue'
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon';
import NpcModInset from '@/features/gm/npc_roster/npcs/_components/NpcModInset.vue';
import EffectApplicator from '@/ui/components/chips/_activeeffect/EffectApplicator.vue';

defineOptions({ name: 'MechWeaponAttack' })

const { owner } = useEncounterContext()

const props = withDefaults(defineProps<{
  event: WeaponAttackEvent
  weapon: NpcWeapon
  isAdditionalAux?: boolean
}>(), {
  isAdditionalAux: false
})

const mods = computed(() => {
  if (!props.weapon) return null;
  return owner.value.actor.NpcFeatureController?.GetModifiers(props.weapon) || [];
})
const ordnanceWarning = computed(() => {
  if (!props.weapon) return false;
  if (props.weapon.Tags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
    return owner.value.actor.CombatController.CanActivate('ordnance') === false;
  }
  return false;
})
const attackCount = computed(() => {
  if (!props.weapon) return 0;
  return props.weapon.getAttacks(owner.value.actor.CombatController.Tier);
})

</script>
