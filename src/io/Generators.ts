import _ from 'lodash'
import { store } from '@/store'
// import {CompendiumStore} from '@/features/compendium/store/index'

function pullRandom(data: string, count: number): string[] {
  const arr = data.split('\n')
  return _.sampleSize(arr, count).map(x => x.replace(/[\n\r]/g, ''))
}

function callsign(): string {
  const callsigns = require('raw-loader!@/assets/generators/callsigns.txt').default.concat(
    store.getters.Tables?.callsigns || []
  )
  return pullRandom(callsigns, 1)[0]
}

function mechname(): string {
  const mechnames = require('raw-loader!@/assets/generators/mechnames.txt').default.concat(
    store.getters.Tables?.mech_names || []
  )
  return pullRandom(mechnames, 1)[0]
}

function teamName(): string {
  const teamnames = require('raw-loader!@/assets/generators/teamnames.txt').default.concat(
    store.getters.Tables?.team_names || []
  )
  return pullRandom(teamnames, 1)[0]
}

function tracert(jumps: number): string[] {
  return pullRandom(require('raw-loader!@/assets/generators/traces.txt').default, jumps || 1)
}

async function name(): Promise<string> {
  const firstNamesList = require('raw-loader!@/assets/generators/firstnames.txt').default
  const lastNamesList = require('raw-loader!@/assets/generators/lastnames.txt').default

  const prob: any = require('@/assets/generators/name_mods.json')
  const firstnames = pullRandom(firstNamesList, 2)
  const lastnames = pullRandom(lastNamesList, 2)
  let name =
    Math.random() <= prob.middleNameChance
      ? `${firstnames[0]} ${firstnames[1]}`
      : `${firstnames[0]}`
  name +=
    Math.random() <= prob.secondSurnameChance
      ? ` ${lastnames[0]}-${lastnames[1]}`
      : ` ${lastnames[0]}`

  if (Math.random() <= prob.suffixChance) name += ` ${_.sample(prob.suffixes)}`

  return name
}

function mission(): string {
  const m = require('@/assets/generators/mission.json')
  return `${_.sample(m.a)} ${_.sample(m.b)}`
}

function encryption(): string {
  return `${Math.random()
    .toString()
    .substring(2, 4)}::${mission()}`.toUpperCase()
}

function flavorID(template: string): string {
  const uc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lc = 'abcdefghijklmnopqrstuvwxyz'
  const num = '0123456789'

  let i = template.length
  let output = ''
  while (i--) {
    output += template[i]
      .replace(/A/, _.sample(uc))
      .replace(/a/, _.sample(lc))
      .replace(/N/, _.sample(num))
  }
  return output
}

export { name, callsign, mechname, teamName, mission, tracert, encryption, flavorID }
