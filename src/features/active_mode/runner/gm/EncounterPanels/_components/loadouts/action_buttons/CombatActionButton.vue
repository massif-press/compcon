<template>
  <cc-dialog :color="available ? displayColor : 'panel'"
    :icon="displayIcon"
    :title="action.Name"
    :close-on-click="false"
    :min-width="minWidth"
    max-width="80vw">
    <template #activator="{ open }">
      <v-btn block
        flat
        tile
        :size="mobile ? 'x-small' : 'small'"
        height="28"
        :color="available ? displayColor : 'panel'"
        @click="open">
        <span class="ml-1">
          <v-icon :icon="displayIcon"
            :color="available ? '' : 'error'"
            start />
          <v-tooltip v-if="!available"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-exclamation-thick"
                color="error"
                class="ml-n2" />
            </template>
            <div class="text-center text-cc-overline">{{ $t('ui.combat.cannotActivateShort') }}</div>
            <v-divider class="my-1" />
            <div v-if="!canActivate">
              <div v-if="!canUse">{{ unavailableText }}</div>
              <div v-else>
                {{ $t('active.combatAction.insufficient') }}
                <v-chip :color="displayColor"
                  size="small"
                  variant="elevated"
                  :prepend-icon="displayIcon || ''">
                  {{ $enum('activationType', action.Activation) }}
                </v-chip>
                {{ $t('active.combatAction.actionsRemaining') }}
              </div>
            </div>
            <div v-else-if="!canUse">{{ unavailableText }}</div>
          </v-tooltip>
        </span>
        <v-tooltip location="top"
          width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ action.Name }}
            </span>
          </template>
          <div v-if="isLimited"
            class="text-cc-overline">
            {{ $t('active.combatAction.usesRemaining', { n: remainingUses, max: action.Frequency.Uses, period: periodLabel }) }}
          </div>
          <div class="d-flex">
            <div class="heading h4 d-flex">{{ action.Name }}</div>
            <v-spacer />
            <v-chip size="x-small"
              :color="displayColor"
              :prepend-icon="displayIcon"
              variant="elevated"
              elevation="0">
              {{ $t('active.combatAction.activationAction', { n: action.Activation }) }}
            </v-chip>
          </div>
          <v-divider class="my-1" />
          {{ action.Terse }}
        </v-tooltip>
        <v-tooltip v-if="isLimited"
          location="top"
          :text="$t('active.combatAction.restoreUse')">
          <template #activator="{ props }">
            <span v-bind="props"
              class="ml-2">
              <v-icon v-for="n in action.Frequency.Uses"
                :key="n"
                size="12"
                :icon="n > usedCount ? 'mdi-hexagon-outline' : 'mdi-hexagon'"
                @click.stop="controller.RestoreUse(useId)" />
            </span>
          </template>
        </v-tooltip>
      </v-btn>
    </template>
    <template #default="{ close }">
      <slot :close="close" />
    </template>
  </cc-dialog>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../../../encounterContext'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { Action } from '@/classes/Action'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActivePeriod } from '@/classes/Frequency'

const { owner, encounterInstance } = useEncounterContext()
const { t } = useI18n()

const props = withDefaults(defineProps<{
  action: Action
  presetWeapon?: { InstanceID: string }
  mobile?: boolean
  actionColor?: string
  actionIcon?: string
  minWidth?: string
}>(), {
  presetWeapon: undefined,
  mobile: false,
  actionColor: undefined,
  actionIcon: undefined,
  minWidth: '70vw'
})

const displayColor = computed(() => {
      return props.actionColor ?? props.action.Color;
    })
const displayIcon = computed(() => {
      return props.actionIcon ?? props.action.Icon;
    })
const controller = computed(() => {
      return owner.value.actor.CombatController.ActiveActor.CombatController;
    })
const canActivate = computed(() => {
      return controller.value.CanActivate(props.action.Activation);
    })
const useId = computed(() => props.presetWeapon?.InstanceID ?? props.action.ID)
const canUse = computed(() => controller.value.RemainingUses(useId.value) > 0)
const usedCount = computed(() => controller.value.UsedCount(useId.value))
const remainingUses = computed(() => props.action.Frequency.Uses - usedCount.value)
const isLimited = computed(() =>
      !props.presetWeapon && !props.action.Frequency.Unlimited && props.action.Frequency.Uses > 1)
const periodLabel = computed(() => {
      const duration = props.action.Frequency.Duration
      const key = duration === ActivePeriod.Scene ? 'encounter' : duration.toLowerCase()
      return t(`enums.duration.${key}`)
    })
const unavailableText = computed(() =>
      isLimited.value
        ? t('active.combatAction.usesExhausted', { period: periodLabel.value })
        : t('active.combatAction.alreadyUsed'))
const available = computed(() => {
      return canActivate.value && canUse.value;
    })
</script>
