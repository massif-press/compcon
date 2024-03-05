import _ from 'lodash';
import { tracert } from '@/io/Generators';

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

const HorusStart = async (typer) => {
  let _nfo = await fetchData(
    './src/features/main_menu/_components/startup_logs/horus_chat/nfo.txt'
  );
  _nfo = (_nfo as string[]).join('\n');

  let _motd = await fetchData(
    './src/features/main_menu/_components/startup_logs/horus_chat/motd.txt'
  );
  _motd = _.sample(_motd as string[]);

  typer
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('COMPANION/CONCIERGE UNIT INITIALIZING')
    .break()
    .type('GMS COMP/CON Unit Mk XI Rev 11.4.1c')
    .break()
    .type('5017.3.12 General Massive Systems // Please Operate Responsibly')
    .break()
    .type('loading h0r_os v3.6c_CLEAN (FINAL) phoubia distro')
    .break()
    .type('working ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('done')
    .break()
    .pause(250)
    .options({ speed: 0, lifeLike: false })
    .type(`<pre class="ibm-text">${_nfo}</pre>`)
    .break()
    .options({ speed: 3, lifeLike: false })
    .pause(250)
    .type('>// run ./usr/startup/autoconnect.sh')
    .break()
    .type(`Connecting to 1489.2551.1461.1880.4851.03`)
    .break()
    .type(`rt//CC/LOCALNET 0ns`)
    .break()
    .type(await tracert(1))
    .break()
    .type(await tracert(1))
    .break()
    .type(await tracert(1))
    .break()
    .type(await tracert(1))
    .break()
    .type(await tracert(1))
    .break()
    .type(await tracert(1))
    .break()
    .type('rt//INC OVERRIDE>')
    .type('>')
    .pause(50)
    .type('>')
    .pause(50)
    .type('>')
    .pause(50)
    .type('>')
    .pause(50)
    .type('>')
    .pause(50)
    .type('>')
    .break()
    .pause(350)
    .type('connection established//ENCRYPT HATHOR-ALEPH')
    .break()
    .pause(250)
    .type('------------------------------------------------------------')
    .break()
    .type("welcome to dogfriend_68's pound")
    .break()
    .type('MOTD:')
    .break()
    .type(_motd)
    .break()
    .type('------------------------------------------------------------')
    .pause(550)
    .go();
};

const banTypes = [
  'BANNED',
  'BANNED',
  'BANNED',
  'BANNED',
  'BANNED',
  'BANNED',
  'PERMABANNED',
  'MUTED FOR 500KSEC',
  'MUTED FOR 800KSEC',
];

function formatChat(input: string[]): string {
  return `<span class="text-accent">${input[0]}: </span><span>${input[1]}</span>`;
}

function formatMod(input: string[]): string {
  return `<span class="text-red">${input[0]}: </span><span>${input[1]}</span>`;
}

function formatAdmin(input: string): string {
  return `<span class="text-info"><b>[ADMIN] dogfriend_68: </b>${input}</span>`;
}

function formatBan(input: string[]): string {
  return `<span class="text-warning">// USER: ${input[0]} ${_.sample(banTypes)} | REASON: ${
    input[1]
  } --ADMIN //</span>`;
}

function randomNoRepeat(arr) {
  let copy = arr.slice(0);
  return function () {
    if (copy.length < 1) {
      copy = arr.slice(0);
    }
    const index = Math.floor(Math.random() * copy.length);
    const item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

const HorusChat = async (output) => {
  let chat = (await fetchData(
    './src/features/main_menu/_components/startup_logs/horus_chat/chat.txt'
  )) as string[];
  chat = chat as string[];

  let mods = (await fetchData(
    './src/features/main_menu/_components/startup_logs/horus_chat/mods.txt'
  )) as string[];
  mods = mods as string[];

  let admin = (await fetchData(
    './src/features/main_menu/_components/startup_logs/horus_chat/admin.txt'
  )) as string[];

  let bans = (await fetchData(
    './src/features/main_menu/_components/startup_logs/horus_chat/bans.txt'
  )) as string[];

  const allLines = [] as string[];

  chat.forEach((l) => {
    allLines.push(formatChat(l.split(/,(.+)/)));
  });

  mods.forEach((l) => {
    allLines.push(formatMod(l.split(/,(.+)/)));
  });

  admin.forEach((l) => {
    allLines.push(formatAdmin(l));
  });

  bans.forEach((l) => {
    allLines.push(formatBan(l.split(/,(.+)/)));
  });

  const sel = randomNoRepeat(allLines);

  function callback(): void {
    output.innerHTML += `<br>${sel()}`;
    output.scrollIntoView({ block: 'end' });
    if (output && output.innerHTML.length > 2500) output.innerHTML = output.innerHTML.trim(200);
  }

  function loop(): void {
    const rand = _.random(10, 2500);
    setTimeout(function () {
      callback();
      loop();
    }, rand);
  }

  loop();
};

export { HorusStart, HorusChat };
