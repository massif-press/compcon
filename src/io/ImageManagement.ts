import path from 'path'

// const webImageTypes = ['.jpeg', '.jpg', '.png', '.gif', '.svg', '.bmp']

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
  Mech = 'mech',
  Map = 'map',
  Location = 'location',
  Object = 'object',
  Logo = 'logo',
  Misc = 'misc',
}

function getImageDir(subdir: ImageTag): string {
  return path.join('/static', 'img', subdir)
}

function getImagePath(subdir: ImageTag, fileName: string): string {
  return path.join(getImageDir(subdir), fileName)
}

// TODO: figure out how to make this work on web
// function getImageInfoArray(subdir: ImageTag): IImageInfo[] {
//   const imageDir = imageDir(subdir)
//   const imageData = path.join(imageDir, 'info.json')

//   if (!fs.existsSync(imageData)) {
//     console.info(`image subdir ${subdir} author db doesn't exist, creating...`)
//     try {
//       fs.writeFileSync(imageData, '[]')
//     } catch (error) {
//       console.info(`error getting image info array for ${imageData}`)
//       return
//     }
//   }

//   return JSON.parse(fs.readFileSync(imageData, 'utf-8')) as IImageInfo[]
// }
// function writeImageInfo(infoArray: IImageInfo[], subdir: ImageTag): void {
//   const imageDir = getImageDir(subdir)
//   try {
//     fs.writeFileSync(path.join(imageDir, 'info.json'), JSON.stringify(infoArray))
//   } catch (err) {
//     console.info(`unable to write image info file in ${imageDir}`)
//   }
// }

// function checkImageData(subdir: ImageTag): void {
//   const images = getImagePaths(subdir)
//   const info = getImageInfoArray(subdir)

//   images.forEach(i => {
//     if (!info.find(x => x.filename === i)) {
//       info.push({
//         filename: i,
//         artist: 'Unknown',
//       })
//     }
//   })

//   writeImageInfo(info, subdir)
// }

//TODO: image data management
// function updateImageInfo(info: IImageInfo) {}

// function importImagePackage() {}

// function exportImagePackage() {}

export { getImagePath, ImageTag }
