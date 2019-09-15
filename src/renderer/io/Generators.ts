import fs from 'fs'
import path from 'path'
import _ from 'lodash'
// import extlog from './ExtLog'

function dataPath(filename: string): string {
  return path.join(__static, 'generators', filename)
}

function pullRandom(filename: string, count: number): string[] {
  const arr = fs
    .readFileSync(dataPath(filename))
    .toString()
    .split('\n')
  return _.sampleSize(arr, count).map(x => x.replace(/[\n\r]/g, ''))
}

function randomCallsign(): string {
  return pullRandom('callsigns.txt', 1)[0]
}

function randomName(): string {
  const prob = JSON.parse(fs.readFileSync(dataPath('name_mods.json'), 'utf-8'))
  const firstnames = pullRandom('firstnames.txt', 2)
  const lastnames = pullRandom('lastnames.txt', 2)
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

export { randomName, randomCallsign }
