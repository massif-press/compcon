<template>
  <v-card min-height="500px">
    <v-toolbar flat
      tile
      density="compact"
      color="primary"
      height="46">
      <v-toolbar-title class="heading h3">{{ $t('active.diceRoller.title') }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon
        @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="selected">
      <div class="heading bg-primary px-5">
        <span class="text-disabled pr-2">{{ $t('active.common.currentlySelected') }}</span>
        <strong v-if="selected">
          {{ actor.Name }}
        </strong>
        <span v-else
          class="text-disabled">{{ $t('common.none') }}</span>
      </div>
      <div>
        <div class="text-cc-overline ma-1">{{ $t('active.diceRoller.quickRoll') }}</div>
        <v-row no-gutters
          class="px-6">
          <v-col><v-btn border
              block
              tile
              flat
              color="primary"
              size="small"
              @click="setCheck('Hull')">{{ $t('active.diceRoller.hullCheck') }}</v-btn></v-col>
          <v-col><v-btn border
              block
              tile
              flat
              color="primary"
              size="small"
              @click="setCheck('Agi')">{{ $t('active.diceRoller.agilityCheck') }}</v-btn></v-col>
          <v-col><v-btn border
              block
              tile
              flat
              color="primary"
              size="small"
              @click="setCheck('Sys')">{{ $t('active.diceRoller.systemsCheck') }}</v-btn></v-col>
          <v-col>
            <v-btn border
              block
              tile
              flat
              color="primary"
              size="small"
              @click="setCheck('Eng')">{{ $t('active.diceRoller.engineeringCheck') }}</v-btn>
          </v-col>

        </v-row>
      </div>
    </div>
    <v-divider v-if="selected"
      class="my-2" />
    <v-card-text class="pb-0">
      <v-row dense>
        <v-col cols="auto">
          <v-card class="text-text text-cc-overline"
            flat>
            <v-card-text class="pa-2">
              <v-row dense
                align="center">
                <v-col cols=6
                  md="">
                  <div class="text-cc-overline text-disabled">{{ $t('active.diceRoller.count') }}</div>
                  <v-text-field v-model="count"
                    density="compact"
                    variant="outlined"
                    type="number"
                    hide-spin-buttons
                    flat
                    hide-details
                    tile />
                </v-col>
                <v-col cols=6
                  md="">
                  <div class="text-cc-overline text-disabled">{{ $t('active.diceRoller.die') }}</div>
                  <v-select v-model="die"
                    :items="dice"
                    density="compact"
                    variant="outlined"
                    type="number"
                    flat
                    min-width="100"
                    hide-details
                    tile>
                    <template #prepend-inner>
                      <v-icon icon=mdi-alpha-d />
                    </template>
                  </v-select>
                </v-col>
                <v-col cols=6
                  md="">
                  <div class="text-cc-overline text-disabled">{{ $t('common.bonus') }}</div>
                  <v-text-field v-model="plus"
                    density="compact"
                    variant="outlined"
                    type="number"
                    hide-spin-buttons
                    flat
                    hide-details
                    tile>
                    <template #prepend-inner>
                      <v-icon icon=mdi-plus />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols=6
                  md="">
                  <div class="text-cc-overline text-disabled">{{ $t('common.accuracy') }}</div>
                  <v-text-field v-model="accuracy"
                    density="compact"
                    variant="outlined"
                    type="number"
                    hide-spin-buttons
                    flat
                    hide-details
                    tile
                    max-width="140"
                    @update:model-value="accuracy = Number($event)">
                    <template #prepend>
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-icon class="mr-n3"
                            v-bind="props"
                            size="x-large"
                            color="accent"
                            :icon="accuracy > 0 ? 'cc:accuracy' : 'cc:difficulty'" />
                        </template>
                      </v-tooltip>
                    </template>
                    <template #prepend-inner>
                      <v-btn flat
                        tile
                        icon
                        size="x-small"
                        class="ml-n2"
                        @click="accuracy--">
                        <v-icon size="20"
                          icon="mdi-minus" />
                      </v-btn>
                    </template>
                    <template #append-inner>
                      <v-btn flat
                        tile
                        icon
                        size="x-small"
                        class="mr-n2"
                        @click="accuracy++">
                        <v-icon size="20"
                          icon="mdi-plus" />
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <div class="mt-2 mb-4">
                <cc-switch v-model="isCrit"
                  :label="$t('active.fields.critical')"
                  class="mt-2"
                  :tooltip="$t('active.tooltips.rollAllDiceTakingThe')" />
                <cc-switch v-model="Overkill"
                  :label="$t('active.fields.overkill')"
                  class="mt-2"
                  :tooltip="$t('active.tooltips.reroll1s')" />
              </div>

              <v-btn size="x-small"
                flat
                tile
                block
                color="panel"
                class="mt-1"
                @click="reset()">{{ $t('common.reset') }}</v-btn>


            </v-card-text>
          </v-card>

          <v-divider class="my-4" />
          <div>
            <cc-button color="success"
              size="small"
              block
              @click="rollDice"
              :disabled="!diceToRoll.length"
              class="mt-2"
              prepend-icon="mdi-dice-d20">
              {{ $t('active.diceRoller.rollDice') }}
            </cc-button>
          </div>
        </v-col>
        <v-divider vertical
          class="mx-1" />
        <v-col class="mt-n2">
          <div class="text-cc-overline">{{ $t('active.diceRoller.rollResult') }}</div>
          <div v-if="lastRoll !== null">
            <div class="text-center my-2 bg-primary heading h1">
              {{ lastRoll }}
            </div>
            <div class="text-center">
              <span v-html-safe="lastRollString" />
            </div>
          </div>
          <div v-else
            class="text-caption text-disabled">{{ $t('active.diceRoller.noRolls') }}</div>
          <v-divider class="my-2" />
          <div class="text-cc-overline mb-2">{{ $t('active.diceRoller.sessionHistory') }}</div>
          <div style="max-height: 300px; overflow-y: scroll">
            <div v-for="(n, index) in encounterInstance.RollHistory"
              :key="`roll-${index}`"
              class="text-cc-overline bg-panel mb-1 pa-1"
              v-html-safe="n" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, ref } from 'vue'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import DiceRollInterface from '@/ui/components/chips/_activeeffect/_shared/DiceRollInterface.vue'

