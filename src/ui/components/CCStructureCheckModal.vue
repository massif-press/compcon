<template>
  <cc-dialog v-model="open"
    :title="table?.Title"
    :close-on-click="false"
    @update:model-value="onToggle">
    <p v-if="table?.Description"
      v-html-safe="table.Description"
      class="body-text text-text mb-3 pa-2" />

    <div v-if="!result">
      <div class="text-cc-overline mb-2">{{ $t('active.structureCheck.rollPrompt', {
        n: marked,
        die: table?.Die
      }) }}</div>
      <cc-button color="primary"
        block
        prepend-icon="mdi-dice-d6"
        @click="roll">{{ $t('active.structureCheck.rollLabel', { n: marked, die: table?.Die })
        }}</cc-button>
    </div>

    <div v-else>
      <div class="d-flex flex-wrap align-center my-1"
        style="gap: 6px">
        <span class="text-cc-overline mr-1">{{ $t('active.structureCheck.rolled') }}:</span>
        <v-chip v-for="(d, i) in result.dice"
          :key="i"
          :color="d === result.lowest ? 'accent' : undefined"
          :variant="d === result.lowest ? 'flat' : 'tonal'"
          size="small">
          {{ d }}
        </v-chip>
        <v-chip v-if="result.multipleOnes"
          color="error"
          size="small"
          class="ml-2">{{ $t('ui.rollTable.multipleOnes') }}</v-chip>
        <v-spacer />
        <cc-button size="x-small"
          variant="text"
          prepend-icon="mdi-dice-multiple"
          @click="roll">{{ $t('active.structureCheck.reroll') }}</cc-button>
      </div>

      <v-divider class="my-2" />
      <div class="heading h2 text-accent">{{ result.row?.title }}</div>
      <p v-html-safe="result.row?.result"
        class="body-text text-text mt-1" />

      <div v-if="resolution.steps.length">
        <v-divider class="my-2" />
        <div class="text-cc-overline mb-1">{{ $t('active.structureCheck.resolution') }}</div>

        <div v-for="step in resolution.steps"
          :key="step.path"
          class="my-1">
          <div v-if="step.kind === 'apply'"
            class="d-flex align-center">
            <v-icon size="small"
              color="accent"
              class="mr-2">mdi-chevron-right</v-icon>
            <span class="body-text text-uppercase">{{ step.label }}</span>
          </div>

          <div v-else-if="step.kind === 'branch'"
            class="heading h3 text-accent">{{ step.label }}</div>

          <div v-else-if="step.kind === 'subroll'"
            class="d-flex align-center">
            <v-chip size="small"
              color="primary"
              class="mr-2">{{ step.rolled }}</v-chip>
            <span class="body-text">{{ step.label }}</span>
          </div>

          <div v-else-if="step.kind === 'damage'"
            class="d-flex align-center">
            <v-chip size="small"
              color="damage--kinetic"
              class="mr-2">{{ step.rolled }}</v-chip>
            <span class="body-text">{{ step.label }} ({{ $t('active.structureCheck.applyManual')
            }})</span>
          </div>

          <cc-alert v-else-if="step.kind === 'note'"
            color="background"
            class="border-s-xl border-accent"
            icon="mdi-information-outline">
            <div class="text-caption">{{ step.label }}</div>
          </cc-alert>

          <div v-else-if="step.kind === 'save'"
            class="pa-2 border-s-xl border-accent">
            <div class="body-text mb-1">{{ $t('active.structureCheck.saveCheck', {
              check: step.label
            }) }}</div>
            <accuracy-difficulty-row v-model="saveAcc[step.path]"
              v-model:bonus="saveBonus[step.path]" />
            <div class="d-flex align-center flex-wrap mt-1"
              style="gap: 8px">
              <cc-button size="x-small"
                prepend-icon="mdi-dice-d20"
                @click="rollSave(step.path)">{{
                  $t('active.structureCheck.rollCheck', { check: step.label }) }}</cc-button>
              <span v-if="saveRolls[step.path]"
                class="body-text"
                v-html-safe="saveRolls[step.path].detail" />
            </div>
            <div class="mt-2">
              <v-btn-toggle v-model="saveChoices[step.path]"
                density="compact"
                variant="outlined"
                divided>
                <v-btn value="success"
                  size="small"
                  color="success">{{ $t('active.structureCheck.success') }}</v-btn>
                <v-btn value="fail"
                  size="small"
                  color="error">{{ $t('active.structureCheck.fail') }}</v-btn>
              </v-btn-toggle>
            </div>
          </div>

          <div v-else-if="step.kind === 'equip'">
            <div class="body-text mb-1">{{ step.label }}:</div>
            <v-select v-model="equipChoices[step.path]"
              :items="step.options"
              item-title="label"
              item-value="id"
              :placeholder="$t('active.structureCheck.chooseOne')"
              density="compact"
              variant="outlined"
              hide-details />
          </div>
        </div>
      </div>
    </div>

    <div v-if="result">
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <cc-button color="primary"
          prepend-icon="mdi-check"
          :disabled="!resolution.complete"
          @click="apply">{{ hasActions ? $t('active.structureCheck.applyResolve') :
            $t('active.structureCheck.markResolved') }}</cc-button>
      </v-card-actions>
    </div>
  </cc-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import AccuracyDifficultyRow from '@/ui/components/chips/_activeeffect/_shared/AccuracyDifficultyRow.vue'
