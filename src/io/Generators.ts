import _ from 'lodash';
import missions from '@/assets/generators/mission.json';
import name_mods from '@/assets/generators/name_mods.json';

import { CompendiumStore } from '@/stores';

function pullRandom(data: string[], count: number): string[] {
  return _.sampleSize(data, count).map((x) => x.replace(/[\n\r]/g, ''));
}

async function callsign(): Promise<string> {
  const callsigns = (await import(`@/assets/generators/callsigns.txt?raw`)).default.split('\n');
  return pullRandom(callsigns.concat(CompendiumStore().Tables?.callsigns || []), 1)[0];
}

async function mechname(): Promise<string> {
  const mechnames = (await import('@/assets/generators/mechnames.txt?raw')).default.split('\n');
  return pullRandom(mechnames.concat(CompendiumStore().Tables?.mech_names || []), 1)[0];
}

async function teamName(): Promise<string> {
  const teamnames = (await import('@/assets/generators/teamnames.txt?raw')).default.split('\n');
  return pullRandom(teamnames.concat(CompendiumStore().Tables?.team_names || []), 1)[0];
}

async function tracert(jumps: number): Promise<string[]> {
  const traces = (await import('@/assets/generators/traces.txt?raw')).default.split('\n');
  return pullRandom(traces, jumps || 1);
}

async function name(): Promise<string> {
  const firstnames = (await import('@/assets/generators/firstnames.txt?raw')).default.split('\n');
  const lastnames = (await import('@/assets/generators/lastnames.txt?raw')).default.split('\n');

  const prob: any = name_mods;
  const fn = pullRandom(firstnames, 2);
  const ln = pullRandom(lastnames, 2);
  let name = Math.random() <= prob.middleNameChance ? `${fn[0]} ${fn[1]}` : `${fn[0]}`;
  name += Math.random() <= prob.secondSurnameChance ? ` ${ln[0]}-${ln[1]}` : ` ${ln[0]}`;

  if (Math.random() <= prob.suffixChance) name += ` ${_.sample(prob.suffixes)}`;

  return name;
}

function mission(): string {
  return `${_.sample((missions as any).a)} ${_.sample((missions as any).b)}`;
}

function encryption(): string {
  return `${Math.random().toString().substring(2, 4)}::${mission()}`.toUpperCase();
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

export { name, callsign, mechname, teamName, mission, tracert, encryption, flavorID };
