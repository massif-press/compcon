import fs from 'fs'
import path from 'path'

const webImageTypes = [
  '.jpeg',
  '.jpg',
  '.png',
  '.gif',
  '.svg',
  '.bmp'
]

function getStaticPath (env) {
  // eslint-disable-next-line no-process-env
  const staticPath = env === 'development' ? __static : path.join(__dirname, 'static')
  return staticPath
}

export default {
  loadData (filename) {
    var p = path.join(getStaticPath(process.env.NODE_ENV), 'data', filename + '.json')
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p))
    } else {
      console.error(`file ${filename} does not exist at ${p}.`)
      return []
    }
  },
  loadBrewData (userDataPath, subdir, filename) {
    
  }
  getImages (subdir, userDataPath) {
    if (fs.existsSync(userDataPath)) {
      var userPath = path.join(userDataPath, 'img', subdir)
      if (fs.existsSync(userPath)) {
        return fs.readdirSync(userPath).filter(x => webImageTypes.includes(path.extname(x).toLowerCase()))
      }
    }
    return []
  },
  newID () {
    return Math.random().toString(36).substr(2, 12)
  },
  randomName (filename) {
    var p = path.join(getStaticPath(process.env.NODE_ENV), 'generators', filename)
    var array = fs.readFileSync(p).toString().split('\n')
    return array[Math.floor(Math.random() * array.length)].replace(/[\n\r]/g, '')
  },
  loadUserData (userDataPath, filePath) {
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
      fs.mkdirSync(userDataPath)
      console.info('data folder created successfully')
    }

    fs.writeFileSync(path.join(userDataPath, filePath), JSON.stringify(data, null, 2), 'utf8', callback)
  },
  saveFile (dataPath, data, callback) {
    fs.writeFileSync(dataPath, data, 'utf8', callback)
  },
  importFile (path, callback) {
    try {
      var data = JSON.parse(fs.readFileSync(path), callback)
      if (data && typeof data === 'object') return data
    } catch (error) {
      alert('Error reading or parsing JSON data at ' + path)
    }
  },
  importImage (userDataPath, subdir, imgPath) {
    var savePath = path.join(userDataPath, 'img', subdir)
    if (!fs.existsSync(path.join(userDataPath, 'img'))) {
      console.info(`data/img folder doesn't exist in userData dir, creating...`)
      fs.mkdirSync(path.join(userDataPath, 'img'))
    }

    if (!fs.existsSync(savePath)) {
      console.info(`data/img/${subdir} folder doesn't exist in userData dir, creating...`)
      fs.mkdirSync(path.join(userDataPath, 'img', subdir))
    }

    var data = fs.readFileSync(imgPath)
    if (data) {
      fs.writeFileSync(path.join(savePath, path.parse(imgPath).base), data, null)
      return savePath
    }
  }
}
