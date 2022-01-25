import { Pilot } from '@/class'
import { IPilotData } from '@/interface'
import axios from 'axios'

// this token is scoped to only allow for the creation of gists on a burner account
// if this is insufficient, we'll move to a login scheme
const gistToken = process.env.VUE_APP_GITHUB_TOKEN

const gistApi = axios.create({
  baseURL: 'https://api.github.com/gists',
  headers: {
    Authorization: 'token ' + gistToken,
  },
  responseType: 'json',
})

const changelogGistID = '3eaedde89e606f60a6346ab190972edf'
const getChangelog = function (): any {
  return gistApi.get(changelogGistID).then(res => res.data)
}

const creditsGistID = 'c79f09f5459c5991c1228c853191bd51'
const getCredits = function (): any {
  return gistApi.get(creditsGistID).then(res => res.data)
}

const messageGistId = '66d0a07ea8762faa7b6d78c9735f8820'
const getMessage = function (): any {
  return gistApi.get(messageGistId).then(res => res.data)
}

const massifPacks = '2f75f2517795327dc9f7f5a739f0ac70'
const getMassifPacks = function (): any {
  return gistApi.get(massifPacks).then(res => res.data)
}

const communityPacks = 'd177b6b6c65a5785ec030f50630807e0'
const getCommunityPacks = function (): any {
  return gistApi.get(communityPacks).then(res => res.data)
}

const newPilot = async function (pilot: Pilot): Promise<any> {
  const pData: IPilotData = Pilot.Serialize(pilot)
  return gistApi
    .post('', {
      files: {
        'pilot.txt': {
          content: JSON.stringify(pData),
        },
      },
      description: `${pilot.Callsign} - ${pilot.Name} (LL:${pilot.Level})`,
      public: true,
    })
    .then(res => res.data)
}

const savePilot = async function (pilot: Pilot): Promise<void> {
  return gistApi
    .patch(pilot.GistCode, {
      files: {
        'pilot.txt': {
          content: JSON.stringify(Pilot.Serialize(pilot)),
        },
      },
      description: `${pilot.Callsign} - ${pilot.Name} (LL:${pilot.Level})`,
    })
    .then(res => res.data)
}

const loadPilot = async function (id: string): Promise<IPilotData> {
  const gistData = await gistApi.get(id).then(res => res.data.files['pilot.txt'].content)
  const pilotData = JSON.parse(gistData) as IPilotData
  return pilotData
}

export default {
  getChangelog,
  getCredits,
  getMessage,
  getMassifPacks,
  getCommunityPacks,
  newPilot,
  savePilot,
  loadPilot,
}
