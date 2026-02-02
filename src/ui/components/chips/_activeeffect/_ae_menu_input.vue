<template>
  <div v-if="!embedded"
    class="text-right text-caption text-disabled mb-1">
    <i v-if="activeEffect.Origin.Name">
      From {{ activeEffect.Origin.Name }}
      <span v-if="activeEffect.Origin.Source">
        ({{ activeEffect.Origin.Type }}, {{ activeEffect.Origin.Source }})
      </span>
      <span v-else-if="activeEffect.Origin.Origin">
        ({{ activeEffect.Origin.Origin.Name }},
        {{ activeEffect.Origin.Origin.ItemType.replace(/([a-z])([A-Z])/g, '$1 $2') }})
      </span>
      <cc-lcp-info :item="activeEffect.Origin" />
    </i>
  </div>

  <div v-if="!hideInput">
    <cc-alert v-if="activeEffect.Condition"
      color="primary">
      <b class="text-accent">IF:&nbsp;</b>
      <b>{{ activeEffect.Condition }}</b>
    </cc-alert>
    <cc-alert v-if="(activeEffect as any).Trigger"
      color="primary">
      <b class="text-accent">Trigger:&nbsp;</b>
      <b>{{ (activeEffect as any).Trigger }}</b>
    </cc-alert>
    <div class="text-text pa-1 mb-3"
      v-html-safe="byTier(activeEffect.Detail)" />

    <v-card flat
      tile
      :color="color"
      class="mb-1 px-1">

      <effect-applicator :event="event" />

    </v-card>

  </div>


  <v-slide-y-transition>
    <div v-if="event && event.Staged"
      class="pa-4">
      <div class="text-cc-overline text-disabled">Staged:</div>
      <v-row dense>
        <v-col>
          <code style="white-space: pre-wrap; font-size: 12px;">
          {{ event.Summary }}
        </code>
        </v-col>
        <v-col cols="auto"
          align-self="end">
          <v-btn size=small
            icon
            flat
            tile
            variant="text"
            class="fade-select"
            @click="copyText(event.Summary)">
            <v-icon icon="mdi-content-copy" />
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-slide-y-transition>

  <apply-button :event="<ActiveEffectEvent>event"
    :encounter="encounter"
    :owner="owner"
    :close="close"
    @reset="reset($event)" />

</template>

<script lang="ts">
import { ActiveEffect } from '@/classes/components/feature/active_effects/ActiveEffect';
import { CombatantData } from '@/classes/encounter/Encounter';
import { ByTier } from '@/util/tierFormat';

import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import EffectApplicator from './EffectApplicator.vue';
import ApplyButton from './ApplyButton.vue'


export default {
  name: 'ae-menu-input',
  components: {
    EffectApplicator,
    ApplyButton,
  },
  props: {
    activeEffect: { type: ActiveEffect, required: true },
    encounter: { type: EncounterInstance, required: true },
    owner: { type: Object, required: true },
    close: { type: Function, required: true },
    hideInput: { type: Boolean, default: false },
    embedded: { type: Boolean, default: false },
    color: { type: String, default: 'panel' },
    overrideMissingInputs: { type: Boolean, default: null },
    initialTargets: { type: Array, default: () => [] },
  },
  data: () => ({
    event: {} as ActiveEffectEvent,
    ready: false,
    isFree: false,
  }),
  emits: ['apply', 'reset', 'stage'],
  created() {
    this.reset();
  },
  computed: {
    isApplied(): boolean {
      return this.owner.actor.CombatController.IsActionUsed(this.activeEffect.ID);
    },
    isRam(): boolean {
      return this.activeEffect.ID === 'act_ram';
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

    reset(clearAction = false) {
      if (clearAction) this.owner.actor.CombatController.ClearActionUsed(this.activeEffect.ID);
      const self = this.encounter.Combatants.find(
        (c: CombatantData) => c.actor.CombatController.RootActor.ID === this.owner.actor.CombatController.RootActor.ID
      );
      if (!self) {
        throw new Error('Owner combatant not found in encounter');
      }
      this.event = new ActiveEffectEvent(self, this.activeEffect, this.encounter);
    },
    stage(asFree) {
      this.event.Staged = true
      this.isFree = asFree || false;
      if (this.isApplied) return;
      this.ready = true;
      // if (this.canOverride) {
      //   this.getSummaries();
      // }
      this.$emit('stage');
    },
    apply(close: Function) {
      if (this.isApplied || !this.ready) return;
      // this.iterateAE('apply');

      if (!this.isFree) this.owner.actor.CombatController.MarkActionUsed(this.activeEffect.ID);
      this.isFree = false;
      this.$emit('apply');
      close();
    },
    copyText(text: string) {
      navigator.clipboard.writeText(text);
    },
  },
};
</script>
