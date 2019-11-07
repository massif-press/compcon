import fs from 'fs'
import path from 'path'
import extlog from './ExtLog'
import uuid from 'uuid/v1'
import { CompendiumStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

interface UserData {
  userID: string
}

function newUser(): string {
  const user = {
    userID: uuid(),
  }
  return JSON.stringify(user)
}

function getUser(): UserData {
  const store = getModule(CompendiumStore)
  const configfile = path.join(store.UserDataPath, 'user.config')

  if (!fs.existsSync(configfile)) {
    try {
      fs.writeFileSync(configfile, newUser())
      extlog('Created user profile')
    } catch (err) {
      extlog(`Critical Error: COMP/CON unable to create user profile at ${configfile}: \n ${err}`)
      return
    }
  }

  return JSON.parse(fs.readFileSync(configfile, 'utf-8')) as UserData
}

export { getUser }
