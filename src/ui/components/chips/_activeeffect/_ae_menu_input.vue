<template>
  <div>
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

      <v-avatar v-if="activeEffect.Duration"
        color="background"
        class="mr-1">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              icon="mdi-numeric-0-circle"
              size="18" />
          </template>
          Expires in X rounds
        </v-tooltip>
      </v-avatar>

      <v-card v-if="activeEffect.Attack"
        flat
        tile
        :color="color"
        class="mb-1">
        <attack-input ref="attackInput"
          :attack="activeEffect.Attack"
          :owner="owner"
          :targets="getTargetsSorted('enemy')"
          @ready-changed="(isReady) => updateInputReadiness('attack', null, isReady)" />
      </v-card>

      <v-card v-if="activeEffect.Save"
        flat
        tile
        :color="color"
        class="mb-1">
        <save-input v-for="(s, index) in activeEffect.Save"
          :ref="`saveInput_${index}`"
          :save="s"
          :owner="owner"
          :targets="getTargetsSorted('enemy')"
          @ready-changed="(isReady) => updateInputReadiness('save', index, isReady)" />
      </v-card>

      <v-card v-if="activeEffect.Damage.length"
        flat
        tile
        :color="color"
        class="mb-1">
        <damage-input v-for="(d, index) in activeEffect.Damage"
          :ref="`damageInput_${index}`"
          :key="index"
          :damage="d"
          :owner="owner"
          :self="d.Target === 'self'"
          :targets="getTargetsSorted(d.Target || 'enemy')"
          @ready-changed="(isReady) => updateInputReadiness('damage', index, isReady)" />
      </v-card>

      <v-card v-if="activeEffect.AddStatus"
        flat
        tile
        :color="color"
        class="mb-1">
        <status-input v-for="(s, index) in activeEffect.AddStatus"
          :ref="`statusInput_${index}`"
          :key="index"
          :status="s"
          :owner="owner"
          :encounter="encounter"
          :self="s.Target === 'self'"
          :targets="getTargetsSorted(s.Target || 'enemy')"
          @ready-changed="(isReady) => updateInputReadiness('status', index, isReady)" />
      </v-card>

      <v-card v-if="activeEffect.AddResist"
        flat
        tile
        :color="color"
        class="mb-1">
        <resist-input v-for="(r, index) in activeEffect.AddResist"
          :ref="`resistInput_${index}`"
          :key="index"
          :resist="r"
          :owner="owner"
          :self="r.Target === 'self'"
          :targets="getTargetsSorted(r.Target || 'enemy')"
          @ready-changed="(isReady) => updateInputReadiness('resist', index, isReady)" />
      </v-card>

      <v-card v-if="activeEffect.AddSpecial"
        flat
        tile
        :color="color"
        class="mb-1">
        <special-input v-for="(s, index) in activeEffect.AddSpecial"
          :ref="`specialInput_${index}`"
          :key="index"
          :status="s"
          :owner="owner"
          :encounter="encounter"
          :self="s.Target === 'self'"
          :targets="getTargetsSorted(s.Target || 'enemy')"
          @ready-changed="(isReady) => updateInputReadiness('special', index, isReady)" />
      </v-card>

      <v-card v-if="activeEffect.RemoveSpecial"
        flat
        tile
        :color="color"
        class="mb-1">
        <remove-special-input v-for="(s, index) in activeEffect.RemoveSpecial"
          :ref="`removeSpecialInput_${index}`"
          :key="index"
          :status="s"
          :owner="owner"
          :encounter="encounter"
          :targets="getTargetsSorted('enemy')"
          @ready-changed="(isReady) => updateInputReadiness('removeSpecial', index, isReady)" />
      </v-card>

      <v-card v-if="activeEffect.AddOther"
        flat
        tile
        :color="color"
        class="mb-1">
        <other-input v-for="(o, index) in activeEffect.AddOther"
          :ref="`otherInput_${index}`"
          :key="index"
          :effect="o"
          :owner="owner"
          :self="o.Target === 'self'"
          :targets="getTargetsSorted(o.Target || 'enemy')"
          @ready-changed="(isReady) => updateInputReadiness('other', index, isReady)" />
      </v-card>

    </div>

    <v-slide-y-transition>
      <div v-if="summaries.length">
        <div class="text-cc-overline text-disabled">Staged:</div>
        <cc-alert>
          {{ summaries.join('; ') }}
        </cc-alert>
      </div>
    </v-slide-y-transition>

    <cc-button v-if="isPassive && !embedded"
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
          :disabled="isApplied || !hasMandatoryInputs"
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
              <v-list-item v-if="!hasMandatoryInputs"
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
                  v-if="!hasMandatoryInputs">
                  <v-list-item-subtitle>Ignore Missing Fields</v-list-item-subtitle>
                </template>
                <template #prepend>
                  <v-icon icon="cc:free"
                    class="mr-n5" />
                </template>
              </v-list-item>
              <v-divider class="my-2" />
              <v-list-item @click="reset"
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

              <v-list-item @click="reset"
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
  </div>
  <div class="d-flex justify-end mt-2 mr-4">
    <v-spacer />
    <div>
      <v-btn v-if="isApplied"
        size="x-small"
        block
        flat
        tile
        color="panel"
        width="165px"
        @click="reset">
        Override
        <template #append>
          <v-tooltip location="top"
            max-width="300px">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-information-outline"
                size="16"
                class="ml-2" />
            </template>
            <div class="text-center">
              <div><b class="text-text">Reset Activation</b></div>
              <v-divider />
              Reset this effect or action, ignoring any conditions or usage restrictions, and refund
              any
              heat incurred.
            </div>
          </v-tooltip>
        </template>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Damage } from '@/class';
