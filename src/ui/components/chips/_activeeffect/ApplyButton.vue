<template>

  <cc-button v-if="activeEffect.IsPassive && !embedded"
    block
    size="x-small"
    color="panel"
    prepend-icon="mdi-close"
    @click="close()">
    Dismiss
  </cc-button>

  <div v-else-if="!embedded"
    class="d-flex justify-end mt-2 mr-4">
    <cc-button size="small"
      stacked
      @click="close">Cancel</cc-button>
    <v-spacer />
    <div>
      <cc-button v-if="!ready"
        size="small"
        stacked
        :color="color"
        :disabled="isApplied || mandatoryRemaining"
        @click="stage(false)">
        <div class="px-4">
          <v-icon v-if="icon"
            :icon="icon"
            class="mt-n1"
            start />
          <span v-if="activation">Activate</span>
          <span v-else>{{ canOverride ? 'Apply All' : 'Confirm' }}</span>
          <div class="text-disabled">
            <span v-if="activation"
              style="letter-spacing: 1px">
              {{ (activeEffect as any).Activation }}
            </span>
            <span v-if="
              (activeEffect as any).Activation &&
              activeEffect.Frequency &&
              (activeEffect.Frequency as any).Duration !== 'Unlimited'
            ">
              •
            </span>
            <span v-if="activeEffect.Frequency"
              style="letter-spacing: 1px">
              {{ frequencyText }}
            </span>
          </div>
        </div>
        <template #options>
          <v-list density="compact"
            class="pa-0"
            bg-color=panel
            border
            tile>

            <v-list-item @click="stage(true)"
              class="bg-action--free"
              :disabled="mandatoryRemaining"
              title="Activate (Free Action)">
              <template #subtitle
                v-if="mandatoryRemaining">
                <v-list-item-subtitle>Mandatory Fields Remaining</v-list-item-subtitle>
              </template>
              <template #prepend>
                <v-icon icon="cc:free"
                  class="mr-n5" />
              </template>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item @click="$emit('reset', false)"
              title="Reset All Inputs">
              <template #prepend>
                <v-icon icon="mdi-reload"
                  class="mr-n5" />
              </template>
            </v-list-item>
          </v-list>
        </template>
      </cc-button>

      <cc-button v-else
        size="small"
        stacked
        :color="isFree ? 'action--free' : color"
        :disabled="isApplied"
        @click="apply(close)">
        <div class="px-4">
          <v-icon v-if="icon"
            :icon="icon"
            class="mt-n1"
            start />
          Confirm
          <div class="text-disabled">
            <span v-if="activation"
              style="letter-spacing: 1px">
              {{ isFree ? 'Free' : (activeEffect as any).Activation }}
            </span>
            <span v-if="
              (activeEffect as any).Activation &&
              activeEffect.Frequency &&
              (activeEffect.Frequency as any).Duration !== 'Unlimited'
            ">
              •
            </span>
            <span v-if="activeEffect.Frequency"
              style="letter-spacing: 1px">
              {{ frequencyText }}
            </span>
          </div>
        </div>
        <template #options>
          <v-list density="compact"
            bg-color=panel
            border
            tile>

            <v-list-item @click="$emit('reset', false)"
              title="Reset All Inputs">
              <template #prepend>
                <v-icon icon="mdi-reload"
                  class="mr-n5" />
              </template>
            </v-list-item>
          </v-list>
        </template>
      </cc-button>
      <div class="text-center text-cc-overline text-disabled">
        <div v-if="isApplied">Already Activated</div>
        <div v-if="noAction">Insufficient Actions</div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { ByTier } from '@/util/tierFormat';

