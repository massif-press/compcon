<template>
  <div>
    <v-row justify="center" dense>
      <cc-statblock-panel
        v-if="deployable.Size"
        :icon="`cc:size_${deployable.Size === 0.5 ? 'half' : deployable.Size}`"
        name="Size"
        inline
        :value="`${deployable.Size === 0.5 ? '½' : deployable.Size}`" />
      <cc-statblock-panel
        v-if="deployable.Armor"
        icon="mdi-shield"
        name="Armor"
        inline
        :value="effectiveStatValue(deployable.Armor, 'armor')" />
      <cc-statblock-panel
        v-if="deployable.HP || deployable.Size"
        icon="mdi-heart"
        name="HP"
        inline
        :value="effectiveStatValue(deployable.HP || parseFloat(deployable.Size || 0.5) * 10, 'hp')" />
      <cc-statblock-panel
        v-if="deployable.Size"
        icon="cc:evasion"
        inline
        name="Evasion"
        :value="effectiveStatValue(deployable.evasion, 'evasion', 5) || 5" />
      <cc-statblock-panel
        v-if="deployable.EDefense"
        icon="cc:edef"
        inline
        name="E-Def"
        :value="effectiveStatValue(deployable.EDefense, 'edef')" />
      <cc-statblock-panel
        v-if="deployable.Heatcap"
        icon="cc:heat"
        inline
        name="Heat Capacity"
        :value="effectiveStatValue(deployable.Heatcap, 'heatcap')" />
      <cc-statblock-panel
        v-if="deployable.Sensors"
        icon="cc:sensor"
        inline
        name="Sensor Range"
        :value="effectiveStatValue(deployable.Sensors, 'sensor_range')" />
      <cc-statblock-panel
        v-if="deployable.TechAttack"
        icon="cc:full_tech"
        inline
        name="Tech Attack"
        :value="effectiveStatValue(deployable.TechAttack, 'tech_attack')" />
      <cc-statblock-panel
        v-if="deployable.Repcap"
        icon="cc:repair"
        inline
        name="Repair Capacity"
        :value="effectiveStatValue(deployable.Repcap, 'repcap')" />
      <cc-statblock-panel
        v-if="deployable.Save"
        icon="cc:save"
        inline
        name="Save Target"
        :value="effectiveStatValue(deployable.Save, 'save')" />
      <cc-statblock-panel
        v-if="deployable.Speed"
        icon="mdi-arrow-right-bold-hexagon-outline"
        inline
        name="Speed"
        :value="effectiveStatValue(deployable.Speed, 'speed')" />
    </v-row>
    <p v-html-safe="deployable.getDetail(tier)" class="pa-2" />

    <div v-if="deployable.Actions && deployable.Actions.length">
      <v-row no-gutters justify="center">
        <v-col v-for="(a, index) in deployable.Actions" :key="`action-${index}`" cols="auto">
          <cc-action :action="a" :panel="$vuetify.display.lgAndUp" class="ma-2" :tier="tier" />
        </v-col>
      </v-row>
    </div>

    <cc-tags v-if="deployable.Tags && deployable.Tags.length" :tags="deployable.Tags" />
  </div>
</template>

<script lang="ts">
import { ByTier, ByTierArray } from '@/util/tierFormat';

export default {
  name: 'deployable-info-base',
  props: {
    deployable: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
    owner: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    isDrone(): boolean {
      return this.deployable.Type?.toLowerCase() === 'drone';
    },
    _bonusController(): any {
      return this.owner?.FeatureController?.BonusController ?? null;
    },
  },
  methods: {
    byTier(str: string) {
      return ByTier(str, this.tier);
    },
    ByTierArray(str: string) {
      return ByTierArray(str, this.tier);
    },
    // Resolves a raw stat value to a number.
    // Handles plain numbers, tier arrays ('[5,8,12]'), and {statKey} expressions.
    // Returns undefined when the value is an expression that cannot be resolved.
    _resolveBase(raw: number | string | undefined, defaultVal: number): number | undefined {
      if (raw === undefined || raw === null || raw === '') return defaultVal;
      if (typeof raw === 'number') return raw;
      const str = String(raw).trim();
      // Expression referencing owner stats e.g. "{edef}", "2+{hull}"
      if (str.includes('{')) {
        if (!this.owner) return undefined;
        // Prefer getExpressionContext() (always current) over MaxStats (only populated post-SetStats)
        const ctx: Record<string, number> =
          this.owner.getExpressionContext?.() ??
          this.owner.CombatController?.StatController?.MaxStats ??
          {};
        const resolved = str.replace(/\{([^}]+)\}/gi, (_, key) => ctx[key] ?? ctx[key.toLowerCase()] ?? 0);
        const num = parseFloat(resolved);
        return isNaN(num) ? undefined : Math.floor(num);
      }
      // Tier array e.g. '[5,8,12]' or plain numeric string
      const tierResult = ByTierArray(str, this.tier);
      const num = parseFloat(tierResult as string);
      return isNaN(num) ? defaultVal : num;
    },
    // Returns the effective stat value, applying owner child-bonuses when an owner is present.
    // raw: the raw deployable stat (number, tier string, expression, or undefined)
    // bonusSuffix: the part after 'deployable_' / 'drone_' in the bonus ID (e.g. 'hp', 'edef')
    // defaultVal: fallback when raw is absent
    effectiveStatValue(raw: number | string | undefined, bonusSuffix: string, defaultVal = 0): number | string {
      const base = this._resolveBase(raw, defaultVal);
      // If base is undefined the raw value is an unresolvable expression — return it for display as-is
      if (base === undefined) return raw as string;

      const bc = this._bonusController;
      if (!bc) return base;

      let val: number = bc.sum(`deployable_${bonusSuffix}`, base);
      if (this.isDrone) val = bc.sum(`drone_${bonusSuffix}`, val);
      return val;
    },
  },
};
</script>
