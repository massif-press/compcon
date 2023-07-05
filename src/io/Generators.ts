import _ from 'lodash';
import missions from '@/assets/generators/mission.json';

import { CompendiumStore } from '@/stores';

function pullRandom(data: string[], count: number): string[] {
  return _.sampleSize(data, count).map((x) => x.replace(/[\n\r]/g, ''));
}

async function callsign(): Promise<string> {
  const callsigns = await fetchData('./src/assets/generators/callsigns.txt');
  return pullRandom(
    (callsigns as string[]).concat(CompendiumStore().Tables?.callsigns || []),
    1
  )[0];
}

async function mechname(): Promise<string> {
  const mechnames = await fetchData('./src/assets/generators/mechnames.txt');
  return pullRandom(
    (mechnames as string[]).concat(CompendiumStore().Tables?.mech_names || []),
    1
  )[0];
}

async function teamName(): Promise<string> {
  const teamnames = await fetchData('./src/assets/generators/teamnames.txt');
  return pullRandom(
    (teamnames as string[]).concat(CompendiumStore().Tables?.team_names || []),
    1
  )[0];
}

async function tracert(jumps: number): Promise<string[]> {
  const traces = await fetchData('./src/assets/generators/traces.txt');
  return pullRandom(traces as string[], jumps || 1);
}

async function name(): Promise<string> {
  const firstnames = await fetchData('./src/assets/generators/firstnames.txt');
  const lastnames = await fetchData('./src/assets/generators/lastnames.txt');
  const name_mods = await fetchData('./src/assets/generators/name_mods.txt');

  const prob: any = name_mods;
  const fn = pullRandom(firstnames as string[], 2);
  const ln = pullRandom(lastnames as string[], 2);
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

const fetchData = (path: string) => {
  return new Promise((resolve, reject) => {
    fetch(path)
      .then((response) => response.text())
      .then((text) => {
        const data = text.split('\n').filter(Boolean);
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export { name, callsign, mechname, teamName, mission, tracert, encryption, flavorID };
