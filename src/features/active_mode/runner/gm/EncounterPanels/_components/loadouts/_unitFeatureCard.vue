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
          <span v-if="item.WeaponType"
            class="text-cc-overline px-1">
            <cc-slashes class="mx-1" />
            {{ item.WeaponType }}
          </span>
          <span v-else
            class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            {{ item.FeatureType }}
          </span>
        </div>
      </v-col>

      <v-col v-if="item.HasAccuracy || item.HasAttackBonus"
        cols="auto">
        <cc-npc-attack-bonus :attack-bonus="item.AttackBonus(tier)"
          small />
        <cc-npc-accuracy-element :accuracy="item.Accuracy(tier)"
          small />
      </v-col>

      <cc-slashes v-if="item.WeaponType"
        class="pl-2 pr-1" />


      <v-col cols="auto">
        <cc-range-element v-if="item.Range"
          small
          :range="item.Range(tier, mods)" />
        <cc-slashes v-if="item.Range && item.Damage"
          class="pr-1" />
        <cc-damage-element v-if="item.Damage"
          small
          :damage="item.Damage(tier, mods)" />
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
            <cc-panel v-if="item.Trigger"
              variant="outlined"
              density="no-gutters"
              class="mx-2 pa-1 mb-1">
              <div class="text-cc-overline text-disabled">Trigger</div>
              <p v-html-safe="item.TriggerByTier(tier)"
                class="text-text" />
            </cc-panel>

            <div v-if="item.Effect">
              <p v-html-safe="item.EffectByTier(tier)"
                class="mb-1 px-2" />
            </div>


            <equipment-actions-deployables :item="item"
              :actor="unit"
              :owner="owner"
              :encounter="encounter"
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
              <v-col cols="auto">
                <cc-tags v-if="item.Mod"
                  :tags="item.Mod.AddedTags"
                  color="mod"
                  :bonus="limitedBonus"
                  combat />
              </v-col>
              <v-col cols="auto"
                class="ml-auto mr-4">
                <cc-bonus v-for="(b, index) in item.Bonuses"
                  :key="`bonus-${index}`"
                  :bonus="b"
                  chip
                  :tier="tier" />
                <cc-bonus v-for="(b, index) in externalUnitItemBonuses"
                  :key="`ext-bonus-${index}`"
                  :bonus="b"
                  chip
                  :tier="tier" />
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </div>
    </v-slide-y-transition>

    <equip-command-panel v-if="showCommandPanel"
      :owner="owner"
      class="mb-2"
      :controller="unit.CombatController"
      :encounter="encounter"
      :item="item" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import NpcModInset from '@/features/gm/npc_roster/npcs/_components/NpcModInset.vue'
import EquipCommandPanel from './_equipCommandPanel.vue'
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue'
import FlavorDescription from './_FlavorDescription.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { useMobile } from '@/composables/useMobile'
import { externalUnitItemBonuses } from '@/composables/useExternalItemBonuses'
import EquipmentDestroyedOverlay from './_DestroyedOverlay.vue'

defineOptions({ name: 'UnitFeatureCombatCard' })

const { mobile, portrait } = useMobile()

const props = defineProps<{
  item: object
  unit: object
  encounter: object
  owner: object
}>()

const emit = defineEmits<{
  'deploy': []
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

function sign(num: number) {
      return num > 0 ? '+' : '';
    }

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
