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
    <v-col v-else
      cols="auto"
      class="px-1">
      <cc-slashes />
      <span class="text-grey pl-1">{{ feature.FeatureType }}</span>
    </v-col>
    <v-col v-if="isWeapon || feature.HasAccuracy || feature.HasAttackBonus"
      class="px-1 text-center">
      <template v-if="isWeapon">
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
      </template>
      <span v-if="feature.HasAccuracy"
        class="pl-1">
        <cc-slashes v-if="isWeapon"
          class="pl-1" />
        <v-icon :icon="feature.Accuracy(tier) < 0 ? 'cc:difficulty' : 'cc:accuracy'"
          class="mt-n1" />
        {{ signed(feature.Accuracy(tier)) }}
      </span>
      <span v-if="isWeapon || feature.HasAttackBonus"
        class="pl-1">
        <cc-slashes v-if="isWeapon || feature.HasAccuracy"
          class="pl-1 pr-2" />
        <v-icon icon="cc:reticle"
          class="mt-n1"
          size="small" />
        {{ signed(feature.AttackBonus(tier)) }}
      </span>
    </v-col>
    <v-col cols="auto"
      class="ml-auto">
      <cc-tags v-if="feature.Tags?.length"
        print
        :tags="feature.Tags"
        :tier="tier" />
    </v-col>
  </v-row>

  <div v-if="feature.IsDeprecated"
    class="text-caption font-weight-bold text-uppercase">
    {{ $t('ui.card.deprecated') }}
  </div>
  <div v-if="feature.Kit">
    <b>{{ feature.Kit }}</b>
    {{ $t('ui.card.kit') }}
  </div>
  <div v-if="feature.Mod">
    <b>{{ $t('ui.card.modifies') }}:</b>
    {{ feature.ModTarget?.Name || $t('common.unknown') }}
  </div>

  <div v-if="(feature as NpcWeapon).Attacks && (feature as NpcWeapon).Attacks.some(x => x > 1)">
    <i18n-t keypath="gm.featurePrint.weaponAttacks"
      tag="span"
      scope="global">
      <template #count>
        <b>
          {{
            tier
              ? (feature as NpcWeapon).Attacks[tier - 1]
              : (feature as NpcWeapon).Attacks.join(' / ')
          }}
        </b>
      </template>
    </i18n-t>
  </div>

  <div v-if="feature.Trigger">
    <b>{{ $t('common.trigger') }}:</b>
    <span v-html-safe="feature.TriggerByTier(tier)" />
  </div>

  <div v-if="(feature as NpcWeapon).OnMiss">
    <b>{{ $t('pm.print.onMISS') }}:</b>
    <span v-html-safe="(feature as NpcWeapon).OnMiss?.getDetail(tier)" />
  </div>
  <div v-if="(feature as NpcWeapon).OnAttack">
    <b>{{ $t('pm.print.onATTACK') }}:</b>
    <span v-html-safe="(feature as NpcWeapon).OnAttack?.getDetail(tier)" />
  </div>
  <div v-if="(feature as NpcWeapon).OnHit">
    <b>{{ $t('pm.print.onHIT') }}:</b>
    <span v-html-safe="(feature as NpcWeapon).OnHit?.getDetail(tier)" />
  </div>
  <div v-if="(feature as NpcWeapon).OnCrit">
    <b>{{ $t('pm.print.onCRIT') }}:</b>
    <span v-html-safe="(feature as NpcWeapon).OnCrit?.getDetail(tier)" />
  </div>

  <div v-html-safe="feature.EffectByTier(tier)" />

  <div v-for="(b, bi) in feature.Bonuses"
    :key="`bonus-${bi}`">
    <v-icon icon="mdi-plus-box-outline"
      size="x-small"
      class="mr-1" />
    <span v-text="b.Detail" />
  </div>

  <print-action v-if="feature.Actions.length"
    :actions="feature.Actions"
    :tier="tier" />
  <print-deployable v-if="feature.Deployables.length"
    :deployables="feature.Deployables"
    :tier="tier"
    :owner="owner" />

  <div v-if="feature.Description"
    v-html-safe="feature.Description"
    class="flavor-text mt-1" />

  <div v-for="m in mods"
    :key="`mod-${m.ID}`"
    class="mt-1 pl-2 ml-2"
    style="border-left: 2px solid rgba(0, 0, 0, 0.3)">
    <NpcFeaturePrint :feature="m"
      :tier="tier"
      :owner="owner" />
  </div>
</template>

<script setup lang="ts">
import type { NpcFeature } from '@/classes/npc/feature/NpcFeature'
import { computed } from 'vue'
import PrintDeployable from './PrintDeployable.vue'
import PrintAction from './PrintAction.vue'
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon.js'
import type { DeployableOwner } from '@/classes/components/feature/IFeatureController'

defineOptions({ name: 'NpcFeaturePrint' })

const props = withDefaults(
  defineProps<{
    feature: NpcFeature
    tier?: number
    owner?: DeployableOwner | null
    mods?: NpcFeature[]
  }>(),
  {
    tier: 1,
    owner: null,
    mods: () => [],
  }
)

const isWeapon = computed(() => props.feature instanceof NpcWeapon)
const asWeapon = computed(() => props.feature as NpcWeapon)

function signed(n: number): string {
  return n > 0 ? `+${n}` : String(n)
}
</script>
