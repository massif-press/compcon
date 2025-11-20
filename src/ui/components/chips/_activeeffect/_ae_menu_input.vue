<template>
  <div>
    <div class="text-right text-caption text-disabled mb-1">
      <i v-if="activeEffect.Origin.Source">
        From {{ activeEffect.Origin.Name }}
        <span>({{ activeEffect.Origin.Type }}, {{ activeEffect.Origin.Source }})</span>
        - {{ activeEffect.Origin.LcpName }}
      </i>
    </div>
    <v-card v-if="activeEffect.Range.length" flat tile color="panel" class="px-2 mb-1">
      <span v-for="r in activeEffect.Range" class="text-cc-overline text-text">{{ r }}</span>
    </v-card>
    <cc-alert v-if="activeEffect.Condition" color="primary">
      <b class="text-accent">IF:&nbsp;</b>
      <b>{{ activeEffect.Condition }}</b>
    </cc-alert>
    <div class="text-text pa-1" v-html-safe="byTier(activeEffect.Detail)" />

    <v-avatar v-if="activeEffect.Duration" color="background" class="mr-1">
      <v-tooltip location="top">
        <template #activator="{ props }">
          <v-icon v-bind="props" icon="mdi-numeric-0-circle" size="18" />
        </template>
        Expires in X rounds
      </v-tooltip>
    </v-avatar>

    <v-card v-if="activeEffect.Save" flat tile color="panel" class="mb-1">
      <div class="pa-2">
        <save-input v-model="saveStat" :save="activeEffect.Save" :active-effect="activeEffect" />
      </div>
    </v-card>

    <v-card v-if="activeEffect.Damage.length" flat tile color="panel" class="mb-1">
      <damage-input
        v-for="(d, index) in activeEffect.Damage"
        :ref="`damageInput_${index}`"
        :key="index"
        :damage="d"
        :owner="owner"
        :targets="getTargetsSorted(d.Target || 'enemy')" />
    </v-card>

    <v-card v-if="activeEffect.AddStatus" flat tile color="panel" class="mb-1">
      <status-input
        v-for="s in activeEffect.AddStatus"
        ref="statusInput"
        :status="s"
        :owner="owner"
        :targets="getTargetsSorted(s.Target || 'enemy')" />
    </v-card>

    <v-card v-if="activeEffect.AddResist" flat tile color="panel" class="mb-1">
      <resist-input
        v-for="(r, index) in activeEffect.AddResist"
        :ref="`resistInput_${index}`"
        :resist="r"
        :owner="owner"
        :targets="getTargetsSorted(r.Target || 'enemy')" />
    </v-card>

    <v-card v-if="activeEffect.AddSpecial" flat tile color="panel" class="mb-1">
      <special-input
        v-for="(s, index) in activeEffect.AddSpecial"
        :ref="`specialInput_${index}`"
        :status="s"
        :owner="owner"
        :targets="getTargetsSorted(s.Target || 'enemy')" />
    </v-card>

    <v-card v-if="activeEffect.AddOther" flat tile color="panel" class="mb-1">
      <div class="pa-2" v-for="(o, idx) in activeEffect.AddOther">
        <v-row v-if="o.Type === 'overshield'" dense align="center">
          <v-col>
            <div class="text-cc-overline text-disabled">Overshield</div>
            <v-text-field
              ref="addOvershield"
              type="number"
              density="compact"
              hide-details
              variant="outlined"
              flat
              tile />
          </v-col>
          <v-col>
            <div class="text-cc-overline text-disabled">
              <span v-if="o.AoE">Targets</span>
              <span v-else>Target</span>
            </div>
            <v-select
              :ref="`other_targets_${idx}`"
              density="compact"
              variant="outlined"
              :multiple="!!o.AoE"
              :items="getTargetsSorted(o.Target || 'enemy')"
              flat
              hide-details
              tile />
          </v-col>
          <v-col cols="auto" class="mx-5">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-icon size="30" v-bind="props" :icon="getAoeIcon(o.AoE)" />
              </template>
              <div v-if="o.AoE">
                Area of Effect
                <span v-if="typeof o.AoE === 'string'">
                  <cc-slashes />
                  {{ o.AoE }}
                </span>
                <div>
                  <i class="text-caption text-disabled">Click to Override</i>
                </div>
              </div>
              <div v-else class="text-center">
                Single Target
                <div>
                  <i class="text-caption text-disabled">Click to Override</i>
                </div>
              </div>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <cc-button color="primary" size="small">
              Apply&nbsp;
              <span>
                X
                <v-icon size="small" icon="cc:explosive" class="mt-n1 ml-n2" />
              </span>
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <div v-if="canOverride" class="text-right">
      <v-btn color="light-panel" flat tile class="fade-select" size="x-small" @click="reset">
        Reset All
      </v-btn>
    </div>

    <v-slide-y-transition>
      <div v-if="summaries.length">
        <div class="text-cc-overline text-disabled">Staged:</div>
        <cc-alert>
          {{ summaries.join('; ') }}
        </cc-alert>
      </div>
    </v-slide-y-transition>

    <cc-button
      v-if="isPassive"
      block
      size="x-small"
      color="panel"
      prepend-icon="mdi-close"
      @click="close">
      Dismiss
    </cc-button>

    <div v-else class="d-flex justify-end mt-2 mr-4">
      <cc-button size="small" stacked @click="close">Cancel</cc-button>
      <v-spacer />
      <div>
        <cc-button
          v-if="!ready"
          size="small"
          stacked
          color="primary"
          :disabled="!canApply"
          @click="stage()">
          <div class="px-6">
            {{ canOverride ? 'Apply All' : 'Confirm' }}
            <div
              v-if="activeEffect.Frequency"
              class="text-disabled mt-1"
              style="letter-spacing: 1px">
              {{ activeEffect.Frequency }}
            </div>
          </div>
        </cc-button>

        <cc-button
          v-else
          size="small"
          stacked
          color="primary"
          :disabled="!canApply"
          @click="apply(close)">
          <div class="px-6">
            Confirm
            <div
              v-if="activeEffect.Frequency"
              class="text-disabled mt-1"
              style="letter-spacing: 1px">
              {{ activeEffect.Frequency }}
            </div>
          </div>
        </cc-button>
      </div>
    </div>
  </div>
  <div class="d-flex justify-end mt-2 mr-4">
    <v-spacer />
    <div>
      <v-btn
        v-if="activeEffect.Applied"
        size="x-small"
        block
        flat
        tile
        color="panel"
        @click="reapply(close)">
        Reapply Effect
        <template #append>
          <v-tooltip location="top" max-width="300px">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-information-outline" size="16" class="ml-2" />
            </template>
            <div class="text-center">
              <div><b class="text-text">Override</b></div>
              <v-divider />
              Re-apply this effect, ignoring any conditions or usage restrictions.
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

