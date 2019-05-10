import GistClient from 'gist-client'
import imgur from 'imgur'
import path from 'path'

// this token is scoped to only allow for the creation of gists on a burner account
// if this is insufficient, we'll move to a login scheme
const token = atob("ZTk4MjJhZTE0MzYyMTRkNDY5YTlkZTNkMDIxMTRmODVkNTJhMjAwMg==")
const gistClient = new GistClient()

imgur.setClientId('36f102b737b2f5f');
imgur.setAPIUrl('https://api.imgur.com/3/')

const createPilotGist = async function (pilot: Pilot): Promise<any> {
  return gistClient.setToken(token).create({
    "files": {
      "pilot.txt": {
        "content": JSON.stringify(pilot)
      }
    },
    "description": `${pilot.callsign} - ${pilot.name} (LL:${pilot.level})`,
    "public": true
  })
}

const updatePilotGist = function (pilot: Pilot) {
  return gistClient.setToken(token).update(pilot.gistID, {
    files: {
      "pilot.txt": {
        "content": JSON.stringify(pilot)
      }
    },
    "description": `${pilot.callsign} - ${pilot.name} (LL:${pilot.level})`,
  })
}

const importPilotGist = function (id: string) {
  return gistClient.setToken(token).getOneById(id)
}

const uploadImage = function (userPath: string, subPath: string, imgPath: string) {
  return imgur.uploadFile(path.join(userPath, 'img', subPath, imgPath))
}

export default {
  createPilotGist,
  updatePilotGist,
  importPilotGist,
  uploadImage,
}