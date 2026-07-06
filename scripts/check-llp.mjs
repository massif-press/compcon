import assert from 'node:assert/strict'
import semver from 'semver'
import { validatePatch, patchKey } from '../src/i18n/validatePatch.mjs'

assert.equal(patchKey('ows-data', 'fr'), 'ows-data::fr')

const good = validatePatch({
  lang: ' fr ',
  target: ' ows-data ',
  data: { 'mf_gilgamesh.name': 'Gilgamesh', 'mf_gilgamesh.description': 'desc' },
})
assert.ok(good.ok)
assert.equal(good.patch.lang, 'fr')
assert.equal(good.patch.target, 'ows-data')
assert.equal(good.patch.id, 'ows-data::fr')

assert.equal(validatePatch({ lang: 'de', data: {} }).patch.id, 'unknown::de')

// rejections
assert.equal(validatePatch(null).ok, false)
assert.equal(validatePatch([]).ok, false)
assert.equal(validatePatch({ data: {} }).ok, false) // no lang
assert.equal(validatePatch({ lang: 'fr' }).ok, false) // no data
assert.equal(validatePatch({ lang: 'fr', data: [] }).ok, false) // data not an object
assert.equal(validatePatch({ lang: 'fr', data: { 'x.name': 5 } }).ok, false) // non-string value

const catalog = { 'mf_gilgamesh.name': 'Gilgamesh (EN)' }
Object.assign(catalog, good.patch.data)
const localize = (id, field, fallback) => catalog[`${id}.${field}`] ?? fallback
assert.equal(localize('mf_gilgamesh', 'name', 'x'), 'Gilgamesh')
assert.equal(localize('mf_gilgamesh', 'missing', 'fallback'), 'fallback')

const stale = (packVersion, range) =>
  !!range && !!packVersion && !semver.satisfies(semver.coerce(packVersion), range)
assert.equal(stale('2.0.0', '>=2.0.1'), true)
assert.equal(stale('2.0.1', '>=2.0.1'), false)
assert.equal(stale('3.0.0', '>=2.0.1'), false)
assert.equal(stale('2.0.0', ''), false)
console.log('check-llp: OK')
