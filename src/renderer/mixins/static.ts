import path from 'path'
import * as url from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

// see https://github.com/electron-userland/electron-webpack/issues/99#issuecomment-459251702
export function getStatic(val: string) {
  if (isDevelopment) {
    return url.resolve(window.location.origin, val)
  }
  return path.resolve(__static, val)
}