import type { CombatController } from '@/classes/components/combat/CombatController'
import type { ICheckRollResult, IPendingCheck, Effect } from '@/classes/components/combat/StructureCheck'
import { getCheckTable, rollCheck, markedPoints, effectsFor, prerollEffects, resolveEffects, applyCheckEffects } from '@/classes/components/combat/StructureCheck'

const props = defineProps<{
  modelValue: boolean
  cc: CombatController
  pending: IPendingCheck
}>()

const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const table = computed(() => getCheckTable(props.pending.kind, props.cc))
const marked = computed(() => markedPoints(props.cc, props.pending.kind))

const result = ref<ICheckRollResult | null>(null)
const effects = ref<Effect[]>([])
const rolls = ref<Record<string, number>>({})
const saveChoices = reactive<Record<string, 'success' | 'fail'>>({})
const equipChoices = reactive<Record<string, string>>({})
const saveRolls = reactive<Record<string, { detail: string }>>({})
const saveBonus = reactive<Record<string, number>>({})
const saveAcc = reactive<Record<string, number>>({})

const resolution = computed(() =>
  resolveEffects(
    effects.value,
    {
      currentStructure: props.cc.CurrentStructure,
      currentStress: props.cc.CurrentStress,
      rolls: rolls.value,
      saveChoices,
      equipChoices,
    },
    props.cc
  )
)

const hasActions = computed(() => resolution.value.actions.length > 0)

const CHECK_STAT: Record<string, 'Hull' | 'Agi' | 'Sys' | 'Eng'> = {
  hull: 'Hull',
  agi: 'Agi',
  sys: 'Sys',
  eng: 'Eng',
}

function clearChoices() {
  ;[saveChoices, equipChoices, saveRolls, saveBonus, saveAcc].forEach(rec =>
    Object.keys(rec).forEach(k => delete rec[k])
  )
}

watch(resolution, r => {
  r.steps.forEach(s => {
    if (s.kind === 'save' && saveBonus[s.path] === undefined) {
      saveBonus[s.path] = props.cc.getCheckBonus(CHECK_STAT[s.check || ''] || 'Hull')
      saveAcc[s.path] = 0
    }
  })
}, { immediate: true })

function roll() {
  const t = table.value
  if (!t) return
  clearChoices()
  const r = rollCheck(t, marked.value)
  result.value = r
  effects.value = r.row ? effectsFor(t.ID, r.row) : []
  rolls.value = prerollEffects(effects.value)
}

function rollSave(path: string) {
  const r = DiceRoller.rollSkillCheck(Number(saveBonus[path]) || 0, saveAcc[path] || 0)
  saveRolls[path] = { detail: r.toString() }
  saveChoices[path] = r.total >= 10 ? 'success' : 'fail'
}

function reset() {
  result.value = null
  effects.value = []
  rolls.value = {}
  clearChoices()
}

function onToggle(v: boolean) {
  if (!v) reset()
}

function apply() {
  if (!resolution.value.complete) return
  applyCheckEffects(props.cc, resolution.value.actions)
  props.cc.RemovePendingCheck(props.pending.id)
  open.value = false
}
</script>
