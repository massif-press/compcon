import { Pilot } from '@/class'
import GistClient from 'gist-client'
import imgur from 'imgur'
import path from 'path'
import axios from 'axios'

// this token is scoped to only allow for the creation of gists on a burner account
// if this is insufficient, we'll move to a login scheme
const gistToken = atob('ZTk4MjJhZTE0MzYyMTRkNDY5YTlkZTNkMDIxMTRmODVkNTJhMjAwMg==')
const gistApi = axios.create({
  baseURL: 'https://api.github.com/gists',
  headers: {
    Authorization: 'token ' + gistToken,
  },
  responseType: 'json',
})

const changelogGistID = '3eaedde89e606f60a6346ab190972edf'
const getChangelog = function() {
  return gistApi.get(changelogGistID).then(res => res.data)
}

const createPilotGist = function(pilot: Pilot): Promise<any> {
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

const updatePilotGist = function(pilot: Pilot) {
  return gistApi
    .patch(pilot.GistID, {
      files: {
        'pilot.txt': {
          content: JSON.stringify(Pilot.Serialize(pilot)),
        },
      },
      description: `${pilot.Callsign} - ${pilot.Name} (LL:${pilot.Level})`,
    })
    .then(res => res.data)
}

const importPilotGist = function(id: string) {
  return gistApi.get(id).then(res => res.data)
}

imgur.setClientId('36f102b737b2f5f')
imgur.setAPIUrl('https://api.imgur.com/3/')

const uploadImage = function(userPath: string, subPath: string, imgPath: string) {
  return imgur.uploadFile(path.join(userPath, 'img', subPath, imgPath))
}

export default {
  getChangelog,
  createPilotGist,
  updatePilotGist,
  importPilotGist,
  uploadImage,
}
