<template>
  <v-menu
    :open-on-hover="!mobile"
    max-width="400"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <div class="mr-n4 ml-n2">
        <v-btn
          icon
          size="x-small"
          variant="text"
          flat
          tile
          v-bind="props"
          @click="!mobile && rollAttack()"
        >
          <v-icon
            :size="mobile ? 22 : 25"
            icon="mdi-dice-d20"
          />
        </v-btn>
      </div>
    </template>
    <template #default>
      <v-card
        class="text-center text-text text-cc-overline"
        style="overflow-x: hidden"
        border
      >
        <v-card-text class="pa-2">
          <div class="text-center">
            {{ $t('ui.combat.d20Plus') }} {{ rollData.AttackBonus }}
            <br />
            {{ rollData.AttackAccuracy }}
            {{ rollData.AttackAccuracy > 0 ? $t('common.accuracy') : $t('common.difficulty') }}
            <br />
            {{ $t('ui.combat.vsTarget') }}
            {{ rollData.TargetDefense }}
          </div>

          <div class="text-center">
            <div v-if="engagedDifficulty">
              - {{ engagedDifficulty }} {{ $t('ui.combat.currentlyEngaged') }}
            </div>
            <div v-if="targetCoverDifficulty">
              - {{ targetCoverDifficulty }} {{ $t('ui.combat.targetInCover') }}
            </div>
          </div>

          <v-checkbox
            v-if="canConsumeLockOn"
            v-model="consumeLockOn"
            density="compact"
            hide-details
            :label="$t('ui.combat.consumeLockOn')"
          />

          <accuracy-difficulty-row
            v-model="rollData.AttackAccuracy"
            v-model:bonus="rollData.AttackBonus"
          />

          <v-btn
            size="x-small"
            flat
            tile
            block
            color="panel"
            class="mt-1"
            @click="reset()"
          >
            {{ $t('common.reset') }}
          </v-btn>

          <v-btn
            flat
            tile
            class="mt-2"
            color="primary"
            size="small"
            block
            @click="rollAttack()"
          >
            {{ $t('common.roll_verb') }}
          </v-btn>
          <div class="pa-2 text-left text-cc-overline text-accent">
            <span class="text-lowercase">{{ $t('active.skillCheck.rollResults') }}</span>
          </div>
          <div
            v-if="rollData.AttackRollResult"
            class="text-text"
          >
            <span v-html-safe="rollData.AttackRollResult.toString()" />
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-menu>
</template>

<script setup lang="ts">
  import type { ActiveEventTarget } from '@/classes/components/feature/active_effects/effect_events/eventTarget'
  import { computed, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import { DiceRoller } from '@/classes/dice/DiceRoller'
  import AccuracyDifficultyRow from './AccuracyDifficultyRow.vue'

  const { mdAndDown: mobile } = useDisplay()

  const props = defineProps<{
    rollData: ActiveEventTarget
  }>()

  const emit = defineEmits<{
    rolled: [value: number]
  }>()

  const dice = [2, 3, 4, 6, 8, 10, 12, 20, 100]


  const targetController = computed(() => props.rollData.Combatant?.actor?.CombatController)
  const attacker = computed(() => props.rollData.Event.Initiator.actor.CombatController)

  const attackType = computed(() => props.rollData.AttackType ?? 'ranged')

  const targetCoverDifficulty = computed(
    () => targetController.value?.DifficultyAgainst(attackType.value) ?? 0
  )

  const engagedDifficulty = computed(() => attacker.value.DifficultyFor(attackType.value))

  const statusAccuracy = computed(() => props.rollData.StatusAccuracy)

  const canConsumeLockOn = computed(() => attacker.value.CanConsumeLockOn(targetController.value))
  const consumeLockOn = ref(false)

  function reset() {
    props.rollData.AttackBonus = props.rollData.Event.AttackBonus || 0
    props.rollData.AttackAccuracy = props.rollData.Event.Accuracy || 0
    props.rollData.AttackRollResult = undefined
    emit('rolled', 0)
  }

  function rollAttack() {
    const lockOn = consumeLockOn.value
      ? attacker.value.ConsumeLockOnAgainst(targetController.value)
      : 0
    consumeLockOn.value = false

    const rollResult = DiceRoller.rollSkillCheck(
      Number(props.rollData.AttackBonus),
      props.rollData.AttackAccuracy + statusAccuracy.value + lockOn
    )
    props.rollData.AttackRollResult = rollResult
    props.rollData.AttackRolledValue = rollResult.total

    emit('rolled', props.rollData.AttackRolledValue)
  }
</script>
