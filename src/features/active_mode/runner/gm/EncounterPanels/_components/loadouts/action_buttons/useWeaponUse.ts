import { computed, ref, shallowRef } from 'vue'
import type { CombatantData } from '@/classes/encounter/Encounter'
import {
  WeaponUseFlow,
  weaponUseState,
  usableWeapons,
  unavailableWeapons,
  activeEvents,
} from '@/classes/components/combat/flows/WeaponUseFlow'
import type { IWeaponUseState } from '@/classes/components/combat/flows/WeaponUseFlow'
import { isSuperheavy } from '@/classes/components/combat/AttackRules'
import type { WeaponUseMode } from '@/classes/components/combat/AttackRules'
import type { IFlowResult } from '@/classes/components/combat/flows/Flow'
import { useEncounterContext } from '../../../encounterContext'

export function useWeaponUse(opts: {
  mode: WeaponUseMode
  actionId: () => string
  makeEvent: (self: CombatantData, weapon: any, label: string) => any
  presetWeapon?: () => any
  carry?: boolean
}) {
  const { owner, encounterInstance, activeController: controller } = useEncounterContext()

  function newState(): IWeaponUseState {
    const rootId = (owner.value as any).actor.CombatController.RootActor.ID
    const self = (encounterInstance.value as any).Combatants.find(
      (c: CombatantData) => c.actor.CombatController.RootActor.ID === rootId
    )
    if (!self) throw new Error('Owner combatant not found in encounterInstance')
    return weaponUseState({
      cc: controller.value,
      actionId: opts.actionId(),
      mode: opts.mode,
      presetWeapon: opts.presetWeapon?.(),
      makeEvent: (weapon: any, label: string) => opts.makeEvent(self, weapon, label),
    })
  }

  const useState = ref<IWeaponUseState>(newState())
  const result = shallowRef<IFlowResult<IWeaponUseState> | null>(null)

  function run() {
    result.value =
      result.value?.outcome === 'awaiting'
        ? WeaponUseFlow.Resume(result.value as IFlowResult<IWeaponUseState>)
        : WeaponUseFlow.Begin(useState.value)
  }

  function reset(clearAction = false) {
    if (clearAction) controller.value.ClearActionUsed(opts.actionId())
    const carried =
      (opts.carry ? useState.value.selected[0] : undefined) ?? opts.presetWeapon?.() ?? null
    useState.value = newState()
    if (carried) useState.value.selected = [carried]
    result.value = null
    run()
  }

  function apply() {
    run()
    reset()
  }

  function setSelected(index: number, weapon: any) {
    if (!weapon) return
    const chosen = useState.value.selected.filter(Boolean)
    chosen[index] = weapon
    useState.value.selected = chosen
    result.value = null
    run()
  }

  const selected = computed<any>({
    get: () => useState.value.selected[0] ?? null,
    set: weapon => {
      useState.value.selected = weapon ? [weapon] : []
    },
  })

  const selectedWeapons = computed<any[]>(() => {
    const chosen = useState.value.selected.filter(Boolean)
    if (chosen.length >= useState.value.capacity) return chosen
    if (chosen.some(isSuperheavy)) return chosen
    if (chosen.length && !usableWeapons(useState.value, chosen.length).length) return chosen
    return [...chosen, undefined]
  })

  const weapons = computed<any[]>(() => usableWeapons(useState.value))
  const weaponsForSlot = (slot: number) => usableWeapons(useState.value, slot)
  const hiddenWeapons = computed(() => unavailableWeapons(useState.value).length)
  const eventArray = computed(() => activeEvents(useState.value))
  const allEventsStaged = computed(
    () => !!eventArray.value.length && eventArray.value.every((e: any) => e.BaseEvent.Staged)
  )

  reset()

  return {
    controller,
    useState,
    result,
    run,
    reset,
    apply,
    setSelected,
    selected,
    selectedWeapons,
    weapons,
    weaponsForSlot,
    hiddenWeapons,
    eventArray,
    allEventsStaged,
  }
}
