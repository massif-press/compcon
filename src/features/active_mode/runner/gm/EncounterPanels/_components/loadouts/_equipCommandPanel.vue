<template>
  <v-row no-gutters
    class="bg-panel"
    align="center">
    <v-col v-if="canDealDamage && item.ItemType === 'PilotWeapon'">
      <pilot-fight-button
        :action="fightAction"
        :preset-weapon="asPilotWeapon" />
    </v-col>
    <v-col v-if="canDealDamage && isFeature && !isSuperheavy">
      <npc-skirmish-button
        :action="skirmishAction"
        :preset-weapon="asNpcWeapon" />
    </v-col>
    <v-col v-if="canDealDamage && isFeature">
      <npc-barrage-button
        :action="barrageAction"
        :preset-weapon="asNpcWeapon" />
    </v-col>
    <v-col v-if="!isFeature && canDealDamage && canSkirmish"
      cols="auto">
      <mech-skirmish-button v-if="canSkirmish"
        :action="skirmishAction"
        :preset-weapon="asMechWeapon" />
    </v-col>
    <v-col v-if="!isFeature && canDealDamage && canBarrage"
      cols="auto"
      class="ml-1">
      <mech-barrage-button v-if="canBarrage"
        :action="barrageAction"
        :preset-weapon="asMechWeapon" />
    </v-col>
    <v-col v-if="isAI"
      cols="auto">
      <ai-control-button v-if="!controller.AIControl"
        :controller="controller"
        :size="mobile ? 'x-small' : 'small'"
        :label="$t('active.fields.cedeControl')"
        tooltip-text="Cede control of your mech to the NHP as a Protocol Action."
        @action="enableAI" />

      <ai-control-button v-if="controller.AIControl"
        :controller="controller"
        :label="$t('active.fields.reclaimControl')"
        tooltip-text="Reclaim control of your mech from the NHP as a Protocol Action."
        @action="disableAI" />

      <v-tooltip location="top"
        max-width="300"
        :text="$t('active.tooltips.markYourMechAsInCascade')">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            color="error"
            size="x-small"
            icon
            flat
            tile
            class="fade-select"
            height="25"
            @click="cascade">
            <v-icon icon="cc:monist"
              size="29"
              style="margin-top: -2px" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col cols="auto"
      class="ml-auto">
      <v-menu open-on-hover
        :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            height="26"
            tile
            flat
            :class="item.Used ? 'bg-success' : 'bg-primary'"
            @click="onUseToggle">
            <v-icon size="x-large"
              :icon="item.Used
                ? 'mdi-checkbox-marked-circle-outline'
                : isLoading
                  ? 'cc:ammo'
                  : 'cc:reticle'
                " />
          </v-btn>
        </template>
        <v-card class="text-center text-text text-cc-overline pa-2"
          width="300"
          border>
          <div v-if="isLoading">
            <i18n-t v-if="!item.Used" keypath="active.equipCmd.markUsedHint" tag="span" scope="global">
              <template #used><b>{{ $t('ui.fields.used') }}</b></template>
            </i18n-t>
            <i18n-t v-else keypath="active.equipCmd.reloadHint" tag="span" scope="global">
              <template #reload><b>{{ $t('active.equipCmd.reload') }}</b></template>
            </i18n-t>
          </div>
          <div v-else>{{ item.Used ? $t('active.equipCmd.clickUnused') : $t('active.equipCmd.clickUsed') }}</div>
        </v-card>
      </v-menu>
    </v-col>

    <v-col v-if="item.MaxUses"
      class="px-2 ml-1"
      cols="auto">
      <v-icon v-for="n in totalUses"
        :key="n"
        :icon="n > item.Uses ? 'mdi-hexagon-outline' : 'mdi-hexagon'"
        :disabled="item.Destroyed"
        class="mr-1"
        @click="setUses(n)" />
    </v-col>

    <v-col v-if="item.MaxUses"
      cols="auto"
      class="ml-1">
      <v-tooltip location="top"
        :text="$t('active.tooltips.resetUses')">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :disabled="item.Destroyed"
            @click="resetUses">
            <v-icon icon="mdi-reload" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="isDestroyable"
      cols="auto"
      class="ml-1"
      style="z-index: 4">
      <v-tooltip location="top"
        :text="$t('active.tooltips.toggleDestroyed')">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :class="item.Destroyed ? 'bg-success' : 'bg-primary'"
            @click="toggleDestroyed">
            <v-icon size="x-large"
              :icon="item.Destroyed ? 'mdi-wrench' : 'mdi-cube-off'" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="recharge"
      cols="auto"
      class="ml-1">
      <v-tooltip location="top"
        :text="`Force Recharge (Recharges on: ${recharge}+)`">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :disabled="!item.Used"
            :class="item.Used ? 'bg-primary' : ''"
            @click="toggleUsed">
            <v-icon icon="mdi-reload" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import { useEncounterContext } from '../../encounterContext'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { EffectSpecial } from '@/classes/components/feature/active_effects/effect_subtype/EffectSpecial'
