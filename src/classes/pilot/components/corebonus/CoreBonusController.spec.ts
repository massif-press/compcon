import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot } from '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'
import { CoreBonusController } from './CoreBonusController'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

const cbs = () => pilot.CoreBonusController
const bonus = (i = 0) => CompendiumStore().CoreBonuses[i]

beforeEach(() => {
  pilot = makePilot({ level: 6 })
})

describe('CoreBonusController points', () => {
  it('grants one point per three pilot levels', () => {
    expect(cbs().MaxCBPoints).toBe(2)
    expect(makePilot({ level: 2 }).CoreBonusController.MaxCBPoints).toBe(0)
  })

  it('counts taken bonuses', () => {
    cbs().AddCoreBonus(bonus(0))

    expect(cbs().CurrentCBPoints).toBe(1)
    expect(cbs().IsMissingCBs).toBe(true)
  })

  it('reports a full sheet', () => {
    cbs().AddCoreBonus(bonus(0))
    cbs().AddCoreBonus(bonus(1))

    expect(cbs().HasCBs).toBe(true)
    expect(cbs().IsMissingCBs).toBe(false)
  })
})

describe('CoreBonusController.RemoveCoreBonus', () => {
  it('removes by id', () => {
    cbs().AddCoreBonus(bonus(0))
    cbs().AddCoreBonus(bonus(1))

    cbs().RemoveCoreBonus(bonus(0))

    expect(cbs().CoreBonuses.map(b => b.ID)).toEqual([bonus(1).ID])
  })

  it('survives removing something the pilot does not have', () => {
    expect(() => cbs().RemoveCoreBonus(bonus(0))).not.toThrow()
  })

  it('clears everything', () => {
    cbs().AddCoreBonus(bonus(0))
    cbs().AddCoreBonus(bonus(1))

    cbs().ClearCoreBonuses()

    expect(cbs().CoreBonuses).toEqual([])
  })
})

describe('CoreBonusController.Serialize/Deserialize', () => {
  it('round-trips the taken bonuses', () => {
    cbs().AddCoreBonus(bonus(0))
    cbs().AddCoreBonus(bonus(1))

    const target: any = {}
    CoreBonusController.Serialize(pilot, target)

    const other = makePilot()
    CoreBonusController.Deserialize(other, target)

    expect(other.CoreBonusController.CoreBonuses.map(b => b.ID)).toEqual([bonus(0).ID, bonus(1).ID])
  })

  it('drops null entries rather than failing the load', () => {
    const other = makePilot()
    CoreBonusController.Deserialize(other, { core_bonuses: [null, bonus(0).ItemData] } as never)

    expect(other.CoreBonusController.CoreBonuses).toHaveLength(1)
  })

  it('flags a bonus whose content pack is gone', () => {
    const other = makePilot()
    CoreBonusController.Deserialize(other, {
      core_bonuses: [{ ...bonus(0).ItemData, id: 'cb_uninstalled' }],
    } as never)

    expect(other.CoreBonusController.MissingCoreBonuses).toHaveLength(1)
  })
})
