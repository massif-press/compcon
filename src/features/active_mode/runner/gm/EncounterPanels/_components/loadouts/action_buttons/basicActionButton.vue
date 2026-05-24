<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter="encounter"
    min-width="1000">
    <template #default="{ close }">
      <cc-synergy-display :location="action.ID.replace('act_', '')"
        :mech="controller.Parent"
        alert />

      <cc-synergy-display v-if="isTechAttack"
        location="tech_attack"
        :mech="controller.Parent"
        alert />

      <menu-input :active-effect="action"
        :encounter="encounter"
        :owner="owner"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </combat-action-button>
</template>

<script lang="ts">
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'BasicActionButton',
  components: { CombatActionButton, MenuInput },
  props: {
    action: { type: Object, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
  },
  emits: ['activate'],
  computed: {
    controller() {
      return this.owner.actor.CombatController;
    },
    isTechAttack() {
      if (this.action.ID.includes('tech_attack')) return true;
      return this.action.ActiveEffects.some((ae) => ae.Attack && ae.Attack === 'tech');
    },
  },
  methods: {
    apply(close) {
      this.$emit('activate', this.action.ID);
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
