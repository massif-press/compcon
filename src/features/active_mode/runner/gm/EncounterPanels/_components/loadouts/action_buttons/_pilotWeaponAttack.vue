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

    <effect-applicator :event="event.BaseEvent" />

    <cc-panel v-for="e in event.TargetEvents"
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

<script lang="ts">
import { PilotWeapon } from '@/class';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import EffectApplicator from '@/ui/components/chips/_activeeffect/EffectApplicator.vue';

export default {
  name: 'MechWeaponAttack',
  props: {
    event: { type: WeaponAttackEvent, required: true },
    weapon: { type: PilotWeapon, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
    isAdditionalAux: { type: Boolean, default: false },
  },
  components: {
    EffectApplicator,
  },
  computed: {
    ordnanceWarning() {
      if (!this.weapon) return false;
      if (this.weapon.Tags.find((t) => t.ID.toLowerCase() === 'tg_ordnance')) {
        return this.owner.actor.CombatController.CanActivate('ordnance') === false;
      }
      return false;
    },
    canUse() {
      if (!this.weapon) return false;
      return !this.weapon.Used
    },
  },
};
</script>
