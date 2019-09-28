import fs from 'fs'
import path from 'path'
import extlog from './ExtLog'
import { CompendiumStore } from '@/store'
import { getModule } from 'vuex-module-decorators'
import { copySync } from 'fs-extra'

const webImageTypes = ['.jpeg', '.jpg', '.png', '.gif', '.svg', '.bmp']

declare interface IImageInfo {
  filename: string
  artist: string
  contact?: string
  site?: string
  notes?: string
}

enum ImageTag {
  Pilot = 'pilot',
  NPC = 'npc',
  Enemy = 'enemy',
  Frame = 'frame',
  Location = 'location',
  Object = 'object',
  Logo = 'logo',
  Misc = 'misc',
}

function getImageDir(subdir: ImageTag): string {
  const store = getModule(CompendiumStore)
  return path.join(store.UserDataPath, 'img', subdir)
}

function getImageInfoArray(subdir: ImageTag): IImageInfo[] {
  const imageDir = getImageDir(subdir)
  const imageData = path.join(imageDir, 'info.json')

  if (!fs.existsSync(imageData)) {
    extlog(`image subdir ${subdir} author db doesn't exist, creating...`)
    try {
      fs.writeFileSync(imageData, '[]')
    } catch (error) {
      extlog(`error getting image info array for ${imageData}`)
      return
    }
  }

  return JSON.parse(fs.readFileSync(imageData, 'utf-8')) as IImageInfo[]
}

function getImagePaths(subdir: ImageTag, defaults: boolean = false): string[] {
  const imageDir = defaults ? path.join(__static, 'img', subdir) : getImageDir(subdir)
  if (!fs.existsSync(imageDir)) {
    extlog(`image subdir ${subdir} doesn't exist, creating...`)
    fs.mkdirSync(imageDir)
  }
  return (
    fs.readdirSync(imageDir).filter(x => webImageTypes.includes(path.extname(x).toLowerCase())) ||
    []
  )
}

function writeImageInfo(infoArray: IImageInfo[], subdir: ImageTag): void {
  const imageDir = getImageDir(subdir)
  try {
    fs.writeFileSync(path.join(imageDir, 'info.json'), JSON.stringify(infoArray))
  } catch (err) {
    extlog(`unable to write image info file in ${imageDir}`)
  }
}

function checkImageData(subdir: ImageTag): void {
  const images = getImagePaths(subdir)
  const info = getImageInfoArray(subdir)

  images.forEach(i => {
    if (!info.find(x => x.filename === i)) {
      info.push({
        filename: i,
        artist: 'Unknown',
      })
    }
  })

  writeImageInfo(info, subdir)
}

function copyDefaults(origin: string): void {
  const store = getModule(CompendiumStore)
  const destination = `default_${origin}`
  const defaults = getImagePaths(origin as ImageTag, true)
  for (let i = 0; i < defaults.length; i++) {
    const imagePath = path.join(store.UserDataPath, 'img', destination, defaults[i])
    const defaultPath = path.join(__static, 'img', origin, defaults[i])
    if (!fs.existsSync(defaultPath)) continue
    if (
      !fs.existsSync(imagePath) ||
      fs.statSync(imagePath).size !== fs.statSync(defaultPath).size
    ) {
      extlog(`${origin} default ${defaults[i]} does not exist in user folder. Copying...`)
      const originPath = path.join(__static, 'img', origin, defaults[i])
      const destinationPath = path.join(store.UserDataPath, 'img', destination, defaults[i])
      copySync(originPath, destinationPath)
    }
  }
}

function validateImageFolders(): void {
  let subdirs = Object.keys(ImageTag).map(k => ImageTag[k as string])
  subdirs.forEach(s => {
    checkImageData(s)
    copyDefaults(s)
  })
}

function addImage(subdir: ImageTag, imagePath: string): void {
  const imageDir = getImageDir(subdir)
  const imgFilename = path.parse(imagePath).base
  let info = getImageInfoArray(subdir)
  info.push({
    filename: imgFilename,
    artist: 'Unknown',
  })
  writeImageInfo(info, subdir)

  copySync(imagePath, path.join(imageDir, imgFilename))
}

function removeImage(subdir: ImageTag, filename: string): void {
  const p = path.join(getImageDir(subdir), filename)
  if (fs.existsSync(p)) {
    fs.unlinkSync(p)
  } else {
    extlog(`unable to delete image: file missing at ${p}`)
    return
  }
  let info = getImageInfoArray(subdir)
  const idx = info.findIndex(x => x.filename === filename)
  info.splice(idx, 1)
  writeImageInfo(info, subdir)
}

//TODO: image data management
// function updateImageInfo(info: IImageInfo) {}

// function importImagePackage() {}

// function exportImagePackage() {}

export { validateImageFolders, checkImageData, getImageInfoArray, addImage, removeImage, ImageTag }
