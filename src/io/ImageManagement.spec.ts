import { describe, it, expect } from 'vitest'
import { getImagePath, getAllImages, getAllImageData } from './ImageManagement'
import { ImageTag } from '@/classes/enums'

describe('getImagePath', () => {
  it('builds a path under the tag directory', () => {
    expect(getImagePath(ImageTag.Frame, 'mf_atlas.png')).toBe('/src/assets/img/frame/mf_atlas.png')
  })
})

describe('getAllImages', () => {
  it('lists every image for a tag as a full path', () => {
    const frames = getAllImages(ImageTag.Frame)

    expect(frames.length).toBeGreaterThan(0)
    expect(frames.every(p => p.startsWith('/src/assets/img/frame/'))).toBe(true)
  })

  it('is empty without a tag', () => {
    expect(getAllImages('' as ImageTag)).toEqual([])
  })

  it('is empty for a tag nothing is filed under', () => {
    expect(getAllImages('not_a_tag' as ImageTag)).toEqual([])
  })
})

describe('getAllImageData', () => {
  it('returns the raw entries, which carry the artist credit fields', () => {
    const [entry] = getAllImageData(ImageTag.Frame)

    expect(entry).toHaveProperty('img')
    expect(entry.tag).toBe(ImageTag.Frame)
  })

  it('agrees with getAllImages on how many images a tag has', () => {
    expect(getAllImageData(ImageTag.Frame)).toHaveLength(getAllImages(ImageTag.Frame).length)
  })
})
