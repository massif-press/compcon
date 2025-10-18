<template>
  <v-row no-gutters align="center" class="no-print-break">
    <v-col cols="auto">
      <v-icon :icon="feature.Icon" class="mr-1" />
      <b v-text="feature.Name" />
    </v-col>
    <v-col v-if="feature.WeaponType" cols="auto" class="px-1">
      <cc-slashes />
      <span class="text-grey pl-1">{{ feature.WeaponType }}</span>
    </v-col>
    <v-col v-else="feature.FeatureType" cols="auto" class="px-1">
      <cc-slashes />
      <span class="text-grey pl-1">{{ feature.FeatureType }}</span>
    </v-col>
    <v-col v-if="feature.WeaponType" class="px-1 text-center">
      <span class="pl-1" v-for="r in feature.Range">
        <v-icon :icon="r.Icon" class="mt-n1" />
        {{ r.Value }}
      </span>
      <cc-slashes class="pl-2" v-if="feature.Damage(tier).length" />
      <span class="pl-1" v-for="d in feature.Damage(tier)">
        <v-icon :icon="d.Icon" class="mt-n1" />
        {{ d.Value }}
      </span>
      <span class="pl-1" v-if="feature.Accuracy(tier)">
        <cc-slashes class="pl-1" />
        <v-icon icon="cc:accuracy" class="mt-n1" />
        {{ feature.Accuracy(tier) }}
      </span>
      <span class="pl-1" v-if="feature.AttackBonus(tier)">
        <cc-slashes class="pl-1 pr-2" />
        <v-icon icon="cc:reticle" class="mt-n1" size="small" />
        {{ feature.AttackBonus(tier) }}
      </span>
    </v-col>
    <v-col cols="auto" class="ml-auto">
      <v-chip v-for="tag in feature.Tags" label size="x-small" class="ml-1">
        <span>{{ tag.GetName(0, tier).toUpperCase() }}</span>
      </v-chip>
    </v-col>
  </v-row>
  <div v-if="feature.Attacks && feature.Attacks.some((x) => x > 1)">
    This weapon can make
    <b>
      {{ tier ? feature.Attacks[tier - 1] : feature.Attacks.join(' / ') }}
    </b>
    attacks at a time.
  </div>

  <div v-if="feature.OnMiss">
    <b>ON MISS:</b>
    {{ feature.OnMiss.Detail }}
  </div>
  <div v-if="feature.OnAttack">
    <b>ON ATTACK:</b>
    {{ feature.OnAttack.Detail }}
  </div>
  <div v-if="feature.OnHit">
    <b>ON HIT:</b>
    {{ feature.OnHit.Detail }}
  </div>
  <div v-if="feature.OnCrit">
    <b>ON CRIT:</b>
    {{ feature.OnCrit.Detail }}
  </div>

  <div v-html-safe="feature.EffectByTier(tier)" />

  <print-action v-if="feature.Actions.length" :actions="feature.Actions" :tier="tier" />
  <print-deployable
    v-if="feature.Deployables.length"
    :deployables="feature.Deployables"
    :tier="tier" />
</template>

<script lang="ts">
import PrintDeployable from './PrintDeployable.vue';
import PrintAction from './PrintAction.vue';

export default {
  name: 'print-npc-feature',
  components: {
    PrintAction,
    PrintDeployable,
  },
  props: {
    feature: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}
</style>
