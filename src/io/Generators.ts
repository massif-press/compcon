import _ from 'lodash';
import { store } from '@/store';
import * as callsigns from '@/assets/generators/callsigns.txt';
import * as mechnames from '@/assets/generators/mechnames.txt';
import * as teamnames from '@/assets/generators/teamnames.txt';
import * as traces from '@/assets/generators/traces.txt';
import * as firstnames from '@/assets/generators/firstnames.txt';
import * as lastnames from '@/assets/generators/lastnames.txt';
import * as name_mods from '@/assets/generators/name_mods.json';
import * as missions from '@/assets/generators/mission.json';
import * as factions from '@/assets/generators/factions.txt';

// import {CompendiumStore} from '@/features/compendium/store/index'

function pullRandom(data: string, count: number): string[] {
  const arr = data.split('\n');
  return _.sampleSize(arr, count).map((x) => x.replace(/[\n\r]/g, ''));
}

function callsign(): string {
  return pullRandom(
    (callsigns as any).concat(store.getters.Tables?.callsigns || []),
    1
  )[0];
}

function mechname(): string {
  return pullRandom(
    (mechnames as any).concat(store.getters.Tables?.mech_names || []),
    1
  )[0];
}

function teamName(): string {
  return pullRandom(
    (teamnames as any).concat(store.getters.Tables?.team_names || []),
    1
  )[0];
}

function tracert(jumps: number): string[] {
  return pullRandom(traces as any, jumps || 1);
}

async function name(): Promise<string> {
  const firstNamesList = firstnames as any;
  const lastNamesList = lastnames as any;

  const prob: any = name_mods;
  const fn = pullRandom(firstNamesList, 2);
  const ln = pullRandom(lastNamesList, 2);
  let name =
    Math.random() <= prob.middleNameChance ? `${fn[0]} ${fn[1]}` : `${fn[0]}`;
  name +=
    Math.random() <= prob.secondSurnameChance
      ? ` ${ln[0]}-${ln[1]}`
      : ` ${ln[0]}`;

  if (Math.random() <= prob.suffixChance) name += ` ${_.sample(prob.suffixes)}`;

  return name;
}

function mission(): string {
  return `${_.sample((missions as any).a)} ${_.sample((missions as any).b)}`;
}

function faction(): string {
  return pullRandom(
    (factions as any).concat(store.getters.Tables?.team_names || []),
    1
  )[0];
}

function encryption(): string {
  return `${Math.random()
    .toString()
    .substring(2, 4)}::${mission()}`.toUpperCase();
}

function flavorID(template: string): string {
  const uc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lc = 'abcdefghijklmnopqrstuvwxyz';
  const num = '0123456789';

  let i = template.length;
  let output = '';
  while (i--) {
    output += template[i]
      .replace(/A/, _.sample(uc as any))
      .replace(/a/, _.sample(lc as any))
      .replace(/N/, _.sample(num as any));
  }
  return output;
}

export {
  name,
  callsign,
  mechname,
  teamName,
  mission,
  tracert,
  encryption,
  flavorID,
};
