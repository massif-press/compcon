import { ImageTag } from '@/classes/enums';
import artistmap from '@/io/assets/artistmap.json';
// const webImageTypes = ['.jpeg', '.jpg', '.png', '.gif', '.svg', '.bmp']

declare interface IImageInfo {
  filename: string;
  artist: string;
  contact?: string;
  site?: string;
  notes?: string;
}

function getImageDir(subdir: ImageTag): string {
  return `/src/assets/img/${subdir}`;
}

function getImagePath(subdir: ImageTag, fileName: string): string {
  return `${getImageDir(subdir)}/${fileName}`;
}

function getAllImages(tag: ImageTag): string[] {
  if (!tag) return [];
  const arr = artistmap
    .flatMap((a) => a.images)
    .filter((i) => i.tag === tag)
    .map((x) => x.img);
  const out = arr.map((x) => getImagePath(tag, x));
  return out;
}

function getAllImageData(tag: ImageTag): any[] {
  return artistmap.flatMap((a) => a.images).filter((i) => i.tag === tag);
}

export { getImagePath, ImageTag, getAllImages, getAllImageData };
