<template>
  <v-row no-gutters
    align="center"
    class="no-print-break">
    <v-col cols="auto">
      <v-icon :icon="feature.Icon"
        class="mr-1" />
      <b v-text="feature.Name" />
    </v-col>
    <v-col v-if="feature.WeaponType"
      cols="auto"
      class="px-1">
      <cc-slashes />
      <span class="text-grey pl-1">{{ feature.WeaponType }}</span>
    </v-col>
    <v-col v-else="feature.FeatureType"
      cols="auto"
      class="px-1">
      <cc-slashes />
      <span class="text-grey pl-1">{{ feature.FeatureType }}</span>
    </v-col>
    <v-col v-if="feature.WeaponType || feature.FeatureType === 'Weapon'"
      class="px-1 text-center">
      <span v-for="(r, ri) in feature.Range(tier)"
        :key="`range-${ri}`"
        class="pl-1">
        <v-icon :icon="r.Icon"
          class="mt-n1" />
        {{ r.Value }}
      </span>
      <cc-slashes v-if="feature.Damage(tier).length"
        class="pl-2" />
      <span v-for="(d, di) in feature.Damage(tier)"
        :key="`damage-${di}`"
        class="pl-1">
        <v-icon :icon="d.Icon"
          class="mt-n1" />
        {{ d.Value }}
      </span>
      <span v-if="feature.Accuracy(tier)"
        class="pl-1">
        <cc-slashes class="pl-1" />
        <v-icon icon="cc:accuracy"
          class="mt-n1" />
        {{ feature.Accuracy(tier) }}
      </span>
      <span v-if="feature.AttackBonus(tier)"
        class="pl-1">
        <cc-slashes class="pl-1 pr-2" />
        <v-icon icon="cc:reticle"
          class="mt-n1"
          size="small" />
        {{ feature.AttackBonus(tier) }}
      </span>
    </v-col>
    <v-col cols="auto"
      class="ml-auto">
      <v-chip v-for="tag in feature.Tags"
        :key="tag.ID"
        label
        size="x-small"
        class="ml-1">
        <span>{{ tag.GetName(0, tier).toUpperCase() }}</span>
      </v-chip>
    </v-col>
  </v-row>
  <div v-if="feature.Attacks && feature.Attacks.some((x) => x > 1)">
    <i18n-t keypath="gm.featurePrint.weaponAttacks" tag="span" scope="global">
      <template #count><b>{{ tier ? feature.Attacks[tier - 1] : feature.Attacks.join(' / ') }}</b></template>
    </i18n-t>
  </div>

  <div v-if="feature.OnMiss">
    <b>{{ $t('gm.featurePrint.onMiss') }}</b>
    {{ feature.OnMiss.Detail }}
  </div>
  <div v-if="feature.OnAttack">
    <b>{{ $t('gm.featurePrint.onAttack') }}</b>
    {{ feature.OnAttack.Detail }}
  </div>
  <div v-if="feature.OnHit">
    <b>{{ $t('gm.featurePrint.onHit') }}</b>
    {{ feature.OnHit.Detail }}
  </div>
  <div v-if="feature.OnCrit">
    <b>{{ $t('gm.featurePrint.onCrit') }}</b>
    {{ feature.OnCrit.Detail }}
  </div>

  <div v-html-safe="feature.EffectByTier(tier)" />

  <print-action v-if="feature.Actions.length"
    :actions="feature.Actions"
    :tier="tier" />
  <print-deployable v-if="feature.Deployables.length"
    :deployables="feature.Deployables"
    :tier="tier" />
</template>

<script setup lang="ts">
import PrintDeployable from './PrintDeployable.vue';
import PrintAction from './PrintAction.vue';

defineOptions({ name: 'PrintNpcFeature' })

const props = withDefaults(defineProps<{
  feature: object
  tier?: number
}>(), {
  tier: 1
})
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
