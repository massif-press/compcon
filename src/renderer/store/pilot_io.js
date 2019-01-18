import fs from 'fs'
import path from 'path'

export default {
  newID () {
    return Math.random().toString(36).substr(2, 12)
  },
  loadUserData (userDataPath, filePath) {
    console.log(userDataPath)
    if (fs.existsSync(userDataPath)) {
      if (fs.existsSync(path.join(userDataPath, filePath))) {
        return JSON.parse(fs.readFileSync(path.join(userDataPath, filePath)))
      } else {
        console.warn(`file ${filePath} does not exist in folder ${userDataPath}. (if this is a new installation, ignore this message)`)
        return []
      }
    } else {
      console.warn(`data folder does not exist (if this is a new installation, ignore this message) ${filePath}`)
      return []
    }
  },
  saveUserData (userDataPath, filePath, data, callback) {
    if (!fs.existsSync(path.join(userDataPath))) {
      console.info(`data folder doesn't exist in userData dir, creating...`)
      fs.mkdir(userDataPath, function (err) {
        if (err) {
          alert(`ERROR: Unable to create save data folder at ${userDataPath}. Ensure you have write access to this folder`)
        } else {
          console.info('data folder created successfully')
        }
      })
    }

    fs.writeFile(path.join(userDataPath, filePath), JSON.stringify(data, null, 2), 'utf8', callback)
  }
}
