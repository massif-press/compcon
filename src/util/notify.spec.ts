import { describe, it, expect, beforeEach, vi } from 'vitest'

const { notifySpy } = vi.hoisted(() => ({ notifySpy: vi.fn() }))

vi.mock('@kyvg/vue3-notification', () => ({ notify: notifySpy }))

import { notify, notifySuccess, notifyError, flushNotifyQueue } from './notify'

beforeEach(() => {
  notifySpy.mockClear()
})

describe('notify', () => {
  it('queues messages until the notification host is ready', () => {
    notify({ text: 'early' })
    expect(notifySpy).not.toHaveBeenCalled()

    flushNotifyQueue()

    expect(notifySpy).toHaveBeenCalledTimes(1)
    expect(notifySpy.mock.calls[0][0].text).toBe('early')
  })

  it('passes later messages straight through', () => {
    notify({ text: 'later' })
    expect(notifySpy).toHaveBeenCalledTimes(1)
  })

  it('drains the queue only once', () => {
    flushNotifyQueue()
    expect(notifySpy).not.toHaveBeenCalled()
  })

  it.each([
    ['success', 'mdi-check-circle', 'success'],
    ['error', 'mdi-alert-circle', 'error'],
    ['warning', 'mdi-alert', 'warning'],
  ])('styles a %s notification', (type, icon, color) => {
    notify({ text: 'msg', type: type as 'success' })

    expect(notifySpy.mock.calls[0][0].data).toMatchObject({ icon, color })
  })

  it('keeps the caller icon and colour for a plain notification', () => {
    notify({ text: 'msg', icon: 'mdi-custom', color: 'accent' })

    expect(notifySpy.mock.calls[0][0].data).toMatchObject({ icon: 'mdi-custom', color: 'accent' })
  })

  it('marks an achievement notification', () => {
    notify({ text: 'unlocked', achievement: true })

    expect(notifySpy.mock.calls[0][0].data.achievement).toBe(true)
  })
})

describe('notifySuccess/notifyError', () => {
  it('titles and styles the shortcuts', () => {
    notifySuccess('saved')
    expect(notifySpy.mock.calls[0][0]).toMatchObject({ text: 'saved' })
    expect(notifySpy.mock.calls[0][0].title).toBeTruthy()

    notifySpy.mockClear()

    notifyError('failed')
    expect(notifySpy.mock.calls[0][0].data.color).toBe('error')
  })
})
