import { describe, it, expect, vi, afterEach } from 'vitest'
import '@/__tests__/factories'
import { Clock } from './elements/Clock'
import { RollableTable } from './elements/RollableTable'
import { Character } from './Character'
import { Faction } from './Faction'
import { Location } from './Location'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Clock', () => {
  it('defaults to a six-segment empty clock', () => {
    const c = new Clock()

    expect(c.Segments).toBe(6)
    expect(c.Progress).toBe(0)
    expect(c.ID).toBeTruthy()
  })

  it('fills up to its segment count and no further', () => {
    const c = new Clock({ segments: 2 } as never)

    c.Increment()
    c.Increment()
    c.Increment()

    expect(c.Progress).toBe(2)
  })

  it('empties down to zero and no further', () => {
    const c = new Clock({ segments: 4, progress: 1 } as never)

    c.Decrement()
    c.Decrement()

    expect(c.Progress).toBe(0)
  })

  it('refuses a negative or non-numeric segment count', () => {
    const c = new Clock()

    c.Segments = -3
    expect(c.Segments).toBe(0)

    c.Segments = NaN
    expect(c.Segments).toBe(0)
  })

  it('round-trips', () => {
    const c = new Clock({ segments: 8, progress: 3, title: 'Countdown' } as never)
    const back = Clock.Deserialize(Clock.Serialize(c))

    expect(back.ID).toBe(c.ID)
    expect(back.Segments).toBe(8)
    expect(back.Progress).toBe(3)
    expect(back.Title).toBe('Countdown')
  })
})

describe('RollableTable', () => {
  it('spans min to die times multiplier', () => {
    const t = new RollableTable({ die: 6, mult: 2 } as never)

    expect(t.Min).toBe(2)
    expect(t.Max).toBe(12)
  })

  it('seeds a result range when given none', () => {
    expect(new RollableTable().Results.length).toBeGreaterThan(0)
  })

  it('returns the entry the roll lands in', () => {
    const t = new RollableTable({
      die: 6,
      mult: 1,
      results: [
        { min: 1, max: 3, result: 'low' },
        { min: 4, max: 6, result: 'high' },
      ],
    } as never)

    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(t.Roll()).toEqual({ roll: 1, result: 'low' })

    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    expect(t.Roll()).toEqual({ roll: 6, result: 'high' })
  })

  it('is empty when the roll falls outside every range', () => {
    const t = new RollableTable({
      die: 6,
      mult: 1,
      results: [{ min: 5, max: 6, result: 'high' }],
    } as never)

    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(t.Roll()).toBe('')
  })

  it('round-trips', () => {
    const t = new RollableTable({ die: 20, mult: 1, title: 'Complications' } as never)
    const back = RollableTable.Deserialize(RollableTable.Serialize(t))

    expect(back.Title).toBe('Complications')
    expect(back.Die).toBe(20)
    expect(back.Results).toEqual(t.Results)
  })
})

describe('narrative collection items', () => {
  it.each([
    ['Character', Character],
    ['Faction', Faction],
    ['Location', Location],
  ])('%s round-trips its identity', (_name, Cls: any) => {
    const item = new Cls()
    item.Name = 'Subject Alpha'

    const back = Cls.Deserialize(JSON.parse(JSON.stringify(Cls.Serialize(item))))

    expect(back.ID).toBe(item.ID)
    expect(back.Name).toBe('Subject Alpha')
    expect(back.ItemType).toBe(item.ItemType)
  })

  it('clones a character under a new id', () => {
    const c = new Character()
    c.Name = 'Subject Alpha'

    const clone = c.Clone() as Character

    expect(clone.ID).not.toBe(c.ID)
    expect(clone.Name).toContain('Subject Alpha')
  })

  it('carries alias, title, and pronouns through a round-trip', () => {
    const c = new Character()
    c.Alias = 'Ghost'
    c.Title = 'Captain'
    c.Pronouns = 'they/them'

    const back = Character.Deserialize(Character.Serialize(c))

    expect(back.Alias).toBe('Ghost')
    expect(back.Title).toBe('Captain')
    expect(back.Pronouns).toBe('they/them')
  })
})

describe('NarrativeController', () => {
  it('holds clocks and tables, and removes them again', () => {
    const c = new Character()
    const narrative = c.NarrativeController

    narrative.AddClock()
    expect(narrative.Clocks).toHaveLength(1)

    narrative.DeleteClock(narrative.Clocks[0])
    expect(narrative.Clocks).toEqual([])
  })

  it('adds and removes text items', () => {
    const c = new Character()
    const narrative = c.NarrativeController

    narrative.AddTextItem({ header: 'Notes', body: 'text' } as never)
    expect(narrative.TextItems).toHaveLength(1)

    narrative.DeleteTextItem(narrative.TextItems[0])
    expect(narrative.TextItems).toEqual([])
  })

  it('joins plain labels into a summary string', () => {
    const c = new Character()
    c.NarrativeController.Labels = ['Ally', 'Wanted'] as never

    expect(c.NarrativeController.LabelString).toBe('Ally, Wanted')
  })
})
