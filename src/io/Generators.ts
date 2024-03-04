import _, { sample } from 'lodash'
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

function shipname_ipsn(): string {
  const shipnames_ipsnData = require('raw-loader!@/assets/generators/shipnames_ipsn.txt').default.concat(
    store.getters.Tables?.shipnames_ipsn || []
  )
  return pullRandom(shipnames_ipsnData, 1)[0]
}

function planet(): string {
  const planetsData = require('raw-loader!@/assets/generators/planets.txt').default.concat(
    store.getters.Tables?.planets || []
  )
  return pullRandom(planetsData, 1)[0]
}

function station(): string {
  const stationsData = require('raw-loader!@/assets/generators/stations.txt').default.concat(
    store.getters.Tables?.stations || []
  )
  return pullRandom(stationsData, 1)[0]
}

function location(): string {
  if (Math.random() > 0.5) {
    return planet()
  } else {  
    return station()
  }
}

function cargo(): string {
  const cargoData = require('raw-loader!@/assets/generators/cargo.txt').default.concat(
    store.getters.Tables?.cargo || []
  )
  return pullRandom(cargoData, 1)[0]
}

function cargo_formatted(): string {
  const cargoData = require('raw-loader!@/assets/generators/cargo.txt').default.concat(
    store.getters.Tables?.cargo || []
  )

  const secrets = ['Redacted', 'Classified', 'None of your business']
  const chance = Math.random()
  let cargo = ""

  if(chance <= 0.05) {
    cargo = '<span class="horus--subtle">'+_.sample(secrets)+'</span>'
  } else {
    cargo= pullRandom(cargoData, 1)[0]
  }

  cargo=cargo.concat(` - ${Math.floor(Math.random()* (30 - 1) + 1)} units`)

  return cargo
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

export { name, callsign, mechname, teamName, shipname_ipsn, planet, station, location, cargo, cargo_formatted, mission, tracert, encryption, flavorID }
