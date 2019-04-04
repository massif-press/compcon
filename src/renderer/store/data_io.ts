import fs from 'fs'
import path from 'path'
import {
  copySync
} from 'fs-extra'

declare const __static: string;

const webImageTypes = [
  '.jpeg',
  '.jpg',
  '.png',
  '.gif',
  '.svg',
  '.bmp'
]

function getStaticPath(env: string): string {
  // eslint-disable-next-line no-process-env
  const staticPath = env === 'development' ? __static : path.join(__dirname, 'static')
  return staticPath
}

export default {
  loadData(filename: string): object[] {
    var p = path.join(getStaticPath(process.env.NODE_ENV || ''), 'data', filename + '.json')
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'))
    } else {
      console.error(`file ${filename} does not exist at ${p}.`)
      return []
    }
  },
  findBrewData(userDataPath: string) {
    var brews = []
    var contentPath = path.join(userDataPath, 'content')
    if (fs.existsSync(contentPath)) {
      var dirs = fs.readdirSync(contentPath).filter(f => fs.statSync(path.join(contentPath, f)).isDirectory())
      for (var i = 0; i < dirs.length; i++) {
        var infoPath = path.join(contentPath, dirs[i], 'info.json')
        if (fs.existsSync(infoPath)) {
          var info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'))
          brews.push({
            info: info,
            dir: dirs[i]
          })
        }
      }
      return brews
    } else {
      console.info(`no brew data found`)
      return []
    }
  },
  loadBrewData(userDataPath: string, subdir: string, filename: string) {
    if (fs.existsSync(userDataPath)) {
      var folder = path.join(userDataPath, 'content', subdir)
      if (fs.existsSync(folder)) {
        var file = path.join(folder, filename + '.json')
        if (fs.existsSync(file)) {
          return JSON.parse(fs.readFileSync(file, 'utf-8'))
        } else {
          return []
        }
      } else {
        return []
      }
    } else {
      fs.mkdirSync(userDataPath)
    }
    return []
  },
  saveBrewData(origin: string, userDataPath: string) {
    var contentPath = path.join(userDataPath, 'content')
    if (!fs.existsSync(contentPath)) {
      fs.mkdirSync(contentPath)
    }
    var destination = path.join(userDataPath, 'content', path.basename(origin))
    copySync(origin, destination)
  },
  setBrewActive(userDataPath: string, subdir: string, isActive: string): void {
    var infopath = path.join(userDataPath, 'content', subdir, 'info.json')
    if (fs.existsSync(infopath)) {
      var info = JSON.parse(fs.readFileSync(infopath, 'utf-8'))
      info.active = isActive
      fs.writeFileSync(infopath, JSON.stringify(info, null, 2), 'utf8')
    } else {
      console.error(`brew at ${infopath} does not exists OR is missing info.json!`)
    }
  },
  getImages(subdir: string, userDataPath: string): string[] {
    if (fs.existsSync(userDataPath)) {
      var userPath = path.join(userDataPath, 'img', subdir)
      if (fs.existsSync(userPath)) {
        return fs.readdirSync(userPath).filter(x => webImageTypes.includes(path.extname(x).toLowerCase()))
      }
    }
    return []
  },
  newID(): string {
    return Math.random().toString(36).substr(2, 12)
  },
  randomName(filename: string): string {
    var p = path.join(getStaticPath(process.env.NODE_ENV || ''), 'generators', filename)
    var array = fs.readFileSync(p).toString().split('\n')
    return array[Math.floor(Math.random() * array.length)].replace(/[\n\r]/g, '')
  },
  loadUserData(userDataPath: string, filePath: string): object[] {
    if (fs.existsSync(userDataPath)) {
      if (fs.existsSync(path.join(userDataPath, filePath))) {
        return JSON.parse(fs.readFileSync(path.join(userDataPath, filePath), 'utf-8'))
      } else {
        console.warn(`file ${filePath} does not exist in folder ${userDataPath}. (if this is a new installation, ignore this message)`)
        return []
      }
    } else {
      console.warn(`data folder does not exist (if this is a new installation, ignore this message) ${filePath}`)
      return []
    }
  },
  saveUserData(userDataPath: string, filePath: string, data: object) {
    if (!fs.existsSync(path.join(userDataPath))) {
      console.info(`data folder doesn't exist in userData dir, creating...`)
      fs.mkdirSync(userDataPath)
      console.info('data folder created successfully')
    }

    fs.writeFileSync(path.join(userDataPath, filePath), JSON.stringify(data, null, 2), 'utf8')
  },
  saveFile(dataPath: string, data: object) {
    fs.writeFileSync(dataPath, data, 'utf8')
  },
  importFile(path: string) {
    try {
      var data = JSON.parse(fs.readFileSync(path, 'utf-8'))
      if (data && typeof data === 'object') return data
    } catch (error) {
      alert('Error reading or parsing JSON data at ' + path)
    }
  },
  importImage(userDataPath: string, subdir: string, imgPath: string) {
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
