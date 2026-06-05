<template>
  <v-card flat
    tile>
    <equipment-destroyed-overlay :destroyed="item.Destroyed" />

    <v-row align="center"
      no-gutters
      justify="end"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-col :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <div>
          <v-tooltip v-if="item.ActiveEffects.length > 0"
            location="top"
            text="Active Effect">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="cc:trait"
                color="accent"
                size="x-small"
                class="mt-n1" />
            </template>
          </v-tooltip>
          <v-tooltip v-if="item.Bonuses.length > 0"
            location="top"
            text="Passive Bonus">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="cc:accuracy"
                color="accent"
                size="x-small"
                class="mt-n1" />
            </template>
          </v-tooltip>
          {{ item.Name }}
          <span v-if="(item as NpcWeapon).WeaponType"
            class="text-cc-overline px-1">
            <cc-slashes class="mx-1" />
            {{ (item as NpcWeapon).WeaponType }}
          </span>
          <span v-else
            class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            {{ (item as NpcWeapon).FeatureType }}
          </span>
        </div>
      </v-col>

      <v-col
        v-if="(item as NpcWeapon).Accuracy && ((item as NpcWeapon).Accuracy(tier) || (item as NpcWeapon).AttackBonus(tier))"
        cols="auto">
        <cc-npc-attack-bonus :attack-bonus="(item as NpcWeapon).AttackBonus(tier)"
          small />
        <cc-npc-accuracy-element :accuracy="(item as NpcWeapon).Accuracy(tier)"
          small />
      </v-col>

      <cc-slashes v-if="(item as NpcWeapon).WeaponType"
        class="pl-2 pr-1" />


      <v-col cols="auto">
        <cc-range-element v-if="(item as NpcWeapon).Range"
          small
          :range="(item as NpcWeapon).Range(tier, mods as NpcWeapon[])" />
        <cc-slashes v-if="(item as NpcWeapon).Range && (item as NpcWeapon).Damage"
          class="pr-1" />
        <cc-damage-element v-if="(item as NpcWeapon).Damage"
          small
          :damage="(item as NpcWeapon).Damage(tier, mods as NpcWeapon[])" />
      </v-col>

      <v-col v-if="!showCommandPanel"
        cols="auto">
        <v-btn icon
          flat
          tile
          size="x-small"
          variant="text"
          @click="collapsed = !collapsed">
          <v-icon size="30"
            :icon="collapsed ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
        </v-btn>
      </v-col>
    </v-row>

    <v-slide-y-transition>
      <div v-if="!collapsed"
        class="pb-1"
        style="position: relative"
        :style="item.Used ? 'opacity: 0.4' : ''">
        <v-card-text class="pa-0">
          <equipment-flavor-description :description="item.FlavorDescription" />

          <div v-if="item"
            class="pt-1">
            <on-element v-for="action in ['hit', 'crit', 'attack']"
              :key="action"
              :profile="item"
              :action="action" />

            <div v-if="mods">
              <npc-mod-inset v-for="mod in mods"
                :key="mod.ID"
                :mod="mod"
                :tier="tier" />
            </div>
          </div>

          <div v-if="item">
            <cc-panel v-if="(item as NpcReaction).Trigger"
              variant="outlined"
              density="no-gutters"
              class="mx-2 pa-1 mb-1">
              <div class="text-cc-overline text-disabled">Trigger</div>
              <p v-html-safe="(item as NpcReaction).TriggerByTier(tier)"
                class="text-text" />
            </cc-panel>

            <div v-if="item.Effect">
              <p v-html-safe="item.EffectByTier(tier)"
                class="mb-1 px-2" />
            </div>


            <ActionsDeployables :item="item"
              :actor="unit"
              :action-icon="item.Icon"
              @deploy="$emit('deploy', $event)" />

            <v-row dense
              align="center">
              <v-col cols="auto">
                <cc-tags v-if="item.Tags"
                  :tags="item.Tags"
                  color="pilot"
                  :bonus="limitedBonus"
                  combat />
              </v-col>
              <v-col cols="auto"
                class="ml-auto mr-4">
                <cc-bonus :bonuses="item.Bonuses"
                  chip />
                <cc-bonus :bonuses="externalUnitItemBonuses(unit, item)" />
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </div>
    </v-slide-y-transition>

    <equip-command-panel v-if="showCommandPanel"
      class="mb-2"
      :controller="unit.CombatController"
      :item="item" />
  </v-card>
</template>

<script setup lang="ts">
import type { Unit } from '@/classes/npc/unit/Unit'
import { useEncounterContext } from '../../encounterContext'
import { computed, ref, onMounted } from 'vue'
import NpcModInset from '@/features/gm/npc_roster/npcs/_components/NpcModInset.vue'
import EquipCommandPanel from './_equipCommandPanel.vue'
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { useDisplay } from 'vuetify'
import { externalUnitItemBonuses } from '@/composables/useExternalItemBonuses'
import EquipmentDestroyedOverlay from './_DestroyedOverlay.vue'
import EquipmentFlavorDescription from './_FlavorDescription.vue'
import { NpcFeature } from '@/classes/npc/feature/NpcFeature'
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon'
import { NpcReaction } from '@/classes/npc/feature/NpcItem/NpcReaction'

defineOptions({ name: 'UnitFeatureCombatCard' })

const { smAndDown: mobile } = useDisplay()

const props = defineProps<{
  item: NpcFeature
  unit: Unit
}>()

defineEmits<{
  'deploy': [value: any]
}>()

const limitedBonus = ref(0)
const collapsed = ref(false)

const mods = computed(() => {
  return props.unit.NpcFeatureController?.GetModifiers(props.item) || []
})
const tier = computed(() => {
  return props.unit.NpcClassController?.Tier || 1
})
const showCommandPanel = computed(() => {
  return !props.item.IsCombatPassive
})

onMounted(() => {
  if (props.item.IsV2 || props.item.FlavorName || props.item.FlavorDescription)
    collapsed.value = false
  else
    collapsed.value = !showCommandPanel.value
})
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
