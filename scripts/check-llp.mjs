// Self-check for .llp language-patch validation + the catalog lookup contract.
// Run: node scripts/check-llp.mjs
import assert from 'node:assert/strict'
import semver from 'semver'
import { validatePatch, patchKey } from '../src/i18n/validatePatch.mjs'

// key derivation
assert.equal(patchKey('ows-data', 'fr'), 'ows-data::fr')

// valid patch: normalizes + stamps id, keeps flat data
const good = validatePatch({
  lang: ' fr ',
  target: ' ows-data ',
  data: { 'mf_gilgamesh.name': 'Gilgamesh', 'mf_gilgamesh.description': 'desc' },
})
assert.ok(good.ok)
assert.equal(good.patch.lang, 'fr')
assert.equal(good.patch.target, 'ows-data')
assert.equal(good.patch.id, 'ows-data::fr')

// missing target defaults to 'unknown'
assert.equal(validatePatch({ lang: 'de', data: {} }).patch.id, 'unknown::de')

// rejections
assert.equal(validatePatch(null).ok, false)
assert.equal(validatePatch([]).ok, false)
assert.equal(validatePatch({ data: {} }).ok, false) // no lang
assert.equal(validatePatch({ lang: 'fr' }).ok, false) // no data
assert.equal(validatePatch({ lang: 'fr', data: [] }).ok, false) // data not an object
assert.equal(validatePatch({ lang: 'fr', data: { 'x.name': 5 } }).ok, false) // non-string value

// catalog contract: patch data merges into the flat `${id}.${field}` map localize() reads.
const catalog = { 'mf_gilgamesh.name': 'Gilgamesh (EN)' }
Object.assign(catalog, good.patch.data) // patch wins on collision
const localize = (id, field, fallback) => catalog[`${id}.${field}`] ?? fallback
assert.equal(localize('mf_gilgamesh', 'name', 'x'), 'Gilgamesh')
assert.equal(localize('mf_gilgamesh', 'missing', 'fallback'), 'fallback')

// drift contract (mirrors patchIsStale): stale when the installed pack version does not satisfy target_version
const stale = (packVersion, range) =>
  !!range && !!packVersion && !semver.satisfies(semver.coerce(packVersion), range)
assert.equal(stale('2.0.0', '>=2.0.1'), true) // pack behind the floor -> stale
assert.equal(stale('2.0.1', '>=2.0.1'), false) // pack meets the floor -> fresh
assert.equal(stale('3.0.0', '>=2.0.1'), false) // pack ahead of a >= floor -> fresh
assert.equal(stale('2.0.0', ''), false) // no target_version -> never stale

console.log('check-llp: OK')
