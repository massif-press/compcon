<template>
  <cc-dialog :close-on-click="false"
    :title="activeEffect.Name"
    icon="mdi-rhombus-outline"
    min-width="75vw">
    <template #activator="{ open }">
      <div class="top-element mr-6 mb-1"
        style="position: relative; display: inline-block">
        <div v-if="!isPassive"
          :class="`light bg-${activeEffect.Applied ? 'panel-border' : lightColor}`" />
        <v-chip :color="activeEffect.Applied ? 'panel-border' : 'primary'"
          variant="elevated"
          :ripple="false"
          size="small"
          flat
          style="
            corner-shape: bevel;
            border-bottom-left-radius: 3px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          "
          :style="`
            border-top-left-radius: ${isPassive ? '3' : '12'}px;
          `"
          @click="open">
          <template #prepend>
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
            <v-avatar v-if="activeEffect.Frequency"
              color="background"
              class="mr-1">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    :icon="frequencyIcon(activeEffect.Frequency)"
                    size="18" />
                </template>
                {{ frequencyText(activeEffect.Frequency) }}
              </v-tooltip>
            </v-avatar>
            <v-tooltip v-if="isPassive"
              location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="cc:trait"
                  size="18"
                  class="mr-1" />
              </template>
              Passive Effect
            </v-tooltip>
            <v-tooltip v-if="activeEffect.Damage.length"
              location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="cc:eclipse"
                  size="18"
                  class="mr-1" />
              </template>
              Damage Assignment Available
            </v-tooltip>
            <v-tooltip v-if="activeEffect.AddStatus"
              location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="cc:status_exposed"
                  size="18"
                  class="mr-1" />
              </template>
              Status Effect Available
            </v-tooltip>
            <v-tooltip v-if="activeEffect.Save"
              location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="mdi-dice-d20"
                  size="18"
                  class="mr-1" />
              </template>
              Save Available
            </v-tooltip>
            <v-tooltip v-if="activeEffect.AddResist"
              location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="mdi-shield-half-full"
                  size="18"
                  class="mr-1" />
              </template>
              Resistance/Immunity Available
            </v-tooltip>
            <v-tooltip v-if="activeEffect.AddOther"
              location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="mdi-hexagon-multiple"
                  size="18"
                  class="mr-1" />
              </template>
              Other Effect Available
            </v-tooltip>
            <v-tooltip v-if="activeEffect.AddSpecial"
              location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="mdi-star-four-points-circle"
                  size="18"
                  class="mr-1" />
              </template>
              Special Effect Available
            </v-tooltip>
          </template>
          <v-tooltip location="top"
            max-width="600px">
            <template #activator="{ props }">
              <div v-bind="props"
                class="font-weight-bold pl-2">
                {{ activeEffect.Name }}
              </div>
            </template>
            <div>
              <div class="heading h3">{{ activeEffect.Name }}</div>
              <div class="text-caption text-disabled my-n1">
                <i>
                  From {{ activeEffect.Origin.Name }}
                  <span v-if="activeEffect.Origin.Source">
                    ({{ activeEffect.Origin.Type }}, {{ activeEffect.Origin.Source }})
                  </span>
                </i>
              </div>
              <v-divider class="my-1" />
              <cc-alert v-if="activeEffect.Condition"
                color="primary">
                <b class="text-accent">IF:&nbsp;</b>
                <b>{{ activeEffect.Condition }}</b>
              </cc-alert>

              <div class="text-text pa-1"
                v-html-safe="byTier(activeEffect.Detail)" />

              <div v-if="activeEffect.Frequency"
                class="text-cc-overline text-center">
                <v-chip :color="activeEffect.Applied ? 'success' : 'text'"
                  size="small"
                  :prepend-icon="activeEffect.Applied ? 'mdi-check' : frequencyIcon(activeEffect.Frequency)
                    ">
                  {{ activeEffect.Frequency }}
                </v-chip>
              </div>
              <div v-if="activeEffect.Duration"
                class="text-cc-overline text-center">
                <v-chip :color="activeEffect.Applied ? 'success' : 'text'"
                  size="small"
                  :prepend-icon="activeEffect.Applied ? 'mdi-check' : ''">
                  {{ activeEffect.Duration }}
                </v-chip>
              </div>
            </div>
          </v-tooltip>
          <template #append>
            <v-icon v-if="activeEffect.Dismissible"
              size="18"
              icon="mdi-close" />
          </template>
        </v-chip>
        <div class="end"
          :class="`bg-${activeEffect.Applied ? 'panel-border' : 'primary'}`" />
        <div class="end-light"
          :class="`bg-${activeEffect.Applied ? 'panel-border' : lightColor}`" />
      </div>
    </template>
    <template #default="{ close }">
      <menu-input :key="owner.ID"
        :active-effect="activeEffect"
        :encounter="encounter"
        :owner="owner"
        :tier="tier"
        :close="close" />
    </template>
  </cc-dialog>
</template>

<script lang="ts">
import { Damage } from '@/class';
import { ActiveEffect } from '@/classes/components/feature/active_effects/ActiveEffect';
import { CombatantData } from '@/classes/encounter/Encounter';
import { ByTier } from '@/util/tierFormat';
import MenuInput from './_activeeffect/_ae_menu_input.vue';

export default {
  name: 'cc-active-effect-chip',
  components: {
    MenuInput,
  },
  props: {
    activeEffect: { type: ActiveEffect, required: true },
    tier: { type: Number, required: false, default: 1 },
    encounter: { type: Object, required: true },
    owner: { type: Object, required: true },
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

      out = this.encounter.Combatants.filter((c: CombatantData) => !c.actor.CombatController.IsDestroyed && !c.reinforcement).sort((a: CombatantData, b: CombatantData) => {
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
  },
};
</script>

<style scoped>
.light {
  position: absolute;
  top: 0;
  left: 0;
  width: 9px;
  height: 9px;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.3s ease-in-out;
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(40deg);
}

.end {
  position: absolute;
  right: -14px;
  top: -0.5px;
  bottom: 0;
  width: 15px;
  display: inline-block;
  clip-path: polygon(0 0, 0% 100%, 100% 0);
}

.end-light {
  position: absolute;
  right: -14px;
  top: 0;
  bottom: 0;
  width: 15px;
  display: inline-block;
  clip-path: polygon(80% 0, 100% 0, 20% 100%, 0% 100%);

  transition: filter 0.3s ease-in-out;
  z-index: 2;
}

.top-element:hover .end-light {
  filter: brightness(2) saturate(200%) hue-rotate(40deg);
}
</style>
