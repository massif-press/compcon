<template>
  <div>
    <div>
      <cc-alert v-if="weapon.Destroyed"
        color="error"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This weapon has been destroyed and must be repaired before it can be activated.
      </cc-alert>
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
        This mech has taken non-Protocol actions this turn. This ordnance weapon cannot be
        activated.
      </cc-alert>
      <cc-alert v-if="weapon.IsLimited && weapon.Uses >= weapon.MaxUses && !weapon.CanSetUses"
        color="warning"
        class="my-2">
        <v-icon start
          icon="mdi-alert" />
        This weapon is out of uses and cannot be activated this turn.
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
import { computed } from 'vue'
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon';
import EffectApplicator from '@/ui/components/chips/_activeeffect/EffectApplicator.vue';

const props = withDefaults(defineProps<{
  event: WeaponAttackEvent
  profile: WeaponProfile
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
      if (!props.profile) return false;
      if (props.profile.Tags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return props.owner.actor.CombatController.CanActivate('ordnance') === false;
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
