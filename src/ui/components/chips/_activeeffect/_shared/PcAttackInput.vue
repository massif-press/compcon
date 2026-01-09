<template>
  <div class="px-2 py-1">
    <v-row dense align="start">
      <base-target-selector
        :selected-targets="selectedTargets"
        :targets="targets"
        :aoe="aoe"
        @toggle-aoe="toggleAoe"
        @add-target="addTarget"
        @remove-target="cancelTarget" />

      <base-save-roller
        v-if="damage.Save"
        :selected-targets="selectedTargets"
        :target-saves="targetSaves"
        :save-data="damage.Save"
        :owner="owner"
        @update:target-saves="targetSaves = $event" />

      <base-attack-roller
        v-if="damage.Attack"
        :selected-targets="selectedTargets"
        :attack-rolls="attackRolls"
        :attack="damage.Attack"
        :base-accuracy="damage.Accuracy"
        :crits="!aoe"
        :owner="owner"
        @update:target-attacks="attackRolls = $event"
        @update:target-hits="hitMiss = $event" />

      <save-half-toggle
        v-if="damage.Save"
        :save-half="damage.SaveHalf"
        :has-save="!!damage.Save"
        @update:save-half="damage.SaveHalf = $event" />
    </v-row>
    <v-row justify="end" dense>
      <DamageTypeSelector
        :disabled="damageDisabled"
        cols="auto"
        :selected-damage-type="selectedDamageType"
        :selected-damage-value="selectedDamageValue"
        :damage-placeholder="damagePlaceholder"
        :armor-piercing="damage.AP"
        :reliable="damage.Reliable"
        :irreducible="damage.Irreducible"
        :overkill="overkill"
        :can-crit="!aoe"
        :critical="isCritDamage"
        @update:damage-type="selectedDamageType = $event"
        @update:damage-value="selectedDamageValue = $event"
        @roll-damage="damageRollResult = $event"
        @toggle-ap="
          damage.AP = !damage.AP;
          emitResults();
        "
        @toggle-irreducible="
          damage.Irreducible = !damage.Irreducible;
          emitResults();
        " />

      <v-col cols="auto">
        <div class="text-cc-overline">&nbsp;</div>
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
              :key="`overkill_${overkill}`"
              :disabled="damageDisabled"
              icon
              v-bind="props"
              variant="text"
              flat
              tile
              size="small"
              class="ml-n3"
              :color="overkill ? 'red' : 'rgba(125,125,125,0.5)'"
              @click.stop="toggleOverkill()">
              <v-icon size="25" icon="cc:burning" />
            </v-btn>
          </template>
          <div class="text-center">
            <span v-if="overkill">This weapon is subject to OVERKILL rules</span>
            <span v-else>This weapon is not subject to OVERKILL rules</span>
            <div>
              <i class="text-caption text-disabled">Click to Override</i>
            </div>
          </div>
        </v-tooltip>
      </v-col>

      <v-col v-if="!additionalAux" cols="auto">
        <div class="text-cc-overline">&nbsp;</div>
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
              :disabled="damageDisabled"
              icon
              v-bind="props"
              variant="text"
              flat
              tile
              size="small"
              class="ml-n3"
              :color="bonus ? 'accent' : 'rgba(125,125,125,0.5)'"
              @click="toggleBonus()">
              <v-icon size="25" icon="mdi-plus-box" />
            </v-btn>
          </template>
          <div class="text-center">
            <span v-if="bonus">Remove</span>
            <span v-else>Add</span>
            Bonus Damage
          </div>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row v-if="bonus || overkill" dense justify="end">
      <v-col v-if="overkill && this.damageRollResult" cols="auto">
        <div class="text-cc-overline text-disabled">OVERKILL</div>
        <cc-panel v-if="this.damageRollResult._overkillRerolls" color="heat" variant="tonal">
          <div class="text-cc-overline">
            <strong class="heading text-accent">
              x{{ this.damageRollResult._overkillRerolls }}
            </strong>
            <cc-slashes class="pl-2" />
            +
            <v-icon icon="cc:heat" class="mx-n2" />
            {{ this.damageRollResult._overkillRerolls }} Heat (self)
          </div>
        </cc-panel>
        <cc-panel v-else color="panel">
          <i class="text-caption text-disabled">None</i>
        </cc-panel>
      </v-col>
      <v-col v-if="bonus" cols="auto">
        <div class="text-cc-overline text-disabled">Bonus Damage</div>
        <v-text-field
          v-model="bonusDamage"
          :placeholder="bonusDamagePlaceholder"
          type="number"
          density="compact"
          hide-details
          hide-spin-buttons
          variant="outlined"
          flat
          tile
          width="120"
          @update:model-value="bonusDamage = Number($event)">
          <template #prepend>
            <dice-roll-interface
              :damage-placeholder="bonusDamagePlaceholder"
              @update:damage-value="bonusDamage = Number($event)" />
          </template>
          <template #append>
            <v-tooltip
              v-if="aoe && hitMiss.filter((x) => x).length > 1"
              location="top"
              max-width="250">
              <template #activator="{ props }">
                <v-icon v-bind="props" class="mr-n4 ml-n2" size="25" icon="mdi-alert-outline" />
              </template>
              <div class="text-center">Applied Bonus Damage will be halved (Area of Effect)</div>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BaseTargetSelector from './BaseTargetSelector.vue';
