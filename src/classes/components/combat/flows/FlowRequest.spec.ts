import { describe, it, expect } from 'vitest'
import { requestFor } from '../StructureCheck'
import type { ResolveStep } from '../StructureCheck'

const step = (over: Partial<ResolveStep>): ResolveStep =>
  ({ path: '0', kind: 'note', label: '', ...over }) as ResolveStep

describe('the one request vocabulary', () => {
  it('asks a structure-check save as a check request', () => {
    expect(requestFor(step({ kind: 'save', label: 'HULL', check: 'hull', mode: 'save' }))).toEqual({
      kind: 'check',
      label: 'HULL',
    })
  })

  it('asks a structure check equipment choice as a select request, dropping the live items', () => {
    const request = requestFor(
      step({
        kind: 'equip',
        label: 'Mount to destroy',
        target: 'mount',
        options: [{ id: '0', label: 'Main Mount: Assault Rifle', items: [{}] }],
      })
    )

    expect(request).toEqual({
      kind: 'select',
      label: 'Mount to destroy',
      options: [{ id: '0', label: 'Main Mount: Assault Rifle' }],
    })
  })

  it('asks a subroll as a roll request', () => {
    expect(
      requestFor(step({ kind: 'subroll', label: 'One system is destroyed', rolled: 5 }))
    ).toEqual({ kind: 'roll', label: 'One system is destroyed' })
  })

  it('asks nothing for steps that only narrate', () => {
    expect(requestFor(step({ kind: 'apply', label: 'impaired' }))).toBeUndefined()
    expect(requestFor(step({ kind: 'branch', label: '2 Structure' }))).toBeUndefined()
    expect(requestFor(step({ kind: 'damage', label: '1d6 kinetic' }))).toBeUndefined()
    expect(requestFor(step({ kind: 'note', label: '' }))).toBeUndefined()
  })
})
