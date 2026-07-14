<template>
  <cc-dialog v-model="open"
    :title="$t('active.burnCheck.title')"
    :close-on-click="false"
    @update:model-value="onToggle">
    <p class="body-text text-text mb-3 pa-2"
      v-html-safe="$t('active.burnCheck.prompt', { n: burn })" />

    <div class="pa-2 border-s-xl border-accent">
      <div class="body-text mb-1">{{ $t('active.structureCheck.saveCheck', { check: 'ENGINEERING' }) }}</div>
      <accuracy-difficulty-row v-model="acc"
        v-model:bonus="bonus" />
      <div class="d-flex align-center flex-wrap mt-1"
        style="gap: 8px">
        <cc-button size="x-small"
          prepend-icon="mdi-dice-d20"
          @click="roll">{{ $t('active.structureCheck.rollCheck', { check: 'ENGINEERING' }) }}</cc-button>
        <span v-if="detail"
          class="body-text"
          v-html-safe="detail" />
      </div>
      <div class="mt-2">
        <v-btn-toggle v-model="outcome"
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
      <div v-if="outcome"
        class="text-cc-overline mt-2"
        :class="outcome === 'success' ? 'text-success' : 'text-error'">
        {{ outcome === 'success'
          ? $t('active.burnCheck.onSuccess')
          : $t('active.burnCheck.onFail', { n: burn }) }}
      </div>
    </div>

    <v-divider />
    <v-card-actions>
      <cc-button variant="text"
        @click="ignore">{{ $t('active.burnCheck.ignore') }}</cc-button>
      <v-spacer />
      <cc-button color="primary"
        prepend-icon="mdi-check"
        :disabled="!outcome"
        @click="apply">{{ $t('active.burnCheck.resolveEndTurn') }}</cc-button>
    </v-card-actions>
  </cc-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import AccuracyDifficultyRow from '@/ui/components/chips/_activeeffect/_shared/AccuracyDifficultyRow.vue'
import { StatKey } from '@/classes/components/combat/stats/Stats'
import { DamageType } from '@/classes/enums'
import type { CombatController } from '@/classes/components/combat/CombatController'

const props = defineProps<{ modelValue: boolean; cc: CombatController }>()
const emit = defineEmits<{ 'update:modelValue': [boolean]; resolved: [] }>()

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const burn = computed(() => props.cc.StatController.getCurrent(StatKey.BURN))

const bonus = ref(0)
const acc = ref(0)
const detail = ref('')
const outcome = ref<'success' | 'fail' | undefined>(undefined)

function seed() {
  bonus.value = props.cc.getCheckBonus('Eng')
  acc.value = 0
  detail.value = ''
  outcome.value = undefined
}

function roll() {
  const r = DiceRoller.rollSkillCheck(Number(bonus.value) || 0, acc.value || 0)
  detail.value = r.toString()
  outcome.value = r.total >= 10 ? 'success' : 'fail'
}

function onToggle(v: boolean) {
  if (v) seed()
}

function ignore() {
  open.value = false
  emit('resolved')
}

function apply() {
  if (!outcome.value) return
  if (outcome.value === 'success') {
    props.cc.StatController.setCurrentStat(StatKey.BURN, 0)
    props.cc.log('Burn check passed: cleared all burn')
  } else {
    props.cc.TakeDamage(DamageType.AppliedBurn, burn.value)
    props.cc.log(`Burn check failed: took ${burn.value} burn damage`)
  }
  open.value = false
  emit('resolved')
}
</script>
