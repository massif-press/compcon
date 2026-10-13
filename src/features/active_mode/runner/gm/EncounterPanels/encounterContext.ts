import {
  computed,
  inject,
  provide,
  ref,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { ItemType } from '@/classes/enums'
import type { CheckType } from '@/classes/components/combat/stats/Stats'

export interface EncounterRunnerContext {
  owner: Ref<CombatantData>
  encounterInstance: Ref<EncounterInstance>
  wizard?: boolean
}

export const EncounterContextKey: InjectionKey<EncounterRunnerContext> =
  Symbol('EncounterRunnerContext')

export const RollCheckKey: InjectionKey<(type: CheckType) => void> = Symbol('RunnerRollCheck')

export function provideRollCheck(diceDialog: Ref<boolean>): Ref<CheckType | null> {
  const check = ref<CheckType | null>(null)
  provide(RollCheckKey, type => {
    check.value = type
    diceDialog.value = true
  })
  watch(diceDialog, open => {
    if (!open) check.value = null
  })
  return check
}

export function useEncounterContext(): EncounterRunnerContext & {
  ownerController: ComputedRef<any>
  activeController: ComputedRef<any>
  simple: ComputedRef<boolean>
  pcSheet: ComputedRef<boolean>
  wizard: boolean
} {
  const ctx = inject(EncounterContextKey)
  if (!ctx) {
    throw new Error('useEncounterContext() called outside an encounter panel.')
  }
  const ownerController = computed(() => (ctx.owner.value as any).actor.CombatController)
  return {
    ...ctx,
    ownerController,
    activeController: computed(() => ownerController.value.ActiveActor.CombatController),
    simple: computed(() => ctx.encounterInstance.value?.PlayMode === 'simple'),
    pcSheet: computed(() => ctx.encounterInstance.value?.ItemType === ItemType.PilotSheet),
    wizard: !!ctx.wizard,
  }
}