import MechSkirmishButton from './action_buttons/mechSkirmishButton.vue'
import { CompendiumStore } from '@/stores'
import MechBarrageButton from './action_buttons/mechBarrageButton.vue'
import NpcSkirmishButton from './action_buttons/npcSkirmishButton.vue'
import NpcBarrageButton from './action_buttons/npcBarrageButton.vue'
import PilotFightButton from './action_buttons/pilotFightButton.vue'
import AiControlButton from './_aiControlButton.vue'
import { CombatController } from '@/classes/components/combat/CombatController'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import { MechSystem } from '@/classes/mech/components/equipment/MechSystem'
import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon'
import { NpcFeature } from '@/classes/npc/feature/NpcFeature'
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon'
import { snapshot } from '@/classes/encounter/EncounterUndoStack'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const _display = useDisplay()

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  item: MechWeapon | MechSystem | PilotWeapon | NpcFeature
  controller: CombatController
}>()

const mobile = computed(() => {
  return _display.mdAndDown.value
})
const isFeature = computed(() => {
  if (!props.item?.ItemType) return false
  return props.item.ItemType.toLowerCase().includes('npc')
})
const asMechWeapon = computed(() => props.item as MechWeapon)
const asNpcWeapon = computed(() => props.item as NpcWeapon)
const asPilotWeapon = computed(() => props.item as PilotWeapon)

const isSuperheavy = computed(() => props.item instanceof NpcWeapon && props.item.IsSuperheavy)
const canSkirmish = computed(() => props.item instanceof MechWeapon && !!props.item.Skirmish)
const canBarrage = computed(() => props.item instanceof MechWeapon && !!props.item.Barrage)
const isAI = computed(() => 'IsAI' in props.item && props.item.IsAI)
const isLoading = computed(() => 'IsLoading' in props.item && props.item.IsLoading)
const recharge = computed(() => (props.item instanceof NpcFeature ? props.item.Recharge : 0))

const isDestroyable = computed(() => {
  if ('IsIndestructible' in props.item && props.item.IsIndestructible) return false
  if (props.item.Tags?.some(x => x.IsIndestructible)) return false
  if (props.item.ItemType === 'NpcFeature') return false
  return true
})
const canDealDamage = computed(() => {
  return 'Damage' in props.item && !!props.item.Damage
})
const skirmishAction = computed(() => {
  return CompendiumStore().Actions.find(x => x.ID === 'act_skirmish')!
})
const barrageAction = computed(() => {
  return CompendiumStore().Actions.find(x => x.ID === 'act_barrage')!
})
const fightAction = computed(() => {
  return CompendiumStore().Actions.find(x => x.ID === 'act_fight')!
})
const totalUses = computed(() => {
  return Number(props.item.MaxUses || 0) + Number(props.controller.LimitedBonus || 0)
})

function snapshotItemEdit() {
  if (encounterInstance.value) snapshot(encounterInstance.value, t('active.equipCmd.undoEditItem', { name: props.item.Name }))
}
function setUses(n) {
  snapshotItemEdit()
  if (props.item.Uses === 1 && n === 1) {
    props.item.Uses = 0
  } else if (totalUses.value && n <= totalUses.value) {
    props.item.Uses = n
  }
}
function resetUses() {
  snapshotItemEdit()
  props.item.Uses = 0
}
function toggleDestroyed() {
  snapshotItemEdit()
  props.item.Destroyed = !props.item.Destroyed
}
function toggleUsed() {
  snapshotItemEdit()
  props.item.Used = !props.item.Used
}
function enableAI() {
  props.controller.CombatActions.Protocol = false
  props.controller.AIControl = true
}
function disableAI() {
  props.controller.CombatActions.Protocol = false
  props.controller.AIControl = false
}
function cascade() {
  props.controller.AIControl = true
  props.controller.ApplyCustomStatus(
    new EffectSpecial({
      attribute: 'In Cascade',
      detail:
        'An installed NHP has entered CASCADE and has taken full control of the mech. The mech is in control of the GM until the Pilot reclaims control by choosing to Shut Down the mech.',
    }),
    '',
    props.controller,
    props.controller,
    encounterInstance.value
  )
}
function onUseToggle() {
  snapshotItemEdit()
  props.item.Use()
}
</script>
