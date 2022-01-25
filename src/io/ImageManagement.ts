import path from 'path'
import artistmap from './assets/artistmap.json'

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
  return path.join('/static', 'img', subdir as string)
}

function getImagePath(subdir: ImageTag, fileName: string): string {
  return path.join(getImageDir(subdir), fileName)
}

function getAllImages(tag: ImageTag): string[] {
  if (!tag) return []
  const arr = artistmap
    .flatMap(a => a.images)
    .filter(i => i.tag === tag)
    .map(x => x.img)
  const out = arr.map(x => getImagePath(tag, x))
  return out
}

function getAllImageData(tag: ImageTag): any[] {
  return artistmap.flatMap(a => a.images).filter(i => i.tag === tag)
}

export { getImagePath, ImageTag, getAllImages, getAllImageData }
