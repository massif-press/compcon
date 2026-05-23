<template>
  <div>
    <v-row justify="center"
      dense>
      <cc-statblock-panel v-if="deployable.Size"
        :icon="deployable.SizeIcon"
        name="Size"
        inline
        :value="`${deployable.Size === 0.5 ? '½' : deployable.Size}`" />
      <cc-statblock-panel v-if="deployable.Armor"
        icon="mdi-shield"
        name="Armor"
        inline
        :value="effectiveStatValue(deployable.Armor, 'armor')" />
      <cc-statblock-panel v-if="deployable.MaxHP"
        icon="mdi-heart"
        name="HP"
        inline
        :value="effectiveStatValue(deployable.MaxHP, 'hp')" />
      <cc-statblock-panel v-if="deployable.Evasion"
        icon="cc:evasion"
        inline
        name="Evasion"
        :value="effectiveStatValue(deployable.Evasion, 'evasion')" />
      <cc-statblock-panel v-if="deployable.EDefense"
        icon="cc:edef"
        inline
        name="E-Def"
        :value="effectiveStatValue(deployable.EDefense, 'edef')" />
      <cc-statblock-panel v-if="deployable.Heatcap"
        icon="cc:heat"
        inline
        name="Heat Capacity"
        :value="effectiveStatValue(deployable.Heatcap, 'heatcap')" />
      <cc-statblock-panel v-if="deployable.Sensors"
        icon="cc:sensor"
        inline
        name="Sensor Range"
        :value="effectiveStatValue(deployable.Sensors, 'sensor_range')" />
      <cc-statblock-panel v-if="deployable.TechAttack"
        icon="cc:full_tech"
        inline
        name="Tech Attack"
        :value="effectiveStatValue(deployable.TechAttack, 'tech_attack')" />
      <cc-statblock-panel v-if="deployable.Repcap"
        icon="cc:repair"
        inline
        name="Repair Capacity"
        :value="effectiveStatValue(deployable.Repcap, 'repcap')" />
      <cc-statblock-panel v-if="deployable.SaveTarget"
        icon="cc:save"
        inline
        name="Save Target"
        :value="effectiveStatValue(deployable.SaveTarget, 'save')" />
      <cc-statblock-panel v-if="deployable.Speed"
        icon="mdi-arrow-right-bold-hexagon-outline"
        inline
        name="Speed"
        :value="effectiveStatValue(deployable.Speed, 'speed')" />
    </v-row>
    <p v-html-safe="deployable.getDetail(tier)"
      class="pa-2" />

    <div v-if="deployable.Actions && deployable.Actions.length">
      <v-row no-gutters
        justify="center">
        <v-col v-for="(a, index) in deployable.Actions"
          :key="`action-${index}`"
          cols="auto">
          <cc-action :action="a"
            :panel="$vuetify.display.lgAndUp"
            class="ma-2"
            :tier="tier" />
        </v-col>
      </v-row>
    </div>

    <cc-tags v-if="deployable.Tags && deployable.Tags.length"
      :tags="deployable.Tags" />
  </div>
</template>

<script setup lang="ts">
import { Deployable } from '@/classes/components/feature/deployable/Deployable';
import { computed } from 'vue'
import { ByTier, ByTierArray as byTierArray } from '@/util/tierFormat';

const props = withDefaults(defineProps<{
  deployable: Deployable
  tier?: number
  owner?: object | null
}>(), {
  owner: null,
})

const isDrone = computed((): boolean => {
  return props.deployable.Type?.toLowerCase() === 'drone';
})

const _bonusController = computed((): any => {
  return props.owner?.FeatureController?.BonusController ?? null;
})

function byTier(str: string) {
  return ByTier(str, props.tier);
}

function _resolveBase(raw: number | string | undefined, defaultVal: number): number | undefined {
  if (raw === undefined || raw === null || raw === '') return defaultVal;
  if (typeof raw === 'number') return raw;
  const str = String(raw).trim();
  if (str.includes('{')) {
    if (!props.owner) return undefined;
    const ctx: Record<string, number> =
      props.owner.getExpressionContext?.() ??
      props.owner.CombatController?.StatController?.MaxStats ??
      {};
    const resolved = str.replace(/\{([^}]+)\}/gi, (_, key) => ctx[key] ?? ctx[key.toLowerCase()] ?? 0);
    try {
      // eslint-disable-next-line no-new-func
      const num = Function('return (' + resolved + ')')()
      return isNaN(num) ? undefined : Math.floor(num)
    } catch {
      const num = parseFloat(resolved)
      return isNaN(num) ? undefined : Math.floor(num)
    }
  }
  const tierResult = byTierArray(str, props.tier);
  const num = parseFloat(tierResult as string);
  return isNaN(num) ? defaultVal : num;
}

function effectiveStatValue(raw: number | string | undefined, bonusSuffix: string, defaultVal = 0): number | string {
  const base = _resolveBase(raw, defaultVal);
  if (base === undefined) {
    const stripped = String(raw).replace(/[{}]/g, '');
    return /\d/.test(stripped) ? stripped : `mech's ${stripped}`;
  }

  const bc = _bonusController.value;
  if (!bc) return base;

  let val: number | string = base;
  if (isDrone.value) val = bc.sum(`drone_${bonusSuffix}`, val);
  else val = bc.sum(`deployable_${bonusSuffix}`, base);
  return val;
}
</script>
