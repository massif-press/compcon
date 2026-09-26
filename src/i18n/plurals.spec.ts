import { describe, it, expect, afterEach } from 'vitest'
import { i18n } from './index'
import { joinPlurals, splitPlurals } from '../../scripts/locale-plurals.mjs'

const key = 'count'
const en = { [key]: '{n} item | {n} items' }

afterEach(() => {
  i18n.global.locale.value = 'en'
})

describe('plural round trip', () => {
  it('picks ru forms by CLDR category', () => {
    const weblate = splitPlurals({ count: '{n} one | {n} other' }, en, 'ru')
    weblate.count_few = '{n} few'
    weblate.count_many = '{n} many'
    i18n.global.setLocaleMessage('ru', joinPlurals(weblate, 'ru') as never)
    i18n.global.locale.value = 'ru'
    const t = (n: number) => i18n.global.t(key, { n }, n)

    expect([1, 2, 5, 21, 22, 1.5].map(t)).toEqual([
      '1 one',
      '2 few',
      '5 many',
      '21 one',
      '22 few',
      '1.5 other',
    ])
  })

  it('fills missing ar forms from other', () => {
    const weblate = splitPlurals({ count: '{n} one | {n} other' }, en, 'ar')
    weblate.count_two = '{n} two'
    i18n.global.setLocaleMessage('ar', joinPlurals(weblate, 'ar') as never)
    i18n.global.locale.value = 'ar'
    const t = (n: number) => i18n.global.t(key, { n }, n)

    expect([0, 1, 2, 3, 11, 100].map(t)).toEqual([
      '0 other',
      '1 one',
      '2 two',
      '3 other',
      '11 other',
      '100 other',
    ])
  })
})
