import { computed, inject, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'

export interface EncounterRunnerContext {
  owner: Ref<CombatantData>
  encounterInstance: Ref<EncounterInstance>
}

export const EncounterContextKey: InjectionKey<EncounterRunnerContext> =
  Symbol('EncounterRunnerContext')

export function useEncounterContext(): EncounterRunnerContext & {
  ownerController: ComputedRef<any>
  activeController: ComputedRef<any>
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
  }
}
