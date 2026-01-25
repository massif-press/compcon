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
        :color="(activeEffect as any).Color || 'primary'"
        :disabled="isApplied || !event.Ready"
        @click="stage(false)">
        <div class="px-4">
          <v-icon v-if="(activeEffect as any).Icon"
            :icon="(activeEffect as any).Icon"
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
            <v-list-item v-if="!event.Ready"
              @click="stage(true)"
              :class="`bg-${(activeEffect as any).Color}`"
              title="Activate Anyway"
              subtitle="Ignore Missing Fields">
              <template #prepend>
                <v-icon :icon="(activeEffect as any).Icon"
                  class="mr-n5" />
              </template>
            </v-list-item>
            <v-list-item @click="stage(true)"
              class="bg-action--free"
              title="Activate (Free Action)">
              <template #subtitle
                v-if="!event.Ready">
                <v-list-item-subtitle>Ignore Missing Fields</v-list-item-subtitle>
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
        :color="isFree ? 'action--free' : (activeEffect as any).Color || 'primary'"
        :disabled="isApplied"
        @click="apply(close)">
        <div class="px-4">
          <v-icon v-if="(activeEffect as any).Icon"
            :icon="(activeEffect as any).Icon"
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
    </div>
  </div>

</template>

<script lang="ts">
import { ActiveEffect } from '@/classes/components/feature/active_effects/ActiveEffect';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { ByTier } from '@/util/tierFormat';

export default {
  name: 'ActiveEventApplyButton',
  props: {
    event: { type: ActiveEffectEvent, required: true },
    encounter: { type: EncounterInstance, required: true },
    owner: { type: Object, required: true },
    close: { type: Function, required: true },
    embedded: { type: Boolean, default: false },
    color: { type: String, default: 'panel' },
  },
  data: () => ({
    ready: false,
    isFree: false,
  }),
  computed: {
    activeEffect() {
      console.log(this.event.Effect)
      return this.event.Effect;
    },
    lightColor() {
      return this.activeEffect.Origin.Color || 'orange';
    },
    icon() {
      return this.activeEffect.Origin.Icon || 'mdi-rhombus-outline';
    },
    isApplied(): boolean {
      return this.owner.actor.CombatController.ActiveActor.CombatController.IsActionUsed(this.activeEffect.ID);
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
      return ByTier(detail, this.owner.CombatController.Tier);
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

      if (!this.isFree) this.owner.CombatController.MarkActionUsed(this.activeEffect.ID);
      this.isFree = false;
      this.$emit('apply');
      close();
    },
  },
};
</script>