defineOptions({ name: 'GmDiceRoller' })

const props = withDefaults(defineProps<{
  selected?: object | false
  encounterInstance: EncounterInstance
}>(), {
  selected: false,
})

const diceToRoll = ref([{ type: 'd20', accuracy: 0, bonus: 0 }])
const lastRoll = ref<any>(null)
const lastRollString = ref('')
const dice = ref([2, 3, 4, 6, 8, 10, 12, 20, 100])
const count = ref(1)
const die = ref('20')
const plus = ref(0)
const isCrit = ref(false)
const Overkill = ref(false)
const accuracy = ref(0)
const rollResult = ref<any>(null)
const rollType = ref('')
const bonus = ref(0)

const actor = computed(() => props.selected ? (props.selected as any).actor : null)

function reset() {
  count.value = 1
  die.value = '20'
  plus.value = 0
  accuracy.value = 0
  isCrit.value = false
  Overkill.value = false
}

function rollResultFormat(roll: any[], selected: any) {
  if (roll.length > 1) {
    let str = ''
    roll.forEach((r, idx) => {
      if (r === selected) {
        str += `<b class='text-accent'>${r}</b>`
      } else {
        str += `<span class='text-disabled'>${r}</span>`
      }
      if (idx < roll.length - 1) str += ', '
    })
    return str
  }
  return `<b class='text-accent'>${roll[0]}</b>`
}

function setCheck(type: string) {
  count.value = 1
  die.value = '20'
  plus.value = actor.value.CombatController.getCheckBonus(type)
  accuracy.value = 0
  isCrit.value = false
  Overkill.value = false
  rollType.value = `${type.toUpperCase()} CHECK`
  rollDice()
}

function rollDice() {
  const diceValue = count.value && die.value ? `${count.value}d${die.value}+${plus.value || 0}` : 0
  const isAcc = accuracy.value > -1

  rollResult.value = DiceRoller.rollAny(
    diceValue,
    bonus.value,
    accuracy.value,
    isCrit.value,
    Overkill.value,
    0
  )

  lastRollString.value = `${rollType.value ? ` [${rollType.value}] ` : ''}${rollResult.value.toString()}`
  lastRoll.value = rollResult.value.total

  let str = actor.value ? `<b>${actor.value.CombatController.CombatName}</b> rolled: ` : 'GM Rolled: '
  str += `(${diceValue}) `
  if (accuracy.value) {
    str += ` [${isAcc ? '+' : '-'}${accuracy.value} ${isAcc ? 'ACC' : 'DIFF'}]`
  }
  if (isCrit.value) str += ' [CRIT]'
  if (Overkill.value) str += ' [OVERKILL]'
  str += ` ${lastRollString.value}`
  ;(props.encounterInstance as any).RollHistory.unshift(str)
  rollType.value = ''
}
</script>
