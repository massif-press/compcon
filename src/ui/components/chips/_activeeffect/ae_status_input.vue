<template>
  <v-row dense
    class="px-2 py-1">
    <v-col cols="3">
      <div class="text-cc-overline text-disabled">status</div>
      <v-select v-model="selectedStatus"
        :items="statusOptions"
        density="compact"
        hide-details
        variant="outlined"
        flat
        tile />
      <BaseDurationDisplay v-if="status.Duration"
        :duration="status.Duration" />
    </v-col>

    <v-row dense
      align="start">
      <BaseTargetSelector :selected-targets="selectedTargets"
        :targets="targets"
        :aoe="aoe"
        @toggle-aoe="toggleAoe"
        @add-target="addTarget"
        @remove-target="cancelTarget" />

      <base-attack-roller v-if="status.Attack"
        :selected-targets="selectedTargets"
        :attack-rolls="attackRolls"
        :attack="status.Attack"
        :owner="owner"
        :crits="crits"
        @update:target-attacks="attackRolls = $event" />

      <BaseSaveRoller v-if="status.Save"
        :selected-targets="selectedTargets"
        :target-saves="targetSaves"
        :save-data="status.Save"
        :owner="owner"
        @update:target-saves="targetSaves = $event" />
    </v-row>
  </v-row>
</template>

<script>
import { CompendiumStore } from '@/stores';
import BaseTargetSelector from './_shared/BaseTargetSelector.vue';
import BaseSaveRoller from './_shared/BaseSaveRoller.vue';
import BaseDurationDisplay from './_shared/BaseDurationDisplay.vue';
import { useActiveEffectBase } from './_shared/baseEffectInput.js';
import { createSummaryText } from './_shared/_effectUtils.js';
import { EffectDurationText } from '@/classes/components/feature/active_effects/EffectDuration';
import BaseAttackRoller from './_shared/BaseAttackRoller.vue';

const baseEffect = useActiveEffectBase();

export default {
  name: 'ae-status-input',
  components: {
    BaseTargetSelector,
    BaseSaveRoller,
    BaseAttackRoller,
    BaseDurationDisplay,
  },
  props: {
    targets: { type: Array, default: () => [] },
    status: { type: Object, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
    self: { type: Boolean },
    crits: { type: Boolean },
  },
  data() {
    return {
      ...baseEffect.data(),
      selectedStatus: null,
    };
  },
  mounted() {
    baseEffect.mounted.call(this);
    this.$emit('ready-changed', this.ready);
  },
  emits: ['update:modelValue', 'update:targets', 'ready-changed'],
  watch: {
    ready: {
      immediate: true,
      handler(newVal) {
        this.$emit('ready-changed', newVal);
      }
    }
  },
  computed: {
    ...baseEffect.computed,
    statusOptions() {
      return CompendiumStore().Statuses.map((s) => ({
        title: s.Name,
        value: s.ID,
      }));
    },
    applyTargets() {
      return this.selectedTargets.map((t) =>
        t.actor.CombatController.Mounted && t.actor.ActiveMech ? t.actor.ActiveMech : t.actor
      );
    },
    ready() {
      return (
        this.selectedStatus != null &&
        this.selectedTargets.length > 0 &&
        this.selectedTargets.every((t) => t != null) && // Check that all targets are actually selected
        (!this.status.Save || this.targetSaves.every((s) => s != null && s > 0)) &&
        (!this.status.Attack || this.attackRolls.every((a) => a != null))
      );
    },
  },
  methods: {
    ...baseEffect.methods,

    getAoeValue() {
      return this.status.AoE;
    },

    getSaveData() {
      return this.status.Save;
    },

    resetCustomFields() {
      this.selectedStatus = this.status._statusId || null;
    },

    createTargetSummary(target, idx) {
      const details = `${this.selectedStatus} to ${target.actor.CombatController.Name} until ${EffectDurationText(this.status.Duration)}`;
      const saveInfo = this.status.Save
        ? {
          saveResult: this.targetSaves[idx],
          saveTarget: this.owner.CombatController.SaveTarget,
        }
        : null;

      return createSummaryText('Apply', target, '', saveInfo).replace(' to', ' ' + details);
    },

    applyToTarget(target, idx) {
      const status = CompendiumStore().Statuses.find((x) => x.ID === this.selectedStatus);
      if (!status) return;

      const applyTarget =
        target.actor.CombatController.Mounted && target.actor.ActiveMech
          ? target.actor.ActiveMech
          : target.actor;
      applyTarget.CombatController.ApplyStatus(
        status,
        this.status.Duration || '',
        this.owner.CombatController,
        applyTarget.CombatController,
        this.encounter
      );
    },

    getData() {
      return {
        ...baseEffect.methods.getData.call(this),
        Status: this.selectedStatus,
      };
    },
  },
};
</script>