import { ActiveEffect } from '@/classes/components/feature/active_effects/ActiveEffect';
import { CombatantData } from '@/classes/encounter/Encounter';
import { ByTier } from '@/util/tierFormat';
import DamageInput from './ae_damage_input.vue';
import SaveInput from './ae_save_input.vue';
import StatusInput from './ae_status_input.vue';
import ResistInput from './ae_resist_input.vue';
import SpecialInput from './ae_special_input.vue';
import RemoveSpecial from './ae_remove_special_input.vue';
import OtherInput from './ae_other_input.vue';
import AttackInput from './ae_attack_input.vue';

export default {
  name: 'ae-menu-input',
  components: {
    DamageInput,
    SaveInput,
    StatusInput,
    ResistInput,
    SpecialInput,
    RemoveSpecial,
    OtherInput,
    AttackInput,
  },
  props: {
    activeEffect: { type: ActiveEffect, required: true },
    encounter: { type: Object, required: true },
    owner: { type: Object, required: true },
    close: { type: Function, required: true },
    hideInput: { type: Boolean, default: false },
    embedded: { type: Boolean, default: false },
    color: { type: String, default: 'panel' },
    overrideHasMandatoryInputs: { type: Boolean, default: null },
  },
  data: () => ({
    summaries: [] as Array<string>,
    ready: false,
    isFree: false,
    inputsReady: {} as Record<string, boolean>,
  }),
  emits: ['apply', 'reset', 'stage'],
  computed: {
    lightColor() {
      return this.activeEffect.Origin.Color || 'orange';
    },
    icon() {
      return this.activeEffect.Origin.Icon || 'mdi-rhombus-outline';
    },
    isApplied(): boolean {
      return this.owner.CombatController.IsActionUsed(this.activeEffect.ID);
    },
    isPassive() {
      return (
        !this.activeEffect.AddOther?.length &&
        !this.activeEffect.AddResist?.length &&
        !this.activeEffect.AddStatus?.length &&
        !this.activeEffect.AddSpecial?.length &&
        !this.activeEffect.Damage.length &&
        !this.activeEffect.Save &&
        !this.activeEffect.Frequency
      );
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
    hasMandatoryInputs(): boolean {
      // Use override value if provided
      if (this.overrideHasMandatoryInputs !== null) {
        return this.overrideHasMandatoryInputs;
      }

      // Check if we have any input components that need to be ready
      const hasAttack = !!this.activeEffect.Attack;
      const hasSave = !!(this.activeEffect.Save && this.activeEffect.Save.length > 0);
      const hasDamage = !!(this.activeEffect.Damage && this.activeEffect.Damage.length > 0);
      const hasStatus = !!(this.activeEffect.AddStatus && this.activeEffect.AddStatus.length > 0);
      const hasResist = !!(this.activeEffect.AddResist && this.activeEffect.AddResist.length > 0);
      const hasSpecial = !!(this.activeEffect.AddSpecial && this.activeEffect.AddSpecial.length > 0);
      const hasRemoveSpecial = !!(this.activeEffect.RemoveSpecial && this.activeEffect.RemoveSpecial.length > 0);
      const hasOther = !!(this.activeEffect.AddOther && this.activeEffect.AddOther.length > 0);

      // If no inputs are required, return true
      const hasAnyInputs = hasAttack || hasSave || hasDamage || hasStatus || hasResist || hasSpecial || hasRemoveSpecial || hasOther;
      if (!hasAnyInputs) {
        return true;
      }

      // Check all required input types are ready
      let allReady = true;

      if (hasAttack) {
        allReady = allReady && (this.inputsReady.attack === true);
      }
      if (hasSave) {
        for (let i = 0; i < this.activeEffect.Save.length; i++) {
          allReady = allReady && (this.inputsReady[`save_${i}`] === true);
        }
      }
      if (hasDamage) {
        for (let i = 0; i < this.activeEffect.Damage.length; i++) {
          allReady = allReady && (this.inputsReady[`damage_${i}`] === true);
        }
      }
      if (hasStatus) {
        for (let i = 0; i < this.activeEffect.AddStatus.length; i++) {
          allReady = allReady && (this.inputsReady[`status_${i}`] === true);
        }
      }
      if (hasResist) {
        for (let i = 0; i < this.activeEffect.AddResist.length; i++) {
          allReady = allReady && (this.inputsReady[`resist_${i}`] === true);
        }
      }
      if (hasSpecial) {
        for (let i = 0; i < this.activeEffect.AddSpecial.length; i++) {
          allReady = allReady && (this.inputsReady[`special_${i}`] === true);
        }
      }
      if (hasRemoveSpecial) {
        for (let i = 0; i < this.activeEffect.RemoveSpecial.length; i++) {
          allReady = allReady && (this.inputsReady[`removeSpecial_${i}`] === true);
        }
      }
      if (hasOther) {
        for (let i = 0; i < this.activeEffect.AddOther.length; i++) {
          allReady = allReady && (this.inputsReady[`other_${i}`] === true);
        }
      }

      return allReady;
    },
  },
  methods: {
    updateInputReadiness(inputType: string, index: number | null, isReady: boolean) {
      const key = index !== null ? `${inputType}_${index}` : inputType;
      this.inputsReady[key] = isReady;
    },
    byTier(detail: string) {
      return ByTier(detail, this.owner.CombatController.Tier);
    },
    getTargetsSorted(target: string): Array<object> {
      let out = [] as Array<CombatantData>;
      const self = this.encounter.Combatants.find(
        (c: CombatantData) =>
          c.actor.CombatController.ActiveActor.ID === this.owner.CombatController.ActiveActor.ID
      );

      if (!self) return out;

      if (self.side === 'enemy' && target === 'enemy') target = 'ally';
      else if (self.side === 'enemy' && target === 'ally') target = 'enemy';

      out = [...this.encounter.Combatants].filter((c: CombatantData) => !c.actor.CombatController.IsDestroyed && !c.reinforcement)
        .sort((a: CombatantData, b: CombatantData) => {
          if (target === 'self') {
            if (
              a.actor.CombatController.ActiveActor.ID === this.owner.CombatController.ActiveActor.ID
            )
              return -1;
            if (
              b.actor.CombatController.ActiveActor.ID === this.owner.CombatController.ActiveActor.ID
            )
              return 1;
          }
          if (a.side === target && b.side !== target) {
            return -1;
          } else if (a.side !== target && b.side === target) {
            return 1;
          } else {
            return a.actor.CombatController.Name.localeCompare(b.actor.CombatController.Name);
          }
        });
      return out;
    },

    initialDamage(damage: Damage): number {
      const n = Number(damage.TieredDamage(this.owner.CombatController.Tier));
      if (!isNaN(n)) {
        return n;
      } else {
        return 0;
      }
    },
    initialPlaceholder(damage: Damage): string {
      const val = damage.TieredDamage(this.owner.CombatController.Tier);
      if (isNaN(Number(val))) {
        return val;
      } else {
        return '';
      }
    },
    getAoeIcon(aoe: string | boolean): string {
      if (typeof aoe === 'boolean') {
        aoe = aoe ? 'true' : 'false';
      }
      return Damage.getAoeIcon(aoe);
    },
    frequencyIcon(frequency: string): string {
      const str = frequency.toLowerCase();
      switch (str) {
        case '1/round':
          return 'mdi-alpha-r-circle';
        case '1/turn':
          return 'mdi-alpha-t-circle';
        case '1/scene':
        case '1/encounter':
          return 'mdi-alpha-e-circle';
        case '1/mission':
          return 'mdi-alpha-m-circle';
        default:
          return 'mdi-timer-sand';
      }
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
    // Helper method to iterate through all active effect input components
    iterateAE(methodName: string, collectResults = false): any[] | null {
      const results: any[] = [];

      const componentConfigs = [
        {
          items: this.activeEffect.Save,
          refPrefix: 'saveInput',
        },
        {
          items: this.activeEffect.Damage,
          refPrefix: 'damageInput',
        },
        {
          items: this.activeEffect.AddResist,
          refPrefix: 'resistInput',
        },
        {
          items: this.activeEffect.AddStatus,
          refPrefix: 'statusInput',
        },
        {
          items: this.activeEffect.AddSpecial,
          refPrefix: 'specialInput',
        },
        {
          items: this.activeEffect.RemoveSpecial,
          refPrefix: 'removeSpecialInput',
        },
        {
          items: this.activeEffect.AddOther,
          refPrefix: 'otherInput',
        },
      ];

      for (const config of componentConfigs) {
        if (config.items) {
          for (let i = 0; i < config.items.length; i++) {
            const ref = this.$refs[`${config.refPrefix}_${i}`] as any;
            if (ref[0] && typeof ref[0][methodName] === 'function') {
              const result = ref[0][methodName]();
              if (collectResults && result != null) {
                results.push(result);
              }
            }
          }
        }
      }

      // disable save lock to prevent blocking effects after application
      this.encounter.Combatants.forEach((t) => {
        if (t && t.actor && t.actor.CombatController) {
          t.actor.CombatController.SaveLock = false;
        }
      });

      return collectResults ? results : null;
    },

    getSummaries() {
      let summaries = this.iterateAE('getSummary', true) || [];
      this.owner.CombatController.RegisterEvent(summaries, this.activeEffect, this.encounter);
      if (summaries.length === 0 || summaries.every((s) => s.trim() === '')) {
        summaries = ['No valid targets selected. Confirm to register use.'];
      }
      this.summaries = summaries;
    },

    reset() {
      this.owner.CombatController.ClearActionUsed(this.activeEffect.ID);
      this.iterateAE('reset');
      this.summaries = [];
      this.ready = false;
      this.isFree = false;
      this.$emit('reset');
    },
    stage(asFree) {
      this.isFree = asFree || false;
      if (this.isApplied) return;
      this.ready = true;
      if (this.canOverride) {
        this.getSummaries();
      }
      this.$emit('stage');
    },
    apply(close: Function) {
      if (this.isApplied || !this.ready) return;
      this.iterateAE('apply');

      if (!this.isFree) this.owner.CombatController.MarkActionUsed(this.activeEffect.ID);
      this.isFree = false;
      this.$emit('apply');
      close();
    },
  },
};
</script>
