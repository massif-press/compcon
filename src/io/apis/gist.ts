import { Pilot } from '@/class'
import { Npc } from '@/class'
import axios from 'axios'
import { INpcData } from '@/classes/npc/Npc'

// this token is scoped to only allow for the creation of gists on a burner account
// if this is insufficient, we'll move to a login scheme
const gistToken = Buffer.from(
  'ZTk4MjJhZTE0MzYyMTRkNDY5YTlkZTNkMDIxMTRmODVkNTJhMjAwMg==',
  'base64'
).toString()

const gistApi = axios.create({
  baseURL: 'https://api.github.com/gists',
  headers: {
    Authorization: 'token ' + gistToken,
  },
  responseType: 'json',
})

const changelogGistID = '3eaedde89e606f60a6346ab190972edf'
export const getChangelog = async (): Promise<any> => {
  return gistApi.get(changelogGistID).then(res => res.data)
}

const creditsGistID = 'c79f09f5459c5991c1228c853191bd51'
export const getCredits = async (): Promise<any> =>  {
  return gistApi.get(creditsGistID).then(res => res.data)
}

export const newPilot = async (pilot: Pilot): Promise<any> => {
  return gistApi
    .post('', {
      files: {
        'pilot.txt': {
          content: JSON.stringify(Pilot.Serialize(pilot)),
        },
      },
      description: `${pilot.Callsign} - ${pilot.Name} (LL:${pilot.Level})`,
      public: true,
    })
    .then(res => res.data)
}

export const savePilot = async (pilot: Pilot): Promise<any> => {
  return gistApi
    .patch(pilot.CloudID, {
      files: {
        'pilot.txt': {
          content: JSON.stringify(Pilot.Serialize(pilot)),
        },
      },
      description: `${pilot.Callsign} - ${pilot.Name} (LL:${pilot.Level})`,
    })
    .then(res => res.data)
}

export const loadPilot = async (id: string): Promise<IPilotData> => {
  const gistData = (await gistApi.get(id)).data
  const pilotData = JSON.parse(gistData.files['pilot.txt'].content) as IPilotData
  return pilotData
}

export const newNpc = async (npc: Npc): Promise<any> => {
  const templateNames = npc.Templates.map( (template) => template.Name ).join(' ');

  const result = await gistApi.post('', {
    files: {
      'npc.txt': { content: JSON.stringify(Npc.Serialize(npc)) },
    },
    description: `${npc.Name} - ${npc.Class} - ${templateNames}`
  })
  return result.data;
}

export const saveNpc = async (npc: Npc): Promise<any> => {
  const templateNames = npc.Templates.map((template) => template.Name).join(' ');
  const result = await gistApi.patch(npc.CloudID, {
    files: {'npc.txt': { content: JSON.stringify(Npc.Serialize(npc)) }
    },
    description: `${npc.Name} - ${npc.Class} - ${templateNames}`
  })
  return result.data
}

export const loadNpc = async (id: string) : Promise<INpcData> => {
  const gistData = (await gistApi.get(id)).data
  const npcData = JSON.parse(gistData.files['npc.txt'].content) as INpcData
  return npcData
}