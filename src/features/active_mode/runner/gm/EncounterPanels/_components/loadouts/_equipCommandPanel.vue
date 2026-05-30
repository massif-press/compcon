<template>
  <v-row no-gutters
    class="bg-panel"
    align="center">
    <v-col v-if="canDealDamage && item.ItemType === 'PilotWeapon'">
      <pilot-fight-button :owner="owner"
        :action="fightAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="canDealDamage && isFeature && !item.IsSuperheavy">
      <npc-skirmish-button :owner="owner"
        :action="skirmishAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="canDealDamage && isFeature">
      <npc-barrage-button :owner="owner"
        :action="barrageAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="!isFeature && canDealDamage && item.Skirmish"
      cols="auto">
      <mech-skirmish-button v-if="item.Skirmish"
        :owner="owner"
        :action="skirmishAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="!isFeature && canDealDamage && item.Barrage"
      cols="auto"
      class="ml-1">
      <mech-barrage-button v-if="item.Barrage"
        :owner="owner"
        :action="barrageAction"
        :controller="controller"
        :encounter="encounter"
        :preset-weapon="item"
        @activate="activate($event)" />
    </v-col>
    <v-col v-if="item.IsAI"
      cols="auto">
      <ai-control-button v-if="!controller.AIControl"
        :controller="controller"
        :size="mobile ? 'x-small' : 'small'"
        label="Cede Control"
        tooltip-text="Cede control of your mech to the NHP as a Protocol Action."
        @action="enableAI" />

      <ai-control-button v-if="controller.AIControl"
        :controller="controller"
        label="Reclaim Control"
        tooltip-text="Reclaim control of your mech from the NHP as a Protocol Action."
        @action="disableAI" />

      <v-tooltip location="top"
        max-width="300"
        text="Mark your mech as IN CASCADE">
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
                : item.IsLoading
                  ? 'cc:ammo'
                  : 'cc:reticle'
                " />
          </v-btn>
        </template>
        <v-card class="text-center text-text text-cc-overline pa-2"
          width="300"
          border>
          <div v-if="item.IsLoading">
            <span v-if="!item.Used">
              Click to mark as
              <b>used</b>
              . Weapons with the LOADING tag must be reloaded before they can be loaded again
            </span>
            <span v-else>
              Click to
              <b>reload</b>
              this weapon.
            </span>
          </div>
          <div v-else>Click to mark {{ item.Used ? 'Unused' : 'Used' }}</div>
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
        text="Reset Uses">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :disabled="item.Destroyed"
            @click="item.Uses = 0">
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
        text="Toggle Destroyed">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :class="item.Destroyed ? 'bg-success' : 'bg-primary'"
            @click="item.Destroyed = !item.Destroyed">
            <v-icon size="x-large"
              :icon="item.Destroyed ? 'mdi-wrench' : 'mdi-cube-off'" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="item.Recharge"
      cols="auto"
      class="ml-1">
      <v-tooltip location="top"
        :text="`Force Recharge (Recharges on: ${item.Recharge}+)`">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :disabled="!item.Used"
            :class="item.Used ? 'bg-primary' : ''"
            @click="item.Used = !item.Used">
            <v-icon icon="mdi-reload" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
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

const _display = useDisplay()

const props = defineProps<{
  item: object
  owner: object
  controller: CombatController
  encounter: object
}>()

const mobile = computed(() => {
      return _display.mdAndDown.value
    })
const isFeature = computed(() => {
      if (!props.item?.ItemType) return false
      return props.item.ItemType.toLowerCase().includes('npc')
    })
const isDestroyable = computed(() => {
      if (props.item.IsIndestructible || props.item.Tags?.some(x => x.IsIndestructible)) return false
      if (props.item.ItemType === 'NpcFeature') return false
      return true
    })
const canDealDamage = computed(() => {
      return !!props.item.Damage
    })
const skirmishAction = computed(() => {
      return CompendiumStore().Actions.find(x => x.ID === 'act_skirmish')
    })
const barrageAction = computed(() => {
      return CompendiumStore().Actions.find(x => x.ID === 'act_barrage')
    })
const fightAction = computed(() => {
      return CompendiumStore().Actions.find(x => x.ID === 'act_fight')
    })
const totalUses = computed(() => {
      return Number(props.item.MaxUses || 0) + Number(props.controller.LimitedBonus || 0)
    })

function setUses(n) {
      if (props.item.Uses === 1 && n === 1) {
        props.item.Uses = 0
      } else if (totalUses.value && n <= totalUses.value) {
        props.item.Uses = n
      }
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
        props.encounter
      )
    }
function onUseToggle() {
      props.item.Use()
    }
</script>
