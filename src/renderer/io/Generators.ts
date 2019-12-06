import _ from 'lodash'
// import extlog from './ExtLog'

function pullRandom(data: string, count: number): string[] {
  const arr = data.split('\n')
  return _.sampleSize(arr, count).map(x => x.replace(/[\n\r]/g, ''))
}

function callsign(): string {
  return pullRandom(require('@assets/callsigns.txt'), 1)[0]
}

function mechname(): string {
  return pullRandom(require('@assets/mechnames.txt'), 1)[0]
}

function name(): string {
  const prob: any = require('@assets/name_mods.json')
  const firstnames = pullRandom(require('@assets/firstnames.txt'), 2)
  const lastnames = pullRandom(require('@assets/lastnames.txt'), 2)
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
  const m = require('@assets/mission.json')
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

// function flavorString(): string {
//   const str =
//     Math.random()
//       .toString(36)
//       .substring(2, 15) +
//     Math.random()
//       .toString(36)
//       .substring(2, 15)
//   return btoa(str)
// }

export { name, callsign, mechname, mission, encryption, flavorID }