export default {
  name: 'ActiveEventApplyButton',
  props: {
    event: { type: [ActiveEffectEvent, Array], required: true },
    weaponEvent: { type: [WeaponAttackEvent, Array], required: false },
    action: { type: Object, required: false },
    actionId: { type: [String, Array], required: false },
    activationOverride: { type: String, required: false },
    encounter: { type: EncounterInstance, required: true },
    owner: { type: Object, required: true },
    close: { type: Function, required: true },
    embedded: { type: Boolean, default: false },
  },
  data: () => ({
    ready: false,
    isFree: false,
  }),
  computed: {
    events(): ActiveEffectEvent[] {
      return Array.isArray(this.event) ? this.event as ActiveEffectEvent[] : [this.event];
    },
    weaponAttackEvents(): WeaponAttackEvent[] {
      return this.weaponEvent
        ? Array.isArray(this.weaponEvent)
          ? this.weaponEvent as WeaponAttackEvent[]
          : [this.weaponEvent]
        : [];
    },
    actionIds(): string[] {
      return this.actionId
        ? Array.isArray(this.actionId)
          ? this.actionId as string[]
          : [this.actionId]
        : [];
    },
    activeEffect() {
      return this.events[0].Effect;
    },
    icon() {
      return this.action?.Icon || (this.activeEffect as any).Icon || this.activeEffect.Origin.Icon || '';
    },
    color() {
      return this.action?.Color || (this.activeEffect as any).Color || this.activeEffect.Origin.Color || 'primary';
    },
    isApplied(): boolean {
      if (this.actionIds.length) {
        return this.actionIds.every(id =>
          this.owner.actor.CombatController.ActiveActor.CombatController.IsActionUsed(id));
      }
      return this.owner.actor.CombatController.ActiveActor.CombatController.IsActionUsed(this.activeEffect.ID);
    },
    noAction(): boolean {
      return !this.owner.actor.CombatController.ActiveActor.CombatController.CanActivate(this.activationOverride || this.action?.Activation || (this.activeEffect as any).Activation || 'free');
    },
    canOverride() {
      return (
        this.activeEffect.AddOther?.length ||
        this.activeEffect.AddResist?.length ||
        this.activeEffect.AddStatus?.length ||
        this.activeEffect.AddSpecial?.length ||
        this.activeEffect.Damage.length > 0
      );
    },
    hasAction() {
      return (
        this.activeEffect.AddOther ||
        this.activeEffect.AddResist ||
        this.activeEffect.AddStatus ||
        this.activeEffect.AddSpecial ||
        this.activeEffect.Damage.length ||
        this.activeEffect.Save
      );
    },
    activation(): boolean {
      return (this.activeEffect as any).Activation != null;
    },
    frequencyText(): string {
      if (this.activeEffect.Frequency) {
        if (
          typeof this.activeEffect.Frequency === 'object' &&
          (this.activeEffect.Frequency as any).FreqText
        ) {
          return (this.activeEffect.Frequency as any).FreqText;
        } else if (typeof this.activeEffect.Frequency === 'string') {
          return this.activeEffect.Frequency;
        }
      }
      return '';
    },
    mandatoryRemaining(): boolean {
      return !this.events.every(x => x.Ready)
    },
  },
  methods: {
    byTier(detail: string) {
      return ByTier(detail, this.owner.actor.CombatController.Tier);
    },
    frequencyText(frequency: string): string {
      const str = frequency.toLowerCase();
      switch (str) {
        case '1/round':
          return 'Usable once per Round';
        case '1/turn':
          return 'Usable once per Turn';
        case '1/scene':
        case '1/encounter':
          return 'Usable once per Encounter';
        case '1/mission':
          return 'Usable once per Mission';
        default:
          return frequency;
      }
    },
    stage(asFree) {
      this.events.forEach(e => e.Staged = true)
      this.isFree = asFree || false;
      if (this.isApplied) return;
      this.ready = true;
      this.$emit('stage');
    },
    apply(close: Function) {
      if (this.isApplied || !this.ready) return;
      if (!this.isFree) {
        this.owner.actor.CombatController.MarkActionUsed(this.activeEffect.ID);
        const action = this.action?.Activation || (this.activeEffect as any).Activation || 'free';
        this.owner.actor.CombatController.SetCombatAction(action, false);
      }
      if (this.weaponAttackEvents.length)
        this.weaponAttackEvents.forEach(we => we.ApplyAll());
      else
        this.events.forEach(e => e.ApplyAll());
      this.isFree = false;
      this.$emit('apply');
      close();
    },
  },
};
</script>
