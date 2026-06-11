<template>
  <div>
    <div>
      <cc-alert v-if="weapon.Destroyed"
        color="error"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        {{ $t('active.weaponAttack.destroyed') }}
      </cc-alert>
      <cc-alert v-if="weapon.Used"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        {{ $t('active.weaponAttack.alreadyActivated') }}
        <span v-if="weapon.Used && weapon.IsLoading">
          {{ $t('active.weaponAttack.mustReload') }}
        </span>
      </cc-alert>
      <cc-alert v-if="ordnanceWarning"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        {{ $t('active.weaponAttack.ordnanceMech') }}
      </cc-alert>
      <cc-alert v-if="weapon.IsLimited && weapon.Uses >= weapon.MaxUses && !weapon.CanSetUses"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        {{ $t('active.weaponAttack.outOfUses') }}
      </cc-alert>
    </div>

    <cc-panel v-if="weapon.Mod"
      color="mod"
      variant="outlined"
      class="mb-2">
      <div class="text-cc-overline">
        <v-icon icon="cc:weaponmod"
          class="mt-n1 mr-1" />
        {{ weapon.Mod.Name }}
      </div>
      <p v-html-safe="weapon.Mod.Effect"
        class=text-text />
    </cc-panel>

    <div v-if="weapon.Profiles.length > 1">
      <v-btn v-for="(profile, index) in weapon.Profiles"
        :key="`profile_${index}`"
        size="small"
        flat
        tile
        :color="index === weapon.ProfileIndex ? 'primary' : 'panel'"
        height="24"
        :style="`width: calc(100%/${weapon.Profiles.length})`"
        @click="weapon.ProfileIndex = index">
        {{ profile.Name }}
      </v-btn>
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
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../../../encounterContext'
import type { CombatantData } from '@/classes/encounter/Encounter'
import { computed } from 'vue'
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon';
import EffectApplicator from '@/ui/components/chips/_activeeffect/EffectApplicator.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = withDefaults(defineProps<{
  event: WeaponAttackEvent
  profile: WeaponProfile
  isAdditionalAux?: boolean
}>(), {
  isAdditionalAux: false
})

const isPilotSheet = computed(() => {
      return encounterInstance.value.ItemType === 'PilotSheet';
    })
const ordnanceWarning = computed(() => {
      if (!props.profile) return false;
      if (props.profile.Tags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return owner.value.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    })
const canUse = computed(() => {
      if (!props.profile) return false;
      return !props.profile.Used && !props.profile.Parent.Destroyed &&
        (!props.profile.Parent.IsLimited || props.profile.Uses > 0);
    })
const weapon = computed(() => {
      return props.profile.Parent;
    })
</script>
