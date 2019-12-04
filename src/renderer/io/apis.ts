import { Pilot } from '@/class'
import GistClient from 'gist-client'
import imgur from 'imgur'
import path from 'path'

// this token is scoped to only allow for the creation of gists on a burner account
// if this is insufficient, we'll move to a login scheme
const token = atob('ZTk4MjJhZTE0MzYyMTRkNDY5YTlkZTNkMDIxMTRmODVkNTJhMjAwMg==')
const gistClient = new GistClient()

const newPilot = async function(pilot: Pilot): Promise<any> {
  return gistClient.setToken(token).create({
    files: {
      'pilot.txt': {
        content: JSON.stringify(Pilot.Serialize(pilot)),
      },
    },
    description: `${pilot.Callsign} - ${pilot.Name} (LL:${pilot.Level})`,
    public: true,
  })
}

const savePilot = async function(pilot: Pilot): Promise<any> {
  return gistClient.setToken(token).update(pilot.CloudID, {
    files: {
      'pilot.txt': {
        content: JSON.stringify(Pilot.Serialize(pilot)),
      },
    },
    description: `${pilot.Callsign} - ${pilot.Name} (LL:${pilot.Level})`,
  })
}

const loadPilot = function(id: string): any {
  return gistClient.setToken(token).getOneById(id)
}

const changelogID = '3eaedde89e606f60a6346ab190972edf'

const getChangelog = function(): any {
  return gistClient.setToken(token).getOneById(changelogID)
}

const uploadImage = function(userPath: string, subPath: string, imgPath: string): any {
  return imgur.uploadFile(path.join(userPath, 'img', subPath, imgPath))
}

export default {
  newPilot,
  savePilot,
  loadPilot,
  uploadImage,
  getChangelog,
}
