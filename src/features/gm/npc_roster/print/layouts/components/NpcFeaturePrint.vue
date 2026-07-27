<template>
  <v-row no-gutters
    align="center"
    class="no-print-break">
    <v-col cols="auto">
      <v-icon :icon="feature.Icon"
        class="mr-1" />
      <b v-text="feature.Name" />
    </v-col>
    <v-col v-if="isWeapon"
      cols="auto"
      class="px-1">
      <cc-slashes />
      <span class="text-grey pl-1">{{ asWeapon.WeaponType }}</span>
    </v-col>
    <v-col v-else="feature.FeatureType"
      cols="auto"
      class="px-1">
      <cc-slashes />
      <span class="text-grey pl-1">{{ feature.FeatureType }}</span>
    </v-col>
    <v-col v-if="isWeapon || feature.FeatureType === 'Weapon'"
      class="px-1 text-center">
      <span v-for="(r, ri) in asWeapon.Range(tier)"
        :key="`range-${ri}`"
        class="pl-1">
        <v-icon :icon="r.Icon"
          class="mt-n1" />
        {{ r.Value }}
      </span>
      <cc-slashes v-if="asWeapon.Damage(tier).length"
        class="pl-2" />
      <span v-for="(d, di) in asWeapon.Damage(tier)"
        :key="`damage-${di}`"
        class="pl-1">
        <v-icon :icon="d.Icon"
          class="mt-n1" />
        {{ d.Value }}
      </span>
      <span v-if="asWeapon.Accuracy(tier)"
        class="pl-1">
        <cc-slashes class="pl-1" />
        <v-icon icon="cc:accuracy"
          class="mt-n1" />
        {{ asWeapon.Accuracy(tier) }}
      </span>
      <span v-if="asWeapon.AttackBonus(tier)"
        class="pl-1">
        <cc-slashes class="pl-1 pr-2" />
        <v-icon icon="cc:reticle"
          class="mt-n1"
          size="small" />
        {{ asWeapon.AttackBonus(tier) }}
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
  <div v-if="(feature as NpcWeapon).Attacks && (feature as NpcWeapon).Attacks.some((x) => x > 1)">
    <i18n-t keypath="gm.featurePrint.weaponAttacks"
      tag="span"
      scope="global">
      <template #count><b>{{ tier ? (feature as NpcWeapon).Attacks[tier - 1] : (feature as
        NpcWeapon).Attacks.join(' / ') }}</b></template>
    </i18n-t>
  </div>

  <div v-if="(feature as NpcWeapon).OnMiss">
    <b>{{ $t('pm.print.onMISS') }}:</b>
    {{ (feature as NpcWeapon).OnMiss?.Detail }}
  </div>
  <div v-if="(feature as NpcWeapon).OnAttack">
    <b>{{ $t('pm.print.onATTACK') }}:</b>
    {{ (feature as NpcWeapon).OnAttack?.Detail }}
  </div>
  <div v-if="(feature as NpcWeapon).OnHit">
    <b>{{ $t('pm.print.onHIT') }}:</b>
    {{ (feature as NpcWeapon).OnHit?.Detail }}
  </div>
  <div v-if="(feature as NpcWeapon).OnCrit">
    <b>{{ $t('pm.print.onCRIT') }}:</b>
    {{ (feature as NpcWeapon).OnCrit?.Detail }}
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
import type { NpcFeature } from '@/classes/npc/feature/NpcFeature'
import { computed } from 'vue'
import PrintDeployable from './PrintDeployable.vue';
import PrintAction from './PrintAction.vue';
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon.js';

defineOptions({ name: 'PrintNpcFeature' })

const props = withDefaults(defineProps<{
  feature: NpcFeature
  tier?: number
}>(), {
  tier: 1
})

const isWeapon = computed(() => props.feature instanceof NpcWeapon)
const asWeapon = computed(() => props.feature as NpcWeapon)
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