export default {
  name: 'ae-menu-input',
  components: {
    DamageInput,
    SaveInput,
    StatusInput,
    ResistInput,
    SpecialInput,
  },
  props: {
    activeEffect: { type: ActiveEffect, required: true },
    tier: { type: Number, required: false, default: 1 },
    encounter: { type: Object, required: true },
    owner: { type: Object, required: true },
    close: { type: Function, required: true },
  },
  data: () => ({
    saveStat: 'hull' as string,
    summaries: [] as Array<string>,
    ready: false,
  }),
  mounted() {
    if (this.activeEffect.Save && this.activeEffect.Save.Stat) {
      this.saveStat = this.activeEffect.Save.Stat;
    }
  },
  computed: {
    lightColor() {
      return this.activeEffect.Origin.Color || 'orange';
    },
    icon() {
      return this.activeEffect.Origin.Icon || 'mdi-rhombus-outline';
    },
    isPassive() {
      return (
        !this.activeEffect.AddOther &&
        !this.activeEffect.AddResist &&
        !this.activeEffect.AddStatus &&
        !this.activeEffect.AddResist &&
        !this.activeEffect.Damage.length &&
        !this.activeEffect.Save &&
        !this.activeEffect.Frequency
      );
    },
    canOverride() {
      return (
        this.activeEffect.AddOther ||
        this.activeEffect.AddResist ||
        this.activeEffect.AddStatus ||
        this.activeEffect.AddResist ||
        this.activeEffect.Damage.length > 0 ||
        this.activeEffect.Save
      );
    },
    hasAction() {
      return (
        this.activeEffect.AddOther ||
        this.activeEffect.AddResist ||
        this.activeEffect.AddStatus ||
        this.activeEffect.AddResist ||
        this.activeEffect.Damage.length ||
        this.activeEffect.Save
      );
    },
    canApply(): boolean {
      // if (this.canOverride) {
      //   // TODO
      //   return false;
      // }
      return !this.activeEffect.Applied;
    },
  },
  methods: {
    byTier(detail: string) {
      return ByTier(detail, this.tier);
    },
    getTargetsSorted(target: string): Array<object> {
      let out = [] as Array<CombatantData>;
      const self = this.encounter.Combatants.find(
        (c: CombatantData) => c.actor.ID === this.owner.ID
      );
      if (!self) return out;

      if (target === 'self')
        out = [self].concat(
          this.encounter.Combatants.filter((c: CombatantData) => c.id !== this.owner.id).sort(
            (a: CombatantData, b: CombatantData) =>
              a.actor.CombatController.Name.localeCompare(b.actor.CombatController.Name)
          )
        );

      if (self.side === 'enemy' && target === 'enemy') target = 'ally';
      else if (self.side === 'enemy' && target === 'ally') target = 'enemy';

      out = this.encounter.Combatants.sort((a: CombatantData, b: CombatantData) => {
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
      const n = Number(damage.TieredDamage(this.tier));
      if (!isNaN(n)) {
        return n;
      } else {
        return 0;
      }
    },
    initialPlaceholder(damage: Damage): string {
      const val = damage.TieredDamage(this.tier);
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

      return collectResults ? results : null;
    },

    getSummaries() {
      const summaries = this.iterateAE('getSummary', true) || [];
      this.summaries = summaries;
    },

    applyAll() {
      this.iterateAE('apply');
    },

    reset() {
      this.iterateAE('reset');
      this.summaries = [];
      this.ready = false;
    },
    stage() {
      if (!this.canApply) return;
      this.getSummaries();
      if (!this.canOverride) {
      }
      this.ready = true;
    },
    apply(close: Function) {
      if (!this.canApply || !this.ready) return;
      this.applyAll();
      this.activeEffect.Applied = true;

      close();
    },
    reapply(close: Function) {
      // TODO
      close();
    },
  },
};
</script>
