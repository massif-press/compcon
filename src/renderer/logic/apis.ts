import GistClient from 'gist-client'

// this token is scoped to only allow for the creation of gists on a burner account
// if this is insufficient, we'll move to a login scheme
const token = '15e5d2bf3aaaedb2ba9d8d05731146e466b45e59'
const gistClient = new GistClient()

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

export default {
  createPilotGist,
  updatePilotGist,
  importPilotGist,
}