import BaseSaveRoller from './BaseSaveRoller.vue';
import DamageTypeSelector from './DamageTypeSelector.vue';
import SaveHalfToggle from './SaveHalfToggle.vue';
import { DiceRoller } from '@/classes/dice/DiceRoller';
import BaseAttackRoller from './BaseAttackRoller.vue';
import DiceRollInterface from './DiceRollInterface.vue';

export default {
  name: 'pc-attack-input',
  components: {
    BaseTargetSelector,
    BaseSaveRoller,
    DamageTypeSelector,
    SaveHalfToggle,
    BaseAttackRoller,
    DiceRollInterface,
  },
  props: {
    targets: { type: Array, default: () => [] },
    damage: { type: Object, required: true },
    owner: { type: Object, required: true },
    self: { type: Boolean },
    additionalAux: { type: Boolean, default: false },
  },
  data: () => ({
    selectedTargets: [],
    targetSaves: [],
    attackRolls: [],
    hitMiss: [],
    aoe: null,
    overkill: false,
    bonus: false,
    selectedDamageType: 'kinetic',
    selectedDamageValue: null,
    damagePlaceholder: '',
    damageRollResult: null,
    bonusDamagePlaceholder: '1d6+0',
    bonusDamage: 0,
  }),
  mounted() {
    this.reset();
  },
  emits: ['update:results'],
  watch: {
    selectedTargets: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.targetSaves = new Array(newVal.length).fill(null);
        this.attackRolls = new Array(newVal.length).fill(null);
        this.emitResults();
      },
    },
    targetSaves: {
      deep: true,
      handler() {
        this.emitResults();
      },
    },
    attackRolls: {
      deep: true,
      handler() {
        this.emitResults();
      },
    },
    hitMiss: {
      immediate: true,
      handler(newval) {
        this.emitResults();
      },
    },
    selectedDamageValue: {
      immediate: true,
      handler() {
        this.emitResults();
      },
    },
    selectedDamageType: {
      immediate: true,
      handler() {
        this.emitResults();
      },
    },
    bonusDamage: {
      immediate: true,
      handler() {
        this.emitResults();
      },
    },
  },
  computed: {
    isReady() {
      return (
        this.selectedTargets.some((t) => t != null) &&
        (!this.damage.Save || this.targetSaves.some((s) => s != null && s > 0)) &&
        (!this.damage.Attack || this.attackRolls.some((a) => a != null))
      );
    },
    isCritDamage() {
      if (!this.damage.IsRollable) return false;
      if (!this.attackRolls.length) return false;
      if (this.aoe) return false;

      return this.attackRolls[0] >= 20;
    },
    damageDisabled() {
      return !this.isReady;
    },
  },
  methods: {
    reset() {
      this.selectedTargets = [null];
      if (this.self) this.selectedTargets = [this.targets[0]];
      this.targetSaves = [null];
      this.attackRolls = [null];
      this.aoe = this.damage.AoE || false;
      this.overkill = this.damage.Overkill || false;
      this.selectedDamageType = this.damage.Type || 'kinetic';
      if (!this.damage.IsRollable) {
        const tier = this.owner.CombatController.Tier;
        this.selectedDamageValue = this.damage.TieredDamage(tier);
      } else {
        this.damagePlaceholder = this.damage.Value;
      }
    },
    emitResults() {
      if (!this.isReady) {
        this.$emit('update:results', []);
        return;
      }
      if (this.selectedDamageValue == null) {
        this.$emit('update:results', []);
        return;
      }
      if (!this.selectedTargets || !this.selectedTargets[0]) return [];

      const res = this.selectedTargets.map((t, idx) => {
        const target = t?.actor;
        if (!target || !this.hitMiss.length || this.hitMiss[idx] == null) return;

        const hitType = this.hitMiss[idx] > 1 ? 'CRIT' : this.hitMiss[idx] > 0 ? 'HIT' : 'MISS';

        const bonus = this.bonus
          ? this.aoe && this.selectedTargets.filter((x, i) => this.hitMiss[i]).length > 1
            ? Math.floor(this.bonusDamage / 2)
            : this.bonusDamage
          : 0;

        const incoming = hitType === 'MISS' ? 0 : this.selectedDamageValue + bonus;

        const damageCalc = target.CombatController.CalculateDamage(
          this.selectedDamageType,
          incoming,
          this.damage.AP,
          this.damage.Irreducible,
          this.damage.Reliable
        );

        const armorCalc = target.CombatController.CalculateArmorReduction(
          this.selectedDamageType,
          this.selectedDamageValue,
          this.damage.AP,
          this.damage.Irreducible
        );

        return {
          hitType,
          target,
          incoming,
          type: this.selectedDamageType,
          reliable: this.damage.Reliable,
          damageCalc,
          armorCalc,
        };
      });

      this.$emit(
        'update:results',
        res.filter((x) => !!x)
      );
    },
    toggleAoe() {
      if (this.aoe) {
        this.aoe = false;
      } else {
        this.aoe = this.damage.AoE || true;
      }
      if (!this.aoe) {
        this.selectedTargets = [this.selectedTargets[0]];
        this.targetSaves = [this.targetSaves[0]];
        this.attackRolls = [this.attackRolls[0]];
      }
    },
    toggleOverkill() {
      if (this.overkill) {
        this.overkill = false;
      } else {
        this.overkill = this.damage.Overkill || true;
      }
      this.selectedDamageValue = null;
      this.emitResults();
    },
    addTarget() {
      this.selectedTargets.push(null);
      this.targetSaves.push(null);
    },
    cancelTarget(idx) {
      if (idx === 0 && this.selectedTargets.length === 1) {
        this.selectedTargets = [null];
        this.targetSaves = [null];
        this.attackRolls = [null];
        return;
      }
      this.selectedTargets.splice(idx, 1);
      this.targetSaves.splice(idx, 1);
      this.attackRolls.splice(idx, 1);
      this.emitResults();
    },
    toggleBonus() {
      this.bonus = !this.bonus;
      if (!this.bonus) {
        this.bonusDamage = 0;
      }
      this.emitResults();
    },
    getSummary() {
      let out = [];
      this.selectedTargets.forEach((t, idx) => {
        if (!t || !t.actor || !t.actor.CombatController) return;
        let part = `Deal ${this.selectedDamageValue} ${
          this.selectedDamageType
        } damage to ${t.actor.CombatController.Name}`;
        if (this.damage.AP) part += ' (ignores armor)';
        if (this.damage.Save) {
          if (this.targetSaves[idx] != null) {
            if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) {
              part += ` [SAVED]`;
              if (this.damage.SaveHalf) part += ' (half damage)';
              else {
                part = part.replace('Deal', 'Failed to deal');
              }
            } else {
              part += ` [FAILED SAVE]`;
            }
          }
        }
        if (this.damage.Attack) {
          if (this.attackRolls[idx] != null) {
            if (
              this.attackRolls[idx] >=
              (this.damage.Attack === 'tech'
                ? t.actor.CombatController.StatController.MaxStats['edef']
                : t.actor.CombatController.StatController.MaxStats['evasion'])
            ) {
              part += ` [HIT]`;
            } else {
              part += ` [MISS]`;
            }
          }
        }
        out.push(part);
      });
      if (out.length === 0) return '';
      return out.join('; ');
    },
    apply() {
      this.selectedTargets.forEach((t, idx) => {
        if (!t || !t.actor || !t.actor.CombatController) return;
        if (this.targetSaves[idx] != null && this.damage.Save) {
          if (this.targetSaves[idx] >= this.owner.CombatController.SaveTarget) return;
        }
        if (this.attackRolls[idx] != null && this.damage.Attack) {
          if (this.attackRolls[idx] < t.actor.CombatController.Evasion) return;
        }
        t.actor.CombatController.ApplyDamage(
          this.selectedDamageType,
          this.selectedDamageValue,
          this.damage.AP
        );
      });
    },
    getData() {
      return {
        damage: {
          Type: this.selectedDamageType,
          Value: this.selectedDamageValue,
          AP: this.damage.AP,
          Save: this.damage.Save ? { ...this.damage.Save } : null,
          AoE: this.aoe,
          Duration: this.damage.Duration,
        },
        targets: this.selectedTargets.map((t, idx) => ({
          target: t,
          save: this.damage.Save ? this.targetSaves[idx] : null,
          attack: this.damage.Attack ? this.attackRolls[idx] : null,
        })),
      };
    },
  },
};
</script>
